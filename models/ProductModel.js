const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
	name: { 
        type: String,
        required: true
    },
    images: {
        type: Array, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    sku: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: false,
        default: 0
    },
    country: {
        type: String,
        required: false,
        default: "India"
    },
    country_image: {
        type: String,
        required: false
    },

}, { timestamps: true, collection:'product' });

module.exports = mongoose.model("Product", ProductSchema);