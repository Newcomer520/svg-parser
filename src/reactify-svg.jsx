var React = require('react');
var inipWidget = require('inip-widget');
var Group = inipWidget.utils.ART.Group;
var Shape = inipWidget.utils.ART.Shape;
var Rect = inipWidget.utils.Rectangle;

var assign = require('object-assign');
var LinearGradientTransform = inipWidget.LinearGradientTransform;

function ReactifySvg(svgjson, id) {
	//check if the root existed
	if(!svgjson.g)
		return;
	var result = [];
	//generate all nodes.
	generateNodes(svgjson.g, 'g', result, id);
	var Reactified = React.createClass({

		render: function() {

			return (
				<Group {...this.props}>
					{result}
				</Group>
			);
		}
	});
	
	
	return Reactified;
}

function generateNodes(node, tag, result, key) {
	var Element;	
	if(Array.isArray(node)) {		
		Element = RECOGNIZED_ELEMENTS[tag]();		
		node.forEach(function(child, idx) {
			if(!RECOGNIZED_ELEMENTS[tag])
				return;
			var grandChildren = [];
			var k = key + '-' + idx;			
			console.log(child)
			resolveStyle(child.style);
			props2React(child);
			var xy = resolveTransform(child);
			if(xy) {
				result.push(
					<Group x={xy.x} y={xy.y}>
						<Element {...child} {...child.style} key={k}>
							{grandChildren}
						</Element>
					</Group>
				)
			}
			else {
				result.push(
					<Element {...child} {...child.style} key={k}>
						{grandChildren}
					</Element>
				)	
			}
			
			generateNodes(child, null, grandChildren, k);
		});
	}
	else if(typeof node === 'object') {
		for(var prop in node) {
			//prevent from making multiple tags.			
			if(RECOGNIZED_ELEMENTS[prop]) {			
				generateNodes(node[prop], prop, result, key);
				break;
			}
		}
	}
	else {
		console.log('should not go here', node)
	}
}

function resolveStyle(style) {

	if(typeof style !== 'object')
		return style;	
	for(var attribute in style) { //attribute like: fill, stroke, etc..
		if(TRANSFORMED_PROP[attribute]) {
			var transformed = TRANSFORMED_PROP[attribute];
			style[transformed.name] = transformed.convert(style[attribute]);
		}
		if(typeof style[attribute] !== 'object')
			continue;
		var svgTag = style[attribute].svgTag;
		if(!RECOGNIZED_SVGTAG[svgTag])
			continue;
		style[attribute] = RECOGNIZED_SVGTAG[svgTag](style[attribute]);
	}
	noneToBeUndefined(style);
	return style;
}

var MATCHED_TRANSLATE_IN_TRANSFORM = /^translate\((.*)\)/;
function resolveTransform(node) {
	if(!node.transform)
		return;
	try {		
		if(!(node.x = parseFloat(node.x)))
			node.x = 0;
		if(!(node.y = parseFloat(node.y)))
			node.y = 0;
	}
	catch(err){ node.x = node.y = 0; }

	var matched;
	//translate.
	if(matched = MATCHED_TRANSLATE_IN_TRANSFORM.exec(node.transform)) {
		var strtmps = matched[1].split(',');
		if(strtmps.length != 2)
			return;
		return {x:parseFloat(strtmps[0]), y: parseFloat(strtmps[1])};
	}
	return undefined;
}
/*
	if the value = none, transform it to undefined,
*/
function noneToBeUndefined(obj) {
	if(typeof obj !== 'object')
		return obj;	
	for(var p in obj) {		
		if(obj[p] === 'none')
			obj[p] = undefined;
	}
	return obj;
}

/*
	transform the property to the suitable one for react-art usage.
	ex: in svg, rx and ry mean border raidus. 
	we need to transform rx(ry) to radius
*/
function props2React(element) {
	for(var p in element) {
		if(!TRANSFORMED_PROP[p])
			continue;
		var newProp = TRANSFORMED_PROP[p].name;
		element[newProp] = TRANSFORMED_PROP[p].convert(element[p]);		
	}
}
module.exports = ReactifySvg;

var RECOGNIZED_SVGTAG = {
	'linearGradient': function(options) {		
		return LinearGradientTransform(options)
	}
};

var TRANSFORMED_PROP = {
	'rx': {
		name: 'radius',
		convert: function(p) { return parseFloat(p); }
	},	
	'ry': {
		name: 'radius',
		convert: function(p) { return parseFloat(p); }
	},
	'width': {
		name: 'width',
		convert: function(p) { return parseFloat(p); }
	},
	'height': {
		name: 'height',
		convert: function(p) { return parseFloat(p); }
	},
	'stroke-width': {
		name: 'strokeWidth',
		convert: function(p) { return parseFloat(p); }
	}
}

var RECOGNIZED_ELEMENTS = {
	'g': function() {
		return Group;
	},
	'path': function() {
		return Shape;
	},
	'rect': function() {
		return Rect;
	}

}
