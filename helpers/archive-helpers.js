var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      console.log(err);
      throw error;
    }
    var urls = data.toString().split('\n');
    cb(err, urls);
  });
};

exports.isUrlInList = function(urlOfInterest, cb) {
  exports.readListOfUrls(function(err, urls) {
    var exists = urls.includes(urlOfInterest);
    cb(err, exists);
  });
};

exports.addUrlToList = function(urlToAdd, cb) {
  exports.readListOfUrls(function(err, urls) {
    urls.push(urlToAdd);
    console.log(urls);
    fs.writeFile(exports.paths.list, urls.join('\n'), function(err) {
      if (err) {
        console.log(err);
        throw error;
      }
      cb(err);
    });
  });
};

exports.isUrlArchived = function(urlOfInterest, cb) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) {
      console.log(err);
      throw err;
    }
    var exists = files.includes(urlOfInterest);
    console.log(urlOfInterest);
    console.log(exists);
    cb(err, exists);
  });
};

exports.downloadUrls = function(urlsToDownloadInArray) {
  urlsToDownloadInArray.forEach(function(url) {
    console.log(url);
    request({uri: 'http://' + url}, function(err, response, body) {
      if (err) {
        console.log(err);
        throw error;
      }

      fs.appendFile(exports.paths.archivedSites + '/' + url, body, function(err) {
        if (err) {
          console.log(err);
          throw error;
        }
        // cb(err);
      });
    });
  });
};
