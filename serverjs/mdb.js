// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else if (process.env.HAMBOXSIMU) {
    console.log('DB in simulation');
    db = mongoose.createConnection('localhost', 'hamboxappsimu');
} else {
    db = mongoose.createConnection('localhost', 'hamboxapp');
}

// Get wireless config schema and model
var WirelessConfigSchema = require('../models/WirelessConfig.js').WirelessConfigSchema;
var WirelessConfig = db.model('wirelessconfigs', WirelessConfigSchema);

exports.WirelessConfig = WirelessConfig;
