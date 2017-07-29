const fs = require('fs');
const cheerio = require('cheerio');
const phantom = require('phantom');

var msac_url = 'https://secure.activecarrot.com/public/facility/iframe_read_only/33/778/2017-06-19';

/**
 * Open url with phantom JS
 * @param  {url} url URL to open
 * @return {content}     return content html if success
 */
async function phantomOpen(url) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    const status = await page.open(url);
    console.log(status);

    if( status === 'success') {
      const content = await page.property('content');
      await instance.exit();
      return content;
    } else {
      console.warn('Phantom opened url but something went wrong.');
    }

    await instance.exit();
};

phantomOpen(msac_url).then( content => {
  buildMsacData(content);
});

// /**
//  * Build bball fetched data
//  */
function buildMsacData(content) {

  // Build data
  var data = {
    'court1': []
  };
  var $ = cheerio.load(content);
  $('#booking_calendar4 .fc-event-time').each(function() {
    data.court1.push($(this).text());
  });

  console.log(data.court1.reverse());  
}

/* JSON


[
  09-10-2017: {
    courts: [
      {
        number: 1,
        available: [
          {
            start: timestamp,
            end: timestamp
          },
          {
            start: timestamp,
            end: timestamp
          }
        ]
      }
    ]
  }
]



*/