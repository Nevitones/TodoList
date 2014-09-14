var gulp = require('gulp'),
	gutil = require('gulp-util'),
	declare = require('gulp-declare'),
	wrap = require('gulp-wrap'),
	compass = require('gulp-compass'),
	uglifyjs = require('gulp-uglifyjs'),
	handlebars = require('gulp-handlebars');

gulp.task('compass', function(){
	return gulp.src('./sass/*.scss')
		.pipe(compass().on('error', gutil.log).on('error', gutil.beep));
		// .pipe(compass({sourcemap: true}).on('error', gutil.log).on('error', gutil.beep));
});

gulp.task('uglifyjs', function(){
	// return gulp.src('./src/js/*.js')
	return gulp.src(['./src/js/TodoModel.js', './src/js/TodoCollection.js', './src/js/TodoModelView.js', './src/js/TodoCollectionView.js', './src/js/TodoMainView.js', './src/js/TodoApp.js'])
		.pipe(uglifyjs('todo-list-min.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('handlebars', function(){
	return gulp.src('./src/template/*.hbs')
		.pipe(handlebars())
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
				namespace: 'templates',
				noRedeclare: true, // Avoid duplicate declarations
			}))
		.pipe(uglifyjs('templates.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('unifyjs', function(){
	return gulp.src(['./src/js/TodoModel.js', './src/js/TodoCollection.js', './src/js/TodoModelView.js', './src/js/TodoCollectionView.js', './src/js/TodoMainView.js', './src/js/TodoApp.js'])
		.pipe(uglifyjs('todo-list-min.js', {
				mangle: false,
				compress: false,
				output: {
					beautify: true
				}
			})
		)
		.pipe(gulp.dest('./js'));
});

gulp.task('default', ['compass', 'uglifyjs', 'handlebars']);

gulp.task('watch', function(){
	gulp.watch('./sass/*.scss', ['compass']);
	gulp.watch('./src/js/*.js', ['uglifyjs']);
	gulp.watch('./src/template/*.hbs', ['handlebars']);
});