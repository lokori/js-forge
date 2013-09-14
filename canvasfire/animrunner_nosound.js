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

function init()
{
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
    effect.precalc();

    // thunderbirds are go
    setInterval(draw, SECONDSBETWEENFRAMES * 1000);
    renderInProgress = false;
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


function draw()
{
  currentFrame = currentFrame + 1;
  if (!renderInProgress) {
      renderInProgress = true;
      var now = new Date();
      effect.render(currentFrame, canvasData);
      context.putImageData(canvasData, 0, 0);
      fpsTimer.refreshFps();
      renderInProgress = false;
  }
  /*
  context.font="16px bold sans-serif";
  context.fillStyle="#ff0000";
  context.fillText(" fps " + fpsTimer.getFps(), 300, canvasData.height-30);
  */
}
