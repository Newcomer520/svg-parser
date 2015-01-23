var MATCHED_TRANSLATE_IN_TRANSFORM = /^translate\((.*)\)/;
var MATCHED_SCALE_IN_TRANSFORM = /^scale\((.*)\)/;
var MATCHED_MATRIX_IN_TRANSFORM = /^matrix\((.*)\)/;

module.exports= function(transformString) {
	var matched;
	var matrix = [1, 0, 0, 1, 0, 0];
	var strtmps;
	if(Array.isArray(transformString) && transformString.length == 6) {
		matrix = transformString;
	}
	else if(matched = MATCHED_TRANSLATE_IN_TRANSFORM.exec(transformString)) {
		strtmps = matched[1].split(',');
		matrix[4] = parseFloat(strtmps[0]);
		matrix[5] = parseFloat(strtmps[1]);
	}
	else if (matched = MATCHED_SCALE_IN_TRANSFORM.exec(transformString)) {
		strtmps = matched[1].split(',');
		matrix[0] = parseFloat(strtmps[0]);
		matrix[3] = parseFloat(strtmps[1]);	
	}
	else if ((matched = MATCHED_MATRIX_IN_TRANSFORM.exec(transformString)) &&
			(strtmps = matched[1].split(',')).length ==6) {		
		for(var i=0; i<6; i++) {
			matrix[i] = parseFloat(strtmps[i]);
		}
	}
	return Transformor(matrix);
}


function Transformor(matrix) {
	return function(x, y) {
		var ret = {};
		ret.x = x * matrix[0] + y * matrix[1] + matrix[4];
		ret.y = y * matrix[3] + y * matrix[2] + matrix[5];
		return ret;
	}
}

//scale(0.92961563,1.0757134)