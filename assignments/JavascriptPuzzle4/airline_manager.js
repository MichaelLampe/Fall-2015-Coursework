 var createDiv = function(flight){
    var flightContainer = document.createElement("div");
    // Give each div a unique ID and a flight widget class so we can style them in the css easily.
    flightContainer.id = flight.seconds_arrive;
    flightContainer.className = "flightWidget";
	
    function createButton(buttonName, tier){
        var flightButton = document.createElement("button");
        flightButton.className = "flightButton";
        flightButton.innerHTML = buttonName;
        flightContainer.appendChild(flightButton);
    }
    createButton("Get me on the next flight!.", 0);
	
	function createParagraph(text,style_type){
		var paragraphDiv = document.createElement("div");
		paragraphDiv.className = style_type;
		var information = document.createElement("p");
		var textNode = document.createTextNode(text);
		information.appendChild(textNode);
		paragraphDiv.appendChild(information);
		
		flightContainer.appendChild(paragraphDiv);
	}
	createParagraph("From - " + flight.from + "     " + "To - " + flight.to + "\n", "fromto");
	createParagraph("Arriving at - " + flight.arrive , "arrive");
	createParagraph("US Flight " + flight.flight + " " + flight.airline, "flight");

	
    
	return flightContainer;
};

var Flight = undefined;
(function() {
    "use strict";
    Flight = function Flight(from, to, arrive, airline, flight) {
		this.from = from;
		this.to = to;
		this.seconds_arrive = arrive;
		this.arrive = new Date(arrive).toTimeString();
		this.airline = airline;
		this.flight = flight;
	};
})();

var FlightController = undefined;
(function() {
    "use strict";
    FlightController = function FlightController() {
		this.flight_container = document.getElementById("container");
		this.flights = [];
	};
	
	FlightController.prototype.addFlight = function(flight){
		var new_div = createDiv(flight);
		
		var added = false;
		for (var x = 0; x < this.flight_container.childNodes.length; x++){
			if (new_div.id < this.flight_container.childNodes[x].id){
				this.flight_container.insertBefore(new_div,this.flight_container.childNodes[x]);
				added = true;
				// Break out of the loop
				x = this.flight_container.childNodes.length;
			}
		}
		// If we haven't added it, make sure to add it here
		if (!added){
			this.flight_container.appendChild(new_div)
		}	
	}
		
	FlightController.prototype.printFlights = function(){
		console.log(this.flights);
	}
})();

var flightController = new FlightController();


function airline_request(company,flightController) {
	var update_flight_list = function(flights){
		function add_flight(flight_number){
			var current_request = company + "?" + flight_number;
			Airlines.request(current_request,function(info){
				var new_flight = new Flight(info.from, info.to, info.arrive, info.airline, info.flight);
				flightController.addFlight(new_flight);
			});
		}
		for (var i = 0; i < flights.length; i++){
			add_flight(flights[i]);
		}
		
	}
	Airlines.request(company + "?flights",update_flight_list)
}

airline_request("Delta",flightController);
airline_request("United",flightController);
airline_request("American",flightController);