var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //curr directory is /web
  var pathToRequest;

  // pathToRequest =  (req.url === '/') ? 
  //                  archive.paths.siteAssets + req.url + 'index.html' :
  //                  archive.paths.archivedSites + req.url;
  
  if (req.url === '/') {
    console.log('ksjdfhkasjdhfka' + req.url);  
    pathToRequest = archive.paths.siteAssets + req.url + 'index.html';

    fs.readFile(pathToRequest, function(err, data) {
      if (err) { throw error; }

      fs.writeFile(path.join(path.normalize(__dirname + '/..'), '/test/testdata/sites.txt'), data, function(err) {
        if (err) { throw error; }

        var headers = httpHelpers.headers;
        var method = req.method;
        var url = req.url;

        console.log('Serving request type ' + method + ' for url ' + url);

        if (method === 'GET') {          
          req.on('error', function(err) {
            console.error(err);
          });
          req.on('data', function(chunk) {
            //do stuff
          });
          req.on('end', function() {
            res.writeHead(200, {'Content-Type': 'application/JSON'});

            var responseBody = {
              headers: headers,
              method: method,
              url: url,
              body: data.toString()
            };
            res.end(JSON.stringify({results: responseBody.body}));
          });
        }     
      });
    });
  } else {

    archive.isUrlArchived(req.url.substring(1), function(err, exists) {
      if (err) {
        throw error;
      }

      if (exists) {
        pathToRequest =  archive.paths.archivedSites + req.url;

        fs.readFile(pathToRequest, function(err, data) {
          if (err) { throw error; }

          fs.writeFile(path.join(path.normalize(__dirname + '/..'), '/test/testdata/sites.txt'), data, function(err) {
            if (err) { throw error; }

            var headers = httpHelpers.headers;
            var method = req.method;
            var url = req.url;
            var statusCode;

            console.log('Serving request type ' + method + ' for url ' + url);

            if (method === 'GET') {          
              req.on('error', function(err) {
                console.error(err);
              });
              req.on('data', function(chunk) {
                //do stuff
              });
              req.on('end', function() {
                res.writeHead(200, {'Content-Type': 'application/JSON'});

                var responseBody = {
                  headers: headers,
                  method: method,
                  url: url,
                  body: data.toString()
                };
                res.end(JSON.stringify({results: responseBody.body}));
              });
            }     
          });
        });

      } else {
        req.on('error', function(err) {
          console.error(err);
        });
        req.on('data', function(chunk) {
          //do stuff
        });
        req.on('end', function() {
          res.writeHead(404);
          res.end(JSON.stringify({}));
        });
      }
    });
  }
};
 
