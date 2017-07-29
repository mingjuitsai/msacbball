const fs = require('fs');
const cheerio = require('cheerio');
const phantom = require('phantom');
const fecha = require('fecha');

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

  if (status === 'success') {
    const content = await page.property('content');
    await instance.exit();
    return content;
  } else {
    console.warn('Phantom opened url but something went wrong.');
  }

  await instance.exit();
};



var dateObj = new Date(2017, 7, 1);
var queryDate = fecha.format(dateObj, 'YYYY-MM-DD');

var msacUrl = 'https://secure.activecarrot.com/public/facility/iframe_read_only/33/778/' + queryDate;
phantomOpen(msacUrl).then(content => {
  buildMsacData(content, dateObj);
});


/**
 * Build data for MSAC courts
 * @param  {content} content in html
 * @return {json}    json data
 *
 * The data parse closely based on how MSAC built their iframe html
 */
function buildMsacData(content, date) {

  var $ = cheerio.load(content);
  var data = {
    id: '',
    available: []
  };

  for (let i = 1; i < 2; i++) {
    let column = 'booking_calendar' + (i === 1 ? '' : i);
    $(`#${column} .fc-event-time`).each(function(index, element) {
      // Build data
      data.id = i;
      data.available.unshift($(element).text());
    });
  }
  console.log(data);
}

/* JSON


[
  09-10-2017: {
    courts: [
      {
        id: 1,
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