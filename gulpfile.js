var gulp = require('gulp');
var parser = require('./index');

gulp.task('default', function() {
	return gulp.src('./svg/**/B.svg')
		.pipe(parser({reactify: true}))
		.pipe(gulp.dest('dest-reactify'));
})