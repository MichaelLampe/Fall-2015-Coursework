function Computer(context, speed) {
	this.context = context;
	this.lightNumber = 0;
	this.lightCounter = 0;
	this.speed = speed;
}

Computer.prototype.draw = function(){
	this.context.save();
	
	this.drawDashboard();
	
	this.context.restore();
}

Computer.prototype.drawButton = function() {
	// Create background
	this.context.save();
	this.context.fillRect(0,0,300,200);	
	
	
	// Create the lights
	this.context.save();
	
	this.context.translate(170,100);
	for (var i = 0; i < 3; i ++){
		
		this.context.save();
		this.context.translate(i*50,0);
		if (i == this.lightNumber){
			this.drawLight("green");
		}
		else {
			this.drawLight("red");
		}
		this.context.restore();
	}
	this.context.restore();
	
	// Creates the counter
	this.context.save();
	this.drawCounter();
	this.context.restore();

	
	this.lightCounter = this.lightCounter + 1;
	this.lightNumber = Math.round(this.lightCounter / 200 * 3);
	if (this.lightCounter >= 200){
		this.lightCounter = 0;
	}
	this.context.restore();
};


Computer.prototype.drawCounter = function(){
	this.context.save();
	this.fillStyle = "white";
	this.context.translate(30,30);
	
	if (this.speed == 2 || this.speed == 3 || this.speed >= 5){
		// Top Line
		this.context.save();
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if ((this.speed >= 2 && this.speed <= 6) || (this.speed >=8 && this.speed <= 9)){
		// Middle Line
		this.context.save();
		this.context.translate(0,75);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if (this.speed == 2 || this.speed == 3  || this.speed == 5 || this.speed == 6 || this.speed >= 8){
		// Bottom Line
		this.context.save();
		this.context.translate(0,145);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if ((this.speed >= 4 && this.speed <= 6) || (this.speed >= 8)){
		// Top Left Line
		this.context.save();
		this.context.translate(0,5);
		this.context.rotate(90*Math.PI/180);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if ((this.speed >= 1 && this.speed <= 4) || this.speed >= 7){
		// Top Right Line
		this.context.save();
		this.context.translate(75,5);
		this.context.rotate(90*Math.PI/180);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if (this.speed == 2 || this.speed == 6 || this.speed == 8){
		// Bottom Left Line
		this.context.save();
		this.context.translate(0,80);
		this.context.rotate(90*Math.PI/180);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	if (this.speed == 1 || this.speed >= 3){
		// Bottom Right Line
		this.context.save();
		this.context.translate(75,80);
		this.context.rotate(90*Math.PI/180);
		this.drawCounterLine();	
		this.context.restore();
	}
	
	this.context.restore();
}

Computer.prototype.drawCounterLine = function(){
	this.context.save();
	this.context.fillStyle = "white";
	this.context.fillRect(0,0,70,10);
	this.context.restore();
}

Computer.prototype.drawLight = function(color) {
	this.context.save();
	this.context.fillStyle = color;
	this.context.strokeStyle = "black";
	
	// Draw the light via an arc.
	this.context.beginPath();
	this.context.arc(0,0,20,2*Math.PI, false);
	this.context.fill();
	this.context.stroke();
	this.context.closePath();
	
	this.context.restore();
}

Computer.prototype.drawDashboard = function() {
	this.context.save();
	
	this.context.save();
	this.context.translate(800,100);
	this.drawButton();
	this.context.restore();
	this.context.restore();
}