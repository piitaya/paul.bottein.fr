const gulp = require('gulp');
const connect = require('gulp-connect');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const clean = require('gulp-clean');
const source = require('vinyl-source-stream');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserify = require('browserify');
const tsify = require('tsify');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('html', () => {
    return gulp.src('src/views/*.ejs')
    .pipe(ejs({}, {}, {ext: '.html'}).on('error', gutil.log))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('css', () => {
    let plugins = [
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];
    return gulp.src('./src/sass/main.scss')
    .pipe(sass({
        includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});

gulp.task('js', () => {
    return browserify({
        //basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest("build/js"))
    .pipe(connect.reload());
});

gulp.task('build', () => {
    runSequence(
        'clean',
        ['html', 'css', 'js']
    );
});

gulp.task('watch', () => {
    gulp.watch('src/views/**/*.ejs', ['html']);
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch('src/ts/**/*.ts', ['js']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

gulp.task('dev', () => {
    runSequence(
        'build',
        ['connect', 'watch']
    );
});

gulp.task('default', ['build']);
