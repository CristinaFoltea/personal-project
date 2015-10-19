require('dotenv').load()
var express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    db = require("monk")(process.env.MONGOLAB_URI),
    users = db.get('users'),
    RSVP = require('rsvp');


router.get('/logout', function(req, res) {
  res.clearCookie('user', {path : '/'})
  res.clearCookie('id', {path : '/'})
  req.logOut()
  res.redirect('/')
})

router.get('/login', function(req, res){
  res.render('login', {error: null})
})

function getUser(doc, req) {
  var promise = new RSVP.Promise(function (resolve, reject) {
     if (bcrypt.compareSync(req.body.password, doc.password) && doc !== null) {
       resolve(doc)
      } else {
       reject()
     }
  })
  return promise
}

router.post('/login', function(req, res, next) {
  users.findOne({email : req.body.email}).then(function (result) {
    return getUser(result, req)
  }).then(function (doc) {
    res.cookie('user', {displayName : doc.fullName})
    res.cookie('id', doc._id)
    res.render('index', {user : {displayName : doc.fullName}, id : doc._id })
  }, function (error) {
    res.render('login', {message : "Log in failed"})
  })
})

router.get('/register', function(req, res, next) {
  res.render('register')
})

function hashing(password) {
  var promise = new RSVP.Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        resolve(hash)
      })
    })
  })
  return promise
}

router.post('/register', function(req, res, next) {
  hashing(req.body.password).then(function (hash) {
    req.body.password = hash
    req.body.bucketList = []
    return users.insert(req.body)
  }).then(function (doc) {
    res.cookie('user', {displayName : doc.fullName})
    res.cookie('id', doc._id)
    res.render('index', {user : {displayName : doc.fullName}, id : doc._id })
  }, function (error) {
    console.log(error);
  })
})

router.use(function (req, res, next) {
  res.locals.user = req.user
  res.locals.id = req.id
  next()
})

module.exports = router;
