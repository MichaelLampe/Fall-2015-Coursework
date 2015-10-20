// Get all the control structures
// Sliders
var F = document.getElementById('FOV');	
var FOV = F.value;

var LAX = document.getElementById('LookAtX');
var LookAtX = LAX.value;

var LAY = document.getElementById('LookAtY');
var LookAtY = LAY.value;

var LAZ = document.getElementById('LookAtZ');
var LookAtZ = LAZ.value;

var LFX = document.getElementById('LookFromX');
var LookFromX = LFX.value;

var LFY = document.getElementById('LookFromY');
var LookFromY = LFY.value;

var LFZ = document.getElementById('LookFromZ');
var LookFromZ = LFZ.value;

// Check boxes
var o = document.getElementById('outlines');
o.checked = true;
var outlines = o.value;

var s = document.getElementById('shapes');
s.checked = true;
var shapes = s.value;

var l = document.getElementById('lights');
l.checked = true;
var lights = l.value;


//////////////////////////////////////////////////
// Actual WebGL Code
/////////////////////////////////////////////////

var canvas = document.getElementById("disco");
console.log(canvas);
var gl = canvas.getContext("webgl");
console.log(gl);
var drawArray = [];
var triangleColor = [];
var normalArray = [];
var m4 = twgl.m4;
var dot = twgl.v3.dot;
var cross = twgl.v3.cross;
var moveX = 0;
var moveY = 0;

var start = function() {
	"use strict";

	// Vertex Shader
  	var vertexSource = "attribute vec3 pos;" +
  		"attribute vec3 inColor;" +
		"attribute vec3 normal;" +
  		"varying vec3 outColor;" +
		"varying vec3 outNormal;" +
  		"uniform mat4 transform;" +
		"uniform mat4 perspective;" +
		"uniform mat4 view;" +
    	"void main(void) {" + 
    	"  gl_Position = perspective*view*vec4(pos, 1.0);" +
    	"  outColor = inColor;" + 
		" if(pos.y > 5.3){" +
		// Special transform based on the fact we want the whick to move.
		" gl_Position = transform*gl_Position;" + 
		// Increase the brightness a bit for the candle part.  
		"	outColor = outColor * 1.5;" +
		"}" +
		"  outNormal = normal;"+
    	"}";
    	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexSource);
	gl.compileShader(vertexShader);
	console.log("Vertex compiled? " + gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS));
	console.log(gl.getShaderInfoLog(vertexShader));

	// Fragment Shader
    var fragmentSource = "precision highp float;" + 
    	"varying vec3 outColor;" +
    	"varying vec3 outNormal;" +
		"void main(void) {" +
		"  vec3 lightSource = vec3(0.0,5.5,0.0);" +
		// If I adjust the light to be also from the x direction, the light gets messed up because
		// there is a small point on the top of the candle becomes dark because of the dot.
		"  vec3 color = 0.8*outColor + 0.5*outColor*max(0.0,dot(outNormal,lightSource));" +
    	"  gl_FragColor = vec4(color, 1.0);" +
    	"}";
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentSource);
	gl.compileShader(fragmentShader);
	console.log("Fragment compiled? " + gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS));
	console.log(gl.getShaderInfoLog(fragmentShader));

	// Put the shaders together
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	console.log("Shaders linked? " + gl.getProgramParameter(shaderProgram,gl.LINK_STATUS));
	console.log(gl.getProgramInfoLog(shaderProgram));



	// Attributes
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "pos");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	
    shaderProgram.inColor = gl.getAttribLocation(shaderProgram, "inColor");
    gl.enableVertexAttribArray(shaderProgram.inColor);
	
	shaderProgram.normal = gl.getAttribLocation(shaderProgram,"normal");
	gl.enableVertexAttribArray(shaderProgram.normal);

    shaderProgram.perspective = gl.getUniformLocation(shaderProgram,"perspective");
    shaderProgram.view = gl.getUniformLocation(shaderProgram,"view");
	shaderProgram.transform = gl.getUniformLocation(shaderProgram,"transform");
	
	// Here we create stuff
    create();
	
	// Buffers
	var trianglePosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawArray), gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = drawArray.length/3;

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColor), gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = triangleColor.length/3;

	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normalArray), gl.STATIC_DRAW);
	normalBuffer.itemSize = 3;
	normalBuffer.numItems = normalArray.length/3;
	var direction = 1;
	var height = 1;
	function draw() {
		// first, let's clear the screen
	    gl.clearColor(0.0, 0.0, 0.0, 1.0);
		if (s.checked){
	    	gl.enable(gl.DEPTH_TEST);
		} else{
			gl.disable(gl.DEPTH_TEST);
		}
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	    // now we draw the triangle(s)
	    // we tell GL what program to use, and what memory block
	    // to use for the data, and that the data goes to the pos
	    // attribute
	    gl.useProgram(shaderProgram);	    

		// Perspective
		var perspective = m4.perspective(F.value*Math.PI/180,2,0.5,100);
		
		// Transformation
		var flameTransform = m4.scaling([1,height,1]);
		// Camera
		var eye = [LFX.value,LFY.value,LFZ.value];
		var target = [LAX.value,LAY.value,LAZ.value];
		var up = [0,1,0];
		
		var camera = m4.lookAt(eye, target, up);
		var view = m4.inverse(camera);
		
		// Pass in the attributes
		gl.uniformMatrix4fv(shaderProgram.transform, false, flameTransform);
		gl.uniformMatrix4fv(shaderProgram.perspective,false,perspective);
		gl.uniformMatrix4fv(shaderProgram.view,false,view);

	    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	    gl.vertexAttribPointer(shaderProgram.inColor, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
		gl.vertexAttribPointer(shaderProgram.normal, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
	    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    
		// Draw
		gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer.numItems);
		if (height > 1.2){
			direction = -1;
		} 
		if (height < 0.8){
			direction = 1;
		}
		height = height + 0.009 * direction;
		window.requestAnimationFrame(draw);
		
	}
	draw();
};

var create = function() {
	console.log("Drawing");
	// Floor
	//drawFloor();
	// Candle flame
	drawFlame();
	// Candle base
	drawBase();
};

var drawBase = function(){
	console.log("Drawing base");
	// Draws the base of the candle
	drawCylinder(0,0,0,1,3,1,5,[245,245,245]);;
	// Wick
	drawCylinder(0,5,0,0.1,3,0.3,2,[165,42,42]);
};

var drawFlame = function(){
	console.log("Drawing flame");
	// Flame
	var segNum = 10;
	for (var i = segNum; i >= 1; i--){
		if (i > segNum - 3){
			drawCylinder(0, moveY/i + 5.5 + 0.2*(segNum-i),0,i/15,3,0.2,1,[255,165,0]);	
		} else{
			drawCylinder(0, moveY/i + 5.5 + 0.2*(segNum-i),0,i/15,3,0.2,1,[255,255,0]);
		}
	}
};

var drawFloor = function() {
	this.drawCylinder(0,-0.5,0,35,5,0.1,1,[22,22,22],5);	
}

var drawCylinder = function(startX, startY, startZ, radius, resolution, heightOfSegment, segments, color,curlEdges) {
	console.log("Draw cylinder");
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
			addTriangle(tpLeft,tpRight,btmRight,color);
			addTriangle(btmRight,btmLeft,tpLeft,color);
				
			if (j === 0){
				// The base
				addTriangle(middlePointBtm,btmRight,btmLeft,color);
			}
			if (j === numberOfSegments - 1){
				// Top
				addTriangle(middlePointTop,tpRight, tpLeft,color);
			}
		}
	}
};

var addTriangle = function(vertex1, vertex2, vertex3,color){
	drawArray.push(vertex1[0]);
	drawArray.push(vertex1[1]);
	drawArray.push(vertex1[2]);

	drawArray.push(vertex2[0]);
	drawArray.push(vertex2[1]);
	drawArray.push(vertex2[2]);

	drawArray.push(vertex3[0]);
	drawArray.push(vertex3[1]);
	drawArray.push(vertex3[2]);
	// Meh, make the triangle the same color.
	for (var i = 0; i < 3; i++){
		triangleColor.push(color[0]/255.0);
		triangleColor.push(color[1]/255.0);
		triangleColor.push(color[2]/255.0);
	}
	var normal1 = cross(vertex1,vertex2);
	var normal2 = cross(vertex2,vertex3);
	var normal3 = cross(vertex3,vertex1);
	normalArray.push(normal1[0]);
	normalArray.push(normal1[1]);
	normalArray.push(normal1[2]);
	
	normalArray.push(normal2[0]);
	normalArray.push(normal2[1]);
	normalArray.push(normal2[2]);
	
	normalArray.push(normal3[0]);
	normalArray.push(normal3[1]);
	normalArray.push(normal3[2]);
};

// Start script
start();