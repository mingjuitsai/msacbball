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
   * Get MSAC court data for certain days including start Date
   */
  function getMsacData(startDate, days) {
    // Set query dates array
    var queryDates = [];
    var date = startDate;
    for (var i = 0; i < days; i++) {
      queryDates.push(date);
      // Update date to be next day
      date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
    }

    return queryMsacData(queryDates);
  }


  function queryMsacData(queryDates) {
    var dataPromise;
    var data = [];

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

          console.log(queryUrl);

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
          data.push({
            date: queryDate,
            courts: buildCourtsData(content, queryDate)
          });
        });
      }, Promise.resolve())
    );

    return dataPromise.then(function() {
      return data;
    });
  }


  // Export module - a promise that would return the data when using .then(data)s
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
      court_data = [];

    // Loop through each column, then find all unavailable time range
    // parse to find the available time
    for (let i = 0; i < 8; i++) {
      let court = {
        id: i,
        unavailable: []
      };

      let column = 'booking_calendar' + ((i + 1) === 1 ? '' : (i + 1)),
        timeLabels = $(`#${column} .fc-event-time`);


      if(!timeLabels.length) {
        console.log(timetableDate);
      }


      // Loop through unavailable time labels scraped in html
      // the order doesn't matter since we will be sorting the final array by timestamp later
      for (let s = 0; s < timeLabels.length; s++) {
        let timeLabel = timeLabels[s];
        let timeLabelText = $(timeLabels[s]).text();
        // console.log(timeLabelText);
        let unavailableTimeRanges = twentyfourHourClock(timeLabel, timeRangeSplit(timeLabelText));
        unavailableTimeRanges = timeRangeToISO(unavailableTimeRanges, timetableDate);
        // console.log(unavailableTimeRanges);
        court.unavailable.push(unavailableTimeRanges);
        court.unavailable = sortTimeRange(court.unavailable);
      }



      /* Insert available time */
      court.available = findAvailable(court);

      /* Push court data */
      court_data.push(court);
    }

    /**
     * Sort time range
     * because MASC HTML is irregular, time range object needs to be sorted
     */
    function sortTimeRange(timeRanges) {
      if(Array.isArray(timeRanges)) {
        return timeRanges.sort(function(timeRangeA, timeRangeB){
          return new Date(timeRangeA.start).getTime() - new Date(timeRangeB.start);
        });
      } else {
        console.warn('Time range must be array to be sorted!');
      }
    }

    /**
     * Find available time by connecting end and start time of unavailable time
     * @param  {object} court object contains unavailable array
     * @return {array}       [an array contains unavailable timestamp]
     */
    function findAvailable(court) {
      var available = [];

      if(court.unavailable.length > 1 ) {
        court.unavailable.forEach( function(value, index, array) {
          if(!array[index + 1]) { return false; }
          available.push({
            start: value.end,
            end: array[index + 1].start
          });
        });
      }

      return available;
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

      // console.log(top, height, noonMark, startHr);
      // If column's top is over certain px ,it'd be over 12pm
      if (top >= noonMark && startHr !== 12) {
        timeRange.start = pad(startHr + 12) + ':' + startMin;
      }
      if (top < noonMark && startHr !== 12) {
        timeRange.start = pad(startHr) + ':' + startMin;
      }

      // If column's top is less than certain px ,it'd be less than 12pm
      if (top + height >= noonMark && endHr !== 12) {
        timeRange.end = pad(endHr + 12) + ':' + endMin;
      }
      if (top + height < noonMark && endHr !== 12) {
        timeRange.end = pad(endHr) + ':' + endMin;
      }

      // less than 12pm but hr is 12 and before noon
      if (startHr === 12 && top < noonMark) {
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

    // Return the data
    return court_data;
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