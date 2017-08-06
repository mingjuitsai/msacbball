/**
 * Global variables
 */
const jsonfile = require('jsonfile');
const AUSTime = require('./scripts/getAUSTime');
var getMsacData = require('./scripts/getMsacData');

console.log(AUSTime.toString());

/**
 * Fetch MSAC data then save json
 */
getMsacData.then(function(data) {
  jsonfile.writeFile('./data.json', data, function(err) {
    console.error(err)
  });
});