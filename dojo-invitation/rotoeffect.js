// Copyright Antti "lokori" Virtanen 2012.

var rotator = (function() {
	var preSin = new Array();
	var sin10buf = new Array();
	var cos10buf = new Array();
	var sin2buf = new Array();
	var cos2buf = new Array();
	var idx = 0; // source
	var ti = 0; // target
	var zoom, cosa, sina;
	var dy, dx;
	var sty = 0;
	var stx = 0;
	var sx = 0;
	var sy = 0;
	
	return { 
	    precalc: function() {
		var i = 0;
		for (i = 0; i<4096; i++) {
		    preSin[i] = (((Math.sin(i*Math.PI/256) + 1) / 2) * 256); // 512 full circle, 0..256, not integers
		}
	    }, 
		
		// rotozoomer with a twist, not so optimized
		render_twist: function(currentFrame,canvasData,imgData) {
		var idx = 0; // source
		var ti = 0; // target
		var zoom = (preSin[currentFrame & 511] / 64) + 0.1;
		var cosa = preSin[(currentFrame+128) & 511] / 128 -1;
		var sina = preSin[currentFrame & 511] / 128 -1;
		var dy = sina * zoom + 256; // -1 == 255, 0 == 256, 1 == 257. very handy
		var dx = cosa * zoom + 256; 
		var sdy = cosa * zoom + 256;  
		var sdx = -sina * zoom + 256;
		var orgsdy = sdy;
		var orgsdx = sdx;
		var orgdx = dx;
		var orgdy = dy;
		var sty = 0;
		var stx = 0;
		var sx = 0;
		var sy = 0;
		var height = canvasData.height;
		var width = canvasData.width;

		// TODO: voisi valmiiksi laskea cosa * zoom * n ja käyttää tätä molemmissa loopeissa indeksoimalla
		// sama sin

		for (var y = 0; y < height-50; y++)  {
		    sy = sty;
		    sx = stx;
		    for (var x = 0; x < width; x++)  {
			idx = ((((sy >> 0) & 255) << 8) + ((sx >> 0) & 255)) << 2;
			canvasData.data[ti] = imgData.data[idx];
			canvasData.data[ti +1] = imgData.data[idx+1];
			canvasData.data[ti +2] = imgData.data[idx+2];
			canvasData.data[ti +3] = 255; // Alpha channel, not transparent
			ti = ti + 4;
			sy = sy + dy; // y = sin(x) + sty == sin(x) + cos(y)
			sx = sx + dx; // x = cos(x) + stx == cos(x) - sin(y)
			dy = orgdy + (x/width);  // TODO: yea yea precalc
			dx = orgdx + (x/width);
		    }
		    sty = sty + sdy;
		    stx = stx + sdx;
		    sdy = orgsdy + (y/height);
		    sdx = orgsdx + (y/height);
		}
	    },

		// very optimized rotozoomer.. 
	    render: function(currentFrame, canvasData, imgData) {
		var width=canvasData.width;
		var height=canvasData.height;
		idx = -1; // source
		ti = -1; // target
		zoom = (preSin[currentFrame & 511] / 64) + 0.1;
		cosa = preSin[(currentFrame+128) & 511] / 128 -1;
		sina = preSin[currentFrame & 511] / 128 -1;
		dy = sina * zoom + 256; // -1 == 255, 0 == 256, 1 == 257. very handy
		dx = cosa * zoom + 256; 
		sty = 0;
		stx = 0;
		sx = 0;
		sy = 0;
		var cosbuf; var sinbuf;
		for (var i=0; i<width; i++) {
		    sinbuf = sy >> 0; // i* dy = i * cos(a) * zoom
		    cosbuf = sx >> 0; // i* dx = i * sin(a) * zoom
		    cos10buf[i] = cosbuf << 10;
		    sin10buf[i] = sinbuf << 10;
		    cos2buf[i] = cosbuf << 2;
		    sin2buf[i] = sinbuf << 2;

		    sx = sx + dx;
		    sy = sy + dy;
		}
		sx = 0;
		sy = 0;
	       
		var y = height-50;
		var id = imgData.data;
		var cd = canvasData.data;
		var x = width;
		do {
		    x = width;
		    do {
			idx = ((sty + sin10buf[x]) & 0x3fc00) // 3fc == 0xff00 << 2
			    + ((stx + cos2buf[x]) & 0x3fc);
			// idx = ((y'*img_width)+x')*4.. no shl here buhaha
			cd[++ti] = id[idx++];
			cd[++ti] = id[idx];
			cd[++ti] = id[++idx];
			cd[++ti] = 255; // Alpha channel, not transparent
		    } while (--x);
		    sty = cos10buf[y];
		    stx = -sin2buf[y];
		} while (--y);

	    }}
    })();


