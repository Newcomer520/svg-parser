var assign = require('object-assign');
var svgUtil = require('./svg-parse-utils');

var parser = function(json, cb) {	
	var err;
	if(!json.svg) {		
		err = 'cannot find svg node.';
		cb(err, null);
	}

	var result = {
		//group:json.svg.grou
	};
	searchingNode(json.svg, result);	
	result = svgUtil.generateUrlProp(result, 'fill');	
	
	cb(null, result);
}


module.exports = parser;
function searchingNode(element, result) {
	var properties = getProperties(element);
	assign(result, parseProperties(properties));
	for (var p in element) {		
		//if (p == 0)
		//	continue;
		if(!AVALIABLETAGS[p])
			continue;
		if(Array.isArray(element[p])) {			
			result[p] = [];
			for(var i = 0; i < element[p].length; i++) {
				var obj = {};
				if (typeof element[p][i] == 'object') {
					result[p].push(obj);
					searchingNode(element[p][i], obj);	
				}				
			}
		}
		else {

			result[p] = parseProperties(getProperties(element[p]));			
			searchingNode(element[p], result[p]);
		}
			
		
	}
}

function getProperties(obj) {
	ret = {};
	for (var p in obj) {
		if (p === '$') {
			assign(ret, obj[p]);
		}
		else
			ret[p] = obj[p];
	}

	return ret;
	//return obj['$'];
}

function parseProperties(obj) {
	var ret = {};
	if(obj) {		
		for (var p in obj) {
			var parsedProperties = parsePropertiesInString(obj[p]);				
			var assigned = {};
			assigned[p] = parsedProperties;
			assign(ret, assigned);
		}
	}
	return ret;
}

/*
	parse a style-like string to a object(width: 500px;height:200px;....)
*/
var ignoredPattern = /\w*:(\/){2}/;
function parsePropertiesInString(value) {
	if (ignoredPattern.test(value)) {		
		return value;
	}

		
	if (typeof value !== 'string')
		return value;
	if (value.indexOf(':') === -1)
		return value;
	var ret = {};	
	var properties = value.split(';');
	

	properties.forEach(function(p) {
		var parsed = parsePropInString(p);
		if(parsed)
			assign(ret, parsed);
	});

	return ret;
}

/*
parse: width: 230px this form
*/
function parsePropInString(prop) {
	var strtmps = prop.split(':');
	if(strtmps.length === 2) {		
		var ret = {};
		ret[strtmps[0].trim()] = strtmps[1].trim();
		return ret;
	}	
}
/*
	generate some property (already known: gradient fill) through url id
*/
function parseUrl(prop, json) {

}
var AVALIABLETAGS = {
	defs: {

	},
	linearGradient: {

	},
	path: {

	},
	g: {

	},
	d: {

	},
	style: {

	},
	rect: {

	},
	stop: {

	}
}