const basePaths = {
        src: 'build/',
        dest: 'app/'
    },
    paths = {
        images: {
            src: basePaths.src + 'img/',
            dest: basePaths.dest + 'img/'
        },
        sprite: {
            src: basePaths.src + 'sprite/*',
            svg: 'img/sprite.svg',
            css: '../' + basePaths.src + 'scss/components/_sprite.scss'
        },
        templates: {
            src: basePaths.src + 'scss/tpl/'
        }
    },
    $ = {
        gutil: require( 'gulp-util' ),
        svgSprite: require( 'gulp-svg-sprite' ),
        svg2png: require( 'gulp-svg2png' ),
        size: require( 'gulp-size' )
    },
    changeEvent = function(evt) {
        $.gutil.log( 'File', $.gutil.colors.cyan( evt.path.replace( new RegExp( '/.*(?=/" + basePaths.src + ")/' ), '' ) ), 'was', $.gutil.colors.magenta( evt.type ) )
    },
    gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    cleanCSS = require( 'gulp-clean-css' ),
    rename = require( 'gulp-rename' ),
    browserSync = require( 'browser-sync' ),
    csscomb = require( 'gulp-csscomb' ),
    path = require( 'path' ),
    concat = require( 'gulp-concat' ),
    imageop = require( 'gulp-image-optimization' ),
    uglify = require( 'gulp-uglify' );

//********************************************************************//

gulp.task( 'images', function(cb) {
    gulp.src( ['build/img/*.png', 'build/img/*.jpg', 'build/img/*.gif', 'build/img/*.jpeg'] ).pipe( imageop( {
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    } ) ).pipe( gulp.dest( 'app/img' ) ).on( 'end', cb ).on( 'error', cb )
} )

//********************************************************************//

gulp.task( 'svgSprite', () => {
    return gulp.src( paths.sprite.src )
        .pipe( $.svgSprite( {
            shape: {
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: './',
                    layout: 'diagonal',
                    sprite: paths.sprite.svg,
                    bust: false,
                    render: {
                        scss: {
                            dest: '../build/scss/components/_sprite.scss',
                            template: 'build/scss/tpl/sprite-template.scss'
                        }
                    }
                }
            },
            variables: {
                mapname: 'icons'
            }
        } ) )
        .pipe( gulp.dest( basePaths.dest ) )
} )

//********************************************************************//

gulp.task( 'pngSprite', gulp.parallel( 'svgSprite' ), () => {
    return gulp.src( basePaths.dest + paths.sprite.svg )
        .pipe( $.svg2png() )
        .pipe( $.size( {
            showFiles: true
        } ) )
        .pipe( gulp.dest( paths.images.dest ) )
} )

gulp.task( 'sprite', gulp.parallel( 'pngSprite' ) )



//********************************************************************//

gulp.task( 'styles', () => {
    return gulp.src( 'build/scss/*.scss' )
        .pipe( sass( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
        .pipe( autoprefixer( {
            browsers: [ 'last 15 versions' ],
            cascade: false
        } ) )
        // .pipe( rename( {
        //     suffix: '.min',
        //     prefix: ''
        // } ) )
        // .pipe( cleanCSS() )
        .pipe( csscomb() )
        .pipe( gulp.dest( 'app/css' ) )
        .pipe( browserSync.reload( { stream: true } ) )
} )

//********************************************************************//

gulp.task( 'scripts', () => {
    return gulp.src( [
        'app/libs/cssrelpreload/cssrelpreload.js',
        'app/libs/IntersectionObserver/IntersectionObserver.js',
        // 'app/libs/jquery-3.3.1/jquery-3.3.1.min.js',
        // 'app/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
        // 'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
    ] )
    .pipe( concat( 'scripts.js' ) )
    //.pipe( uglify() ) //Minify scripts.js
    .pipe( gulp.dest( 'app/js/' ) )
    .pipe( browserSync.reload( { stream: true } ) )
} )

//********************************************************************//

gulp.task( 'code', () => {
	return gulp.src( 'app/*.html' )
	.pipe( browserSync.reload( { stream: true } ) )
} )

//********************************************************************//

gulp.task( 'browser-sync', () => {
    browserSync.init( {
        server: {
            baseDir: "app"
        },
        notify: false
    } )
} )

//********************************************************************//

gulp.task( 'full', () => {
    return gulp.src( 'build/scss/*.scss' )
        .pipe( sass( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
        .pipe( autoprefixer( {
            browsers: [ 'last 15 versions' ],
            cascade: false
        } ) )
        .pipe( csscomb() )
        .pipe( gulp.dest( 'app/css' ) )
} )

//********************************************************************//

gulp.task( 'watch', () => {
    gulp.watch( 'build/scss/**/*.scss', gulp.parallel( 'styles' ) )
    gulp.watch( 'app/libs/**/*.js', gulp.parallel( 'scripts' ) )
    gulp.watch( 'app/*.html', gulp.parallel( 'code' ) )
} )

gulp.task( 'default', gulp.parallel( 'watch', 'styles', 'scripts', 'browser-sync' ) )
