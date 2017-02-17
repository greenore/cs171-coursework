var margin2 = {
        top: 20,
        right: 140,
        bottom: 30,
        left: 50
    },
    width2 = 550 - margin2.left - margin2.right,
    height2 = 350 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width2]);

var y = d3.scale.linear()
    .range([height2, 0]);

// Colors
var colorScheme2 = colorbrewer["Dark2"];

var color2 = d3.scale.ordinal()
    .range(colorScheme2[6]);

// Format text
var format = d3.format(",.f");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) {
        return x(d.Year);
    })
    .y(function (d) {
        return y(d.Spending);
    });

var svg2 = d3.select("#chart-area2").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var div2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip2")
    .style("opacity", 0);

//////////////
// Functions//
//////////////
var data2;

queue()
    .defer(d3.csv, "data/global-funding.csv")
    .await(ready2);

function namesFunction(x) {
    if (x === "World_Bank") {
        return "World Bank"
    } else if (x === "All_Other_Sources") {
        return "All Other Sources"
    } else if (x === "Global_Fund") {
        return "Global Fund"
    } else if (x === "United_States") {
        return "United States"
    } else if (x === "Domestic_Resources") {
        return "Domestic Resources"
    } else if (x === "United_Kingdom") {
        return "United Kingdom"
    } else {
        return x;
    }
}

function ready2(error, dataVar) {
    "use strict";
    if (error) throw error;
    data2 = dataVar;

    data2.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.Global_Fund = +d.Global_Fund || 0;
        d.United_States = +d.United_States || 0;
        d.Domestic_Resources = +d.Domestic_Resources || 0;
        d.United_Kingdom = +d.United_Kingdom || 0;
        d.World_Bank = +d.World_Bank || 0;
        d.All_Other_Sources = +d.All_Other_Sources || 0;
        d.Year = parseDate(d.Year);
    });

    updateLineChart(data2);
}

function updateLineChart(data2) {
    "use strict";

    color2.domain(d3.keys(data2[0]).filter(function (key) {
        return key !== "Year";
    }));

    var donors = color2.domain().map(function (name) {
        return {
            name: name,
            values: data2.map(function (d) {
                return {
                    Year: d.Year,
                    Spending: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data2, function (d) {
        return d.Year;
    }));

    y.domain([0,
    d3.max(donors, function (c) {
            return d3.max(c.values, function (v) {
                return v.Spending;
            });
        }) + 100
  ]);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Donations (in millions $)");

    var donor = svg2.selectAll(".donor")
        .data(donors)
        .enter().append("g")
        .attr("class", "donor");

    donor.append("path")
        .on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(0)
                .style("stroke-width", 5);

            div2.transition().duration(100)
                .style("opacity", 0.8)
            var yearVar = x.invert(d3.mouse(this)[0]).getFullYear()
            var donationVar = Math.round(y.invert(d3.mouse(this)[1]))

            div2.html(function () {
                    return "<strong>" + namesFunction(d.name) + "</strong>" + " <br> " + format(donationVar) + " million USD" + " <br> (" + "Year: " + yearVar + ")"
                })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", 1)
                .style("stroke-width", 2.5);
            div2.transition().duration(300)
                .style("opacity", 0);
        })
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return color2(d.name);
        });


    donor.append("text")
        .datum(function (d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.Year) + "," + y(d.value.Spending) + ")";
        })
        .attr("x", 3)
        .attr("dy", function (d) {
            if (d.name === "World_Bank") {
                return "-.50em"
            } else if (d.name === "All_Other_Sources") {
                return ".90em"
            } else {
                return ".25em"
            }
        })
        .attr("class", "lineText")
        .text(function (d) {
            if (d.name === "World_Bank") {
                return "World Bank"
            } else if (d.name === "All_Other_Sources") {
                return "All Other Sources"
            } else if (d.name === "Global_Fund") {
                return "Global Fund"
            } else if (d.name === "United_States") {
                return "United States"
            } else if (d.name === "Domestic_Resources") {
                return "Domestic Resources"
            } else if (d.name === "United_Kingdom") {
                return "United Kingdom"
            } else {
                return d.name;
            }
        });

    //console.log(donors);
}