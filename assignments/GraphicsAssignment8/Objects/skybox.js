var grobjects = grobjects || [];
var Skybox = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    Skybox = function Skybox(name, position, size, textureLocation) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.textureLocation = textureLocation;
        this.helipad = true;
                this.helipadAltitude = 50;
        /*
            Declare buffer here... 
            If you declare it out of scope, the first buffer 
            will be the only used buffer which is a problem 
            (Houses look lame because they are all the same).
        */
        this.buffers = undefined;
    };
    
    Skybox.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["ball-vs", "ball-fs"]);
        }
        if (!this.buffers) {
            this.buffers = this.drawSkybox(drawingState,this.size,40);
        }
        this.texture = twgl.createTextures(drawingState.gl, {
            myimage: {src: this.textureLocation, mag: gl.NEAREST, min: gl.LINEAR}
        });
        console.log(drawingState.gl);
    };
    Skybox.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        
        gl.useProgram(shaderProgram.program);
        
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);
        
        
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
             lightdir:drawingState.sunDirection,
            model: modelM,
            uTexture: this.texture.myimage});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
        
    };
    
    Skybox.prototype.drawSkybox = function(drawingState, radius,resolution, yStart){
        var ball = twgl.primitives.createSphereBufferInfo(drawingState.gl,radius,resolution,resolution)
        return ball;
    }
        
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    };
    
    
    
    
    // now that we've defined the object, add it to the global objects list
})();
var earthTextureLocation = "images/night-sky.jpg";
var moon = new Skybox("Skybox",[0,0,0],25,earthTextureLocation);
grobjects.push(moon);