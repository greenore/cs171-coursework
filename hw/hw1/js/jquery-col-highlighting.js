// JQuery helper function to highlight columns
$('td').hover(function() {
    var t = parseInt($(this).index()) + 1;
    $('td:nth-child(' + t + ')').addClass('highlighted');
},
function() {
    var t = parseInt($(this).index()) + 1;
    $('td:nth-child(' + t + ')').removeClass('highlighted');
});


// Source: http://stackoverflow.com/questions/1553571/html-hover-table-column