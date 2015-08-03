var express = require('express'),
    router = express.Router(),
    db = require("monk")(process.env.MONGOLAB_URI),
    users = db.get('users')

/* GET users listing. */

router.get('/', function(req, res, next){
  res.render('register', {message : "You need an account to create a bucket list"})
})

router.get('/:id', function(req, res, next) {
  console.log(req.params.id)
  users.findOne({_id : req.params.id}, function(err, doc) {
    if(err) res.end('not found')
    res.render('list', {list : doc.bucketList})
  })
})

module.exports = router;
