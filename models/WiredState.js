var mongoose = require('mongoose');

// Document schema for wired state to support simulation mode
exports.WiredStateSchema = new mongoose.Schema({
    iface: { type: String, required: true },
    ipaddr: { type: String, required: true },
    ipmask: { type: Number, required: true, default: 24  },
    macaddr: { type: String, required: true, default: "be:ef:de:ad:fe:01" }
});
