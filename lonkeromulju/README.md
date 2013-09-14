Javascript may have problems if you try from browser with file:/// style URI.
Cross-origin policy and whatnot.

Use http server and http:// URI. Like this:

python -m SimpleHTTPServer

http://localhost:8000/lonkeromulju.html

