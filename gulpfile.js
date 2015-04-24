"use strict";
var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    gifsicle = require("imagemin-gifsicle"),
    DEST = "build-test",
    IMAGE_SRC = "build-test/img-source/",
    IMAGE_DEST = DEST + "/img";

gulp.task("seed-task", function () {
    return gulp.src([
        'src/seed/src/singer.js',
        'src/seed/src/lang/*.js',
        'src/seed/src/*.js',
        'src/seed/src/loader/*.js'])
        //合并文件
        .pipe(concat("seed.js"))
        //写文件
        .pipe(gulp.dest(DEST))
        //压缩文件
        .pipe(uglify())
        //重命名
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(DEST));
});

gulp.task('image-task', function () {
    gulp.src(IMAGE_SRC + '**/*.png')
        .pipe(pngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest(IMAGE_DEST));
    gulp.src(IMAGE_SRC + '**/*.jpg')
        .pipe(jpegtran({ progressive: true })())
        .pipe(gulp.dest(IMAGE_DEST));
    gulp.src(IMAGE_SRC + '**/*.gif')
        .pipe(gifsicle({ interlaced: true })())
        .pipe(gulp.dest(IMAGE_DEST));
});

//png task
gulp.task('png-task', function () {
    return gulp.src('build/img/**/*.png')
        .pipe(pngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest(IMAGE_DEST));
});
gulp.task('jpg-task', function () {
    return gulp.src('build/img/**/*.jpg')
        .pipe(jpegtran({ progressive: true })())
        .pipe(gulp.dest(IMAGE_DEST));
});
gulp.task('gif-task', function () {
    return gulp.src('build/img/**/*.gif')
        .pipe(gifsicle({ interlaced: true })())
        .pipe(gulp.dest(IMAGE_DEST));
});