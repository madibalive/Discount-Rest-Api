// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8000; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/discount'); // connect to our database
var Discount = require('./app/models/discount');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('api call initiated on db');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /discounts
// ----------------------------------------------------
router.route('/discounts')

// create a discount (accessed at POST http://localhost:8080/discounts)
	.post(function (req, res) {

		var discount = new Discount();		// create a new instance of the Bear model
		discount.store = req.body.store;
		discount.location = req.body.location;
		discount.discount = req.body.discount;
		discount.cell = req.body.cell;
		discount.reviews = req.body.reviews;
		// discount.timestamp=req.body.timestamp;

		// discount.contact = req.body.contact;
		// set the discounts name (comes from the request)

		discount.save(function (err) {
			if (err)
				res.send(err);

			res.json({ message: 'discount created!' });
		});


	})

// get all the discounts (accessed at GET http://localhost:8080/api/discounts)
	.get(function (req, res) {
		Discount.find(function (err, discounts) {
			if (err)
				res.send(err);

			res.json(discounts);
		});
	});
	
	
// on routes that end in /discounts/:store
//-----------------------------------------------------
// router.route('/discount/:store')
// 	.get(function (req, res) {
// 		Discount.find({ store: req.params.store }, function (err, discount) {
// 			if (err)
// 				res.send(err);
// 			res.json(discount);
// 		});
// 	});


//stretch goal on find by populaar 
//-----------------------------------------------------

router.route('/discounts/popular')
	.get(function(req,res){
		Discount.
			find({}).
			exec(function(err,discounts){
				if(err)
					res.send(err);
				res.json(discounts);
			});
	});
	
	
// on routes that end in /discounts/:discount_id
// ----------------------------------------------------
router.route('/discounts/:discount_id')
//get discount by store name
	.get(function (req, res) {
		Discount.find({ store: req.params.discount_id }, function (err, discounts) {
			if (err)
				res.send(err);
			res.json(discounts);
		});
	})
// get the discount with that id
	.get(function (req, res) {
		Discount.findById(req.params.discount_id, function (err, discount) {
			if (err)
				res.send(err);
			res.json(discount);
		});
	})

// update the discount with this id
	.put(function (req, res) {
		Discount.findById(req.params.discount_id, function (err, discount) {

			if (err)
				res.send(err);

			discount.name = req.body.name;
			discount.save(function (err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

// delete the discount with this id
	.delete(function (req, res) {
		Discount.remove({
			_id: req.params.discount_id
		}, function (err, discount) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});
	


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
