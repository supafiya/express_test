const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

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


app.get('/', function(req, res){
	res.render('index', {
		title: 'Customers'
	});
});

app.listen(3000, function(){
	console.log('Server started on port 3000');
});