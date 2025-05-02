const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const terser = require('gulp-terser')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const sourcemaps = require('gulp-sourcemaps')

const files = {
	scssPath: 'app/scss/**/*.scss',
	jsPath: 'app/js/*.js',
}

function gulpScss() {
	return src(files.scssPath, { sourcemaps: true })
		.pipe(sass())
		.pipe(sourcemaps.init())
		.pipe(concat('style.css'))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write())
		.pipe(dest('dist'))
}

function gulpJs() {
	return src(files.jsPath, { sourcemaps: true }).pipe(sourcemaps.init()).pipe(concat('script.js')).pipe(terser()).pipe(dest('dist'))
}

function watchTask() {
	watch([files.scssPath, files.jsPath], { interval: 1000, usePolling: true }, series(parallel(gulpScss, gulpJs)))
}

exports.default = series(parallel(gulpScss, gulpJs), watchTask)
