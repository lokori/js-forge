// Copyright Antti "lokori" Virtanen 2009.

// testing javascript + 2dcanvas and cubic interpolation
// so many ways to fit a smooth curve in some data. This cubic interpolation thing is one.

// target frames per second
const FPS = 15;
const SECONDSBETWEENFRAMES = 1 / FPS;
var canvas = null;
var context = null;
var currentTime = 0;
var canvasData = null; 
var currentFrame = 0;
window.onload = init;

var renderInProgress = false;
var brushX = 0;
var brushY = 0;
var sortedPoints = 0;
var pointNow = null;

function init()
{
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    // the firefox 3.5 way: 
    if (context.createImageData != null) {
	canvasData = context.createImageData(canvas.width, canvas.height);
	//	alert("new canvasdata creation method ok, " + canvas.width + " x " + canvas.height + " created");
    } else {
	// the old way - perhaps this sucks, don't know..
	canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    sortedPoints = randomPoints(canvas.width/2, canvas.height, 15);
    //    for (var i=0; i<15; i = i+1) { // vertical distribute evenly
    //	sortedPoints[i].y = ((canvas.height/15)*i) >> 0;
    //    }
    sortedPoints[16] = new Point(0,0);	
    sortedPoints.sort(sortY);
    pointNow = 0;
    setInterval(draw, SECONDSBETWEENFRAMES * 1000);
}

function Point(x,y) {
    this.x = x;
    this.y = y;
}

function randomPoint(maxX,maxY) {
    var p = new Point((Math.random()*maxX) >> 0, (Math.random() * maxY) >> 0);
    return p;
}

function randomPoints(maxX, maxY, amount) {
    var p = new Array();
    var i = 0;
    for (i =0; i<amount; i++) {
	var po = randomPoint(maxX, maxY);
	p[i] = po;
    }
    return p;
}

function sortY(a, b) {
    return a.y - b.y;
} 


function draw()
{
  currentTime += SECONDSBETWEENFRAMES;
  currentFrame = currentFrame + 1;
  hinkkaa();
  context.putImageData(canvasData, 0, 0);
}

function putpixel(x, y, r, g, b, a) {
    var ofs  = x*4 + y*4*canvas.width;
    canvasData.data[ofs] = r;
    canvasData.data[ofs + 1] = g;
    canvasData.data[ofs + 2] = b;
    canvasData.data[ofs + 3] = a;
}

// no bresenham here now duh :( 
function line(x, y, x1, y1, r, g, b, a) {	
    var dx = x1-x;
    if ((y1-y) != 0) {
	dx = (x1-x) / Math.abs(y1-y);
    } 
    var bx = x >> 0;
    var by = y >> 0;
    var rx = x + dx;
    if (y < y1) {
	do {
	    putpixel(bx,by,r,g,b,a);
	    if (x < x1) { 
		for (bx = bx; bx < rx; bx = bx +1) {
		    putpixel(bx, by, r, g, b, a);
		}
	    } else if (x > x1) {
		for (bx = bx; bx > rx; bx = bx -1) {
		    putpixel(bx, by, r, g, b, a);
		}
	    }
	    rx = rx + dx;
	    by = by + 1;
	} while (by < y1);
    } else { // y >= y1
	do {
	    if (x < x1) {
		for (bx = bx; bx < rx; bx = bx +1) {
		    putpixel(bx, by, r, g, b, a);
		}
	    } else if (x > x1) {
		for (bx = bx; bx > rx; bx = bx -1) {
		    putpixel(bx, by, r, g, b, a);
		}
	    }
	    rx = rx + dx;
	    by = by - 1;
	} while (by > y1);
    }
}

function CubicInterpolate(y0, y1, y2, y3, mu)
{
    var mu2 = mu*mu;
    var a0 = y3 - y2 - y0 + y1;
    var a1 = y0 - y1 - a0;
    var a2 = y2 - y0;
    var a3 = y1;
    return(a0*mu*mu2+a1*mu2+a2*mu+a3);
}


function hinkkaa() {
  if (renderInProgress) {
    return;
  } 
  renderInProgress=true; 
  // straight lines for reference 
  for (var skit = 0; skit < 14; skit = skit +1) {
      line(sortedPoints[skit].x + canvas.width >> 1 , sortedPoints[skit].y, sortedPoints[skit +1].x + canvas.width >> 1, sortedPoints[skit +1].y, 
	   0, 0, 0, 80);
  }
  var elapsed = 1;
  if (sortedPoints[pointNow].y != sortedPoints[pointNow+1].y) {
      elapsed = (brushY-sortedPoints[pointNow].y) / (sortedPoints[pointNow+1].y - sortedPoints[pointNow].y);
  }
  var newX = 0;
  if ((pointNow < 14) && (pointNow > 1)) { // cubic now that we have the end-points covered
      newX = CubicInterpolate(sortedPoints[pointNow-1].x, sortedPoints[pointNow].x, sortedPoints[pointNow+1].x, sortedPoints[pointNow+2].x, elapsed);
  } else {
      // 0 <=  elapsed <= 1, for straight line
      var mu2 = (1 - Math.cos(elapsed * Math.PI))/2; // cosine interpolation
      newX = sortedPoints[pointNow].x + ((sortedPoints[pointNow+1].x - sortedPoints[pointNow].x)*mu2); 
  }

  newX = newX >> 0; // to int 
  var idx  = brushX*4 + brushY * 4 * canvas.width;
  if (newX > brushX) { 
      for (brushX = brushX; brushX <= newX; brushX = brushX + 1) {
	  canvasData.data[idx] = 255;
	  canvasData.data[idx + 1] = 0;
	  canvasData.data[idx + 2] = 0;
	  canvasData.data[idx + 3] = 255;
	  idx = idx + 4;
      }
  } else { // newX <= brushX      
      for (brushX = brushX; brushX >= newX; brushX = brushX - 1) {
	  canvasData.data[idx] = 255;
	  canvasData.data[idx + 1] = 0;
	  canvasData.data[idx + 2] = 0;
	  canvasData.data[idx + 3] = 255;
	  idx = idx - 4;
      }
  }
  if (brushY >= sortedPoints[pointNow + 1].y) {
      pointNow = pointNow + 1;
      brushY = sortedPoints[pointNow].y;
      brushX = sortedPoints[pointNow].x;
  }
  if (brushY < sortedPoints[14].y) {
      brushY = brushY + 1;
  }
  renderInProgress = false;
}

