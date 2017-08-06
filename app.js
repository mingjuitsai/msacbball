
const jsonfile = require('jsonfile');
var getMsacData = require('./scripts/getMsacData');


getMsacData.then(function(data) {
  jsonfile.writeFile('./data.json', data, function(err) {
    console.error(err)
  });
});
