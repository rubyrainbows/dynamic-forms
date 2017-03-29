var gulp = require("gulp");
var babel = require("gulp-babel");
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function () {
    return gulp.src("src/dynamic_forms.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task('build_playground', function () {
    return gulp.src(["dist/dynamic_forms.min.js", "node_modules/jquery/dist/jquery.min.js"])
        .pipe(uglify())
        .pipe(gulp.dest("docs"));
});

gulp.task("default", ['build','build_playground']);

gulp.task('watch', function () {
    gulp.watch('src/*.js', ['default']);
});