var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require('gulp-compass'),
	uglifyjs = require('gulp-uglifyjs');

gulp.task('compass', function(){
	return gulp.src('./sass/*.scss')
		.pipe(compass().on('error', gutil.log).on('error', gutil.beep));
		// .pipe(compass({sourcemap: true}).on('error', gutil.log).on('error', gutil.beep));
});

gulp.task('uglifyjs', function(){
	return gulp.src('./src/js/*.js')
		.pipe(uglifyjs('todo-list-min.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('default', ['compass', 'uglifyjs']);

gulp.task('watch', function(){
	gulp.watch('./sass/*.scss', ['compass']);
	gulp.watch('./src/js/*.js', ['uglifyjs']);
});