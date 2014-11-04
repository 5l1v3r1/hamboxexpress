// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
var WirelessState;
var WiredState;

// get schemas
var WirelessConfigSchema = require('../models/WirelessConfig.js').WirelessConfigSchema;
var WiredConfigSchema = require('../models/WiredConfig.js').WiredConfigSchema;
var WirelessStateSchema  = require('../models/WirelessState.js').WirelessStateSchema;
var WiredStateSchema  = require('../models/WiredState.js').WiredStateSchema;

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else if (process.env.HAMBOXSIMU) {
    console.log('DB in simulation');
    db = mongoose.createConnection('localhost', 'hamboxappsimu');
    WirelessState = db.model('wirelessstate', WirelessStateSchema);
    WiredState = db.model('wiredstate', WiredStateSchema);
} else {
    db = mongoose.createConnection('localhost', 'hamboxapp');
}

// Get models - all cases
var WirelessConfig = db.model('wirelessconfigs', WirelessConfigSchema);
var WiredConfig = db.model('wiredconfigs', WiredConfigSchema);

exports.WirelessConfig = WirelessConfig;
exports.WiredConfig = WiredConfig;
exports.WirelessState = WirelessState;
exports.WiredState = WiredState;
