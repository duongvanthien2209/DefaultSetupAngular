const { src, dest, parallel, watch, series } = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  browserSync = require("browser-sync").create(),
  angularFileSort = require("gulp-angular-filesort"),
  templateCache = require("gulp-angular-templatecache"),
  ngAnnotate = require("gulp-ng-annotate");

const FilesPath = {
  sassFiles: "app/scss/*.scss",
  mainHtmlFile: "app/index.html",
  // htmlFiles: "app/pug/pages/*.pug",
  htmlTemplates: "app/templates/**/*.html",
  jsFiles: "app/js/**/*.js",
};

function sassTask() {
  return src(FilesPath.sassFiles)
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function mainHtmlTask() {
  return src(FilesPath.mainHtmlFile)
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// function htmlTask() {
//   return src(FilesPath.htmlFiles)
//     .pipe(pug({ pretty: true }))
//     .pipe(dest("dist"))
//     .pipe(browserSync.stream());
// }

function htmlTask() {
  return src(FilesPath.htmlTemplates)
    .pipe(
      templateCache("template.js", {
        module: "quizApp",
        root: "app/templates",
      })
    )
    .pipe(gulp.dest("dist/templates"))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(FilesPath.jsFiles)
    .pipe(ngAnnotate())
    .pipe(angularFileSort())
    .pipe(concat("script.js"))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function assetsTask() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
  browserSync.init({ server: { baseDir: "./dist" } });

  watch(FilesPath.jsFiles, sassTask);
  watch(FilesPath.htmlTemplates, htmlTask);
  watch(FilesPath.mainHtmlFile, mainHtmlTask);
  // watch("app/pug/**/*.pug", htmlTask);
  watch(FilesPath.jsFiles, jsTask);
}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.mainHtml = mainHtmlTask;
exports.default = series(
  parallel(htmlTask, sassTask, jsTask, assetsTask, mainHtmlTask)
);
exports.serve = series(
  serve,
  parallel(htmlTask, sassTask, jsTask, assetsTask, mainHtmlTask)
);
