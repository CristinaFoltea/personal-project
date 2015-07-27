require('dotenv').load()
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var SabreDevStudio = require('sabre-dev-studio');
var db = require("monk")(process.env.MONGOLAB_URI);
var destinations = db.get('destinations');
var sabreDevStudio = new SabreDevStudio({
  client_id:     process.env.SABRE_CLIENT_ID,
  client_secret: process.env.SABRE_SECRET,
  uri:           'https://api.test.sabre.com'
});
var options = {};


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    unirest.get('https://api.twitter.com/1.1/list/~:(id,num-connections,picture-url)')
      .header('Authorization', 'Bearer ' + req.user.token)
      .header('x-li-format', 'json')
      .end(function (response) {
        res.render('index', { user : req.user});
      })
  } else {
    res.render('index', {});
  }
});

router.get('/airport', function(req, res) {
    unirest.get('http://iatacodes.org/api/v1/cities.json?api_key=' + process.env.IATA_KEY)
      .end(function (response) {
        response.body.response.forEach(function(value){
          destinations.insert({ iata: value.code, city : value.name, country : value.country_code}, function(err, doc){
            if (err) res.end('404')
            res.end()
          })
        })
      })
      .error(function(data, status){
        console.log(data)
      })
})


router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
  res.redirect('/')
})
})

function sabreCall(q, res) {
sabreDevStudio.get(q, options, function(err, data) {
  console.log(JSON.parse(data).FareInfo[0].LowestNonStopFare)
  response(res, err, data);
});
}

function response(res, err, data) {
if (err) {
  res.status(200).send({
    'status': false,
    'message': 'NO results matching your query',
    'info': err
  });
} else {
  res.status(200).send({
    'status': true,
    'message': 'Success',
    'info': data
  });
}
}

router.get('/places', function(req,res) {
  origin = req.query.origin.split(',')
  destinations.findOne({city : origin[0]}, function(err, doc){
    if(err) console.log('can\'t find this data')
    // code = doc.iata
    // console.log(code)
    console.log(doc.iata)
    sabreCall('/v1/shop/flights/fares?origin=' + doc.iata +
    '&departuredate=' + req.query.departuredate +
    '&returndate=' + req.query.returndate +
    '&maxfare=' + req.query.maxfare, res);
    });
  })

module.exports = router;
