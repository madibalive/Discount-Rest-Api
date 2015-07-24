var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reviews= new Schema({
	username: String,
	content: String,
	// timestamp: Date
});

var DiscountSchema = new Schema({
	store: String,
	location: String,
	discount: Number,
	contact:String,
	reviews: [Reviews]
});

module.exports = mongoose.model('Discount', DiscountSchema);
