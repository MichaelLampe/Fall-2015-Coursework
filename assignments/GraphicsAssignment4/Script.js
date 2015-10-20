function Script(context,width,height) {
	this.context = context;
	this.m4 = twgl.m4;
	this.dot = twgl.v3.dot;
	this.cross = twgl.v3.cross;
	this.rotate = 0;
	this.currentTransform = this.m4.create();
	
	this.width = width;
	this.height = height;
	
	// Stuff
	
	this.FOV = 85;
	
	this.LookAtX = 0;
	this.LookAtY = 0;
	this.LookAtZ = 0;
	
	this.LookFromX = 0;
	this.LookFromY = 0;
	this.LookFromZ = -1;
	
	// Flame movement
	this.moveX = 0;
	this.moveY = 0;
	this.directionX = -1;
	this.directionY = -1;
	
	// Shape
	this.shapeOutlines = false;
	this.orderShapes = true;
	this.lights = true;
	
	// 
	this.currentlyActiveZIndex = [];
	
	// Draw stack
	
}

Script.prototype.setupView = function(){
	// Perspective
	var perspective = this.m4.perspective(this.FOV*Math.PI/180,2,0.5,100);
	
	// Scale and Translate view
	var trans = this.m4.scaling([this.width,-1 * this.height,1]);
	this.m4.setTranslation(trans,[this.width/2, this.height/2,0],trans);
	// Camera
	var eye = [this.LookFromX,this.LookFromY,this.LookFromZ];
	var target = [this.LookAtX,this.LookAtY,this.LookAtZ];
	var up = [0,1,0];
	
	var camera = this.m4.lookAt(eye, target, up);
	var view = this.m4.inverse(camera);
	
	// Apply all effects
	var projection = this.m4.multiply(view, perspective);
	this.m4.multiply(projection, trans,this.currentTransform);
	this.currentTriangles = [];	
};

Script.prototype.draw = function() {
	this.drawStack = [];
	for (var i = 0; i <= 5000; i++){
		this.drawStack.push([]);
	}
	
	
	this.setupView();

	this.drawFloor();

	this.drawCandle();



	this.drawScene();

	this.rotate = this.rotate + 1;
};

Script.prototype.drawFloor = function(){

	this.drawCylinder(0,-0.5,0,35,3,0.1,1,[22,22,22],5);	
		
};


Script.prototype.brightnessAdjustColor = function(colors,normal){
	var lightSource = [1,1,0];
	if (!this.lights){
		return "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")";
	}
	
	
	// Apply shader
	// Make sure to floor it.  Decimal numbers are black no matter what...
	var dp = Math.abs(this.dot(normal,lightSource));
	var dpAdjust = (0.9 + 0.2 * dp);
	var red = Math.floor(dpAdjust*colors[0]);
	var blue = Math.floor(dpAdjust*colors[1]);
	var green = Math.floor(dpAdjust*colors[2]);
		
	// Make sure they are valid
	if (red > 255) red = 255;
	if (blue > 255) blue = 255;
	if (green > 255) green = 255;
	
	return "rgb(" + red + "," + blue + "," + green + ")";
};

Script.prototype.drawCylinder = function(startX,startY,startZ,radius, resolution,heightOfSegment, segments,color,curlEdges) {
	if (curlEdges == undefined) curlEdges = 0;
	var increaseBy = resolution;
	var pieceHeight = heightOfSegment;
	var numberOfSegments = segments;
		
	var middlePointBtm = [startX,startY,0];
	var middlePointTop = [startX,startY + pieceHeight*numberOfSegments,0];
	for (var j = 0; j < numberOfSegments; j++){
		for (var i = 0; i < 360; i+= increaseBy){
			var btmRight = [Math.cos(i*Math.PI/180)*radius +startX,startY + 0 + j*pieceHeight + curlEdges,Math.sin(i*Math.PI/180)*radius];
			var btmLeft = [Math.cos((i+increaseBy)*Math.PI/180)*radius +startX,startY + 0 + j*pieceHeight + curlEdges,Math.sin((i+increaseBy)*Math.PI/180)*radius];
			var tpLeft = [Math.cos((i+increaseBy)*Math.PI/180)*radius + startX,startY + pieceHeight + j*pieceHeight + curlEdges ,Math.sin((i+increaseBy)*Math.PI/180)*radius];
			var tpRight = [Math.cos(i*Math.PI/180)*radius +startX,startY + pieceHeight + j*pieceHeight + curlEdges,Math.sin(i*Math.PI/180)*radius];
				
			// Vertical Triangles
			this.addTriangle(tpLeft,tpRight,btmRight,this.brightnessAdjustColor(color,this.cross(tpRight,btmRight)));
			this.addTriangle(btmRight,btmLeft,tpLeft,this.brightnessAdjustColor(color,this.cross(tpLeft,btmRight)));
				
			if (j === 0){
				// The base
				this.addTriangle(middlePointBtm,btmRight,btmLeft,this.brightnessAdjustColor(color,this.cross(middlePointBtm,btmRight)));
			}
			if (j === numberOfSegments - 1){
				// Top
				this.addTriangle(middlePointTop,tpRight, tpLeft,this.brightnessAdjustColor(color,this.cross(middlePointTop,tpRight)));
			}
		}
	}	
};

Script.prototype.drawCandle = function(){
	// Draws the base of the candle
	this.drawCylinder(0,0,0,1,10,1,5,[245,245,245]);
	// Wick
	this.drawCylinder(0,5,0,0.1,20,0.3,2,[165,42,42]);
	// Flame
	var segNum = 10;
	for (var i = segNum; i >= 1; i--){
		if (i == segNum){
			this.drawCylinder(0, 0 + 5.5 + 0.2*(segNum-i),0,i/15,30,0.2,1,[255,165,0]);	
		}
		if (i > segNum - 3){
			this.drawCylinder(this.moveX/i, this.moveY/i + 5.5 + 0.2*(segNum-i),0,i/15,30,0.2,1,[255,165,0]);	
		} else{
			this.drawCylinder(this.moveX/i, this.moveY/i + 5.5 + 0.2*(segNum-i),0,i/15,30,0.2,1,[255,255,0]);
		}
	}
	if (this.moveX < -0.1){
		this.directionX = 1;
	}
	if (this.moveX > 0.1) {
		this.directionX = -1;
	}
	if (this.moveY < -0.1){
		this.directionY = 1;
	}
	if (this.moveY > 0.1) {
		this.directionY = -1;
	}

	this.moveX = this.moveX + 0.04*this.directionX;
	this.moveY = this.moveY + 0.01*this.directionY;
	

};


Script.prototype.calculateZIndex = function(z1,z2,z3){
	var zIndex = Math.abs(Math.round((9001*(z1/2 + z2/2+ z3/2))/3));
	return zIndex;
};

Script.prototype.zIndexContains = function(zIndex) {
    for (var i = 0; i < this.currentlyActiveZIndex.length; i++) {
        if (this.currentlyActiveZIndex[i] === zIndex) {
            return true;
        }
    }
    return false;
}

Script.prototype.addTriangle = function(point1, point2, point3,color){
	var t1 = this.m4.transformPoint(this.currentTransform,point1);
	var t2 = this.m4.transformPoint(this.currentTransform,point2);
	var t3 = this.m4.transformPoint(this.currentTransform,point3);
	if (this.orderShapes){
		this.currentTriangles.push([t1,t2,t3,color]);
		var zIndex = this.calculateZIndex(t1[2],t2[2],t3[2]);
		if(!this.zIndexContains(zIndex)){
			this.currentlyActiveZIndex.push(zIndex);
		}
	try{
		this.drawStack[zIndex].push([point1,point2,point3,color]);
	} catch (err){
		//console.log("zIndex buffer range exceeded!")
		// If this happens things won't draw correctly, but it also won't completely crash the page...
	}
	} else{
		this.drawStack[0].push([point1,point2,point3,color]);
	}
};


Script.prototype.drawScene = function(){
	// This doesn't work...
	// Fixed by expanding buffer size.
	// Ok if we don't go through all the array it might be fasta which means we can get a higher resolution?
	this.currentlyActiveZIndex.sort();
	for (var i = this.currentlyActiveZIndex.length - 1; i >= 0; i--){
		try{
		for (var j = this.drawStack[this.currentlyActiveZIndex[i]].length - 1; j >= 0; j--){
			this.context.fillStyle = this.drawStack[this.currentlyActiveZIndex[i]][j][3];
			if (this.shapeOutlines){
				this.context.strokeStyle = "grey";
			} else{
				this.context.strokeStyle = this.drawStack[this.currentlyActiveZIndex[i]][j][3];
			}
			this.drawTriangle(this.drawStack[this.currentlyActiveZIndex[i]][j]);
		}
		} catch(err){
			// Do nothing just so it doesn't crash...
		}
	}
	/*
	for (var i = this.drawStack.length - 1; i >= 0; i--){
		/*console.log("The value of the index is");
		console.log(i);
		console.log("The size of the stack is");
		console.log(this.drawStack[i].length);
		for (var j = this.drawStack[i].length - 1; j >= 0; j--){
			this.context.fillStyle = this.drawStack[i][j][3];
			if (this.shapeOutlines){
				this.context.strokeStyle = "grey";
			} else{
				this.context.strokeStyle = this.drawStack[i][j][3];
			}
			this.drawTriangle(this.drawStack[i][j]);
		}
	}*/ 
};

Script.prototype.drawTriangle = function(arrayOfPoints){
	this.context.beginPath();
	this.moveTo(arrayOfPoints[0]);
	this.drawLine(arrayOfPoints[1]);
	this.drawLine(arrayOfPoints[2]);
	this.drawLine(arrayOfPoints[0]);
	this.context.fill();
	this.context.stroke();
	this.context.closePath();
};

Script.prototype.drawLine = function(point) {
	var loc = point;
	var result = this.m4.transformPoint(this.currentTransform,loc);
	this.context.lineTo(result[0],result[1]);
};

Script.prototype.moveTo = function(point) {
	var loc = point;
    var result = this.m4.transformPoint(this.currentTransform,loc);
    this.context.moveTo(result[0],result[1]);
};