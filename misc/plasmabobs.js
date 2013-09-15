// k3wlc00l experiment

//  http://hacks.mozilla.org/2009/06/pushing-pixels-with-canvas/
// http://blog.nihilogic.dk/2008/03/canvas-3d-renderer.html
// http://www.brighthub.com/hubfolio/matthew-casperson/blog/archive/2009/06/29/game-development-with-javascript-and-the-canvas-element.aspx

// Copyright Antti "lokori" Virtanen 2012

// target frames per second
const FPS = 30;
const SECONDSBETWEENFRAMES = 1 / FPS;
var canvas = null;
var context = null;
var currentTime = 0;
var canvasData = null; 
var currentFrame = 4;
window.onload = init;

var preSin = new Array(); // sin precalc
var sqX = new Array(); // x squared
var sqY = new Array(); // y squared
var brushMap = new Array(); // paintbrush, make it 32x32, intensity map - not color

var renderInProgress = false;
var height = 400;
var width = 600;

var brushObj = new Object();
brushObj.moveBrush = moveBrush;
brushObj.initBrush = initBrush;
brushObj.initBrush(40, 40, 1, 1);
brushObj.brush = brushMap;

var anotherBrush = new Object();
anotherBrush.moveBrush = moveBrushPull;
anotherBrush.initBrush = initBrush;
anotherBrush.initBrush(80, 80, -1, -1);
anotherBrush.brush = brushMap;

var bobs = new Array(); // put the shadebobs here
bobs[0] = brushObj;
bobs[1] = anotherBrush;

function initBrush(startx, starty, startyd, startxd) {
    this.brushx = startx;
    this.brushy = starty;
    this.brushyd = startyd;
    this.brushxd = startxd;
}

// pull force towards brushObj
function moveBrushPull() {
    var x = brushObj.brushx;
    var y = brushObj.brushy;
    // move the brush
    this.brushy = this.brushy+this.brushyd;
    this.brushx = this.brushx+this.brushxd;
  
    var dist = Math.sqrt((x-this.brushx)*(x-this.brushx) + (y-this.brushy)*(y-this.brushy));
    this.brushyd = this.brushyd + ((y-this.brushy)/dist); // normalized pull
    this.brushxd = this.brushxd + ((x-this.brushx)/dist); //

    this.brushyd = this.brushyd * 0.97; // dampening, there is resistance in this space
    this.brushxd = this.brushxd * 0.97; // dampening

    if (this.brushy > (height-32)) {
	this.brushy = height-32;
    }
    if (this.brushx > (width -32)) {
	this.brushx = width -32;
    }
    if (this.brushy < 1) {
	this.brushy = 0;
    }
    if (this.brushx < 1) {
	this.brushx = 0;
    }
}

// falling and bouncing
function moveBrush() {
  // move the brush
  this.brushy = this.brushy+this.brushyd;
  this.brushx = this.brushx+this.brushxd;
  this.brushyd = this.brushyd + 0.3; // gravity pull
  if (this.brushy > (height-32)) {
      this.brushyd = -Math.random()*13 -2; // random velocity for bounce
      this.brushy = height-32;
  }
  if (this.brushx > (width -32)) {
      this.brushxd = -Math.random()*2-1;
      this.brushx = width -32;
  }
  if (this.brushy < 1) {
      this.brushy = 0;
  }
  if (this.brushx < 1) {
      this.brushxd = Math.random()*2+1;
      this.brushx = 0;
  }
}

function brushToCanvas(brushObj, canvasData) {
  var idx = 0;
  var bo = 0;
  for (var y=0; y<32; y++) {
      idx = (brushObj.brushx >> 0)*4 + y*width*4 + ((brushObj.brushy >> 0) * width*4); // TODO: shl
      for (x=0; x<32; x++) {
	  canvasData.data[idx+1] = (canvasData.data[idx+1] + brushObj.brush[bo]);
	  if (canvasData.data[idx+1] > 255) canvasData.data[idx+1] = 255; // TODO: not good
	  bo++;
	  idx = idx + 4;
      }
  }
}


function precalcBrush() {
    var i = 0;
    var j = 0;
    // make 32x32 circle
    for (i = 0; i<16; i++) {
	for (j = 0; j<16; j++) {
	    brushMap[i*32+j] = Math.sqrt(i*i + j*j);
	    brushMap[i*32+31-j] = brushMap[i*32+j]; // mirror 
	    brushMap[31*32-i*32+j] = brushMap[i*32+j]; // mirror
	    brushMap[31*32-i*32+31-j] = brushMap[i*32+j]; // mirror
	}
    }
}

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
	// precalc
	var i = 0;
	for (i = 0; i<4096; i++) {
	    preSin[i] = (((Math.sin(i*Math.PI/256) + 1) / 2) * 256) >> 0; // 512 full circle, 256 max, integers
	}
	for (i = 0; i<height; i++) {
	    sqY[i] = ((i/height) * (i/height) * 256) >> 0;
	}
	for (i = 0; i<width; i++) {
	    sqX[i] = ((i/width) * (i/width) * 256) >> 0;
	}
	precalcBrush();
	clearCanvas();
	alert("everything ok, precalc done " );
	setInterval(draw, SECONDSBETWEENFRAMES * 1000);
}

function draw()
{
  currentTime += SECONDSBETWEENFRAMES;
  currentFrame = currentFrame + 1;
  for (var i =0; i<bobs.length; i++) {
      bobs[i].moveBrush();
  }
  renderCanvas();
  context.putImageData(canvasData, 0, 0);
}

function clearCanvas() {
    for (var ofs = 0; ofs<height*width; ofs++) {
	canvasData.data[ofs*4] = 0;
	canvasData.data[ofs*4+1] = 0;
	canvasData.data[ofs*4+2] = 0;
	canvasData.data[ofs*4+3] = 255; // alpha channel, not transparent
    }
}

// just like the good old days?
function renderCanvas() {
  if (renderInProgress) {
    return;
  }
  renderInProgress = true;
  var idx = 0;
  var ny = 0;
  var nyF = 0;
  var x = 0;
  for (var y = 0; y < height; y++)  {
    ny = y/height;
    nyF = ny * currentFrame;
     for (x = 0; x < width; x++)  {
	 canvasData.data[idx] = ((preSin[(currentFrame + y) & 4095] + preSin[(x + currentFrame ) & 4095]) >> 1) ^ ((x + y + currentFrame) & 255); // Red channel
	 if (canvasData.data[idx+1] > 0) canvasData.data[idx+1] = canvasData.data[idx+1]-1;
	 idx = idx + 4;
    }
  }
  for (var i=0; i<bobs.length; i++) {
      brushToCanvas(bobs[i], canvasData);
  }
  renderInProgress = false;
}

