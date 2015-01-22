var Reactify = require('./reactify-svg.jsx');
var BSvg = require('../dest-reactify/B02');
var Surface = require('inip-widget').utils.ART.Surface;
var Group = require('inip-widget').utils.ART.Group;
var React = require('react');
var Rectangle = require('inip-widget').utils.Rectangle;
var CSvg = require('../dest-reactify/test');
var ellipseSvg = require('../dest-reactify/ellipse');
//var Dir = Reactify(BSvg, 'test');
var CRect = Reactify(CSvg, 'rect01');
//var Ell = Reactify(ellipseSvg, 'ell01');

//var Group = require('inip-widget').utils.ART.Group;
//<Rectangle width={800} height={300} fill="#eeeeee" />
//<CRect x={50} y={50} />
//<Dir scale={0.5} />
//<Ell x={0} y={0} scale={2} />
React.render(
	<Surface width={800} height={400}>
		<CRect x={50} y={0} />
		

		
	</Surface>,
	document.getElementById('s1')
);
