const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const path = require('path');
const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;
const db = mongojs('mongodb://david-duncan-28:peppep123@dunbase-shard-00-00-zhpe0.mongodb.net:27017,dunbase-shard-00-01-zhpe0.mongodb.net:27017,dunbase-shard-00-02-zhpe0.mongodb.net:27017/test?ssl=true&replicaSet=dunbase-shard-0&authSource=admin&retryWrites=true', ['users'])

const app = express();

// mongoDB connection string
// mongodb+srv://david-duncan-28:peppep123@dunbase-zhpe0.mongodb.net/test?retryWrites=true

/* custom middleware
const logger = function(req, res, next) {
	console.log('logging...');
	next();
};

app.use(logger);
*/






// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});



// Express validation middleware
app.use(expressValidator());


app.get('/', function(req, res){
	db.users.find(function(err, docs){
		res.render('index', {
				title: 'Customers',
				users: docs	// rendering from docs which comes from mongodb
		});
	})
});


app.post('/users/add', function(req, res){

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	const errors = req.validationErrors();

	if (errors) {
		db.users.find(function(err, docs){
			res.render('index', {
				title: 'Customers',
				users: docs,
				errors: errors
			})
		})


	} else {
		let newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		console.log('SUCCESS: No Errors')
		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});

	}
});

app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id)
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err)
		}
		res.redirect('/');

	});
});

app.listen(3000, function(){
	console.log('Server started on port 3000');
});