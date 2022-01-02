const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamp: true });

module.exports = mongoose.model("Category", CategorySchema);