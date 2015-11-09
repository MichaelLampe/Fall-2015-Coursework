/**
 * Created by gleicher on 11/3/2015.
 */

// as specified in the assignment, this provides a single object
//      Airlines
// there is a single field
//      airlines - which is a list of the airlines
// and a single method to use
//      request
// it also exports a tesreq method for testing
//

// this is a grungy way to set things up, but I'm learning JavaScript too!
var Airlines = {};
var gleichersTests = gleichersTests || false;

(function(){
    "use strict";
    // handy utility
    function objFor(obj,func) {
        Object.keys(obj).forEach(function(e) {func(e,obj[e])});
    };
    //
    // some internal data
    // stuck in an object so we can look at it for debugging
    var data = {
        allAirlines : ["Delta", "American", "United"],
        codes : {"Delta" : "DL", "American" : "AA", "United" : "UA"},
        // each airline has a "base delay"
        delay : {"Delta" : 300, "American" : 500, "United" : 700},
        variance : 250,
        // for each airline, the places it goes from Chicago, and number of flights +/-1
        United : { ORD:4, DEN:3, EWR:1},
        Delta : {MSP:3, DTW: 3, LGA: 2, ATL: 2, DCA:1},
        American : {ORD:3, DFW:2, MIA:1}
    };

    // generate a set of N flight numbers - between 100 and 999
    function randList(n) {
        var lst = [];
        while (lst.length < n) {
            var num = Math.floor(Math.random()*899 + 100);
            if (lst.indexOf(num)<0)
                lst.push(num);
        }
        return lst;
    }
    // generate a set of random hours - between 8 and 23
    // but no two the same
    function randHour(n) {
        var lst = [];
        while (lst.length < n) {
            var num = Math.floor(Math.random()*15.5 + 8);
            if (lst.indexOf(num)<0)
                lst.push(num);
        }
        return lst;
    }

    function randTime(hour) {
        var d = new Date();
        d.setHours(hour, Math.floor(Math.random()*60));
        return d.getTime();
    }

    // make a set of flights for an airline
    // make a list first, then a dictionary by number
    function makeFlights(airline) {
        var cities = data[airline];
        var flights = [];
        objFor(cities,function(city,nflightsI) {
            // do the +/- 1
            var nflights = nflightsI + Math.floor(Math.random() * 2.5)-1;
            var starts = randHour(nflights);
            starts.forEach(function(t) {
                flights.push({from:city, to:"MSN", arrive:randTime(t), airline:data["codes"][airline]});
            });
        });
        var flightNums = randList(flights.length);
        var flightTable = {};
        flights.forEach(function(e,i) {
            e["flight"] = flightNums[i];
            flightTable[flightNums[i]] = e;
        });
        return flightTable;
    }

    //  build up the table of flights for each airline
    var flightData = {};
    data.allAirlines.forEach(function(airline) {
       flightData[airline] = makeFlights(airline);
    });

    //
    // the server functions
    function testreq(request) {
        var req = request.split("?");
        var alData = flightData[req[0]];
        if (alData) {
            if (req[1] == "flights") {
                return Object.keys(flightData[req[0]]);
            } else {
                return flightData[req[0]][req[1]];
            }
        } else {
            return undefined;
        }
    }

    function request(req, callback) {
        // we'll schedule the computation at the end of the timeout
        // get the airline to get the delay
        var rs = req.split("?");
        var delay = data.delay[rs[0]] + 2 * data.variance * Math.random() - data.variance;

        setTimeout(function() { callback(testreq(req))}, delay);
    }

    Airlines.testreq = testreq;
    Airlines.airlines = data.allAirlines;
    Airlines.request = request;
})();