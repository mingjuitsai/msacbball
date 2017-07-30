const fs = require('fs');
const cheerio = require('cheerio');
const phantom = require('phantom');
const fecha = require('fecha');

/**
 * Helper function
 */
function pad(n) {
  return (n < 10) ? ("0" + n) : n;
}

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
      timeLabels = $(`#${column} .fc-event-time`).get();

    // Need to do this backward cuz of how MSAC html structured
    for (let s = timeLabels.length - 1; s >= 0; s--) {
      let timeLabel = timeLabels[s];
      let timeLabelText = $(timeLabels[s]).text();
      let unavailableTimeRanges = twentyfourHourClock(timeLabel, timeRangeSplit(timeLabelText));
      unavailableTimeRanges = timeRangeToDateObj(unavailableTimeRanges);
      court.unavailable.push(unavailableTimeRanges);
    }

    function twentyfourHourClock(timeLabel, timeRange) {
      // Transform MSAC timetable from 12 hr clock to 24 hr clock
      // bit hacky way to tell the am/pm, maybe a better way?
      var top = parseInt($(timeLabel).closest('.fc-event').css('top'), 10),
        height = parseInt($(timeLabel).closest('.fc-event').css('height'), 10),
        startTime = timeRange.start.split(':'),
        startHr = parseInt(startTime[0]),
        startMin = startTime[1],
        endTime = timeRange.end.split(':'),
        endHr = parseInt(endTime[0]),
        endMin = endTime[1];

      // console.log(top);

      // If over 12pm
      if (top >= 295 && startHr !== 12) {
        timeRange.start = pad(startHr + 12) + ':' + startMin;
      } else if (top + height >= 295 && startHr !== 12) {
        timeRange.end = pad(endHr + 12) + ':' + endMin;
      } else if (startHr === 12) {
        // less than 12pm but hr is 12
        timeRange.start = pad(0) + ':' + startMin;
      }
      return timeRange;
    }

    function timeRangeToDateObj(timeRange) {
      var date = fecha.format(timetableDate, 'YYYY-MM-DD');
      timeRange.start = date + 'T' + timeRange.start;
      timeRange.end = date + 'T' + timeRange.end;
      return timeRange;
    }


    /**
     { start: '12:00', end: '6:00' },
     { start: '7:00', end: '7:30' },
     { start: '8:00', end: '11:59' }
     */


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