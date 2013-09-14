// Copyright Antti "lokori" Virtanen 2012.

var canvas = null;
var context = null;
var canvasData = null; 
window.onload = init;

function init()
{
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

    clear(canvasData, 0, 0, 0, 255);
    
    draw();
    // setInterval(draw, SECONDSBETWEENFRAMES * 1000);
    // renderInProgress = false;
}

// target frames per second
// const FPS = 28;
// const SECONDSBETWEENFRAMES = 1 / FPS;
// var currentFrame = 4;
// var renderInProgress = true;

function draw()
{
    //    currentFrame = currentFrame + 1;
    //    if (!renderInProgress) {
    //  renderInProgress = true;
      pikseloi();
      context.putImageData(canvasData, 0, 0);
      //   fpsTimer.refreshFps();
      //   renderInProgress = false;
      //  }
    /*
  context.font="16px bold sans-serif";
  context.fillStyle="#ff0000";
  context.fillText(" fps " + fpsTimer.getFps(), 300, canvasData.height-30);
    */
}

function pikseloi() {
    for (var i=0; i<1000; i++) {
	var x = Math.floor(Math.random() * canvasData.width);
	var y = Math.floor(Math.random() * canvasData.height);
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	putpixel(x,y,r,g,b);
    }
}

function putpixel(x,y,r,g,b) {
    canvasData.data[(canvasData.width*y + x) * 4] = r;
    canvasData.data[(canvasData.width*y + x) * 4+1] = g;
    canvasData.data[(canvasData.width*y + x) * 4+2] = b;
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

