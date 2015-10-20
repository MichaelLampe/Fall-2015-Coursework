// Let's use a node prototype because it is extensible if we want to add later features
function Node(airportName) {
	// Each node has an airport name
	this.name = airportName;
	// Each node tracks adjacent flights
	// The type here should be Node
	this.connectedFlights = [];
}

function Graph() {
	// Nodes
	this.nodes = {};
};

Graph.prototype.createConnection = function (nodeOne, nodeTwo) {
	// Make sure our graph contains both the nodes that we are connecting
	if (!this.nodes[nodeTwo]) {
		// If it doesn't exist, we'll need to add it to the graph.
		this.nodes[nodeTwo] = new Node(nodeTwo);
	}
	if (!this.nodes[nodeOne]) {
		// If it doesn't exist, we'll need to add it to the graph.
		this.nodes[nodeOne] = new Node(nodeOne);
	}
	// Connect the flights together
	this.nodes[nodeOne].connectedFlights.push(this.nodes[nodeTwo]);
	this.nodes[nodeTwo].connectedFlights.push(this.nodes[nodeOne]);
};