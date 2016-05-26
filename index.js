var esriUrl = require('esri-rest-url'),
    request = require('request');

module.exports = function(url, cb) {

  var services = [],
      layers = [],
      waiting = 1;

  collectServices(url, null, function() {
    //console.log(services);

    waiting = services.length;
    services.map(function(d) {
      collectLayers(url, d.name, d.type, function() {
        cb(layers);
      })
    });

  });

  function collectServices(url, folder, callback) {
    var api = esriUrl({ 'base': url, 'folderLocation': folder, 'format': 'pjson'});
    // Request /rest/services/ home metadata page in JSON format
    request(api, function (error, response, body) {
      waiting--;
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);

        // Collect listed services
        if (typeof data.services !== 'undefined' && data.services.length > 0) {
          data.services.map(function(d) {
            services.push(d);
          });
        }

        // Collect listed folders
        if (typeof data.folders !== 'undefined' && data.folders.length > 0) {
          data.folders.map(function(d) {
            waiting++;
            if (folder) d = folder + '/' + d;
            collectServices(url, d, callback);
          });
        } else if (waiting === 0) {
          callback();
        }
      }
    });
  }

  function collectLayers(url, serviceName, serviceType, callback) {
    var api = esriUrl({
      'base': url,
      'service': serviceName,
      'type': serviceType,
      'layerIndex': 'layers',
      'format': 'pjson'
    });
    // Request resource metadata page in JSON format
    request(api, function (error, response, body) {
      waiting--;
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        // Collect listed layers
        if (typeof data.layers !== 'undefined' && data.layers.length > 0) {
          data.layers.map(function(d) {
            layers.push(d);
          });
        }
      }
      if (waiting === 0) callback();
    });
  }

}
