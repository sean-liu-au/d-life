var express = require('express');
var router = express.Router();
var path = require('path');
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');


router.get('/', function(req, res, next) {
  res.send('respond with a ajax resource');
});

router.get('/getNotes', function(req, res, next) {
	var loginUser='guomengjie@gmail.com';
	db.cypherQuery(
"match  (login:user {email:'"+loginUser+"'}) "
+"match  (login)-[f1:userBelongToFamily]->(f:family) "
+"match  (members:user)-[f2:userBelongToFamily]->(f) "
+"match  (date:date {date:'2016-01-13'}) "
+"match  (note:note)-[createdOn:createdOn]->(date) "
+"match  (note)-[about:aboutUser]->(members) "
+"match  (note)-[link:linkTo]->(keyword:keyword) "
+"match  (note)-[create:createdBy]->(creator:user) "
+"return {about:members.firstname,creator:creator.firstname, keyword:keyword.keyword, details:note.details}  as note "
+"order by members.firstname, keyword.keyword, creator.firstname, note.details ",
	{},
	function (err, result) {
	  if (err) {
	    return console.log(err);
	  }
	  res.json(result.data);
	});	
});





module.exports = router;