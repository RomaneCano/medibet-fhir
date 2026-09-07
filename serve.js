const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const port = 8123;
http.createServer((req, res) => {
  let filePath = path.join(dir, req.url === '/' ? '/medibet.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.js' ? 'text/javascript; charset=utf-8' : 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}).listen(port, () => console.log('listening on ' + port));
