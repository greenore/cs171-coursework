// DATASETS

// Global variable with 1198 pizza deliveries
console.log(deliveryData);

// Access list
function returnList(data, objName) {
    var x = [];

    for (i = 0; i < data.length; i++) {
        x[i] = data[i][objName]
    }

    return x
}

console.log(returnList(deliveryData, "delivery_id"));
console.log(returnList(deliveryData, "date"));
console.log(returnList(deliveryData, "area"));
console.log(returnList(deliveryData, "price"));
console.log(returnList(deliveryData, "count"));
console.log(returnList(deliveryData, "driver"));
console.log(returnList(deliveryData, "delivery_time"));
console.log(returnList(deliveryData, "temperature"));
console.log(returnList(deliveryData, "drinks_ordered"));
console.log(returnList(deliveryData, "order_type"));


// Global variable with 200 customer feedbacks
console.log(feedbackData);
console.log(feedbackData.length);
console.log(returnList(feedbackData, "punctuality"));
console.log(returnList(feedbackData, "quality"));
console.log(returnList(feedbackData, "delivery_id"));
console.log(returnList(feedbackData, "wrong_pizza"));

// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART
createSummary(deliveryData, feedbackData);

function createSummary(data1, data2) {
    
    // Math
    //-----
    // Number of pizza deliveries 
    var numberDeliveries = data1.length;

    // Number of pizza deliveries (Count)
    var totalPizza = 0;
    for (i = 0; i < data1.length; i++) {
        totalPizza += data1[i].count;
    }

    // Average delivery time
    var totalDeliveryTime = 0;
    for (i = 0; i < data1.length; i++) {
        totalDeliveryTime += data1[i].delivery_time;
    }
    var meanDelieveryTime = totalDeliveryTime / numberDeliveries;

    // Total sales in USD
    var totalSales = 0;
    for (i = 0; i < data1.length; i++) {
        totalSales += data1[i].price;
    }

    // Number of all feedback entries
    var numberFeedbackEntries = data2.length;

    // Number of feedback entries per quality category: low, medium, high
    var qualityLow = data2.filter(function (value) {
        return value.quality === "low";
    });
    var qualityMedium = data2.filter(function (value) {
        return value.quality === "medium";
    });
    var qualityHigh = data2.filter(function (value) {
        return value.quality === "high";
    });

    // HTML Txt
    //---------
    var htmlTxt = "<h4>Dataset Summary</h4>";

    htmlTxt += "<table class='mytable highlight'>"
    htmlTxt += "<tr><th>Delivery Data</th>"
    htmlTxt += "<th>Feedback Data</th></tr>"

    htmlTxt += "<tr><td>Number of deliveries: " + numberDeliveries + " </td>"
    htmlTxt += "<td>Number of feedbacks: " + numberFeedbackEntries + "</td></tr>"

    htmlTxt += "<tr><td>Number of pizzas: " + totalPizza + "</td>"
    htmlTxt += "<td>Low quality entries: " + qualityLow.length + "</td></tr>"

    htmlTxt += "<tr><td>Average delivery time: " + Math.round(meanDelieveryTime) + "</td>"
    htmlTxt += "<td>Medium quality entries: " + qualityMedium.length + "</td></tr>"

    htmlTxt += "<tr><td>Total sales: " + Math.round(totalSales) + " $</td>"
    htmlTxt += "<td>High quality entries: " + qualityHigh.length + "</td></tr>"

    htmlTxt += "</tr></table></div>"

    document.getElementById("text-area").innerHTML = htmlTxt
}

// Barchart
createVisualization(deliveryData);

function createVisualization(data) {
    renderBarChart(data);
}

// dataManipulation
function dataManipulation() {
    var delivery = deliveryData;
    var feedback = feedbackData;

    var selectedBox1 = document.getElementById("delivery-area");
    var selectedBox2 = document.getElementById("order-type");

    var selectedValue1 = selectedBox1.options[selectedBox1.selectedIndex].value;
    var selectedValue2 = selectedBox2.options[selectedBox2.selectedIndex].value;

    // Filter category
    if (selectedValue1 != "All") {
        delivery = delivery.filter(function (value) {
            return value.area.toLowerCase() === selectedValue1.toLowerCase();
        });

    }

    if (selectedValue2 != "All") {
        delivery = delivery.filter(function (value) {
            return value.order_type.toLowerCase() === selectedValue2.toLowerCase();
        });
    }

    
    feedback = findMultibleIds(feedback, "delivery_id", returnList(delivery, "delivery_id"));

    createVisualization(delivery);
    createSummary(delivery, feedback);
}


// Find single ID in data
function findId(data, idVarName, idToLookFor) {

    for (var i = 0; i < data.length; i++) {
        if (data[i][idVarName] == idToLookFor) {
            return (data[i]);
        }
    }
}

// Find multible ID's in data
function findMultibleIds(data, idVarName, idsToLookFor) {
    var item = [];

    for (var i = 0; i < idsToLookFor.length; i++) {
        if (typeof findId(data, idVarName, idsToLookFor[i]) != "undefined") {
            item.push(findId(data, idVarName, idsToLookFor[i]));
        }
    }
    
    return (item)
}


/* ************************************************************
 *
 * ADD YOUR CODE HERE
 * (accordingly to the instructions in the HW2 assignment)
 * 
 * 1) Filter data
 * 2) Display key figures
 * 3) Display bar chart
 * 4) React to user input and start with (1)
 *
 * ************************************************************/
