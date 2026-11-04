// Servidor local sin dependencias ni cuenta de Vercel. Sirve public/ y las funciones de api/.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function addVercelHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  };
}

function serveStatic(pathname, res) {
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = path.resolve(PUBLIC_DIR, relative);
  if (file !== PUBLIC_DIR && !file.startsWith(PUBLIC_DIR + path.sep)) {
    res.statusCode = 403;
    return res.end('Prohibido');
  }
  fs.readFile(file, (err, content) => {
    if (err) {
      res.statusCode = 404;
      return res.end('No encontrado');
    }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.end(content);
  });
}

http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/api/problems') {
    addVercelHelpers(res);
    return require(path.join(ROOT, 'api', 'problems.js'))(req, res);
  }
  serveStatic(decodeURIComponent(pathname), res);
}).listen(PORT, () => {
  console.log('InterviewCoach en http://localhost:' + PORT);
});
