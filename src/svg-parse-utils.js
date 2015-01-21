var assign = require('object-assign');

var matchedUrl = /^\s*url\(["'\s]*\#([^\)]*?)["'\s]*\)/;
var matchedId = /\#(\w*)/;
var matchedGradientTransform = /^matrix\((.*)\)/;

module.exports = {
	generateUrlProp: generateUrlProp,
	getById: getById
}

/*
	parse url in svg, convert to the total information
*/
function generateUrlProp(node, prop, svg) {
	svg = svg || node;

	if(node[prop]) {				
		node[prop] = parseUrl(node[prop], svg);		
	}
	
	for(var p in node) {
		if(p == 0)
			continue;
		if(p === prop)
			continue;
		if(Array.isArray(node[p])) {

			node[p].forEach(function(pp, idx) {								
				node[p][idx] = generateUrlProp(pp, prop, svg);
			});
		}
		else {			
			node[p] =generateUrlProp(node[p], prop, svg);
		}
	}
	return node;
}
function parseUrl(url, svg) {
	if(typeof url !== 'string')
		return url;
	var match;
	if(match = matchedUrl.exec(url)) {
		var found;
		found = getById(match[1], svg, 'svg');
		if(!found)
			return url;
		var child = found; //initial loop
		while(child && child['xlink:href'] && (match = matchedId.exec(child['xlink:href']))) {
			var extraInfo = getById(match[1], svg, 'href');
			//console.log(extraInfo, match[1], child['xlink:href'])
			assign(child, extraInfo);			
			child = extraInfo;
		}
		//console.log(found)
		return found;
	}
	else {
		return url;
	}
}
function parseGradientTransform(node) {
	var gString = 'gradientTransform';
	if(!node[gString] || typeof node[gString] !== 'string')
		return;
	
	var match;
	if(match = matchedGradientTransform.exec(node[gString])) {
		var strtmps = match[1].split(',');
		var ret = [];
		strtmps.forEach(function(s) {
			ret.push(parseFloat(s));
		})
		node[gString] = ret;
	}	
}
/*
stop in gradient transform. parse them to the form feed ART linearGradientTransform
*/
function parseStops(node) {
	if(!Array.isArray(node.stop)) 
		return;
	var stops = {};
	node.stop.forEach(function(stop) {
		if(!stop['offset'] || !stop.style || !stop.style['stop-color'])
			return;
		stops[stop['offset']] = stop.style['stop-color'];
	});
	node.stops = stops;
}
function getById(id, node, svgTag) {
	if(!node)
		return;
	if(node['id'] === id) {
		var found;
		found = assign({svgTag: svgTag},node);
		//parse gradienttransform
		parseGradientTransform(found);		
		parseStops(found);
		//delete found['id'];
		return found;
	}
	for(var p in node) {
		if(Array.isArray(node[p])) {
			for (var i = 0; i < node[p].length; i++) {
				var found = getById(id, node[p][i], p);
				if(found) return found;
			}
				
		}
	}
		
}

