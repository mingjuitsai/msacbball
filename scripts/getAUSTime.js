/**
 * Build date object for +10 timezone
 * @type {[type]}
 */
var time = require('time');
var now = new time.Date();
now.setTimezone('Australia/Sydney');
module.exports = now;