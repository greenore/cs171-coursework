
/*****************************************/
/*   DRAW BAR CHART - ALREADY COMPLETE   */
/*****************************************/


// Chart area

var margin = {top: 60, right: 20, bottom: 40, left: 80},
		width = $('#chart-area').width() - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

width = width > 600 ? 600 : width;
width = width < 400 ? 400 : width;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Parse date
var	parseDate = d3.time.format("%Y-%m-%d").parse;


// Scales and axes 

var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
		.range([height, 0]);

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.time.format("%Y-%m-%d"));

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var xAxisGroup = svg.append("g")
		.attr("class", "x-axis axis");

var yAxisGroup = svg.append("g")
	.attr("class", "y-axis axis");


// Initialize tooltip
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
	return "<b>" + d.values + "</b> Deliveries<br/>Date: " + d.key.getMonth() + 1 + "/" + d.key.getDate() + "/" + d.key.getFullYear();;
});


function renderBarChart(data) {

	// Group data by 'date'
	var nestedData = d3.nest()
		.key(function(d) { return d.date; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(data);

	nestedData.forEach(function(d) {
		d.key = parseDate(d.key);
		d.value = +d.value;
	});

	// Update scale domains
	x.domain(nestedData.map(function(d) { return d.key; }));
	y.domain([0, d3.max(nestedData, function(d) { return d.values; })]);


	// ---- DRAW BARS ----

	var bars = svg.selectAll(".bar")
			.data(nestedData);

	// Add
	bars.enter().append("rect")
			.attr("class", "bar");

	// Update
	bars
			.attr("x", function(d) { return x(d.key); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.values); })
			.attr("height", function(d) { return height - y(d.values); })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

	// Remove
	bars.exit().remove();

	// Invoke tooltip
	bars.call(tip)


	// ---- DRAW AXIS	----

	xAxisGroup = svg.select(".x-axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	yAxisGroup = svg.select(".y-axis")
			.call(yAxis);

	svg.select("text.axis-title").remove();

	svg.append("text")
		.attr("class", "axis-title")
		.attr("x", -5)
		.attr("y", -15)
		.attr("dy", ".1em")
		.style("text-anchor", "end")
		.text("Deliveries");
}