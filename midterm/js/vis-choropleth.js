// Add JSLint settings
/*jslint browser: true*/
/*global $, jQuery, alert, d3, colorbrewer, queue, console*/

// --> CREATE SVG DRAWING AREA
// SVG Area
var margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 60
};

var width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create MERCATOR projection
var projection = d3.geo.mercator()
    .rotate([-10, 0])
    .center([35, 3])
    .scale(330);

//Define default colorbrewer scheme
var quantiles = 8
var colorScheme = colorbrewer["Reds"];
var color = d3.scale.quantile()
    .range(colorScheme[quantiles]);
var colorData = [];
colorData.push("grey")
for (i = 0; i < color.range().length; i++) {
    colorData[i + 1] = color.range()[i]
}

// Select SVG
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Path
var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// Data
var data,
    map;

//////////////
// Functions//
//////////////

// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/africa.topo.json")
    .defer(d3.csv, "data/global-malaria-2015.csv")
    .await(ready);

// Group text ending
function groupTxt(group) {
    if (group === "UN_population") {
        return " People";
    } else if (group === "At_risk" || group === "At_high_risk") {
        return " %";
    } else if (group === "Suspected_malaria_cases" || group === "Malaria_cases") {
        return " Cases"
    } else {
        return "";
    };
}

// Legend scaling
function legendScaling(data, group) {
    // Get the maximum
    var max = d3.max(data, function (d) {
        return d[group];
    })

    // Round up
    var x = Math.pow(10, max.toString().length - 1);
    return Math.ceil(max / x) * x;
}

// Data manipulation function
function ready(error, mapVar, dataVar) {
    "use strict";

    // Write to global space
    map = mapVar;
    data = dataVar;

    // --> PROCESS DATA
    data = data.filter(function (d) {
        return d.WHO_region === "African" ||
            d.WHO_region === "Eastern Mediterranean";
    });

    data.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.UN_population = +d.UN_population;
        d.At_risk = +d.At_risk;
        d.At_high_risk = +d.At_high_risk;
        d.Suspected_malaria_cases = +d.Suspected_malaria_cases;
        d.Malaria_cases = +d.Malaria_cases;
    });

    // Update choropleth
    updateChoropleth(map, data);
};

function updateChoropleth(map, data) {
    "use strict";

    // Get selected variable
    var group = d3.select("#selected-variable")
        .property("value");

    // Create a malariaDataByCountryID
    var dataById = {};

    data.forEach(function (d) {
        dataById[d.Code] = +d[group];
    });

    // Colors
    color.domain([0, legendScaling(data, group)])

    // Choropleth implementation //
    ///////////////////////////////
    var world = topojson.feature(map, map.objects.collection)
        .features;

    // SELECT
    var mapObject = g.selectAll("path")
        .data(world)

    // ENTER
    mapObject.enter()
        .append("path")

    // UPDATE
    mapObject.on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", 0.8);
            div.transition().duration(100)
                .style("opacity", 0.8)
            div.html(function () {
                    if (isNaN(dataById[d.properties.adm0_a3])) {
                        return "<strong>" + d.properties.name + "</strong>" + " <br> " + "No data available"
                    } else {
                        return "<strong>" + d.properties.name + "</strong>" + " <br> " + format(dataById[d.properties.adm0_a3]) + groupTxt(group)
                    }
                })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 0);
        })
        .transition()
        .duration(400)
        .ease("linear")
        .attr("d", path)
        .style("fill", function (d) {
            if (isNaN(dataById[d.properties.adm0_a3])) {
                return "grey"
            } else {
                return color(dataById[d.properties.adm0_a3]);
            }
        });

    // EXIT
    mapObject.exit().remove();

    // Legend //
    ////////////
    // SELECT Box
    var legendBox = g.selectAll('.legendBox')
        .data(color.range());

    // ENTER
    legendBox.enter()
        .append('rect');

    // UPDATE
    legendBox
        .transition()
        .duration(100)
        .attr('class', 'legendBox')
        .attr("x", width - 775)
        .attr("y", function (d, i) {
            return 300 + i * 18;
        })
        .attr("width", 18)
        .attr("height", 18)
        .style("stroke", "white")
        .style("opacity", 1)
        .style("stroke-width", 0)
        .style("fill", function (d) {
            return d;
        });

    // EXIT
    legendBox.exit().remove();

    // SELECT Text
    var legendText = g.selectAll('.legendText')
        .data(colorData);

    // ENTER
    legendText.enter()
        .append('text');

    // UPDATE
    var xVar = legendScaling(data, group) / quantiles;
    var legendData = [];
    for (var j = 0; j < quantiles + 1; j++) {
        legendData[j] = 0 + j * xVar;
    }

    // Format text
    var format = d3.format(",.f");

    legendText
        .transition()
        .duration(100)
        .attr('class', 'legendText')
        .attr("x", width - 753)
        .attr("y", function (d, i) {
            return 300 + i * 18;
        })
        .style("opacity", 1)
        .style("fill", "white")
        .attr("dy", "0.4em")
        .text(function (d, i) {
            return format(legendData[i]) + groupTxt(group);
        });

    // EXIT
    legendText.exit().remove();


    //console.log(mapTopJson);
    //console.log(malariaDataCsv);

}