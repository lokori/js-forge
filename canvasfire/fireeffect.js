// Copyright Antti "lokori" Virtanen 2012.

var fire = (function() {
	var colrs = new Array();
	var randoms = new Array();
	var rndi = 0;
	var temps;
	
	return { 
	    precalc: function() {
		var i = 0;
		for (i = 0; i<255; i++) {
		    var col = {r: i >> 2, g:i >> 2, b:0};
		    colrs[i] = col;
		}
		for (i=0; i<=64; i++) {
		    var col={r:64 + (i*3), g:64, b:0};
		    colrs[i+255] = col;
		}
		for (i=0; i<=64; i++) {
		    var col={r:255, g:64 + (i*3), b:0};
		    colrs[i+255+64] = col;
		}
		for (i=0; i<=255; i++) {
		    var col={r:255, g:255, b:i>>1};
		    colrs[i+255+64+64] = col;
		}

		for (i=0; i<4096; i++) {
		    randoms[i] = Math.floor((0.5-Math.random())*16);
		}
	    }, 
		
	    render: function(currentFrame, canvasData) {
		var width=canvasData.width;
		var height=canvasData.height;
		if (temps === undefined) { // first time..
		    temps = new Array();
		    var ti =0;
		    for (var i=0; i<height+3; i++) { // two extra
			for (var j=0; j<width; j++) {
			    temps[ti] = 120; // init to 120
			    ti++;
			}
		    }

		}

		// plot
		var y = height;
		var idx = 0;
		var ti = 0;
		var col;
		var v;
		var x;

		// plot spectrum
		for (y =0; y<20; y++) {
		    idx = y * width * 4;
		    for (x=0; x<512; x++) {
			col = colrs[x];
			if (col === undefined) 
			    col={r:0, g:0, b:255};
			canvasData.data[idx] = col.r;
			canvasData.data[++idx] = col.g;
			canvasData.data[++idx] = col.b;
			canvasData.data[++idx] = 255;
			idx++;
		    }
		}

		
		idx = width*20*4;
		y = (height-20)*width;
		ti = width*20;
		rndi = Math.floor(Math.random()*4095);
		var col;
		do {
		    col = colrs[temps[ti]];
		    v = temps[ti] + temps[ti+width] + temps[ti+width-1] + temps[ti+width+1]+
			randoms[rndi++];
		    rndi = rndi & 4095; // voi eliminoida riittävän isolla random-taulukolla tapahtuvaksi kerran framessa
		    v = v < 0 ? 0 : v; // oikeasti mahdollista vain yläosassa
		    temps[ti] = v >> 2;
		    
		    canvasData.data[idx] = col.r;
		    canvasData.data[++idx] = col.g;
		    canvasData.data[++idx] = col.b;
		    canvasData.data[++idx] = 255;
		    idx++;
		    ti++;
		} while (--y);

		
		// new random source
		ti = width*height+1;
		for (var i=0; i<width; i++) {
		    temps[ti] = Math.random()*255 + 255;
		    ti++;
		}
	    }}
    })();


