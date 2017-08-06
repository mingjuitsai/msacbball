
/**
 * Global variables
 */
const jsonfile = require('jsonfile');
var getMsacData = require('./scripts/getMsacData');

/**
 * Fetch MSAC data then save json
 */
getMsacData.then(function(data) {
  jsonfile.writeFile('./data.json', data, function(err) {
    console.error(err)
  });
});
