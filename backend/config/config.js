let config = process.env.NODE_ENV || 'local'
module.exports = require("./" + config + ".js");
