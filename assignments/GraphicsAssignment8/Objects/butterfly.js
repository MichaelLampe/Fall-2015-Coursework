/**
 * Created by gleicher on 10/17/15.
 */
var grobjects = grobjects || [];

// make the two constructors global variables so they can be used later
var Copter = undefined;
var Helipad = undefined;

/* this file defines a helicopter object and a helipad object

the helicopter is pretty ugly, and the rotor doesn't spin - but
it is intentionally simply. it's ugly so that students can make
it nicer!

it does give an example of index face sets

read a simpler object first.


the helipad is a simple object for the helicopter to land on.
there needs to be at least two helipads for the helicopter to work..


the behavior of the helicopter is at the end of the file. it is
an example of a more complex/richer behavior.
 */

(function () {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var copterBodyBuffers = undefined;
    var copterRotorBuffers = undefined;
    var copterNumber = 0;

    var padBuffers = undefined;
    var padNumber = 0;

    // constructor for Helicopter
    Copter = function Copter(name) {
        this.name = "copter"+copterNumber++;
        this.position = [0,0,0];    // will be set in init
        this.color = [.9,.3,.4];
        // about the Y axis - it's the facing direction
        this.orientation = 0;
        this.angle = 0;
        this.direction = 1;
        this.wings = twgl.m4.create;
    }
    Copter.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var q = .25;  // abbreviation

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["butterfly-vs", "butterfly-fs"]);
        }
       
        if (!copterBodyBuffers) {
            
            // Body
            var arrays = {
                vpos : { numComponents: 3, data: [
                    // Bottom 
                    0.0, 0.0, 0.0,      0.5, 0.0, 0.0,      0.0,0.0,0.5,
                    0.5, 0.0, 0.5,      0.5, 0.0, 0.0,      0.0,0.0,0.5,
                    // Top
                    0.0, 0.5, 0.0,      0.5, 0.5, 0.0,      0.0,0.5,0.5,
                    0.5, 0.5, 0.5,      0.5, 0.5, 0.0,      0.0,0.5,0.5,
                    // Left
                    0.0, 0.0, 0.0,      0.0, 0.5, 0.0,      0.0,0.0,0.5,
                    0.0, 0.5, 0.5,      0.0, 0.5, 0.0,      0.0,0.0,0.5,
                    // Right
                    0.5, 0.0, 0.0,      0.5, 0.5, 0.0,      0.5,0.0,0.5,
                    0.5, 0.5, 0.5,      0.5, 0.5, 0.0,      0.5,0.0,0.5,
                    // Front pyramid
                    0.25, 0.25, 0.75,   0.5, 0.5, 0.5,      0.5, 0.0, 0.5, 
                    0.25, 0.25, 0.75,   0.5, 0.5, 0.5,      0.0, 0.5, 0.5, 
                    0.25, 0.25, 0.75,   0.0, 0.0, 0.5,      0.5, 0.0, 0.5, 
                    0.25, 0.25, 0.75,   0.0, 0.0, 0.5,      0.0, 0.5, 0.5, 
                    // Back pyramid
                    0.25, 0.25, -0.25,   0.5, 0.5, 0.0,      0.5, 0.0, 0.0, 
                    0.25, 0.25, -0.25,   0.5, 0.5, 0.0,      0.0, 0.5, 0.0, 
                    0.25, 0.25, -0.25,   0.0, 0.0, 0.0,      0.5, 0.0, 0.0, 
                    0.25, 0.25, -0.25,   0.0, 0.0, 0.0,      0.0, 0.5, 0.0 
                ] },
                vnormal : {numComponents:3, data: [
                    // Bottom 
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    // Top
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    // Left
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    // Right
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    // Front pyramid
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    // Back pyramid
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0,
                    0.0, 0.0, 0.0,      0.0, 0.0, 0.0,     0.0, 0.0, 0.0
                ]},

            };
            copterBodyBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            
            // Wings
            var rarrays = {
                vpos : {numComponents:3, data: [
                    0.0, 0.3, 0.25,     -1.0, 0.3, -0.5,      -1.0, 0.3, 1.0,
                    0.5, 0.3, 0.25,     1.5, 0.3, -0.5,        1.5, 0.3, 1.0
                ]},
                vnormal : {numComponents:3, data: [
                    0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0
                ]}
            };
            copterRotorBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,rarrays);
        }
        // put the helicopter on a random helipad
        // see the stuff on helicopter behavior to understand the thing
        this.lastPad = randomHelipad();
        this.position = twgl.v3.add(this.lastPad.center(),[0,.5+this.lastPad.helipadAltitude,0]);
        this.state = 0; // landed
        this.wait = getRandomInt(250,750);
        this.lastTime = 0;

    };
    Copter.prototype.draw = function(drawingState) {
        // make the helicopter fly around
        // this will change position and orientation
        advance(this,drawingState);

        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.rotationY(this.orientation);
        twgl.m4.scale(modelM,[0.125,0.125,0.125],modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var leftwings = twgl.m4.rotationZ(this.angle*Math.PI/180);
        var rightwings = twgl.m4.rotationZ(-this.angle*Math.PI/180);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        
        if (this.angle > 30){
            this.direction = -1;
        }
        if (this.angle < -30){
            this.direction = 1;
        }
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, leftmovewings: leftwings, rightmovewings: rightwings});
        twgl.setBuffersAndAttributes(gl,shaderProgram,copterBodyBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, copterBodyBuffers);
        twgl.setBuffersAndAttributes(gl,shaderProgram,copterRotorBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, copterRotorBuffers);
        this.angle = this.angle + 1*this.direction;
        
    };
    Copter.prototype.center = function(drawingState) {
        return this.position;
    }


    ///////////////////////////////////////////////////////////////////
    // Helicopter Behavior
    //
    // the guts of this (the "advance" function) probably could
    // have been a method of helicopter.
    //
    // this is all kept separate from the parts that draw the helicopter
    //
    // the idea is that
    // the helicopter starts on a helipad,
    // waits some random amount of time,
    // takes off (raises to altitude),
    // picks a random helipad to fly to,
    // turns towards that helipad,
    // flies to that helipad,
    // lands
    //
    // the helicopter can be in 1 of 4 states:
    //      landed  (0)
    //      taking off (1)
    //      turning towards dest (2)
    //      flying towards dest (3)
    //      landing (4)


    ////////////////////////
    // constants
    var altitude = 7;
    var verticalSpeed = 15 / 1000;      // units per milli-second
    var flyingSpeed = 3/1000;          // units per milli-second
    var turningSpeed = 40/1000;         // radians per milli-second
    // utility - generate random  integer
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // find a random helipad - allow for excluding one (so we don't re-use last target)
    function randomHelipad(exclude) {
        var helipads = grobjects.filter(function(obj) {return (obj.helipad && (obj!=exclude))});
        if (!helipads.length) {
            throw("No Helipads for the helicopter!");
        }
        var idx = getRandomInt(0,helipads.length);
        return helipads[idx];
    }

    // this actually does the work
    function advance(heli, drawingState) {
        // on the first call, the copter does nothing
        if (!heli.lastTime) {
            heli.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - heli.lastTime;
        heli.lastTime = drawingState.realtime;
        var floatLikeAButterfly = 0;
        // now do the right thing depending on state
        switch (heli.state) {
            case 0: // on the ground, waiting for take off
                if (heli.wait > 0) { heli.wait -= delta; }
                else {  // take off!
                    heli.state = 1;
                    heli.wait = 0;
                }
                break;
            case 1: // taking off
                if (heli.position[1] < altitude) {
                    var up = verticalSpeed * delta;
                    heli.position[1] = Math.min(altitude,heli.position[1]+up);
                } else { // we've reached altitude - pick a destination
                    var dest = randomHelipad(heli.lastPad);
                    heli.lastPad = dest;
                    // the direction to get there...
                    heli.dx = dest.position[0] - heli.position[0];
                    heli.dz = dest.position[2] - heli.position[2];
                    heli.dst = Math.sqrt(heli.dx*heli.dx + heli.dz*heli.dz);
                    if (heli.dst < .01) {
                        // small distance - just go there
                        heli.position[0] = dest.position[0];
                        heli.position[2] = dest.position[2];
                        heli.state = 4;
                     } else {
                        heli.vx = heli.dx / heli.dst;
                        heli.vz = heli.dz / heli.dst;
                    }
                    heli.dir = Math.atan2(heli.dx,heli.dz);
                    heli.state = 2;
                }
                break;
            case 2: // spin towards goal
                var dtheta = heli.dir - heli.orientation;
                // if we're close, pretend we're there
                if (Math.abs(dtheta) < .01) {
                    heli.state = 3;
                    heli.orientation = heli.dir;
                }
                var rotAmt = turningSpeed * delta;
                if (dtheta > 0) {
                    heli.orientation = Math.min(heli.dir,heli.orientation+rotAmt);
                } else {
                    heli.orientation = Math.max(heli.dir,heli.orientation-rotAmt);
                }
                break;
            case 3: // fly towards goal
                if (heli.dst > .01) {
                    var go = delta * flyingSpeed;
                    // don't go farther than goal
                    go = Math.min(heli.dst,go);
                    heli.position[0] += heli.vx * go;
                    heli.position[2] += heli.vz * go;
                    // Fix this equation
                    heli.position[1] = Math.abs(Math.sin(floatLikeAButterfly*Math.PI/180)*altitude*0.25) + altitude;
                    floatLikeAButterfly += 4;
                    heli.dst -= go;
                } else { // we're effectively there, so go there
                    heli.position[0] = heli.lastPad.position[0];
                    heli.position[2] = heli.lastPad.position[2];
                    heli.state = 4;
                }
                break;
            case 4: // land at goal
                floatLikeAButterfly = 0;
                var destAlt = heli.lastPad.position[1] + .5 + heli.lastPad.helipadAltitude;
                if (heli.position[1] > destAlt) {
                    var down = delta * verticalSpeed;
                    heli.position[1] = Math.max(destAlt,heli.position[1]-down);
                } else { // on the ground!
                    heli.state = 0;
                    heli.wait = getRandomInt(500,1000);
                }
                break;
        }
    }
})();

// normally, I would put this into a "scene description" file, but having
// it here means if this file isn't loaded, then there are no dangling
// references to it

// make the objects and put them into the world
// note that the helipads float above the floor to avoid z-fighting
var numberOfButterflies = 50;
for (var i = 0; i < numberOfButterflies; i++){
    grobjects.push(new Copter());
}