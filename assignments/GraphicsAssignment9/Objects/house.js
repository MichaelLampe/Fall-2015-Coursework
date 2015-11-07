var grobjects = grobjects || [];
var heloLandingSites = heloLandingSites || [];
// allow the two constructors to be "leaked" out
var House = undefined;

var shaderProgram = undefined;
(function() {
    "use strict";
    var shaderProgram = undefined;
    House = function House(name, position, size, houseColors, houseDimensions, doorLocation) {
        "use strict";
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        console.log("ONE HOUSE COLORS");
        this.houseColors = houseColors;
        this.houseDimensions = houseDimensions;
        this.doorLocation = doorLocation;
        this.helipad = true;
        this.helipadAltitude = houseDimensions[1] + houseDimensions[1]*0.5 - 0.5;
        this.bumpTexture = "images/rocky_bump_map.jpg";
        /*
            Declare buffer here... 
            If you declare it out of scope, the first buffer 
            will be the only used buffer which is a problem 
            (Houses look lame because they are all the same).
        */
        this.buffers = undefined;
    };
    House.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["house-vs", "house-fs"]);
        }
        this.texture = twgl.createTextures(drawingState.gl, {
            bump: {src: this.bumpTexture, mag: gl.NEAREST}
        });
        if (!this.buffers) {
            this.buffers = twgl.createBufferInfoFromArrays(drawingState.gl,this.drawHouse());
        }
    };
    House.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        //twgl.m4.setTranslation(modelM,[0,-0.5,0],modelM);
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        
        
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM,
            uBump: this.texture.bump});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
    };
    
    House.prototype.drawHouse = function(){     
        var width = this.houseDimensions[0];
        var height = this.houseDimensions[1];
        var depth = this.houseDimensions[2];
        
        var roofColor = this.houseColors[0];
        var bodyColor = this.houseColors[1];
        var doorColor = this.houseColors[2];
        
        var doorLocation = this.doorLocation;
        
        var house = {
            vpos: {numComponents: 3,
                data : []
            },
            vnormal: { numComponents: 3,
                data : []
            },
            inColor: {numComponenets: 3,
                data : []
            },
            texCoords: {numComponents: 2,
                data: []
            }
        };
        
        // Roof
        function roof(width,height,depth,color){
            rectangle3D(0-width*0.3,width+width*0.3,height,height+height*0.5,0-depth*0.3,depth+depth*0.3,color);
        }
            // Roof is just a pyramid
        // Main
        function body(width,height,depth,color){
            rectangle3D(0,width,0,height,0,depth,color);
        }
    
        // Windows
              // 2d Panes, Texture
        var window = function(){
            
            return window;
        }
        // Door
            // Brown door
        function door(width, height, depth, side,color){
            
            // There is somethign wrong with these states as the doors do not always show up.
            switch(side){
                case 1: 
                    rectangle3D(-0.01, -0.01, 0, height/2, depth/4, 3*depth/4,color);  
                    break;
                case 2:
                    rectangle3D(width+0.01, width+0.01, 0, height/2, depth/4, 3*depth/4,color);  
                    break;
                case 3:
                    rectangle3D(width/4, 3*width/4, 0, height/2, -0.01, -0.01,color);
                    break;
                case 4:
                    rectangle3D(width/4, 3*width/4, 0, height/2, depth+0.01, depth+0.01,color);
                    break;
                default:
                    // Just in case
                    rectangle3D(width/4, 3*width/4, 0, height/2, depth+0.01, depth+0.01,color);   
                    console.log("Used default door location?");
                    break;
            } 
        }
            
        function rectangle3D(lowerX, upperX, lowerY, upperY, lowerZ, upperZ,color){         
            color = color || [0,0,0];
            var upperWidth = upperX - 0.5;
            var lowerWidth = lowerX - 0.5;
            var upperHeight = upperY - 0.5;
            var lowerHeight = lowerY - 0.5;
            
            var upperDepth = upperZ - 0.5;
            var lowerDepth = lowerZ - 0.5;
                        
            house.vpos.data.push(
                    lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,        lowerWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth, lowerWidth,upperHeight,lowerDepth,
                    lowerWidth,lowerHeight,upperDepth,  upperWidth,lowerHeight,upperDepth,  upperWidth,upperHeight,upperDepth,        lowerWidth,lowerHeight,upperDepth,  upperWidth,upperHeight,upperDepth, lowerWidth,upperHeight,upperDepth,
                    lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,upperDepth,        lowerWidth,lowerHeight,lowerDepth,  upperWidth,lowerHeight,upperDepth, lowerWidth,lowerHeight,upperDepth,
                    lowerWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth,        lowerWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth, lowerWidth,upperHeight,upperDepth,
                    lowerWidth,lowerHeight,lowerDepth,  lowerWidth,upperHeight,lowerDepth,  lowerWidth,upperHeight,upperDepth,        lowerWidth,lowerHeight,lowerDepth,  lowerWidth,upperHeight,upperDepth, lowerWidth,lowerHeight,upperDepth,
                    upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,lowerDepth,  upperWidth,upperHeight,upperDepth,        upperWidth,lowerHeight,lowerDepth,  upperWidth,upperHeight,upperDepth, upperWidth,lowerHeight,upperDepth   
            );
            house.vnormal.data.push(
                        0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                        0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                        0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                        -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                        1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0
           );
           house.texCoords.data.push(
            0,0,  1,0,  1,1,        0,0,  1,1, 0,1,
            0,0,  1,0,  1,1,        0,0,  1,1, 0,1,
            0,0,  1,0,  1,0,        0,0,  1,0, 0,0,
            0,1,  1,1,  1,1,        0,1,  1,1, 0,1,
            0,0,  0,1,  0,1,        0,0,  0,1, 0,0,
            1,0,  1,1,  1,1,        1,0,  1,1, 1,0   
           )
           for (var i = 0; i < 36; i++){
               house.inColor.data.push(color[0],color[1],color[2]);
           }
        }
        door(width, height, depth, doorLocation, doorColor);
        roof(width, height, depth, roofColor);
        body(width, height, depth, bodyColor);
        return house;
    };
    
    House.prototype.center = function(drawingState) {
        return this.position;
    };
})();

// J should be a multiple of 4.
// But I'm nice so I'll just make it work out.
var numberOfHouses = 64;
var houseSize = 1;
// Each house gets a house size square
// Base house size square 3x3
var houseGrid = houseSize * 6;

for (var x = 1; x <= numberOfHouses/8; x++){
    for (var y = 1; y <= numberOfHouses/8; y++){
        var houseName = "house" + x*y;
        var doorLocation = Math.floor(Math.random()*4) + 1;
        var roofColor = [0.58,0.29,0.0];
        var bodyColor = [Math.random(),Math.random(),Math.random()];
        var doorColor = [0.0,0.0,0.0];
        var houseColors = [roofColor, bodyColor, doorColor];
        var width = Math.floor(Math.random()*3 + 1);
        var height = Math.floor(Math.random()*3 + 1);
        var depth = Math.floor(Math.random()*3 + 1);
        var houseDimensions = [width,height,depth];
        var newHouse = new House(houseName, [-houseGrid*x,0.5,-houseGrid*y], houseSize, houseColors, houseDimensions, doorLocation);
        grobjects.push(newHouse);
        heloLandingSites.push(newHouse);
    }   
}

for (var x = 1; x <= numberOfHouses/8; x++){
    for (var y = 1; y <= numberOfHouses/8; y++){
        var houseName = "house" + x*y;
        var doorLocation = Math.floor(Math.random()*4) + 1;
        var roofColor = [0.58,0.29,0.0];
        var bodyColor = [Math.random(),Math.random(),Math.random()];
        var doorColor = [0.0,0.0,0.0];
        var houseColors = [roofColor, bodyColor, doorColor];
        var width = Math.floor(Math.random()*3 + 1);
        var height = Math.floor(Math.random()*3 + 1);
        var depth = Math.floor(Math.random()*3 + 1);
        var houseDimensions = [width,height,depth];
        var newHouse = new House(houseName, [houseGrid*x,0.5,-houseGrid*y], houseSize, houseColors, houseDimensions, doorLocation);
        grobjects.push(newHouse);
        heloLandingSites.push(newHouse);
    }   
}
