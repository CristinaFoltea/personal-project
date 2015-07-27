var input = document.getElementById('autocomplete')
autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});

$(function() {
  $("#start").datepicker({
  dateFormat: "yy-mm-dd"
})
});

$(function() {
  $("#end").datepicker({
  dateFormat: "yy-mm-dd"
})
});
