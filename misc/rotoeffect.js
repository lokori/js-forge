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
	var imgDat;
	
	return { 
	    precalc: function(imgDat) {
		var i = 0;
		for (i = 0; i<4096; i++) {
		    preSin[i] = (((Math.sin(i*Math.PI/256) + 1) / 2) * 256); // 512 full circle, 0..256, not integers
		}
		this.imgDat = imgDat;

	    }, 

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


