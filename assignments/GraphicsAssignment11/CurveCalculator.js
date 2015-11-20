var CurveCache = undefined;
(function() {
	CurveCache = function CurveCache() {
    	"use strict";
		this.controlPoints = [];
		this.samples = [] ;
	 }

	// Do the calculations to get everything sampled.
	CurveCache.prototype.resample = function(drawType){
		
		console.log(drawType)
		switch(drawType) {
			case 1:
				this.calculateBezierConnection();
				break;
			case 2:
				this.calculateCardinalSpline();
				break;
			default: 
				this.calculateLineConnection();
				break;
		}
	}
	
	CurveCache.prototype.clearSamplesAndSetControlPoints = function(){
		this.samples = [];
		// X
		this.x0 = this.controlPoints[0][0]
		this.x1 = this.controlPoints[1][0]
		this.x2 = this.controlPoints[2][0]
		this.x3 = this.controlPoints[3][0]
		// Y
		this.y0 = this.controlPoints[0][1]
		this.y1 = this.controlPoints[1][1]
		this.y2 = this.controlPoints[2][1]
		this.y3 = this.controlPoints[3][1]
	}
	CurveCache.prototype.calculateLineConnection = function(){
		this.clearSamplesAndSetControlPoints()
		this.samples = this.controlPoints;
	}
	
	CurveCache.prototype.calculateCubicBezierConnection = function() {
		this.clearSamplesAndSetControlPoints();
		// Resolution
		var sampleSize = 0.001;
		for (var t = 0; t <= 1; t = t + sampleSize){
			this.samples.push(this.getCubicBezierPoint(t));
		}
	}
	
	// Return the position of a given t
	CurveCache.prototype.getCubicBezierPoint = function(t) {
		//t = t/4.0;
		var xCoord = (1-t)*(1-t)*(1-t)*this.x0 + 3*(1-t)*(1-t)*t*this.x1 + 3*(1-t)*t*t*this.x2 + t*t*t*this.x3;
		var yCoord = (1-t)*(1-t)*(1-t)*this.y0 + 3*(1-t)*(1-t)*t*this.y1 + 3*(1-t)*t*t*this.y2 + t*t*t*this.y3;
		return [xCoord,yCoord];
	}
	
	CurveCache.prototype.calculateCardinalSpline = function() {
		this.clearSamplesAndSetControlPoints();
		this.calculateSplineBetweenPoints(this.controlPoints[3],this.controlPoints[0],this.controlPoints[1],this.controlPoints[2]);
		this.calculateSplineBetweenPoints(this.controlPoints[0],this.controlPoints[1],this.controlPoints[2],this.controlPoints[3]);
		this.calculateSplineBetweenPoints(this.controlPoints[1],this.controlPoints[2],this.controlPoints[3],this.controlPoints[0]);
		this.calculateSplineBetweenPoints(this.controlPoints[2],this.controlPoints[3],this.controlPoints[0],this.controlPoints[1]);
	};
	
	CurveCache.prototype.oneCoordSpline = function(t, p1,p2,p3,p4){
			var v1 =(-p1 + 3*p2 -3*p3 + p4)*t*t*t;
			var v2 = (2*p1 -5*p2 + 4*p3 - p4)*t*t;
			var v3 = (-p1+p3)*t;
			var v4 = 2*p2;
			return 0.5*(v1+v2+v3+v4);
	};
	
	CurveCache.prototype.calculateSplineBetweenPoints = function(p1,p2,p3,p4) {
		var sampleSize = 0.001;
		for (var t = 0; t < 1; t = t + sampleSize){
			var x = this.oneCoordSpline(t,p1[0],p2[0],p3[0],p4[0]);
			var y = this.oneCoordSpline(t,p1[1],p2[1],p3[1],p4[1]);
			this.samples.push([x,y]);
		}
	};
	
	CurveCache.prototype.getLocation = function(t,p1,p2,p3,p4){
			var x = this.oneCoordSpline(t,p1[0],p2[0],p3[0],p4[0]);
			var y = this.oneCoordSpline(t,p1[1],p2[1],p3[1],p4[1]);
			return [x,y];
	};
	
	CurveCache.prototype.getSplineBetweenPoints = function(t) {
		if (!(t >= 1)){
			return this.getLocation(t,this.controlPoints[3],this.controlPoints[0],this.controlPoints[1],this.controlPoints[2]);
		} else if(!(t >= 2)){
			t = t - 1;
			return this.getLocation(t,this.controlPoints[0],this.controlPoints[1],this.controlPoints[2],this.controlPoints[3]);
		} else if(!(t >= 3)){
			t = t - 2;
			return this.getLocation(t,this.controlPoints[1],this.controlPoints[2],this.controlPoints[3],this.controlPoints[0]);
		} else{
			t = t-3;
			return this.getLocation(t,this.controlPoints[2],this.controlPoints[3],this.controlPoints[0],this.controlPoints[1]);
		}
	};
	
	CurveCache.prototype.eval = function(t, drawType) {
		
			switch(drawType) {
				case 1:
					console.log("using bezier");
					return this.getCubicBezierPoint(t);
					break;
				case 2:
					var answer = this.getSplineBetweenPoints(t);
					return this.getSplineBetweenPoints(t);
					break;
				default: 
					console.log("Using default resmapler");
					break;
		}
	}
})();