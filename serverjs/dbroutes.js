var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;

// JSON API for list of wireless configs
exports.wirelessconfiglist = function(req, res) {
    // Query Mongo for polls, just get back the question text
    WirelessConfig.find({}, function(error, wirelessconfigs) {
        res.json(wirelessconfigs);
    });
};
