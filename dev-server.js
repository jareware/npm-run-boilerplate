var SRC_ROOT = __dirname + '/../src/';

var fs = require('fs'),
    exec = require('child_process').exec,
    express = require('express'),
    httpProxy = require('http-proxy'),
    livereload = require('livereload'),
    watch = require('glob-watcher'),
    apiProxy = httpProxy.createProxyServer(),
    server = livereload.createServer();

express()
    .get('/', function(req, res) {
        var lr = '<script src="http://localhost:35729/livereload.js"></script>';
        res.send(fs.readFileSync(SRC_ROOT + 'index.html', 'utf8').replace('</body>', lr + '</body>'));
    })
    .get('/api/*', function(req, res) {
        apiProxy.web(req, res, { target: 'http://localhost:8080' });
    })
    .use('/', express.static(SRC_ROOT))
    .listen(3000);

watch([ SRC_ROOT + '**/*.jsx' ], function(e) {
    exec('npm run build-js', function() {
        server.refresh(e.path);
    });
});

watch([ SRC_ROOT + '**/*.scss' ], function(e) {
    exec('npm run build-css', function() {
        server.refresh(e.path);
    });
});
