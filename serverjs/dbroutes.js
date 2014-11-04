var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;
var WiredConfig = mdb.WiredConfig;


// JSON API for list of wireless configs
exports.wirelessconfiglist = function(req, res) {
    // Query Mongo for polls, just get back the question text
    WirelessConfig.find({}, function(error, wirelessconfigs) {
        res.json(wirelessconfigs);
    });
};

// JSON API for list of wired configs
exports.wiredconfiglist = function(req, res) {
    // Query Mongo for polls, just get back the question text
    WiredConfig.find({}, function(error, wiredconfigs) {
        res.json(wiredconfigs);
    });
};
