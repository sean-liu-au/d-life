var express = require('express');
var router = express.Router();
var path = require('path');
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Know Your Life' });
});


router.post('/auth', function(req, res, next) {
  var auth=req.body;
  db.cypherQuery(
    "MATCH (n:user{email:'"+auth.username+"', password:'"+auth.password+"'}) RETURN n",
    {},
    function (err, result) {
      if (err) {
        return console.log(err);
      }

      if (result.data.length!=0) {        
        res.redirect('/notes');
      }else{
        res.redirect('/');
      }  
    });
});

router.get('/notes',function(req,res){
  res.render('notes', { title: 'Notes' });
});

router.get('/userlist',function(req,res){
  db.cypherQuery(
    'MATCH (n:user) RETURN n LIMIT 25',
    {},
    function (err, result) {
      if (err) {
        return console.log(err);
      }
      console.log('kjhfksajhfaiwehfwfnei');
      console.log(result.data); // delivers an array of query results
      res.json(result.data); 
    }
  );
});

module.exports = router;
