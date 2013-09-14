// co-op @ Solita Coding dojo with noidi
// oldskool lonkero effect 

// verteksin etäisyys lonkeron keskipisteestä
var D = 64;
var STEPS = 256;

var lonkero = (function() {
	var lonkeroIndeksit = new Array();
	var img;
	var imgData;
	var imgCanvas;

	return { 
	    precalc: function() {		
		// kulma ja samalla y
		for (var i = 0; i<STEPS; i++) {
		    var dX = Math.floor(D * Math.cos((i/256)*(2*Math.PI)));
		    lonkeroIndeksit[i] = dX;
		}

		var textureLoad = function() {
		    img = document.getElementById('texture');
		    alert("lonkero texture loaded " + img.width + " / " + img.height);
		    imgCanvas = document.createElement("canvas");
		    imgCanvas.width = img.width;
		    imgCanvas.height = img.height;
		    var ctx = imgCanvas.getContext("2d");
		    ctx.drawImage(img, 0, 0, 256, 256);
		    imgData = ctx.getImageData(0,0,256,256);
		}

		textureLoad();
	    },
		
	    render: function(currentFrame, canvasData) {
		var width=canvasData.width;
		var height=canvasData.height;

		var centerX = canvasData.width / 2;

		var fill = function(y, xl, xr, zl, zr) {
		    var dz = (zr - zl) / (xr - xl);
		    var i = 4 * (y * canvasData.width + centerX + xl);    
		    var yy = y % imgData.height;
		    for (var x = xl, z = zl; x<xr; x++, z+=dz) {
			var ti = 4* (yy*imgData.width+Math.floor(z));
			canvasData.data[i] = imgData.data[ti];
			canvasData.data[i+1] = imgData.data[ti+1];
			canvasData.data[i+2] = imgData.data[ti+2];
			canvasData.data[i+3] = imgData.data[ti+3];
			i += 4;
		    }
		}

		// clearscreen
		clear(canvasData, 0, 0, 0, 255);

		for (var y = 0; y < canvasData.height; y++) {
		    // c:n indeksi lookup-taulussa, vektori aina kohti kameraa
		    var kulma = Math.floor(Math.sin( (currentFrame*4 + y)*0.005 ) * 128 + 128) ;
		    var i = (STEPS / 8) + (kulma % (STEPS / 4));
		    // indeksi puoliympyrään
		    var c = lonkeroIndeksit[i];
		    var r = lonkeroIndeksit[(i + 3*STEPS/4) % STEPS];
		    var l = lonkeroIndeksit[(i + STEPS / 4) % STEPS];
		    fill(y, l, c, 0, 255);
		    fill(y, c, r, 0, 255);
		    //canvasData.data[4*(y * canvasData.width + centerX + l)] = 255;
		    //canvasData.data[4*(y * canvasData.width + centerX + c) + 1] = 255;
		    //canvasData.data[4*(y * canvasData.width + centerX + r) + 2] = 255;
		}
	    }}
    })();


