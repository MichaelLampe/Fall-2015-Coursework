var dateElement = document.getElementById('dateInput');
var addTaskElement = document.getElementById("addTask");
var nameElement = document.getElementById("taskText");
var priorityElement = document.getElementById("taskPriority");

function task(){

	var text = nameElement.value
	var date = dateElement.value
	var priority = priorityElement.value
	console.log(text);
	var create = function(){
		var newElement = document.createElement("div")
		var color = "rgb(" + priority*20 + ",50,50)";
		newElement.style.fontSize = 10 + 3*priority;
		newElement.style.background = color;
		newElement.style.color = "#FFF";

		var checkBox = document.createElement("input");
		var label = document.createElement("label");
		var labelText = document.createTextNode("Task of " +text +" is due on " + date);
		label.appendChild(labelText);
		checkBox.type = "checkbox";

		checkBox.onclick = function() {
			newElement.remove();
		};
		newElement.appendChild(checkBox)
		newElement.appendChild(label);

		// Add into the items div
		document.getElementById("items").appendChild(newElement);
	};
	create();
}

// Stole this from stack overflow.
//http://stackoverflow.com/a/13052187
// Sets the date to today's date by default
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
dateElement.value = new Date().toDateInputValue();

document.getElementById("addTask").onclick = function(){
	task()
};