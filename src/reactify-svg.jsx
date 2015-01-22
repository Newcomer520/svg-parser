var React = require('react');
var inipWidget = require('inip-widget');
var Group = inipWidget.utils.ART.Group;
var Shape = inipWidget.utils.ART.Shape;
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
			resolveStyle(child.style);
						
			
			console.log(child.style)
			result.push(
				<Element {...child} {...child.style} key={k}>
					{grandChildren}
				</Element>
			)			
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
module.exports = ReactifySvg;

var RECOGNIZED_SVGTAG = {
	'linearGradient': function(options) {		
		return LinearGradientTransform(options)
	}
};


var RECOGNIZED_ELEMENTS = {
	'g': function() {
		return Group;
	},
	'path': function() {
		return Shape;
	}

}
