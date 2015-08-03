var express = require('express'),
    router = express.Router(),
    db = require("monk")(process.env.MONGOLAB_URI),
    users = db.get('users')

/* GET users listing. */

router.get('/:id', function(req, res, next) {
  users.findOne({_id : req.params.id}, function(err, doc) {
    if(err) res.end('not found')
    res.render('list', {list : doc.bucketList})
  })
})

module.exports = router;
