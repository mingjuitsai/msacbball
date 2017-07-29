const fs = require('fs');
const cheerio = require('cheerio');
const phantom = require('phantom');

var data_url = 'https://secure.activecarrot.com/public/facility/iframe_read_only/33/778/2017-06-19';


function phantomOpenContent(url, callback) {
  phantom.create().then(function(phInstance) {
    phInstance.createPage().then(function(page) {
      page.open(url).then(function(status){
        if(status === 'success') {
          page.property('content').then(function(content){
            callback({
              instance: phInstance,
              page: page,
              content: content
            });
          });
        } else {
          console.warn('Phantom open URL but something went wrong.');
        }
      });
    });
  });
}

/**
 * Build bball fetched data
 */
function buildMsacData(phData) {
  // Set variables
  let phInstance = phData.instance,
  page = phData.page,
  content = phData.content; 

  // Build data
  var data = {
    'court1': []
  };
  var $ = cheerio.load(content);
  $('#booking_calendar4 .fc-event-time').each(function() {
    data.court1.push($(this).text());
  });

  console.log(data.court1.reverse());

  page.close();
  phInstance.exit();
}


phantomOpenContent(data_url, function(phData){
  buildMsacData(phData);
});
