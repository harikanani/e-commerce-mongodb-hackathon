const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminUserSchema = new mongoose.Schema({
    full_name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, required: false, default: "admin" },
}, { timestamps: true, collection: "adminusers" });

module.exports = mongoose.model("AdminUser", AdminUserSchema);