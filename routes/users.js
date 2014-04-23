var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

var Users = mongoose.model('Users', UserSchema);

/* Get all users */
router.get('/', function(req, res) {
  Users.find({}, function(err, docs){
  	res.render('users/index', {users: docs});
  });
});

//Form new
router.get('/new', function(req, res){
	res.render('users/new');
});

//Add User
router.post('/', function(req, res){
	new Users({
		name: req.param("name"),
		email: req.param("email"),
		age: req.param("age")
	}).save(function(err, user){
		if (err) { res.json(err); }
		else { res.redirect('/users/' + user.name) }
	});
});

//Detail user
router.get('/:name', function(req,res){
	Users.find({name: req.param("name")}, function(err, users){
		var user = users[0];		
		res.render('users/show', {user: user});
	});
});

//Edit User
router.get('/:name/edit', function(req, res){
	Users.find({name: req.param("name")}, function(err, users){
		var user = users[0];		
		res.render('users/edit', {user: user});
	});
});

//Update User
router.post('/:name', function(req,res){
	Users.update(
		{name: req.param("name")},
		{name: req.body.name, email: req.body.email, age: req.body.age},
		function(err){ res.redirect('/users/' + req.body.name) }
	);
});

//Delete User
router.post('/:name/delete', function(req,res){
	Users.remove(
		{name: req.param("name")},
		function(err){
			res.redirect('/users');
		});
});

module.exports = router;
