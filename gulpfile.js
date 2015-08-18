var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
// var rev = require('gulp-rev');
// var revReplace = require('gulp-rev-replace');

var app = {
  'name': 'tuco',
  'static': 'public',
  'dev': 'dev',
};

var dirs = {
  'scss': 'dev/scss',
  'css': app.static + '/css',
  'js': app.static + '/js',
  'images': app.static + '/images',
  'views': 'views',
};

var dev = {
  'scss': app.dev + '/scss/main.scss',

  'js': [app.dev + '/js/dragdealer.js',
         app.dev + '/js/stage.js'],

  'images': dirs.images + '/*.*',
};

var build = {
  'css': dirs.css + '/' + app.name + '.css',
  'js': dirs.js + '/' + app.name + '.js',
};

gulp.task('scss', function() {
  return gulp.src(dev.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename(app.name + '.css'))
    .pipe(gulp.dest(dirs.css));
});

gulp.task('minify', function() {
  return gulp.src(build.css)
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename(app.name + '.min.css'))
    .pipe(gulp.dest(dirs.css));
});

gulp.task('js', function() {
  return gulp.src(dev.js)
    .pipe(concat(app.name + '.js'))
    .pipe(gulp.dest(dirs.js));
});

gulp.task('uglify', function() {
  return gulp.src(build.js)
    .pipe(uglify())
    .pipe(rename(app.name + '.min.js'))
    .pipe(gulp.dest(dirs.js));
});

gulp.task('watch', function() {
  gulp.watch(app.dev + '/scss/*.scss', ['scss']);
  gulp.watch(app.dev + '/js/*.js', ['js']);
});

// gulp.task('revision', function() {
//   return gulp.src([dirs.js + app.name + '.min.js', dirs.css + app.name + '.min.css', files.img], {base: 'public'})
//     .pipe(rev())
//     .pipe(gulp.dest(app.static))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest(app.dev))
// })

// gulp.task('revReplace', function() {
//   var manifest = gulp.src(app.dev + 'rev-manifest.json');
//   return gulp.src(dirs.views + 'canvas.jade')
//     .pipe(revReplace({
//       manifest: manifest,
//       replaceInExtensions: ['.js', '.css', '.jade'],
//     }))
//     .pipe(gulp.dest(dirs.views))
// })