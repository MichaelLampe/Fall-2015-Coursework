/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var House = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    House = function House(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    House.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    0, 0,-.5,  .5, 0,-.5,  .5, 0, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,this.drawHouse());
            console.log(buffers);
        }

    };
    House.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        
    };
    
    House.prototype.drawHouse = function(){
        var rectangle;
        // Roof
            // Roof is just a pyramid
        // Main
            // Cube 
            // Instead of a cube class let's just make a 3D rectangle class
        // Windows
            // 2d Panes, Texture
        // Door
            // Brown door
        function rectangle3D(width,height,depth,color){           
            var upperWidth = width/2;
            var lowerWidth = upperWidth*-1;
            console.log(upperWidth);
            var upperHeight = height/2;
            var lowerHeight = upperHeight*-1;
            
            var upperDepth = depth/2;
            var lowerDepth = upperDepth*-1;
                        
            rectangle = {
                vpos: { numComponents: 3, data: [
                    lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,        lowerWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth, lowerWidth,upperHeight,lowerDepth,
                    lowerWidth,lowerHeight,upperDepth,  upperWidth,lowerHeight,upperDepth,  upperWidth,upperHeight,upperDepth,        lowerWidth,lowerHeight,upperDepth,  upperWidth,upperHeight,upperDepth, lowerWidth,upperHeight,upperDepth,
                    lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,upperDepth,        lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,upperDepth, lowerWidth,lowerHeight,upperDepth,
                    lowerWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth,        lowerWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth, lowerWidth,upperHeight,upperDepth,
                    lowerWidth,lowerHeight,lowerDepth,  lowerWidth,upperHeight,lowerDepth,  lowerWidth,upperHeight,upperDepth,        lowerWidth,lowerHeight,lowerDepth,  lowerWidth,upperHeight,upperDepth, lowerWidth,lowerHeight,upperDepth,
                    upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth,        upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,upperDepth, upperWidth,lowerHeight,upperDepth   
                ] },
                vnormal: {numComponents:3, data: [
                        0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                        0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                        0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                        -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                        1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
               ] }
            };
            
            
        }
        rectangle3D(5,1,1);
        
        return rectangle;
    }
    
    House.prototype.center = function(drawingState) {
        return this.position;
    }
})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new House("house1",[-1,0.5,   0],1));

