function Orbit(){}
 Orbit.prototype.get = function (path, callback) {
  var res = new XMLHttpRequest()
  res.open("get", path)
  res.addEventListener('load', callback.bind(res, res))
  res.send()
  return res
  }

var orbit = new Orbit()


function save(id){
  orbit.get('/save/' + id, function() {
    var input = document.getElementById(id)
    console.log(input.innerHTML)
    input.innerHTML = 'Saved'
    input.classList.add('saved')
  })
}
