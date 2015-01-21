'use strict';
var path = require('path');
var fs = require('graceful-fs');
var gutil = require('gulp-util');
var map = require('map-stream');
var filesize = require('filesize');
var tempWrite = require('temp-write');
var xml2js = require('xml2js');
var translator = require('./src/svg2json');

module.exports = function (options) {
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-svg2json', 'Streaming not supported'));
		}

		if (['.svg', '.SVG'].indexOf(path.extname(file.path)) === -1) {
			gutil.log('gulp-xml2json: Skipping unsupported xml ' + gutil.colors.blue(file.relative));
			return cb(null, file);
		}

		tempWrite(file.contents, path.extname(file.path), function (err, tempFile) {
			if (err) {
				return cb(new gutil.PluginError('gulp-svg2json', err));
			}

			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new gutil.PluginError('gulp-svg2json', err));
				}

				options = options || {};

				fs.readFile(tempFile, { encoding : 'UTF-8'}, function(err, data) {
					if (err) {
						return cb(new gutil.PluginError('gulp-xml2json', err));
					}

					var parser = new xml2js.Parser();
					parser.parseString(data, function (err, result) {
						if(err) throw new Error(err);	
						gutil.log('gulp-svg2json:', gutil.colors.green('✔ ') + file.relative); 
						translator(result, function(err, jsonResult) {
							if(err)
								throw new Error(err);
							file.contents = new Buffer('var svg=' + JSON.stringify(jsonResult) + ';module.exports=svg;');
							file.path = gutil.replaceExtension(file.path, '.js');
							cb(null, file);							
						})						
					});
				
				});

			});
		});
	});
};
