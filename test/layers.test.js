var test = require('tape'),
    esriLayers = require('..');

//esriLayers('http://tnmap.tn.gov/arcgis');
esriLayers('http://services1.arcgis.com/I6XnrlnguPDoEObn/ArcGIS/', function(layers) {
  console.log(layers.length);
});
