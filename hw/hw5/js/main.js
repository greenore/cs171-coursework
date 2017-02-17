/*
 main.js
 @author			Tim Hagmann
 @license			MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

// SVG drawing area

var margin = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 60
};

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Scales
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// Axes
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(10)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10)
    .orient("bottom");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

// Axes
///////
// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Initialize data
loadData();

// FIFA world cup
var data;

// Load CSV file
function loadData() {
    d3.csv("data/fifa-world-cup.csv", function (error, csv) {

        csv.forEach(function (d) {
            // Convert string to 'date object'
            d.YEAR = formatDate.parse(d.YEAR);

            // Convert numeric values to 'numbers'
            d.TEAMS = +d.TEAMS;
            d.MATCHES = +d.MATCHES;
            d.GOALS = +d.GOALS;
            d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
            d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
        });

        // Store csv data in global variable
        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });
}

// Render visualization
function updateVisualization() {

    // Get selected group
    /////////////////////
    var group = d3.select("#ranking-type")
        .property("value"),
        startYear = d3.select("#startYear")
        .property("value"),
        endYear = d3.select("#endYear")
        .property("value");

    // Filter data
    var parseDate = d3.time.format("%Y");
    data2 = data.filter(function (d) {
        return d.YEAR >= parseDate.parse(startYear) && d.YEAR <= parseDate.parse(endYear)
    });

    // Sort data
    data2.sort(function (a, b) {
        return b.YEAR - a.YEAR
    });

    // Tooltip
    tip.html(function (d) {
        return "<strong>Edition:</strong> <span style='color:#ffce00'>" + d.EDITION + "</span>" + "<br/><strong >" + group + ": </strong> <span style='color:#ffce00'>" + d[group] + "</span >";
    })

    // Specify the domain 
    /////////////////////
    x.domain(d3.extent(data2, function (d) {
        return d.YEAR;
    }));

    y.domain([0, d3.max(data2, function (d) {
        return d[group];
    })]);

    // Create line chart
    ////////////////////
    var line = d3.svg.line()
        .x(function (d) {
            return x(d.YEAR);
        })
        .y(function (d) {
            return y(d[group]);
        })
        .interpolate("linear");

    svg.call(tip);

    // SELECT / ENTER / UPDATE / REMOVE
    ///////////////////////////////////
    // SELECT
    var linePath = svg.selectAll(".line").data(data2);
    var circle = svg.selectAll(".circle")
        .data(data2);

    // ENTER
    linePath.enter().append("path");
    circle.enter().append("circle");

    // UPDATE
    linePath.attr("class", "line")
        .transition()
        .duration(800)
        .ease("linear")
        .attr("d", line(data2));

    circle.attr("class", "circle")
        .on('mouseover', function (d) {
            tip.show(d);
            showEdition(d);
        })
        .on('mouseout', function (d) {
            tip.hide(d);
            hideEdition(d);
        })
        .transition()
        .duration(800)
        .ease("linear")
        .attr("r", 7)
        .attr("cx", function (d) {
            return x(d.YEAR);
        })
        .attr("cy", function (d) {
            return y(d[group]);
        });

    svg.selectAll(".x.axis")
        .transition()
        .duration(800)
        .ease("linear")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".y.axis") // change the y axis
        .transition()
        .duration(800)
        .ease("linear")
        .call(yAxis);

    // EXIT
    linePath.exit().remove();
    circle.exit().remove();

    // Log
    ///////
    console.log(data2);
}


var svg2 = d3.select("#text-area").append("svg");

// Show details for a specific FIFA World Cup
function showEdition(d) {

    var htmlTxt = "</br></br><table class='table col-md-2'>"

    htmlTxt += "<caption>" + d.EDITION + "</caption>"

    htmlTxt += "<tr><td>Winner: </td>"
    htmlTxt += "<td>" + d.WINNER + "</td></tr>"

    htmlTxt += "<tr><td>Goals: </td>"
    htmlTxt += "<td>" + d.GOALS + "</td></tr>"

    htmlTxt += "<tr><td>Average Goals: </td>"
    htmlTxt += "<td>" + d.AVERAGE_GOALS + "</td></tr>"

    htmlTxt += "<tr><td>Matches: </td>"
    htmlTxt += "<td>" + d.MATCHES + "</td></tr>"

    htmlTxt += "<tr><td>Teams: </td>"
    htmlTxt += "<td>" + d.TEAMS + "</td></tr>"

    htmlTxt += "<tr><td>Average Attendance</td>"
    htmlTxt += "<td>" + d.AVERAGE_ATTENDANCE + "</td></tr>"

    htmlTxt += "</tr></table>"

    console.log(htmlTxt)
    document.getElementById("text-area").innerHTML = htmlTxt
}

function hideEdition(d) {
    document.getElementById('text-area').innerHTML = "";
}
