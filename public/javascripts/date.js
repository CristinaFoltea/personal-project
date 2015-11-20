var message = document.getElementById("message");
var cancel = document.getElementById("cancel-pop-up");
var input = document.getElementById("auto-google");
autocomplete = new google.maps.places.Autocomplete(input)

$(function() {
  $("#start").datepicker({
  dateFormat: "yy-mm-dd"
})
})

$(function() {
  $("#end").datepicker({
  dateFormat: "yy-mm-dd"
})
})

//adding alternating class for list items
$(document).ready(function(){
  $('#city-list li:nth-child(odd)').addClass('alternate');
});
