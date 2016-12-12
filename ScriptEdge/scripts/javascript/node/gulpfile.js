const gulp = require('gulp');
const eslint = require('gulp-eslint');

const path = {
  js: './src/**/*.js',
  json: './src/**/*.json'
};

gulp.task('json:copy', function() {
  return gulp.src(path.json)
    .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
  const st = gulp.src(path.js)
    .pipe(eslint())
    .pipe(eslint.format());

  if (gulp.isWatching) {
    return st;
  } else {
    return st.pipe(eslint.failAfterError());
  }
});

gulp.task('watch', function() {
  gulp.watch([path.js, path.json], ['server']);
  gulp.watch('./start.js', ['server']);
});
