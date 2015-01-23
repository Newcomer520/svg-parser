var React = require('react');
var inipWidget = require('inip-widget');
var Group = inipWidget.utils.ART.Group;
var Shape = inipWidget.utils.ART.Shape;
var Text = inipWidget.utils.ART.Text;
var transformor = require('./resolve-transform');


module.exports = function(node, key) {
	//Text should be stored in tag tspan	
	var texts = node.tspan;
	if(!texts || !Array.isArray(texts))
		return Group;
	var transform = transformor(node.transform);	
	var TextArray = texts.map(function(t, idx) {		
		return (
			<Text fill={node.style.fill} {...t} key={key+'-'+idx} x={t.x} y={t.y-node.y} font={stringifyFont(node.style)} alignment={node.style['text-align']}>
				{t['_']}
			</Text>
		);
	});
	var Reactified = React.createClass({		
		render: function() {
			var y = (node.y - parseFloat(node.style['font-size']));
			var xy = transform(0, y);
			console.log(xy.y, node.y, parseFloat(node.style['font-size']))
			return(
				<Group y={xy.y}>
					{TextArray}
				</Group>
			);
		}
	});

	return Reactified;
}

function stringifyFont(nodeStyle) {
	var fontWeight = nodeStyle['font-weight']? nodeStyle['font-weight']: 'normal';
	var fontSize = nodeStyle['font-size']? nodeStyle['font-size']: '20px';
	var fontFamily = 'Moderna'; //fixed this family first!

	return fontWeight + ' ' + fontSize + ' ' + fontFamily;
}