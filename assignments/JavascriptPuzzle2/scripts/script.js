
//////////////////////
// Auto complete stuff
/////////////////////
// To
var airportLocations = [];
for (var i = 0; i < airports.length; i++){
	airportLocations.push(airports[i]["Location"]);
}

var goingTo = document.getElementById('toContainer');
var comingFrom = document.getElementById('fromContainer');
var to = completely(toContainer, {
    fontFamily:'sans-serif',
    fontSize:'26px', 
   	promptInnerHTML : ''
});
to.dropDown.hidden=true;
to.options = airportLocations;

to.onEnter = function() {
    var complete = to.hint.value;
    to.setText(complete);
};



to.onChange = function (text) {
	to.repaint();
};

// From

var from = completely(fromContainer, {
    fontFamily:'sans-serif',
    fontSize:'26px', 
   	promptInnerHTML : ''
});
from.dropDown.hidden=true;
from.options = airportLocations;

from.onEnter = function() {
    var complete = from.hint.value;
    from.setText(complete);
};

from.onChange = function (text) {
	from.repaint();
};

////////////////
// Flight Display Buttons
///////////////

document.getElementById("connect").onclick = function(){
	connection();
};

// Graph structure
g = new Graph();
var connection = function(){
    updatePossibleFlights(to.getText(), from.getText());
    g.createConnection(to.getText(), from.getText());
};

// Current flights holds all the divs
var currentFlightButtons = {};
var updatePossibleFlights = function(node1, node2){
    var container = document.getElementById("widgetContainer");
    
    var createDiv = function(text){
        var flightContainer = document.createElement("div");
        // Give each div a unique ID and a flight widget class so we can style them in the css easily.
        flightContainer.id = text;
        flightContainer.className = "flightWidget";
        function createButton(buttonName, tier){
            var flightButton = document.createElement("button");
            currentFlightButtons[buttonName] = flightButton;
            flightButton.className = "flightButton";
            flightButton.innerHTML = buttonName;
            flightButton.onclick = function() {
                // Clear
                for (var name in currentFlightButtons){
                    currentFlightButtons[name].style.border = "";
                }
                // Highlight new ones
                for (var j = 0; j < g.nodes[buttonName].connectedFlights.length; j++){
                    var currentButton = currentFlightButtons[g.nodes[buttonName].connectedFlights[j].name];
                    currentButton.style.border = "thick solid #0000FF";
                };
            };
            flightContainer.appendChild(flightButton);
        }
        createButton(text, 0);
        container.appendChild(flightContainer);
    };
    
    if(!g.nodes[node1]){
        createDiv(node1);
    }
    if (!g.nodes[node2]){
        createDiv(node2);
    }    
};