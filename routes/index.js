require('dotenv').load()
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var SabreDevStudio = require('sabre-dev-studio');
var db = require("monk")(process.env.MONGOLAB_URI);
var destinations = db.get('destinations');
var users = db.get('users');
var options = {};
var sabreDevStudio = new SabreDevStudio({
  client_id:     process.env.SABRE_CLIENT_ID,
  client_secret: process.env.SABRE_SECRET,
  uri:           'https://api.test.sabre.com'
});


router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    unirest.get('https://api.twitter.com/1.1/list/~:(id,num-connections,picture-url)')
      .header('Authorization', 'Bearer ' + req.user.token)
      .header('x-li-format', 'json')
      .end(function (response) {
        console.log(response)
        res.cookie('user', {displayName : req.user.displayName})
        res.render('index', { user : req.user});
      })
  } else {
    res.render('index', {});
  }
})

function getCity(dataArr, res){
  var cityNameCollection = []
  var completed = 0;
  dataArr.forEach(function(city) {
    unirest.get('http://iatacodes.org/api/v1/cities.json?api_key=' + process.env.IATA_KEY + "&code=" + city.DestinationLocation)
      .end(function(response){
        completed++
        if(JSON.parse(response.raw_body).response.length > 0){
          cityNameCollection.push({
                city : JSON.parse(response.raw_body).response[0].name,
                code : city.DestinationLocation,
                price : city.LowestFare})
          if (completed === dataArr.length) {
            res.render('cities', { results : cityNameCollection}
        )}
     }
  })
})}

function sabreCall(q, res) {
  sabreDevStudio.get(q, options, function(err, data) {
    if (err) res.render('index', {message : 'Can\'t find destinations for this price - destination combination'})
    else {
      getCity(JSON.parse(data).FareInfo, res);
  }})
}

router.get('/places', function(req,res) {
  origin = req.query.origin.split(',')
  destinations.findOne({city : origin[0]}, function(err, doc){
    if(err) console.log('can\'t find this data')
    if (doc) {
      sabreCall('/v1/shop/flights/fares?origin=' + doc.iata +
                '&departuredate=' + req.query.departuredate +
                '&returndate=' + req.query.returndate +
                '&maxfare=' + req.query.maxfare, res);
    } else {
      res.render('index', {message : 'We can\'t find an airoport matching your city'})
    }
  })
})

router.post('/save', function(req, res){

})

router.get('/photos/:id', function(req, res) {
  destination = req.params.id.replace(/\s/g, '')
  unirest.get('https://api.instagram.com/v1/tags/' + destination + '/media/recent?client_id=' + process.env.CLIENT_ID_INSTAGRAM)
    .type('json')
    .end(function (response) {
      res.render('more', {photos : JSON.parse(response.raw_body).data})
    })
  })

router.get('/save/:id', function(req, res) {
  if(res.locals.id){
    users.update({_id : res.locals.id}, {$push : { bucketList : req.params.id }}, function(err, doc) {
      if(err) res.end('error')
      res.end()
    })
  }
  else {
    res.redirect('/auth/login')
  }
})

module.exports = router;
