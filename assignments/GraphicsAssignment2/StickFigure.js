"use strict ";

/*

Creates an instance of a stick figure

*/
function StickFigure(context,x,y,speed) {
	this.context = context;
	this.speed = speed + 0.1;
	this.X = x || 400;
	this.Y = y || 400;
	this.move = -275;
	this.frontleg = 1;
	this.currentAngle = 45;
	this.countup = true;
}

StickFigure.prototype.drawHair = function(trans) {
	this.context.save();
	this.context.translate(-40,trans);
	this.context.fillStyle = "black";
	
	this.context.save();
	this.context.rotate(1.5*Math.PI/180);
	this.context.beginPath();
	this.context.moveTo(40,40+trans);
	var scaleFactor = 0;
	if (this.currentAngle > 0) {
		scaleFactor = this.currentAngle/45*0.05 + 1;
	} else{
		scaleFactor = 1- this.currentAngle/45*0.05;
	}
	this.context.scale(1,scaleFactor);
	this.context.bezierCurveTo(100,10+this.currentAngle/25,150,100,40,trans-this.currentAngle/15);
	this.context.fill();
	this.context.closePath();
	this.context.restore();
	
	this.context.restore();
}

StickFigure.prototype.drawHead = function() {
	this.context.save();
	this.context.translate(10+this.currentAngle/10,-70+(this.currentAngle/15));
			
	// Head (Big Part)
	this.context.beginPath();
	this.context.fillStyle = "#FFBBFF";
	this.context.arc(0,0,80,0,2*Math.PI);
	this.context.fill();
	this.context.closePath();
	
	// Eye White Part
	this.context.beginPath();
	this.context.fillStyle = "white";
	this.context.StrokeStyle = "black";
	this.context.arc(40,3,20,0,2*Math.PI);
	this.context.closePath();
	this.context.fill();
	this.context.stroke();
	
	// Eyeball
	this.context.beginPath();
	this.context.fillStyle = "black";
	this.context.arc(50,3,5,0,2*Math.PI);
	this.context.closePath();
	this.context.fill();
	
	// Mouth
	this.context.beginPath();
	this.context.fillStyle = "red";
	this.context.strokeStyle = "black";
	this.context.lineTo(60,40);
	this.context.lineTo(40,65);
	this.context.lineTo(10,40);
	this.context.closePath();
	this.context.lineWidth = 1;
	this.context.stroke();
	this.context.fill();
	
	// Flowing Hair
	this.context.save();
	this.context.translate(-80,0);
	this.context.save();
	for (var i = 0; i < 15; i ++){
		this.context.rotate(3*Math.PI/180);
		var separation = -9;
		this.drawHair(i*separation);
	}
	this.context.restore();
	
	this.context.restore();
	
	this.context.restore();
}

StickFigure.prototype.drawBody = function() {
	this.context.save();
	this.context.fillRect(0,0,10,125);
	this.context.restore();
}

StickFigure.prototype.drawLeg = function(legNumber) {
	var legLength = 70;
	var legRotate = 0;
	// One leg
	this.context.save();
	
	this.context.save();
	this.context.fillRect(0,0,10,legLength);
	this.context.restore();
	
	this.context.save();
	this.context.translate(1,legLength-5);
	
	if (legNumber == 1){
		if (this.currentAngle >= 0){
			legRotate = this.currentAngle*Math.PI/200;
		} else{
			legRotate = -this.currentAngle*Math.PI/200;
		}
	} else{
		// Leg number is 2
		if (this.currentAngle >= 0){
			legRotate = this.currentAngle*Math.PI/300;
		} else{
			legRotate = -this.currentAngle*Math.PI/300;
		}
	}
	this.context.rotate(legRotate);
	this.context.fillRect(0,0,10,legLength-10);
	this.context.restore();

	this.context.restore();
}

StickFigure.prototype.drawArm = function() {
	var upperArmRotate = -60;
	var lowerArmRotate = -180 - upperArmRotate;
	var armLength = 50;
	// One arm
		// Upper Arm
	this.context.save();	
	this.context.translate(0,30);
	this.context.rotate(upperArmRotate*Math.PI / 180);
	this.context.fillRect(0,0,10,armLength);
	this.context.restore();
		// Lower Arm
	this.context.save();
	var lowerArmY = armLength/Math.cos(upperArmRotate);
	this.context.translate(armLength-5,-1*lowerArmY);
	this.context.rotate(lowerArmRotate*Math.PI / 180)
	this.context.fillRect(0,0,10,50);
	this.context.restore();
	
}

StickFigure.prototype.draw = function() {
	if(this.countup){
		this.currentAngle += 0.7*this.speed*Math.abs(Math.abs(this.currentAngle%10) + 0.2);
	} else{
		this.currentAngle -= 0.7*this.speed*Math.abs(Math.abs(this.currentAngle%10) + 0.2);
	}
	console.log("CURRENT ANGLE");
	console.log(this.currentAngle);
	console.log("CURRENT SPEED");
	console.log(this.speed);	
	if (this.currentAngle >= 45){
		this.countup = false;
	}
	if (this.currentAngle <= -45){
		this.countup = true;
	}
	
	
	this.context.save();
	
	// Translate the initial scene
	this.context.translate(this.X + this.move, this.Y);
	
	this.context.fillStyle = "#FFBBFF";
	this.context.strokeStyle = "FFBBFF";
	
	this.context.save();
	this.drawBody();
	this.context.restore();
	
	this.context.save();
	this.drawHead();
	this.context.restore();
	
	// Arms
	var arm1Angle = -this.currentAngle;
	var arm2Angle = this.currentAngle;
	var adjustX = (this.currentAngle/3) + 4;
	// arm 1
	this.context.save();
	this.context.translate(-adjustX,0);
	this.context.rotate(arm1Angle*Math.PI/180);
	this.drawArm();
	this.context.restore();
	
	// arm2
	this.context.save();
	this.context.translate(adjustX,0);
	this.context.rotate(arm2Angle*Math.PI/180);
	this.drawArm();
	this.context.restore();
	
	// legs
	var leg1Angle = this.currentAngle;
	var leg2Angle = (-1)*this.currentAngle;

	var leg1X = 0;
	var leg1Y = 115;
	var leg2X = 0;
	var leg2Y = 115;	
	
	// leg1
	this.context.save();
	this.context.translate(leg1X,leg1Y);
	this.context.rotate(leg1Angle*Math.PI/180);
	this.drawLeg(1);
	this.context.restore();
	
	//leg 2
	this.context.save();
	this.context.translate(leg2X, leg2Y);
	this.context.rotate(leg2Angle*Math.PI/180);
	this.drawLeg(2);
	this.context.restore();
	this.move = this.move + 2*this.speed;
	if(this.move >= 1200){
		this.move = -275;
	}
	this.context.restore();
}
