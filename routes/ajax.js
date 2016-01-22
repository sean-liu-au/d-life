var express = require('express');
var router = express.Router();
var path = require('path');
var neo4j = require('node-neo4j');
var db = new neo4j('http://localhost:443','Authorization:Basic bmVvNGo6THlic2VhbjIwMTY=');
var moment = require("moment");

router.get('/', function(req, res, next) {
  res.send('respond with a ajax resource');
});

router.post('/getNotesByDate', function(req, res, next) {
	var loginUser=req.cookies.loginUser;
	var selectedDate=req.body.selectedDate;
	var queryDate= moment(selectedDate).format('L');


	db.cypherQuery(
	"match  (login:user {email:'"+loginUser+"'}) "
	+"match  (login)-[f1:userBelongToFamily]->(f:family) "
	+"match  (members:user)-[f2:userBelongToFamily]->(f) "
	+"match  (date:date {date:'"+queryDate+"'}) "
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


router.post('/searchKeyword', function(req, res, next) {
	var query="match (keyword:keyword) where keyword.keyword contains '"+req.body.keyword+"' return keyword.keyword";

	db.cypherQuery(
	query,
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


router.post('/searchNotes', function(req, res, next) {
	var loginUser=req.cookies.loginUser;
	var para= req.body;
	
	para.from=moment(para.from).format('L');
	para.to=moment(para.to).format('L');

	var query=
	"match (note:note)-[createdOn:createdOn]->(date:date) where date.date >='"+para.from+"' AND date.date<='"+para.to+"' "
	+"match (note)-[aboutUser:aboutUser]->(aboutwho:user) where aboutwho.email='"+para.about+"' "
	+"match (note)-[linkTo:linkTo]->(keyword:keyword) ";

	if(para.keyword){
		query+="where keyword.keyword CONTAINS '"+para.keyword+"' ";
	}


	if(para.detail){
		query+="match (note) where note.details CONTAINS '"+para.detail+"' ";	
	}

	query=query
	+"match (note)-[createdBy:createdBy]-(creator:user) "
	+"return {about:aboutwho.firstname,creator:creator.firstname, keyword:keyword.keyword, details:note.details,createdOn:date.date}  as result "
	"order by aboutwho.firstname, keyword.keyword, creator.firstname, note.details ";

	db.cypherQuery(
	query,
	{},
	function (err, result) {
	  if (err) {
	    return console.log(err);
	  }
	  var notes =result.data;
	  var summary={};
	  notes.forEach(function(note){
	  	if(summary[note.keyword]){
	  		summary[note.keyword]+=1;	
	  	}else{
  			summary[note.keyword]=1;	
	  	}	  	
	  });

	  var summaryArray=[];
	  for(var attr in summary){
	  	summaryArray.push({keyword:attr, count:summary[attr]});
	  }
	  res.json({summary:summaryArray, notes:notes});
	});	
});


module.exports = router;