const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")


// const imagemin = require('gulp-imagemin');

// function imgMinify() {
//     return gulp.src('project/pics/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/images'));
// }

// exports.img = imgMinify

const htmlmin = require('gulp-htmlmin');
function copyHtml() {
    return src('project/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = copyHtml



const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsMinify() {
    return src('project/js/**/*.js',{sourcemaps:true}) //path includeing all js files in all folders
    
        //concate all js files in all.min.js
        .pipe(concat('all.min.js'))
        //use terser to minify js files
        .pipe(terser())
        //create source map file in the same directory
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify


//minify css files and copy it to dist folder

var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src("project/css/**/*.css")
        //concate all css files in style.min.css
        .pipe(concat('style.min.css'))
        //minify file 
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
//sass task
// var sass = require('gulp-sass');
// function sassMinify() {
//     return src(["project/sass/**/*.scss", "project/css/**/*.css"],{sourcemaps:true})
//         .pipe(sass()) // Using gulp-sass to convert sass to css
//         //concate all js files in all.min.js
//         .pipe(concat('style.sass.min.css'))
//         .pipe(cleanCss())
//         .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
// }



var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch task
function watchTask() {
    watch('project/*.html',series(copyHtml, reloadTask))
    watch('project/js/**/*.js',series(jsMinify, reloadTask))
    watch(["project/css/**/*.css"], parallel(cssMinify,reloadTask));
}
exports.default = series(parallel( jsMinify, cssMinify, copyHtml), serve,watchTask)
// exports.default = series(parallel(imgMinify, jsMinify/* , cssMinify */, sassMinify, copyHtml), serve,watchTask)




