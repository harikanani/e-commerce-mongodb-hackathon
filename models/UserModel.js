const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	email: { type: String, required: false },
	password: { type: String, required: true },
	// address_id: { type: Schema.ObjectId, required: false },
	profile_pic: { type: String, required: false, default: 0 },
	full_name: { type: String, required: false },
	is_active: { type: Boolean, required: false, default: true },
	role: { type: String, require: false, default: "customer" }
}, { timestamps: true, collection:'users' });

module.exports = mongoose.model("User", UserSchema);