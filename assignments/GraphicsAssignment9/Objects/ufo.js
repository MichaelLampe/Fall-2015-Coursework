var grobjects = grobjects || [];

(function() {
    "use strict";
    var shaderProgram = undefined;
    Ufo = function Ufo(name, position, size) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        /*
            Declare buffer here... 
            If you declare it out of scope, the first buffer 
            will be the only used buffer which is a problem 
            (Houses look lame because they are all the same).
        */
        this.buffers = undefined;
    };
    
    Ufo.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["ball-vs", "ball-fs"]);
        }
        if (!this.buffers) {
            this.buffers = this.drawBall(drawingState,this.size,40);
        }
        this.texture = twgl.createTextures(drawingState.gl, {
            myimage: {src: this.textureLocation, mag: gl.NEAREST}
        });
    };
    Ufo.prototype.draw = function(drawingState) {
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
            model: modelM
		});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
    };
            
    Ufo.prototype.center = function(drawingState) {
        return this.position;
    };
    
    
    
    
    // now that we've defined the object, add it to the global objects list
})();
var ufo = new Ufo("Ufo",[0,0,0],2);
grobjects.push(ufo);