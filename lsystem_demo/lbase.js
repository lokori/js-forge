/*
    Copyright Antti "lokori" Virtanen 2012.

    Just an experiment with Javascript and L-systems.
    (http://en.wikipedia.org/wiki/L-system)


I was trying to replicate this language in Javascript with minimal code and maintain
a readable DSL like syntax at the same time.

rule fig3 {
fig2 { }
fig2 { flip -90}
fig3 { r 45 x -.75 y -2 s .9 hue 20}
}
 
rule fig2 {
fig1 { }
fig1 { flip -90}
fig2 { r 20 s .9 hue 0}
}
 
rule fig1 {
TRIANGLE { a -.55 hue 2 sat 1}
fig1 { s .94 r 17 x .5 hue 0.1 b .03}
}
*/


var canvas = null;
var context = null;
var canvasData = null; 
window.onload = init;

// l-system engine is here.. it works like this:
// -rules are function pointers
// -rule functions can return arrays of function pointers, single function pointers or null
// -for each generation, engine calls all and pushes results for next generation
// -stops when enough rules have been applied
var shapes = []; 
function makeIt() {
    clear(canvasData,0,0,0,0xff);
    var initiator = function() { return fc(0.5, 0, 0, 128, 0, 128);};
    productionRules[0] = initiator;
    // initial rules set

    var iters = 0;
    while (iters < 10000) {
	   var nextIter = [];
	   var ni = 0;
	   for (var  i=0; i<productionRules.length; i++) {
	    var next = productionRules[i]();
	    if (next != null) {
		  nextIter = nextIter.concat(collapse(next));
	    }
	   }
	   productionRules = nextIter;
	   iters += productionRules.length;
    }
}

// just some basic rules.. the syntax could be improved, perhaps
function fc2(s,x,y,   r,g,b) {
    circle(s,x,y, r,g,b);
      return function() {
	  return fc2(s*0.95, x+0.01, y, 0 , 128 , 255*s);
    }
}

function fc(s,x,y,   r,g,b) {
    circle(s,x,y, r,g,b);
    return function() {
	   return [
		  fc(s*0.95, x+0.01, y, 255*s, (g -1) & 255, b),
		  fc2(s*0.94, x-0.01, y, 255*s, (g -1) & 255, b)
	       ];
    }
}

// a terminal, not expanding production rule
function circle(s,x,y,    r,g,b) {
    context.strokeStyle = "rgba(" + r + "," + g + ", " + b +",1)";
    context.beginPath();
    var ss = canvasData.width/(2*(1/s));
    var xx = canvasData.width/2 + canvasData.width/(1/x);
    var yy = canvasData.height/2 + canvasData.height/(1/y);
    context.arc(xx, yy, ss,  0, Math.PI*2, true);
    context.closePath();
    context.stroke();
}

// blabla boring generic stuff below.. not related to l-systems 



function init()
{
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    // the firefox 3.5 way: 
    if (context.createImageData != null) {
	   canvasData = context.createImageData(canvas.width, canvas.height);
    } else {
	// the old way - perhaps this sucks, don't know..
	   canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    makeIt();
}



function clear(canvasData,r,g,b,a) {
    var ti = canvasData.width*canvasData.height*4;
    do {
    	canvasData.data[--ti] = a;
	   canvasData.data[--ti] = b;
	   canvasData.data[--ti] = g;
	   canvasData.data[--ti] = r;
    } while (ti > 0);
}


// generic array util
function collapse(arr) {
    return collaps(arr, new Array());
}

function collaps(arr, accum) {
    if (!(arr instanceof Array)) {
	   accum.push(arr);
    } else {
	   for (var j=0; j<arr.length; j++) {
	       collaps(arr[j], accum);
	   }
    }
    return accum;
}


