var grobjects = grobjects || [];
var Beam = undefined;
(function() {
    "use strict";
    var shaderProgram = undefined;
    Beam = function Ufo(name, position, size) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.beam_height = 100;
        this.beam_angle = 0;
        /*
            Declare buffer here... 
            If you declare it out of scope, the first buffer 
            will be the only used buffer which is a problem 
            (Houses look lame because they are all the same).
        */
        this.buffers = undefined;
    };
    
    Beam.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["beam-vs", "beam-fs"]);
        }
        if (!this.buffers) {
            this.buffers = this.drawBeam(drawingState);
        }
    };
    Beam.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        this.position = [ufo.position[0],ufo.position[1],ufo.position[2]];
        twgl.m4.setTranslation(modelM,this.position,modelM);
        twgl.m4.translate(modelM,[0,-this.beam_height/2-1,0], modelM);
        // TODO - Make the beam rotate and make it pull up houses.
        
        //twgl.m4.rotateX(modelM,Math.PI*50/180,modelM);
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
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
    };
            
    Beam.prototype.center = function(drawingState) {
        return this.position;
    };
    
    Beam.prototype.drawBeam = function(drawingState){
        var beam = twgl.primitives.createTruncatedConeBufferInfo(drawingState.gl,10, 0.2, this.beam_height, 5,5);
        return beam;
        
    }
    
    
    
    // now that we've defined the object, add it to the global objects list
})();
var beam = new Beam("Beam",[0,0,0],1.0);
grobjects.push(beam);