var express = require('express');
var router = express.Router();
var path = require('path');
var neo4j = require('node-neo4j');
db = new neo4j('http://localhost:7474');
var moment = require("moment");

router.get('/', function(req, res, next) {
  res.send('respond with a ajax resource');
});

router.get('/getNotes', function(req, res, next) {
	var loginUser=req.cookies.loginUser;
	var today= moment().format('L');


	db.cypherQuery(
	"match  (login:user {email:'"+loginUser+"'}) "
	+"match  (login)-[f1:userBelongToFamily]->(f:family) "
	+"match  (members:user)-[f2:userBelongToFamily]->(f) "
	+"match  (date:date {date:'"+today+"'}) "
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

router.post('/AddNote', function(req, res, next) {
	var loginUser=req.cookies.loginUser;
	var note=req.body;
	var today= moment().format('L');
	console.log(today);

	db.cypherQuery(
	"match (creator:user {email:'"+loginUser+"'}) "
	+"match (tagged:user {email:'"+note.about+"'}) "
	+"merge (keyword:keyword {keyword:'"+note.keyword+"'}) "
	+"merge (tagged)-[feel:feel]->(keyword) "
	+"merge (date:date {date:'"+today+"'}) "
	+"create (note:note {details:'"+note.detail+"', value:'"+note.value+"'}) "
	+"create (note)-[linkTo:linkTo]->(keyword) "
	+"create (note)-[createdBy:createdBy]->(creator) "
	+"create (note)-[aboutUser:aboutUser]->(tagged) "
	+"create (note)-[createdOn:createdOn {time:timestamp()}]->(date) ",
	{},
	function (err, result) {
	  if (err) {
	    console.log(err);
	  }
	  res.json(true);
	});	
});




module.exports = router;