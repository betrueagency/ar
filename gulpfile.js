var pkg = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var footer = require('gulp-footer');
var ghPages = require('gulp-gh-pages');

var runSequence = require('run-sequence');
var flatten = require('gulp-flatten');
var header = require('gulp-header');
var clean = require('gulp-clean');
var buildConfig = require('./build.config.js');



/**
 * main build task
 */
gulp.task('build', function(callback) {
    runSequence('clean','sass',
        'css',
        ['uglify','vendor','html','fonts','vis'],'assets',
        callback);


});

/**
 * Compile les fichier scss en css et les dépose dans le répertoire /src/assets/css
 */
gulp.task('sass', function(done) {
    gulp.src('./src/assets/sass/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./src/assets/css'))
        .on('end', done);


});

/**
 *
 * Supression des fichiers du precedent build
 *
 */
gulp.task('clean', function () {
    return gulp.src(['dist/assets','dist/app'],
        {force: true})
        .pipe(clean());
});


gulp.task('css', function(done) {
    gulp.src(buildConfig.cssDependencies
        .concat('src/assets/css/*.css'))
        .pipe(concat('main.css'))
      //  .pipe(minifyCss({
        //    keepSpecialComments: 0
        //}))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist/assets/css'))
        .on('end', done);
});

/**
 * Concat et Minifie le Javascript applicatif
 */
gulp.task('uglify', function() {
    return gulp.src(buildConfig.src)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(header(buildConfig.banner,{pkg:pkg}))
        .pipe(header(buildConfig.closureStart))
               .pipe(footer(buildConfig.closureEnd))
        .pipe(gulp.dest('dist/app'));
});

/**
 * Concat et Minifie le Javascript des librairies utilisés
 * et les déplace
 */
gulp.task('vendor', function() {
    return gulp.src(buildConfig.jsDependencies)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/lib'));
});

/**
 * Concat et Minifie le Javascript des librairies utilisés
 * et les déplace
 */
gulp.task('vis', function() {
    return gulp.src('node_modules/vis/dist/img/network/**/*')
        .pipe(gulp.dest('dist/assets/css/img/network/'));
});



/**
 * Déplace les fichier html de l'application
 *
 */
gulp.task('html', function() {
    gulp.src('./src/app/**/*.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/app'));
});

/**
 * copie des resources present dans assets autre que Javascrip (sera minifié et concaténé)
 */
gulp.task('assets', function() {
    gulp.src(['!node_modules/**/*.js',
        '!node_modules/**/*.json',
        '!node_modules/**/*.md',
        '!node_modules/**/*.md',
        '!node_modules/**/*.html',
        '!node_modules/**/*.xml',
        '!node_modules/**/*.js.map',
        '!node_modules/**/*.css',
        '!src/assets/css/**/*',
        '!src/assets/scss/**/*.scss',
        'src/assets/**/*'
    ])
        // And put it in the dist folder
        .pipe(gulp.dest('dist/assets'));
    gulp.src(['node_modules/ng-walkthrough/icons/**.*'])
           // And put it in the dist folder
           .pipe(gulp.dest('dist/assets/lib/icons'));
});


gulp.task('fonts', function() {
    gulp.src(['node_modules/**/*.{eot,svg,ttf,woff,woff2}',
        'node_modules/components-font-awesome/fonts/*.{eot,svg,ttf,woff}'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/assets/fonts'));
});


gulp.task('deploy',  function () {
    return gulp.src(['dist/**/*'])
        .pipe(ghPages());
});

