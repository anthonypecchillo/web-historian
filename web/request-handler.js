var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //curr directory is /web
  console.log('__dirname is: ', __dirname, '\n');

  fs.readFile(__dirname + '/public/index.html', function(err, data) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('I read the file!\n');
    console.log('The file is: ', '???file???');
    console.log('The data is: ', data.toString());

    fs.writeFile(path.join(path.normalize(__dirname + '/..'), '/test/testdata/sites.txt'), data, function(err) {
      console.log('I\'m in the writeFile method now!\n');
      console.log('The data is now: ' + data.toString());
      console.log('I\'m writing the data into: ' + path.join(path.normalize(__dirname + '/..'), '/test/testdata/sites.txt'));
      if (err) {
        console.log(err);
        throw err;
      }

      var headers = httpHelpers.headers;
      var method = req.method;
      var url = req.url;
      var statusCode;

      console.log('Serving request type ' + method + ' for url ' + url);

      if (method === 'GET') {
        console.log('GET METHOD!!!!!!');
        statusCode = 200;
        
        req.on('error', function(err) {
          console.error(err);
        });
        req.on('data', function(chunk) {
          //do stuff
        });
        req.on('end', function() {
          res.writeHead(statusCode, {'Content-Type': 'application/JSON'});

          var responseBody = {
            headers: headers,
            method: method,
            url: url,
            body: data.toString()
          };
          console.log('hi therererererere');
          console.log(JSON.stringify({results: responseBody.body}));
          res.end(JSON.stringify({results: responseBody.body}));
        });
      }     
    });
  });

  // res.end(archive.paths.list);
};
