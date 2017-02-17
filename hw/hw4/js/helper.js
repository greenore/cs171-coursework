// Add JSLint settings
/*jslint browser: true*/
/*global $, jQuery, alert, d3, console*/

// Range function
function countUp(start, end) {
    "use strict";
    var array = [];

    for (var i = start; i < end; i++) {
        array.push(i);
    }
    return array;
}
