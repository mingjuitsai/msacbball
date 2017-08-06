/**
 * Build date object for +10 timezone
 * @type {[type]}
 */
const time = require('time');
const fecha = require('fecha');
var now = new Date();
time.extend(now);
now.setTimezone('Australia/Sydney');
now = fecha.format(now, 'YYYY-MM-DD');
now = new Date(now);
module.exports = now;