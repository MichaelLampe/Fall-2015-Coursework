var grobjects = grobjects || [];
var Ball = undefined;
var heloLandingSites = heloLandingSites || [];

(function() {
    "use strict";
    var shaderProgram = undefined;
    Ball = function Ball(name, position, size, textureLocation, bumpLocation) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.bumpMapLocation = bumpLocation;
        this.textureLocation = textureLocation;
        this.helipad = true;
        this.helipadAltitude = 50;
        this.rotate = 0;        
        this.innerRotate = 0;
        /*
            Declare buffer here... 
            If you declare it out of scope, the first buffer 
            will be the only used buffer which is a problem 
            (Houses look lame because they are all the same).
        */
        this.buffers = undefined;
    };
    
    Ball.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["ball-vs", "ball-fs"]);
        }
        if (!this.buffers) {
            this.buffers = this.drawBall(drawingState,this.size,40);
        }
        this.texture = twgl.createTextures(drawingState.gl, {
            myimage: {src: this.textureLocation, mag: gl.NEAREST},
            bump: {src:this.bumpMapLocation, mag: gl.NEAREST},
            man: {src:"images/man_on_the_moon.jpg", mag: gl.NEAREST}
        });
    };
    Ball.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        twgl.m4.rotateY(modelM,this.rotate*Math.PI/180,modelM);
        twgl.m4.translate(modelM,[0,0,-30],modelM);
        //twgl.m4.rotateY(modelM,Math.PI*this.innerRotation/180,modelM);
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        
        gl.useProgram(shaderProgram.program);
        
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
             lightdir:drawingState.sunDirection,
            model: modelM,
            uTexture: this.texture.myimage,
            uBump: this.texture.bump,
            uMan: this.texture.man
            });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
        this.rotate += .5;
        this.innerRotate += 0.2;
    };
    
    Ball.prototype.drawBall = function(drawingState, radius,resolution, yStart){
        var ball = twgl.primitives.createSphereBufferInfo(drawingState.gl,radius,resolution,resolution)
        return ball;
        
    }
        
    Ball.prototype.center = function(drawingState) {
        return this.position;
    };
    
    
    
    
    // now that we've defined the object, add it to the global objects list
})();
var moonTextureLocation = "images/moon.jpg";
var bumpMapLocation = "images/rocky_bump_map.jpg";
var moon = new Ball("Moon",[0,40,-30],2,moonTextureLocation, bumpMapLocation)
grobjects.push(moon);
heloLandingSites.push(moon);