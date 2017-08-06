(function() {

  /**
   * Set variables
   */
  const fs = require('fs');
  const cheerio = require('cheerio');
  const phantom = require('phantom');
  const fecha = require('fecha');
  const jsonfile = require('jsonfile');


  /**
   * Set up empty data object
   * Set up data promise to be resolved async
   * Set up dates to query
   */
  /**
   * TODO: 
   * Only request a data fetch to next day data and next 6 days
   * Put data into JSON and save to local disk
   */
  var data = {},
    dataPromise,
    queryDates = [
      new Date()
    ],

  /* Async promise to resolve data fetching for dates in query */
  dataPromise = Promise.resolve(
    /**
     * Map dates array to be phantom promises
     * then it can be chained by the Promise.resolve() later
     */
    queryDates.map(function(dateObj) {
      // Convert the date to be queried in URL
      var queryDate = fecha.format(dateObj, 'YYYY-MM-DD'),
        queryPrefix = 'https://secure.activecarrot.com/public/facility/iframe_read_only/33/778/',
        queryUrl = queryPrefix + queryDate;

      return {
        queryDate: queryDate,
        phantomPromise: phantomOpen(queryUrl)
      };

    }).reduce(function(sequence, tempObj) {
      /**
       * Chained promise in sequence then push the built data into data object
       */
      return sequence.then(function() {
        return tempObj.phantomPromise;
      }).then(content => {
        let queryDate = tempObj.queryDate;
        if (!data[queryDate]) data[queryDate] = {};
        data[queryDate]['courts'] = buildCourtsData(content, queryDate);
      });
    }, Promise.resolve())
  );


  // Export module - a promise that would return the data when using .then(data)
  var getMsacData = dataPromise.then(function(){
    return data;
  });

  module.exports = getMsacData;



  /*=================================
  =            FUNCTIONS            =
  =================================*/
  
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


  /**
   * Build data for MSAC courts
   * @param  {content} content in html
   * @return {json}    json data
   *
   * The data parse closely based on how MSAC built their iframe html
   */
  function buildCourtsData(content, timetableDate) {

    var $ = cheerio.load(content),
      court_data = {};

    // Loop through each column, then find all unavailable time range
    // parse to find the available time
    for (let i = 1; i < 2; i++) {
      let court = {
        id: i,
        unavailable: []
      };

      let column = 'booking_calendar' + (i === 1 ? '' : i),
        timeLabels = $(`#${column} .fc-event-time`).get();

      // Need to do this backward cuz of how MSAC html structured
      for (let s = timeLabels.length - 1; s >= 0; s--) {
        let timeLabel = timeLabels[s];
        let timeLabelText = $(timeLabels[s]).text();
        let unavailableTimeRanges = twentyfourHourClock(timeLabel, timeRangeSplit(timeLabelText));
        unavailableTimeRanges = timeRangeToISO(unavailableTimeRanges, timetableDate);
        court.unavailable.push(unavailableTimeRanges);
      }

      /**
       * Convert the MSAC html time label from 12 hour format to 24 hour format
       * Pretty hacky way to deal with it but best way for now
       */
      function twentyfourHourClock(timeLabel, timeRange) {
        var top = parseInt($(timeLabel).closest('.fc-event').css('top'), 10),
          height = parseInt($(timeLabel).closest('.fc-event').css('height'), 10),
          startTime = timeRange.start.split(':'),
          startHr = parseInt(startTime[0]),
          startMin = startTime[1],
          endTime = timeRange.end.split(':'),
          endHr = parseInt(endTime[0]),
          endMin = endTime[1],
          noonMark = 295;

        // If column's top is over certain px ,it'd be over 12pm
        if (top >= noonMark && startHr !== 12) {
          timeRange.start = pad(startHr + 12) + ':' + startMin;
        } else if (top + height >= noonMark && startHr !== 12) {
          timeRange.end = pad(endHr + 12) + ':' + endMin;
        } else if (startHr === 12) {
          // less than 12pm but hr is 12
          timeRange.start = pad(0) + ':' + startMin;
        }
        return timeRange;
      }

      /**
       * Conver the time range object value into Date ISO string
       */
      function timeRangeToISO(timeRange, date) {
        timeRange.start = date + 'T' + timeRange.start;
        timeRange.end = date + 'T' + timeRange.end;
        return timeRange;
      }
      return court;
    }

    /**
     * Split the MSAC time range label string into object with start and end keys
     */
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

})();


/* JSON aiming to build
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