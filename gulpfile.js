const path = require('path');
const fs = require('fs');
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
const gdata = require('gulp-data');

const out_dir = 'dist';
const port = process.env.PORT || 3000;
const livereload_port = 13888;

gulp.task('clean', function () {
    return gulp.src(out_dir, {read: false})
    .pipe(clean());
});

gulp.task('html', () => {
    gulp.src('src/views/*.ejs')
    .pipe(gdata((file) => {
        try{
            return JSON.parse(fs.readFileSync('src/data/' + path.basename(file.path, '.ejs') + '.json'));
        } catch(e){
            gutil.log(gutil.colors.red('Views'), "- File", 'src/data/' + path.basename(file.path, '.ejs') + '.json', "doesn't exist.");
        }
    }))
    .pipe(ejs({}, {}, {ext: '.html'}).on('error', gutil.log))
    .pipe(gulp.dest(`${out_dir}/`))
    .pipe(connect.reload());
});

gulp.task('css', () => {
    let plugins = [
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];
    return gulp.src('src/sass/main.scss')
    .pipe(sass({
        includePaths: ['node_modules']
    })
    .on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(`./${out_dir}/css`))
    .pipe(connect.reload());
});

gulp.task('js', () => {
    browserify({
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .on('error', gutil.log)
    .pipe(source('main.js'))
    .pipe(gulp.dest(`${out_dir}/js`))
    .pipe(connect.reload());
});

gulp.task('assets', () => {
    return gulp.src(['src/assets/**/*'])
    .pipe(gulp.dest(`${out_dir}/assets`));
});

gulp.task('build', () => {
    runSequence(
        'clean',
        ['html', 'css', 'js', 'assets']
    );
});

gulp.task('watch', () => {
    gulp.watch(['src/views/**/*.ejs', 'src/data/**/*.json'], ['html']);
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch('src/ts/**/*.ts', ['js']);
});

gulp.task('connect', function() {
    connect.server({
        root: out_dir,
        livereload: {
            port: livereload_port
        },
        port: port,
    });
});

gulp.task('dev', () => {
    runSequence(
        'build',
        ['connect', 'watch']
    );
});

gulp.task('default', ['dev']);
