var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack-stream");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

gulp.task('default', function() {
    gulp.src("./src/index.html")
      .pipe(gulp.dest('dist/'));

    gulp.src("./src/default.css")
      .pipe(gulp.dest('dist/'));

    gulp.src("./src/docs.json")
      .pipe(gulp.dest('dist/'));

    gulp.src("./src/main.js")
      .pipe(webpack( require('./webpack.config.js') ))
      .pipe(gulp.dest('dist/'));
      
});

gulp.task("webpack-dev-server", function(callback) {
    var compiler = webpack(
        require('./webpack.config.js') 
    );

    new WebpackDevServer(compiler, {
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});
