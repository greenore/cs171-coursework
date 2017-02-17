// Add JSLint settings
/*jslint browser: true*/
/*global $, jQuery, alert, d3, console*/

// Population Plot
//----------------
var data;
// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", function (error, dataset) {
    // Setup
    //--------
    "use strict";
    data = dataset;

    // Transform the data
    var parseDate = d3.time.format("%Y-%m-%d");
    data.forEach(function (d) {
        d.date = parseDate.parse(d.date);
        d.population = +d.population;
    });

    data.sort(function (a, b) {
        return a.date - b.date;
    });

    // Filter missing variables (i.e., Taiwan)
    var data = data.filter(function (value) {
        return value.population !== 0 &&
            value.date !== isNaN;
    });

    // Margins etc.
    //------------
    // Margin object with properties for the four directions
    var margin = {
        top: 30,
        right: 10,
        bottom: 115,
        left: 90
    };

    // Width and height as the inner dimensions of the chart area
    var width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // SVG Areas
    //----------
    // Define SVG area
    var svg = d3.select("#area-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scales & Shapes
    //----------------
    // Linear scales
    var xScale = d3.time.scale()
        .domain([d3.min(data, function (d) {
                return d.date;
            }),
                     d3.max(data, function (d) {
                return d.date;
            })])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([0,
            d3.max(data, function (d) {
                return d.population + 40000;
            })])
        .range([height, 0]);

    // Define Area shape
    var area = d3.svg.area()
        .x(function (d) {
            return xScale(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return yScale(d.population);
        });

    // Axes
    //-----
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(12)
        .tickFormat(d3.time.format("%B %Y"));

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // Drawing
    //--------
    // Draw graph
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Draw x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    // Draw y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add text
    svg.append("text")
        .attr("class", "text titel")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text("Camp Population");

    svg.append("text")
        .attr("class", "text label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Date");

    svg.append("text")
        .attr("class", "text label")
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("y", 0 - margin.left + 15)
        .text("Population")
        .attr("transform", "rotate(-90)");

    // Draw interactive line
    //----------------------
    // Define the line
    var formatDate = d3.time.format("%d-%b"),
        bisectDate = d3.bisector(function (d) {
            return d.date;
        }).left;

    var lineSvg = svg.append("g");

    var focus = svg.append("g")
        .style("display", "none");

    // Add the are path.
    lineSvg.append("path")
        .attr("class", "area")
        .attr("d", area(data));

    // Append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "white")
        .style("stroke", "black")
        .style("opacity", 0.8)
        .attr("r", 6);

    // Append X line
    focus.append("line")
        .attr("class", "tooltip-line")
        .attr("y1", 0)
        .attr("y2", height);

    // population text
    focus.append("text")
        .attr("class", "y1")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // date text
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "1em");

    // append invisible rectangle to capture the mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function () {
            focus.style("display", null);
        })
        .on("mouseout", function () {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        // Add defined elements to svg
        focus.select("circle.y")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population) + ")");

        focus.select(".tooltip-line")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                0 + ")")
            .attr("y2", height);

        var populationFormat = d3.format("0,000");
        focus.select("text.y1")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                25 + ")")
            .text("People: " + populationFormat(d.population));

        var dateFormat = d3.time.format("%d. %B %Y");
        focus.select("text.y2")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                25 + ")")
            .text("Date: " + dateFormat(d.date));

    }

    console.log("hello");

});

// Shelter plot
//-------------
// Define data
var shelterData = [{
        "category": "Caravans",
        "value": 0.7968
    },
    {
        "category": "Combination*",
        "value": 0.1081
    },
    {
        "category": "Tents",
        "value": 0.0951
    }];

// Load barPlot function 
function barPlot(data) {
    // Setup
    //--------
    "use strict";

    // Margins etc.
    //------------
    // Margin object with properties for the four directions
    var margin = {
        top: 30,
        right: 10,
        bottom: 115,
        left: 65
    };

    // Width and height as the inner dimensions of the chart area
    var width = 400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var barWidth = width / data.length;

    // SVG Areas
    //----------
    // Define SVG area
    var svg = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scales & Shapes
    //----------------
    // Linear scales
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.25)
        .domain(data.map(function (d) {
            return d.category;
        }));

    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain([0, 1]);

    // Axes
    //-----
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10, "%");

    // Drawing
    //--------
    // Draw graph
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d.category);
        })
        .attr("width", barWidth - 40)
        .attr("y", function (d) {
            return yScale(d.value);
        })
        .attr("height", function (d) {
            return height - yScale(d.value);
        });

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return Math.round(d.value * 10000) / 100 + " %";
        })
        .attr("x", function (d) {
            return xScale(d.category) + 35;
        })
        .attr("y", function (d) {
            return yScale(d.value) - 5;
        })
        .attr("text-anchor", "middle");


    // Draw x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text");

    // Draw y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add text
    svg.append("text")
        .attr("class", "text titel")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text("Type of Shelter");

    svg.append("text")
        .attr("class", "text label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Category");

    svg.append("text")
        .attr("class", "text label")
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("y", 0 - margin.left + 15)
        .text("Percentage")
        .attr("transform", "rotate(-90)");

};

barPlot(shelterData);
