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
  buildCourtsData(content, dateObj);
});


/**
 * Build data for MSAC courts
 * @param  {content} content in html
 * @return {json}    json data
 *
 * The data parse closely based on how MSAC built their iframe html
 */
function buildCourtsData(content, timetableDate) {

  var $ = cheerio.load(content),
  data = [];

  // Loop through each column, then find all unavailable time range
  // parse to find the available time
  for (let i = 1; i < 2; i++) {
    let court = {
      id: '',
      available: [],
      unavailable: []
    };
    
    let column = 'booking_calendar' + (i === 1 ? '' : i),
    timeStrings = $(`#${column} .fc-event-time`).get();

    // Need to do this backward cuz of how MSAC html structured
    for (let s = timeStrings.length - 1; s >= 0 ; s--) {
      let timeString = $(timeStrings[s]).text();
      court.unavailable.push(timeRangeSplit(timeString));
    }

    // Covert the time into 24hr format and timestamp
    

    console.log(court);

    data.push(court);
  }


  function timeRangeSplit(range) {
    if (typeof range === 'string') {
      range = range.replace(/\s/g, '');
      range = range.split('-');
      return {
        start: range[0],
        end: range[1]
      };
    } else {
      console.warn('parse range time must be string');
    }
  }

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