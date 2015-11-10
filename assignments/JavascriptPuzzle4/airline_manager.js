/*
This is a function I've created that takes in a flight 
and returns a formatted div that can be added
*/
var createDiv = function(flight){
	// We declare the div which we will add everything to here.
    var flightContainer = document.createElement("div");
    // Give each div a unique ID and a flight widget class so we can style them in the css easily.
    flightContainer.id = flight.seconds_arrive;
	// The class name is here so we can style them all via CSS instead of js.
    flightContainer.className = "flightWidget";
	
	// This allows us to easily create a button and add it to our container.
    function createButton(buttonName){
		// Create button
        var flightButton = document.createElement("button");
		// Style
        flightButton.className = "flightButton";
		// Text
        flightButton.innerHTML = buttonName;
		// Add to container
        flightContainer.appendChild(flightButton);
    }
    createButton("Get me on the next flight the other direction!.");
	
	// This does the same thing as button, but creates a paragraph element
	// Style type lets us set which class we want to assign at creation time
	function createParagraph(text,style_type){
		// Div to add everything to
		var paragraphDiv = document.createElement("div");
		// Class we've decided for it to be
		paragraphDiv.className = style_type;
		// Where we put our text
		var information = document.createElement("p");
		// Text is found in a textnode
		var textNode = document.createTextNode(text);
		// Add a textnode to our paragraph item
		information.appendChild(textNode);
		// Add it to the paragraph div we previously made
		paragraphDiv.appendChild(information);
		// Finally, we add that our our overall container div
		flightContainer.appendChild(paragraphDiv);
	}
	// Each of these paragraphs we create gives a different subset of information
	createParagraph("From - " + flight.from + "     " + "To - " + flight.to + "\n", "fromto");
	createParagraph("Arriving at - " + flight.arrive , "arrive");
	createParagraph("US Flight " + flight.flight + " " + flight.airline, "flight");

	
    // Finally, we return it here so that we can do any placement issues elsewhere
	// This function is JUST concerned with creating a div, not adding it to a specific place
	// or anything
	return flightContainer;
};

// Because one base unit of our program is a flight, let's define a flight here.
// From here, we can make more flights if we want.

// Declare this as undefined so that we can leak the scope below.
var Flight = undefined;
(function() {
    "use strict";
	// Leaks scope to our previous var Flight
    Flight = function Flight(from, to, arrive, airline, flight) {
		// All this information relevant to a flight
		this.from = from;
		this.to = to;
		// This is in seconds. Good to compare.
		this.seconds_arrive = arrive;
		// This is in datetime, human readable.
		this.arrive = new Date(arrive).toTimeString();
		this.airline = airline;
		this.flight = flight;
	};
})();

// Same idea of leaking the scope
// We make a flight controller because we want some way of controlling flights.
// This will coordinate flights and correctly do things to them.
var FlightController = undefined;
(function() {
    "use strict";
	// Leaks to var FlightController above
    FlightController = function FlightController() {
		// This is a container I setup in the html that will hold all of our flight divs
		this.flight_container = document.getElementById("container");
		// Ended up not using this aside from testing.  
		this.flights = [];
	};
	
	// To add a flight, let's do this stuff
	FlightController.prototype.addFlight = function(flight){
		
		// Create a divo out of the flight as noted in the function declared at the 
		// start of the file.
		var new_div = createDiv(flight);
		
		// Tracks if we've added our flight div to the cotnainer
		var added = false;
		
		// Looks for an element to insert the div before.
		// This sorts it by time (If the div is less than the next flight)
		// We then know that it is smaller and thus should go before
		for (var x = 0; x < this.flight_container.childNodes.length; x++){
			if (new_div.id < this.flight_container.childNodes[x].id){
				// Insert before does as you would think it would do
				this.flight_container.insertBefore(new_div,this.flight_container.childNodes[x]);
				// Note that we've added the div
				added = true;
				// Break out of the loop
				x = this.flight_container.childNodes.length;
			}
		}
		// If we haven't added it, make sure to add it here
		if (!added){
			// Just add it to the end of the container if it wasn't added before
			this.flight_container.appendChild(new_div)
		}	
	}
	
	// For testing.
	FlightController.prototype.printFlights = function(){
		console.log(this.flights);
	}
})();

// Say that there is a controller.
var flightController = new FlightController();

// Here is how we format a request.
// We tell it what comapny we want and the controller that will control it.
function airline_request(company,flightController) {
	
	// The callback function for the list of flights
	// Flights = all the flight numbers
	var update_flight_list = function(flights){
		// We define the function ABOVEEEEEE our loop
		function add_flight(flight_number){
			// Here is the format of a request for an individual flight info
			var current_request = company + "?" + flight_number;
			// This will update our div by adding a flight (Once it is returned)
			// to the container div.
			Airlines.request(current_request,function(info){
				// Instantiate a new flight with the returned information
				var new_flight = new Flight(info.from, info.to, info.arrive, info.airline, info.flight);
				// Add the flight to the flight controller which takes care of everythign else.
				flightController.addFlight(new_flight);
			});
		}
		// Note we define our function prior to the loop then call it
		// at each iteration of the loop.
		for (var i = 0; i < flights.length; i++){
			add_flight(flights[i]);
		}	
	}
	
	// We define our function above, then call it here as our callback
	Airlines.request(company + "?flights",update_flight_list)
}

// Here, after we've defined everything above, we ask about all the different airlines.
// This is where our program really starts cooking.
airline_request("Delta",flightController);
airline_request("United",flightController);
airline_request("American",flightController);