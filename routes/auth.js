require('dotenv').load();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require("monk")(process.env.MONGOLAB_URI);
var users = db.get('users');

router.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) res.end('404')
  res.redirect('/')
  })
})

router.get('/login', function(req, res){
  res.render('login', {error: null})
})

router.post('/login', function(req, res, next) {
  users.findOne({email : req.body.email}, function(err, doc) {
    if (err) res.end('dead end')
    if (doc === null) {
      res.render('login', {message : "Log in failed"})
      return
    }
    if (bcrypt.compareSync(req.body.password, doc.password)) {
        res.render('index', { user : { displayName : doc.fullName}})
      } else {
        res.render('login', {message : "Log in failed"})
     }
  })
})

router.get('/register', function(req, res, next) {
  res.render('register')
})

router.post('/register', function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        req.body.password = hash
        users.insert(req.body, function(err, doc) {
          if (err) res.send('something went wrong')
          res.render('index', { user : { displayName : doc.fullName}})
        })
      })
    })
})


module.exports = router;
