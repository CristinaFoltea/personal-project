require('dotenv').load()
var express = require('express'),
    request = require('request'),
    unirest = require('unirest'),
    router = express.Router(),
    SabreDevStudio = require('sabre-dev-studio'),
    db = require('monk')(process.env.MONGOLAB_URI),
    destinations = db.get('destinations'),
    users = db.get('users'),
    options = {},
    userForCity = null,
    sabreDevStudio = new SabreDevStudio({
      client_id:     process.env.SABRE_CLIENT_ID,
      client_secret: process.env.SABRE_SECRET,
      uri:           'https://api.test.sabre.com'
    })

router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    unirest.get('https://api.twitter.com/1.1/list/~:(id,num-connections,picture-url)')
      .header('Authorization', 'Bearer ' + req.user.token)
      .header('x-li-format', 'json')
      .end(function (response) {
        res.cookie('user', {displayName : req.user.displayName})
        res.render('index', { user : req.user});
      })
  } else {
    res.render('index', {})
  }
})

function getCity(dataArr, doc, res){
  var cityNameCollection = []
  var completed = 0
  dataArr.forEach(function(city) {
    unirest.get('http://iatacodes.org/api/v1/cities.json?api_key=' + process.env.IATA_KEY + '&code=' + city.DestinationLocation)
      .end(function(response){
        completed++
        if(JSON.parse(response.raw_body).response.length > 0){
          cityNameCollection.push({
            city : JSON.parse(response.raw_body).response[0].name,
            code : city.DestinationLocation,
            price : city.LowestFare})
            if (completed === dataArr.length) {
              // google(cityNameCollection, doc)
              res.render('cities', { results : cityNameCollection, origin : doc, userForCity : userForCity})}
        }
      })
    })
  }

function sabreCall(q, doc, res) {
  sabreDevStudio.get(q, options, function(err, data) {
    if (err) {res.render('index', {message : 'Can\'t find destinations for this price - destination combination'})
  } else {
      getCity(JSON.parse(data).FareInfo, doc, res)
  }})
}

router.get('/places', function(req,res) {
  userForCity = res.locals.id;
  console.log(userForCity);
  origin = req.query.origin.split(',');
  destinations.findOne({city : origin[0]}, function(err, doc){
    if(err) console.log('can\'t find this data')
    if (doc) {
      sabreCall('/v1/shop/flights/fares?origin=' + doc.iata +
                '&departuredate=' + req.query.departuredate +
                '&returndate=' + req.query.returndate +
                '&maxfare=' + req.query.maxfare, req.query, res);
    } else {
      res.render('index', {message : 'We can\'t find an airoport matching your city'})
    }
  })
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
  } else {
    res.redirect('/auth/login')
  }
})

router.get('/delete/:id', function(req, res) {
  users.update({_id : res.locals.id }, {$pull : {bucketList : req.params.id }}, function(err, doc) {
    if(err) res.end('error')
    res.redirect('/users/' + res.locals.id)
  })
})

module.exports = router;












// function google(cities, doc) {
//   console.log(cities);
//   destinations.findOne({city : doc.origin.split(',')[0]}, function (err, data) {
//     if(err) console.log('bad DB connection');
//     var array = [],
//         count = data.length
//     var result = cities.map(function (value) {
//       var requestData = {
//       request: {
//         maxPrice : 'USD' + doc.maxfare,
//         slice: [
//           {
//             origin: data.iata,
//             destination: value.code,
//             date: doc.departuredate
//           },
//           {
//             origin: value.code,
//             destination: data.iata,
//             date: doc.returndate
//           }
//           ],
//           passengers: {
//           adultCount: 1,
//           infantInLapCount: 0,
//           infantInSeatCount: 0,
//           childCount: 0,
//           seniorCount: 0
//           },
//           solutions: 2,
//           refundable: false
//         }
//       };
//
//       url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + process.env.GOOGLE_KEY
//        request({
//           url: url,
//           method: "POST",
//           headers: {
//               "content-type": "application/json",
//           },
//           body: JSON.stringify(requestData)
//       }, function (err, response, body) {
//         if (JSON.parse(body)){
//           console.log(JSON.parse(body));
//           array.push({city : data.city,
//                         code : data.code,
//                         flight : JSON.parse(body).trips.tripOption
//                         // flight1_price : JSON.parse(body).trips.tripOption[0].price,
//                         // flight2_price : JSON.parse(body).trips.tripOption[1].price,
//                         // flight1_carrier : JSON.parse(body).trips.tripOption[0].slice[0].segment[0].flight,
//                         // flight2_carrier : JSON.parse(body).trips.tripOption[1].slice[0].segment[0].flight
//                         // flight1_carrier : JSON.parse(body).trips.tripOption[1].slice[0].segment[0].leg
//                         // flight2_carrier : JSON.parse(body).trips.tripOption[1].slice[0].segment[0].leg
//         //  console.log(JSON.parse(body).trips.tripOption[0].saleTotal);
//         //  console.log(JSON.parse(body).trips.tripOption[1].saleTotal);
//         //  console.log(JSON.parse(body).trips.tripOption[0].slice[0].segment[0]);
//         //  console.log(JSON.parse(body).trips.tripOption[0].slice[1].segment[0]);
//         //  console.log(JSON.parse(body).trips.tripOption[1].slice[0].segment[0]);
//         //  console.log(JSON.parse(body).trips.tripOption[1].slice[1].segment[0]);
//         })
//       } else {
//         count --
//       }
//       if(array.length == count){
//         console.log(array);
//         render('index', {result : array})
//       }
//     })
//   })
// })
// }
