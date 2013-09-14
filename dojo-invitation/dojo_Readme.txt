Koodin nopeusoptimointi:
  http://www.websiteoptimization.com/speed/10/
  http://codeutopia.net/blog/2009/04/30/optimizing-javascript-for-extreme-performance-and-low-memory-consumption/
  http://www.crowl.org/lawrence/programming/Bentley82.html

Algoritmista grafiikan generointia:
  http://www.contextfreeart.org/
  http://en.wikipedia.org/wiki/L-system
  http://mathworld.wolfram.com/CellularAutomaton.html

Javascript canvas:
  http://thinkvitamin.com/code/how-to-draw-with-html-5-canvas/
  http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
  Kirjastolla: http://www.html5canvastutorials.com/kineticjs/htlm5-canvas-kineticjs-rotation-animation-tutorial/

Javascript:
  http://stackoverflow.com/questions/111102/how-do-javascript-closures-work
  https://developers.google.com/closure/


Asioita jotka olisi hyvä muistuttaa mieleen:
  http://en.wikipedia.org/wiki/Linear_interpolation
  binaarilaskenta, & ja >> ja << 
  RGBA määrittelee värin.. 8 bittiä per arvo -> 24 bit värit -> 16 miljoonaa värisävyä
  Värimäärittelyt yleisesti: 
  http://en.wikipedia.org/wiki/HSL_and_HSV


Asioita jotka on muuten vaan hyvä muistaa kun duunailee:
  file:/// urlin kautta ei voi käsitellä pikseleitä kuvatiedostosta. Chromelle joku --allow-file-access-from-files
  python -m SimpleHTTPServer on ystävä

  >> 0 tuottaa javascriptissa tyyppipakotuksen kokonaisluvuksi
  Chrome hallitsee

-dojopohja.zip jossa perus putpixel ja randomizer vaikka

dojon roadmap:
-Perusteet:
   -Javascript, canvas
   -Pikseleiden asettaminen
-Demokoodauksen perusteet:
   -Inkrementaalinen efekti vs. matriisiefekti? 
    --rekursiivinen funktio vs. ei-rekursiivinen funktio
   -Lookup-taulut
   -Kokonaisluvut
   -x & 255 = x mod 256, which is nice
   -Käänteisfunktio yleensä parempi, esim. raytracer tai rotaattori
   
-Fire-efektin rakentaminen:
  -paletin rakentaminen (f(lämpötila) -> rgb)
    Reaalimaailmassakin on kaikenlaisia: http://en.wikipedia.org/wiki/Colored_fire
  -ajastus
  -pikseleiden asettaminen
  -fire-efekti (erillinen taulukko jossa lämpötilat)


http://www.html5canvastutorials.com/webgl/html5-canvas-webgl-plane-with-three-js/
http://low.fi/~visy/webgl/mkultra/
