/**
 * Global variables
 */
const jsonfile = require('jsonfile');
const AUSTime = require('./scripts/getAUSTime');
var getMsacData = require('./scripts/getMsacData');

/**
 * Fetch MSAC data then save json
 */
var daysFromToday = 0;
var AUSTomorrow = new Date( AUSTime.getTime() + (daysFromToday * 24 * 60 * 60 * 1000));

getMsacData(AUSTomorrow, 6).then(function(data) {
  jsonfile.writeFile('./data.json', data, function(err) {
    console.error(err)
  });
});