var grobjects = grobjects || [];
var Ufo = undefined;
(function() {
    "use strict";
    var shaderProgram = undefined;
    Ufo = function Ufo(name, position, size) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.move = 0;
        this.direction = 1;
        this.move_amount = 0.1;
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
            shaderProgram = twgl.createProgramInfo(gl, ["ufo-vs", "ufo-fs"]);
        }
        if (!this.buffers) {
            this.buffers = twgl.createBufferInfoFromArrays(drawingState.gl,LoadedOBJFiles["ufo.obj"]);
        }
    };
    Ufo.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        this.position = [50*Math.sin(Math.PI*this.move/180),50,10*Math.sin(Math.PI*this.move/180)-100];
        twgl.m4.setTranslation(modelM,this.position,modelM);
       
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);
        
        
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            lightdir:drawingState.sunDirection,
		});
        twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, this.buffers);
        this.move = this.move + this.move_amount*this.direction;
        //if (this.move > 360){
        //    this.direction = -1;
        //}
        //if (this.move < 0){
        //    this.direction = 1;
        //}
    };
            
    Ufo.prototype.center = function(drawingState) {
        return this.position;
    };
    
    
    
    
    // now that we've defined the object, add it to the global objects list
})();
var ufo = new Ufo("Ufo",[0,40,-30],0.1);
grobjects.push(ufo);