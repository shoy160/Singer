"use strict";
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    gifsicle = require('imagemin-gifsicle'),
    $ = gulpLoadPlugins(),
    paths = {
        dest: 'dist',
        seeds: [
            'src/seed/src/singer.js',
            'src/seed/src/lang/*.js',
            'src/seed/src/*.js',
            'src/seed/src/loader/*.js'
        ],
        css: ['demo/css/**/*.css'],
        jpg: ["demo/image/**/*.jpg"],
        gif: ["demo/image/**/*.gif"],
        png: ["demo/image/**/*.png"],
        html: ['demo/**/*.html']
    },
    dest = function (type) {
        return type ? paths.dest + '/' + type : paths.dest;
    };

//seed
gulp.task("seed", function () {
    return gulp.src(paths.seeds)
        //合并文件
        .pipe($.concat("seed.js"))
        //写文件
        .pipe(gulp.dest(dest()))
        // .pipe($.jshint('.jshintrc'))
        // .pipe($.jshint.reporter('default'))
        //压缩文件
        .pipe($.uglify())
        .on('error', function (err) {
            $.util.log($.util.colors.red('[Error]'), err.toString());
        })
        //重命名
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dest()))
        .pipe($.notify({
            message: 'seed task complete'
        }));
});

gulp.task('seed-under', function () {
    var src = paths.seeds.concat();
    src.push('plugs/underscore/underscore.js');
    src.push('plugs/underscore/singer.underscore.js');
    return gulp.src(src)
        //合并文件
        .pipe($.concat("seed-under.js"))
        //写文件
        .pipe(gulp.dest(dest()))
        //        .pipe($.jshint('.jshintrc'))
        //        .pipe($.jshint.reporter('default'))
        //压缩文件
        .pipe($.uglify())
        //重命名
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dest()))
        .pipe($.notify({
            message: 'seed-under task complete'
        }));
});

// styles
gulp.task('styles', function () {
    return gulp.src(paths.css)
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(dest('css')))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest(dest('css')))
        .pipe($.notify({
            message: 'styles task complete'
        }));
});

//png
gulp.task('png', function () {
    return gulp.src(paths.png)
        .pipe(pngquant({
            quality: '65-80',
            speed: 4
        })())
        .pipe(gulp.dest(dest('img')));
});
gulp.task('jpg', function () {
    return gulp.src(paths.jpg)
        .pipe(jpegtran({
            progressive: true
        })())
        .pipe(gulp.dest(dest('img')));
});
gulp.task('gif', function () {
    return gulp.src(paths.gif)
        .pipe(gifsicle({
            interlaced: true
        })())
        .pipe(gulp.dest(dest('img')));
});

// clean
gulp.task('clean', function () {
    return gulp.src([dest('css'), dest('html')], {
            read: false
        })
        .pipe($.clean());
});

// clean-image
gulp.task('clean-image', function () {
    return gulp.src([dest('img')], {
            read: false
        })
        .pipe($.clean());
});

//html
gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe($.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(dest('html')))
        .pipe($.notify({
            message: 'html task complete'
        }));
});

//images
gulp.task('images', ['clean-image'], function () {
    return gulp.start('jpg', 'gif', 'png');
});

// default
gulp.task('default', ['clean'], function () {
    return gulp.start('seed', 'styles');
});