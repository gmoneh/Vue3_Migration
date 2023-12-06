$(document).ready(function () {


    applyDateFormatters();

});
//$(document).after("<script type='text/javascript'> applyDateFormatters();</script >")
function applyDateFormatters() {
  
    $(".shortDate").each(function () {
        $(this).text(shortDate($(this).text()));
    });
  
    $(".longDate").each(function () {
        $(this).text(longDate($(this).text()));
    });

    $(".monthAbbrevDate").each(function () {
        $(this).text(monthAbbrevDate($(this).text()));
    });
    $(".monthAbbrevDateTime").each(function () {
        $(this).text(monthAbbrevDateTime($(this).text()));
    });

    
    $(".monthAbbrevFullYearDate").each(function () {
        $(this).text(monthAbbrevFullYearDate($(this).text()));
    });

    $(".mmonthYearDate").each(function () {
        $(this).text(monthYearDate($(this).text()));
    });
}