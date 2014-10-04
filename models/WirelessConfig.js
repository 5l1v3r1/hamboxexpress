var mongoose = require('mongoose');

// Document schema for wireless configs
exports.WirelessConfigSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iface: { type: String, required: true },
    iploc: { type: String, required: true },
    iplocmask: { type: Number, required: true, default: 24  },
    ipnet: { type: String, required: false, default: "" },
    ipnetmask: { type: Number, required: false, default: 8 },
    essid: { type: String, required: true, default: "BroadbandHamnet-v2" },
    bssid: { type: String, required: true, default: "82:CC:16:64:64:41" },
    freq: { type: Number, required: true, default: 2392 },
    bw: { type: Number, required: true, default: 5 },
    txpower: { type: Number, required: true, default: 300 }
});
