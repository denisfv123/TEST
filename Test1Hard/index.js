'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const mimetypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'woff2': 'application/x-font-woff'
};

http.createServer((req, res) => {
    
    if(req.method == 'GET') {
        loadFile(req, res);
    } else if(req.method == 'POST') {
        getWeather(req, res);
    }

}).listen('3000', '127.0.0.1', () => {
    console.log(`Server is running on server http://127.0.0.1:3000`);
});

function Error404(res) {
    res.writeHead(404, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'origin, content-type, accept'
    });
    res.end('Not Found 404');
}

function getWeather(req, res) {
    postData(req, (data) => {
        getForecast(res, data);
    });
}

function getForecast(res, data) {
    http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${data}&APPID=e6cfb6a97b8c614260dfd94ae42ed86e`, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
            res.writeHead(200, { 
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'origin, content-type, accept'
            });
            res.end(data);
        });
    });
}

function loadFile(req, res) {
    let uri = url.parse(req.url).pathname;
    let filename = path.join(process.cwd(), querystring.unescape(uri));
    let loadFile;

    try {
        loadFile = fs.lstatSync(filename);
    } catch (err) {
        Error404(res);
        return;
    }

    if (loadFile.isFile()) {
        let mimeType = mimetypes[path.extname(filename).split('.').reverse()[0]];
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'origin, content-type, accept'
        });
        let filestream = fs.createReadStream(filename);
        filestream.pipe(res);
    } else if (loadFile.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'origin, content-type, accept'
        });
        res.end();
    }
}

function postData(request, callback){
  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    callback(data);
  });
};
