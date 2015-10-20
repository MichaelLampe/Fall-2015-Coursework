function Tree(context) {
	
	this.context = context;
	this.m4 = twgl.m4;
	
	// Makes the transition stack just like we see in 2D
	this.stack = [];
	
	// Makes the currently active transform the most recent one.
	this.stack.push(this.m4.create());
	this.currentTransform = this.previousTransform();
	
	this.rotate = 0;
	this.wind = 0;
	
	this.windspeed = 0.5;
	
	this.FOV = 5;
	
	this.LookAtX = 0;
	this.LookAtY = 0;
	this.LookAtZ = -1;
	
	this.LookFromX = 0;
	this.LookFromY = 5;
	this.LookFromZ = 10;
};

Tree.prototype.setup = function(){
	// Perspective Matrix;
	this.currentTransform = this.m4.perspective(Math.PI*this.FOV*10/180,2,5,15);
	this.m4.lookAt([this.LookFromX,this.LookFromY,this.LookFromZ],[this.LookAtX,this.LookAtY,this.LookAtZ],[0,1,0],this.currentTransform);
	console.log(this.currentTransform);
	this.translate3D(-1000,0,0);
};

Tree.prototype.draw = function(){
	this.save();
	this.setup();
	
	this.save();
	this.translate3D(500,50,0);
	//this.rotate3D([0,1,0],this.rotate);
	this.save();
	this.translate3D(0,300,0);
	var numberOfTrunkSegments = 4;
	this.drawTrunk(numberOfTrunkSegments);
	this.restore();
	
	this.save();
	var numberOfBranches = 4;
	this.drawBranches(numberOfBranches)
	this.restore();
	
	this.restore();
	
	this.rotate = this.rotate + 1;
	this.wind = this.wind + this.windspeed;
	
	this.restore();
};

Tree.prototype.drawBranches = function(branches){
	this.save();
	for (var i = 0; i < branches;i++){
		this.save();
		this.translate3D(0,400,0);
		this.rotate3D([1,0,0],90);
		this.rotate3D([0,0,1],85*i);
		this.drawBranch();
		
		this.restore();
	}
	this.restore();
};

Tree.prototype.drawBranch = function(){
	this.save();
	for (var i = 0; i < 6; i++){
		var rotateAxis = [1,1,1];
		this.rotate3D(rotateAxis,-10);
		this.rotate3D([1,0,1],-10);
		this.translate3D(0,-50,0);
		this.drawTreeSegment();
		this.drawLeaves(15);
	}
	this.restore();
};

Tree.prototype.drawLeaves = function(numberOfLeaves) {
	this.save();
	
	for (var i = 0; i < numberOfLeaves; i++){
		this.translate3D(-10*i,-10*i,10*i);
		//this.rotate3D([0,1,0],this.rotate);
		this.translate3D(this.wind,this.wind,this.wind);
		this.rotate3D([0,0,1],90);
		this.draw2DRectangle(10,15,0,"green");
	}
	
	this.restore();
};

// This also needs to attach leaves to a given box.
Tree.prototype.drawTreeSegment = function(){
	this.drawBox(25,50,25,"brown");
	// Apply individual leaves
	this.save();
	
	this.save();
	this.rotate3D([0,0,1],90);
	this.rotate3D([0,1,0],45);
	this.draw2DRectangle(10,15,0,"green");
	this.restore();
	
	this.save();
	this.rotate3D([0,0,1],90);
	this.rotate3D([0,1,0],45);
	this.translate3D(-60,0,0);
	this.draw2DRectangle(10,15,0,"green");
	this.restore();
	
	this.save();
	this.rotate3D([0,0,1],90);
	this.rotate3D([0,1,0],45);
	this.translate3D(-30,0,0);
	this.draw2DRectangle(10,15,0,"green");
	this.restore();
	
	this.save();
	this.rotate3D([0,0,1],90);
	this.rotate3D([1,1,0],55);
	this.translate3D(-30,-30,0);
	this.draw2DRectangle(10,15,0,"green");
	this.restore();
	
	this.save();
	this.rotate3D([0,0,1],90);
	this.rotate3D([1,1,0],-55);
	this.translate3D(-30,-50,30);
	this.draw2DRectangle(10,15,0,"green");
	this.restore();
	
	this.restore();
}

Tree.prototype.drawTrunk = function(segments){
	this.save();
	for (var i = 0; i < segments; i++){
		this.translate3D(0,50,0);
		this.drawBox(25,50,25,"brown");
	}
	this.restore();
};

Tree.prototype.drawBox = function(width,length,depth,color){
	// Draw a box
	this.save();
	this.draw2DRectangle(width,length,0,color);
	this.draw2DRectangle(width,0,depth,color);
	this.draw2DRectangle(0,length,depth,color);
	
	this.save();
	this.translate3D(0,0,depth);
	this.draw2DRectangle(width,length,0,color);
	this.restore();
	
	this.save();
	this.translate3D(width,0,0);
	this.draw2DRectangle(0,length,depth,color);
	this.restore();
	
	this.save();
	this.translate3D(0,length,0);
	this.draw2DRectangle(width,0,depth,color);	
	this.restore();
	
	this.restore();
};

Tree.prototype.draw2DRectangle = function(width,length,depth,color){
		
	this.context.beginPath();
	
	this.moveToTx(0,0,0);
	
	if (width == 0){
		this.lineToTx(0,length,0);
		this.lineToTx(0,length,depth);
		this.lineToTx(0,0,depth);
		this.lineToTx(0,0,0);
	} else if (length == 0){
		this.lineToTx(width,0,0);
		this.lineToTx(width,0,depth);
		this.lineToTx(0,0,depth);
		this.lineToTx(0,0,0);
	} else if (depth == 0) {
		this.lineToTx(width,0,0);
		this.lineToTx(width,length,0);
		this.lineToTx(0,length,0);
		this.lineToTx(0,0,0);
	}
	
	// Styling
	this.context.strokeStyle = "black";
	if (color != undefined) this.context.strokeStyle = color;
	if (color != undefined) this.context.fillStyle = color;
	//this.context.fill();
	this.context.stroke();
	
	this.context.closePath();
};






// General, fundamental commands
Tree.prototype.translate3D = function(x, y, z, matrix){
	if (matrix == undefined) matrix = this.m4.create();
	var loc = [x,y,z];
	this.m4.translation(loc,matrix);
	this.m4.multiply(matrix,this.currentTransform,this.currentTransform);
};

Tree.prototype.rotate3D = function(axisArray, angle, matrix){
	if (axisArray.length != 3) throw "Incorrect axis array input size. Size should be 3";
	if (matrix == undefined) matrix = this.m4.create();
	
	// Puts into radians so I can just pass degrees
	var angleRadians =  angle * Math.PI/180;
	this.m4.axisRotation(axisArray, angleRadians, matrix);
	this.m4.multiply(matrix,this.currentTransform,this.currentTransform);
};

Tree.prototype.scale3D = function(x,y,z,matrix){
	if (matrix == undefined) matrix = this.m4.create();
	var scaleArray = [x,y,z];
	this.m4.scaling(scaleArray,matrix);
	this.m4.multiply(matrix,this.currentTransform,this.currentTransform);
};

Tree.prototype.moveToTx = function (x,y,z) {
	this.save();
	
    var loc = [x,y,z];
    var locTx = this.m4.transformPoint(this.currentTransform,loc);
    this.context.moveTo(locTx[0],locTx[1]);
	
	this.restore();
 };

Tree.prototype.lineToTx = function(x,y,z) {
	this.save();
	
    var loc = [x,y,z];
	var locTx = this.m4.transformPoint(this.currentTransform,loc);
	this.context.lineTo(locTx[0],locTx[1]);
	
	this.restore();
};

Tree.prototype.save = function() {
	var oldTransform = this.m4.multiply(this.m4.create(), this.currentTransform);
	
	this.stack.push(oldTransform);
};

Tree.prototype.restore = function(){
	// This makes the current transform the last one saved
	// Also creates a copy of it.
	var copiedArray = this.stack.slice();
	
	this.currentTransform = copiedArray.pop();
	this.stack.pop();
};

Tree.prototype.previousTransform = function(){
	// Slice makes a deep copy of the array.  
	// This is necessary to not cause problems.
	var copiedArray = this.stack.slice();
	
	var element = copiedArray[copiedArray.length - 1];
	return element;
};

