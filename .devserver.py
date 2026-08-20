# EUROBROKER dev server: no-cache + SPA fallback za History API rutiranje.
# Port se uzima iz okruženja (PORT), uz podrazumijevani 8790.
#   python .devserver.py
import http.server, socketserver, os
PORT = int(os.environ.get("PORT", "8790"))
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()
    def do_GET(self):
        p = self.path.split("?")[0]
        fs = self.translate_path(p)
        # Nepoznata putanja bez ekstenzije -> posluži index.html (ruter je u pregledaču).
        if not os.path.exists(fs) and "." not in os.path.basename(p.rstrip("/")):
            self.path = "/index.html"
        return super().do_GET()
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), H) as httpd:
    print("Serving on http://127.0.0.1:%d/ (no-cache, SPA fallback)" % PORT)
    httpd.serve_forever()
