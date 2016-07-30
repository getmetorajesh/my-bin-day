
/*jslint node: true */

'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify'); // notification plugin for gulp
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber'); //Prevent pipe breaking caused by errors from gulp plugins
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var reload = browserSync.reload;

/* Setup scss path */
var paths = {
  scss: './scss/*.scss'
};

/* Javascript files */
gulp.task('scripts', function() {
  return gulp.src([
    /* JS files here to combine them into one*/
    'bower_components/js/*.js',
    'src/app.js'
    ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

/**
 * SCSS
 */
 gulp.task('sass', function () {
    gulp.src('scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat()
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

gulp.task('browser-sync',['nodemon'], function() {
  browserSync.init(['public/css/*.css', 'public/js/*.js'], {
    proxy: 'localhost:3000',
    port: 3030
    /* For a static server you would use this: */
    // server: {
    //   baseDir: './public/',
    //   port: 4000
    // }
    //proxy: "http://localhost:3000",
    //port: 5001
  });
});

/* Reload task */
gulp.task('bs-reload', function() {
  browserSync.reload();
});

/*nodemon*/
gulp.task('nodemon', function(callback){
  var started =false;

  return nodemon({
    script: './bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			callback();
			started = true;
		}
	});
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['sass', 'browser-sync'], function() {

  gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);
  /* Watch app.js file, run the scripts task on change. */
  gulp.watch(['public/js/app.js'], ['scripts']);
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['public/*.html'], ['bs-reload']);

  // gulp.watch("js/*.js", [browserSync.reload]);

});
