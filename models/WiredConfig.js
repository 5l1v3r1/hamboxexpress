var mongoose = require('mongoose');

// Document schema for wired configs
exports.WiredConfigSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iface: { type: String, required: true },
    addr: { type: String, required: true },
    mask: { type: Number, required: true, default: 24 },
    mode: { type: String, required: true, default: "static" }
});
