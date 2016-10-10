/*global require, console*/
/*jshint -W119*/
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

function swallowError (error) {
    this.emit('end');
}

// Static Server + watching scss/html files
gulp.task('serve', ['css'], function () {

    browserSync.init({
        proxy: 'localhost'
    });
    gulp.watch('sass/*.scss', ['css']);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('**/*.php').on('change', browserSync.reload);
    gulp.watch('js/*.js', ['js']);
});

gulp.task('js', () => {
    gulp.src('js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('static/js'));
});

gulp.task('imgs', () => {
    gulp.src('static/imgs/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('static/imgs'));
});

// auto-inject into browsers
gulp.task('css', () => {
    return gulp.src(['css/*.css', 'sass/*.scss'])
        .pipe(concat('all.css'))
        .on('error', swallowError)
        .pipe(sass({ compass: true }))
        .on('error', swallowError)
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .on('error', swallowError)
        .pipe(cssmin())
        .on('error', swallowError)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('static/css'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);