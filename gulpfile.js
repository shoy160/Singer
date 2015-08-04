"use strict";
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
//    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    gifsicle = require('imagemin-gifsicle'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
//    cache = require('gulp-cache'),
//    livereload = require('gulp-livereload'),
    DEST = "build_gulp",
    SEED_SRC = [
        'src/seed/src/singer.js',
        'src/seed/src/lang/*.js',
        'src/seed/src/*.js',
        'src/seed/src/loader/*.js'
    ],
    CSS_SRC = "demo/css/**/*.css",
    CSS_DEST = DEST + "/css",
    IMAGE_JPG_SRC = ["demo/image/**/*.jpg"],
    IMAGE_GIF_SRC = ["demo/image/**/*.gif"],
    IMAGE_PNG_SRC = ["demo/image/**/*.png"],
    IMAGE_DEST = DEST + "/img",
    HTML_SRC = 'demo/**/*.html',
    HTML_DEST = DEST + '/html';

//seed
gulp.task("seed", function () {
    return gulp.src(SEED_SRC)
        //合并文件
        .pipe(concat("seed.js"))
        //写文件
        .pipe(gulp.dest(DEST))
//        .pipe(jshint('.jshintrc'))
//        .pipe(jshint.reporter('default'))
        //压缩文件
        .pipe(uglify())
        //重命名
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST))
        .pipe(notify({message: 'seed task complete'}));
});

// styles
gulp.task('styles', function () {
    return gulp.src(CSS_SRC)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(CSS_DEST))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_DEST))
        .pipe(notify({message: 'styles task complete'}));
});

//png
gulp.task('png', function () {
    return gulp.src(IMAGE_PNG_SRC)
        .pipe(pngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest(IMAGE_DEST));
});
gulp.task('jpg', function () {
    return gulp.src(IMAGE_JPG_SRC)
        .pipe(jpegtran({progressive: true})())
        .pipe(gulp.dest(IMAGE_DEST));
});
gulp.task('gif', function () {
    return gulp.src(IMAGE_GIF_SRC)
        .pipe(gifsicle({interlaced: true})())
        .pipe(gulp.dest(IMAGE_DEST));
});

// clean
gulp.task('clean', function () {
    return gulp.src([CSS_DEST, HTML_DEST], {read: false})
        .pipe(clean());
});

// clean-image
gulp.task('clean-image', function () {
    return gulp.src([IMAGE_DEST], {read: false})
        .pipe(clean());
});

//html
gulp.task('html', function () {
    return gulp.src(HTML_SRC)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(HTML_DEST))
        .pipe(notify({message: 'html task complete'}));
});

//images
gulp.task('images', ['clean-image'], function () {
    return gulp.start('jpg', 'gif', 'png');
});

// default
gulp.task('default', ['clean'], function () {
    return gulp.start('seed', 'styles');
});


