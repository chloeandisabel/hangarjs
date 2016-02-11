'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
  };
})();

var http = require('http');
var url = require('url');
var inflection = require('inflection');
var Promise = require('promise');

var _default = (function () {
  function _default(url) {
    this._url = url + 'hangar/' ;
  }

  _createClass(_default, [{
    key: 'create',
    value: function create(name, data) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var options = url.parse(self._url + inflection.pluralize(name));

        var wrappedData = {};
        wrappedData[name] = data;
        wrappedData = JSON.stringify(wrappedData);

        options.method = 'POST';
        options.headers = {};
        for (var key in self.hangarHeaders) {
          options.headers[key] = self.hangarHeaders[key];
        }
        options.headers['Content-Length'] = wrappedData.length;

        var req = http.request(options, function (res) {
          var responseData = '';
          res.on('data', function (chunk) {
            responseData += chunk;
          });
          res.on('end', function () {
            if (res.statusCode == 200 || res.statusCode == 201) {
              resolve(JSON.parse(responseData));
            } else {
              reject(responseData);
            }
          });
        }).on('error', function (e) {
          reject(e.message);
        });
        req.write(wrappedData);
        req.end();
      });
    }
  }, {
    key: 'attributesFor',
    value: function attributesFor(name) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var options = url.parse(self._url + inflection.pluralize(name) + '/new');
        options.headers = {};
        for (var key in self.hangarHeaders) {
          options.headers[key] = self.hangarHeaders[key];
        }

        http.get(options, function (res) {
          var responseData = '';
          res.on('data', function (chunk) {
            responseData += chunk;
          });
          res.on('end', function () {
            if (res.statusCode == 200) {
              resolve(JSON.parse(responseData));
            } else {
              reject(responseData);
            }
          });
        }).on('error', function (e) {
          reject(e.message);
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var options = url.parse(self._url);

        options.method = 'DELETE';
        options.headers = {};
        for (var key in self.hangarHeaders) {
          options.headers[key] = self.hangarHeaders[key];
        }

        http.request(options, function (res) {
          if (res.statusCode == 204) {
            resolve();
          } else {
            reject();
          }
        }).on('error', function (e) {
          deferred.reject(e.message);
        }).end();
      });
    }
  }, {
    key: 'hangarHeaders',
    get: function get() {
      return {
        Factory: 'hangar',
        Accept: 'application/json',
        'Content-Type': 'application/json' };
    }
  }]);

  return _default;
})();

exports['default'] = _default;
module.exports = exports['default'];