function Orbit(){}
 Orbit.prototype.get = function (path, callback) {
  var res = new XMLHttpRequest()
  res.open('get', path)
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

function change(e){
  var show = document.getElementById('show')
  if (e.classList.contains("fa-chevron-down")) {
    e.classList.remove('fa-chevron-down')
    e.classList.add('fa-chevron-left')
    show.classList.remove('show')
    show.classList.add('hide')
  } else {
    e.classList.add('fa-chevron-down')
    e.classList.remove('fa-chevron-left')
    show.classList.add('visible')
    show.classList.remove('hide')
  }
}
