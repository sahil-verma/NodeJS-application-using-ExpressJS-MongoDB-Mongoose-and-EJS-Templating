let mongoose = require('mongoose');

// create items schema
var itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    description: {
        type: String,
        required: 'Author is required'
    },
    price: {
        type: Number,
        min: 0.01
    }
});

// make it public
module.exports = mongoose.model('Item', itemSchema);