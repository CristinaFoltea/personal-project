function Orbit (){}
 Orbit.prototype.get = function (path, callback) {
  var res = new XMLHttpRequest()
  res.open("post", path)
  res.addEventListener('load', callback.bind(res, res))
  res.send()
  return res
  }

  var orbit = new Orbit ()
var usersRequest = orbit.post('/save', function() {
  console.log(this.response);
});


function save(e){

}
