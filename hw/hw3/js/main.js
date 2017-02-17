//////////////////
// Activity III //
//////////////////

d3.csv("data/buildings.csv", function (data) {

    // Sort data
    data = data.sort(function (a, b) {
        return b.height_m - a.height_m;
    });

    clickFunction(data[0])

    // Transform the data
    data.forEach(function (d) {
        d.height_m = +d.height_m;
        d.height_ft = +d.height_ft;
        d.height_px = +d.height_px;
        d.floors = +d.floors;
        d.completed = +d.completed;
    });

    function clickFunction(element) {
        console.log(element);
        
        // HTML Txt
        //---------
        var htmlTxt = "<div class='col-sm-4' id='building_picture'>";
        htmlTxt += "<img src='img/" + element.image + "' alt='Image' class='image'></div>"
        htmlTxt += "<div class='col-sm-4' id='building_info'>"
        
                  
        htmlTxt += "<h4 id='building-title'>" + element.building + "</h4>"

        htmlTxt += "<table class='mytable'>"

        htmlTxt += "<tr><td>Height</td>"
        htmlTxt += "<td>" + element.height_m + "m" + "</td></tr>"

        htmlTxt += "<tr><td>City</td>"
        htmlTxt += "<td>" + element.city + "</td></tr>"

        htmlTxt += "<tr><td>Country</td>"
        htmlTxt += "<td>" + element.country + "</td></tr>"

        htmlTxt += "<tr><td>Floors</td>"
        htmlTxt += "<td>" +  element.floors + "</td></tr>"

        htmlTxt += "<tr><td>Completed</td>"
        htmlTxt += "<td>" +  element.completed + "</td></tr>"

        htmlTxt += "</tr></table></div></div>"
        document.getElementById("svg_right").innerHTML = htmlTxt
    }

    // Define left SVG Space
    var svg_left = d3.select("#svg_left").append("svg")
        .attr("width", 500)
        .attr("height", 500)

    // Bind the date to SVG rectangles
    svg_left.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-chart")
        .attr("fill", "darkred")
        .attr("width", function (d) {
            return d.height_px
        })
        .attr("height", 20)
        .attr("x", 220)
        .attr("y", function (d, index) {
            return (index * 40)
        })
        .on("click", function (element) {
            clickFunction(element)
        });

    //Add the SVG Text Element to the svgContainer
    svg_left.selectAll("text.names")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "tower-names")
        .attr("x", 210)
        .attr("y", function (d, index) {
            return (index * 40 + 15)
        })
        .text(function (d) {
            return d.building;
        })
        .on("click", function (element) {
            clickFunction(element)
        });

    svg_left.selectAll("text.labels")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-labels")
        .attr("x", function (d) {
            return 215 + d.height_px
        })
        .attr("y", function (d, index) {
            return (index * 40 + 15)
        })
        .text(function (d) {
            return d.height_m;
        })
        .on("click", function (element) {
            clickFunction(element)
        });

});
