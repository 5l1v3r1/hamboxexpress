var mongoose = require('mongoose');

// Document schema for wireless configs
exports.WirelessStateSchema = new mongoose.Schema({
    iface: { type: String, required: true },
    ipaddr: { type: String, required: true },
    ipmask: { type: Number, required: true, default: 24  },
    essid: { type: String, required: true, default: "BroadbandHamnet-v2" },
    bssid: { type: String, required: true, default: "82:CC:16:64:64:41" },
    freq: { type: Number, required: true, default: 2392 },
    bw: { type: Number, required: true, default: 5 },
    txpower: { type: Number, required: true, default: 300 }
});
