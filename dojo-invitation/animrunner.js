// Copyright Antti "lokori" Virtanen 2012.

// target frames per second
const FPS = 28;
const SECONDSBETWEENFRAMES = 1 / FPS;

var canvas = null;
var context = null;
var canvasData = null; 
var currentFrame = 4;
window.onload = init;

var renderInProgress = true;

var img;
var imgCanvas;
var imgData;

var lastFlash = new Date();
var algo = effect.render;

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
    pixelLoad();
    // clear canvas -> no need to set alpha in every frame
    // paitsi ettei toimi.. nollaantuu jostain syystä..
    for (var ti=0; ti<canvas.width*canvas.height; ti++) {
	canvasData.data[ti] = 0;
	canvasData.data[ti+1] = 0;
	canvasData.data[ti+2] = 0;
	canvasData.data[ti+3] = 255; // alpha, not transparent
    }

    // thunderbirds are go
    soundize();
    setInterval(draw, SECONDSBETWEENFRAMES * 1000);
    renderInProgress = false;
}

// setup base image for rotation etc
function pixelLoad() {
    imgCanvas = document.createElement("canvas");
    imgCanvas.width = 256;
    imgCanvas.height = 256;
    effect.precalc();
    var ctx = imgCanvas.getContext("2d");
    imgData = ctx.getImageData(0,0,256,256);
}

// very very simple and lame writer
function putText(elapsedms) {
    var ctx = imgCanvas.getContext("2d");
    var ind = Math.floor(elapsedms / 4000);
    switch(ind) {
    case 1: 
	ctx.font = "32px bold sans-serif";
	ctx.fillStyle="#f050ff";
	ctx.fillText("Greetings to all", 30, 90);
	imgData = ctx.getImageData(0,0,256,256);
	break;
    case 2:
	ctx.font="18px bold sans-serif";
	ctx.fillStyle="#f050af";
	ctx.fillText("Programming Motherfuckers(Tm)",10, 140);
	imgData = ctx.getImageData(0,0,256,256);
	break;
    case 3:
	ctx.font="16px bold sans-serif";
	ctx.fillStyle="#8050af";
	ctx.fillText("(Fuckings to lamers)", 10, 190);
	imgData = ctx.getImageData(0,0,256,256);
	break;
    case 0:
	ctx.font="20px bold sans-serif";
	ctx.fillStyle="#f050ff";
	ctx.fillText("Solita Democoding Dojo", 10, 40);
	imgData = ctx.getImageData(0,0,256,256);
	break;
    }
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

var soundIndex=0;
// very simple "player" and "synthezizer"
function soundize() {
    var data = []; // just an array    
    for (var i=0; i < 11025*10; i++) {
	var t = i + soundIndex;
	t = (t+(t>>2)|(t>>5))+(t>>3)|((t>>13)|(t>>7)|(t>>11));
	data[i] = t & 255;
    }
    soundIndex = soundIndex + 11025*10;
    if (soundIndex > (11025 * 70)) {
	soundIndex = 0; // loop to start
    }
    var wave = new RIFFWAVE(data); // create the wave file
    wave.header.sampleRate = 11025; //  8KHz
    wave.header.numChannels = 1; // mono
    wave.header.bitsPerSample = 8;

    var audio = new Audio(wave.dataURI); // create the HTML5 audio element
    audio.addEventListener('ended', soundize);  // make more lame noise when this crap ends
    audio.play(); // some noise
}

function draw()
{
  currentFrame = currentFrame + 1;
  if (!renderInProgress) {
      renderInProgress = true;
      var now = new Date();
      if ((now-lastFlash) > 900) { // lame flash 900ms
	  lastFlash = now;
	  clear(canvasData,0xff,0xff,0xff,0xff);
	  putText(fpsTimer.elapsed());
	  if (fpsTimer.elapsed() > 20000) algo = effect.render_twist; // 20sek -> pimp rotator 
      } else {
	  algo(currentFrame, canvasData, imgData);
      }
      context.putImageData(canvasData, 0, 0);
      fpsTimer.refreshFps();
      renderInProgress = false;
  }
  context.font="16px bold sans-serif";
  context.fillStyle="#ff0000";
  context.fillText(" fps " + fpsTimer.getFps(), 300, canvasData.height-30);
}
