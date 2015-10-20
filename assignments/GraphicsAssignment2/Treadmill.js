function Treadmill(context,treadSizes,x,y,treadmillWidth, speed){
	this.context = context;
	this.size = treadSizes;
	this.Y = y;
	this.width = treadmillWidth;
	this.speed = speed;
	this.currentLocation = 0;
}

Treadmill.prototype.drawTreads = function(){
	this.context.save();
	this.context.strokeStyle = "black";
	this.context.fillStyle = "black";
	this.context.lineWidth = 0.45;
	this.context.strokeRect(0,0,50,100);
	this.context.restore();
}

Treadmill.prototype.draw = function() {
	for (var i = 0; i < this.width/this.size + 2; i++){
		this.context.save();
		this.context.translate(i*this.size - this.currentLocation,this.Y);
		this.drawTreads();
		this.context.restore();
	}
	if (this.currentLocation >= 10){
		this.currentLocation = 0;
	} else{
		this.currentLocation = this.currentLocation + 1*this.speed;
	}
}