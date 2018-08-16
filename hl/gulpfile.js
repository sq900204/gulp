// 模块引入
var gulp = require('gulp'),                        // gulp基础文件
sass = require('gulp-sass')                    // sass编译
minifycss = require('gulp-minify-css'),        // 压缩css
rename = require('gulp-rename'),               // 重命名
autoprefixer = require('gulp-autoprefixer'),   //添加css前缀
browserSync = require('browser-sync'),         // 自动刷新页面
runSequence = require('run-sequence'),         // 顺序执行代码
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
imagemin = require('gulp-imagemin'),
cache = require('gulp-cache'),                 // cache减少重复压缩图片
pngquant = require('imagemin-pngquant'),
clean = require('gulp-clean'),
del = require("del"),
plumber = require('gulp-plumber');             // 阻止 gulp 插件发生错误导致进程退出
// 源文件路径以及输出文件路径设置	
var htmlSrc =  'src/**/*.html',                  // html源文件路径       
htmlDist = './dist/',                       // html输出路径
styleSrc = ['src/common/sass/common.scss', 'src/**/*.scss', 'src/**/*.css'],                    // 样式源文件路径
styleDist = './dist/css',                      // 样式输出路径
scriptSrc = ['src/lib/*.js','src/js/*.js'],
scriptDist = './dist/js',
imgSrc =  'src/img/**/*',
imgDist = './dist/img',
fontSrc = 'src/scss/iconfont/*.+(eot|svg|ttf|woff)',   // 不要生成无用的font目录和_iconfont.sass文件
fontDist = './dist/css';

// html
gulp.task('html', function() {
return gulp.src(htmlSrc)
		 .pipe(plumber())
		 .pipe(rename({dirname: ''}))      // 加上rename可以在生成文件目录中去掉源文件所在目录
		 .pipe(gulp.dest(htmlDist))
});

/* 样式 */
gulp.task("styles",function(){
return gulp.src(styleSrc)                           // 源文件路径
		   .pipe(plumber({
			errorHandler: function(err) {
			  console.log(err);
			  this.emit('end');
			}
		  }))
		   .pipe(sass({ style: 'expanded'}))        // 编译sass
		   .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))  // 生成css前缀
		   .pipe(rename({dirname: ''}))			
		   .pipe(gulp.dest(styleDist))              // 生成未压缩的css文件
		   .pipe(rename({ suffix: '.min' }))        // 重命名压缩的文件
		   .pipe(minifycss())                       // 压缩css
		   .pipe(gulp.dest(styleDist));             // 生成路径： 注意--gulp.dest()在压缩前先执行一次生成未压缩的css文件，否则只有一个css压缩文件
		   
});

// 脚本
gulp.task("scripts",function(){
return gulp.src(scriptSrc)
		   //.pipe(jshint())
		   //.pipe(jshint.reporter("default"))        // js语法检查
		   //.pipe(concat("main.js"))                 // 把所有js文件合并到一个叫"main.js文件中"
		   .pipe(plumber({
			errorHandler: function(err) {
			  console.log(err);
			  this.emit('end');
			}
		  }))
		   .pipe(rename({dirname: ''}))
		   .pipe(gulp.dest(scriptDist))
		   .pipe(rename({ suffix: '.min' }))
		   .pipe(uglify())                          // 压缩文件 
		   .pipe(gulp.dest(scriptDist));
					  
});

// 图片
gulp.task('images', function(){
//return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
return gulp.src(imgSrc)
.pipe(imagemin())                      // 图片压缩时间比较长，使用gulp-cache减少重复压缩
.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
.pipe(plumber({
	errorHandler: function(err) {
		console.log(err);
		this.emit('end');
	}
}))
.pipe(rename({dirname: ''}))
.pipe(gulp.dest(imgDist));

});

// 字体
gulp.task('fonts', function() {
return gulp.src(fontSrc)
	.pipe(plumber({
		errorHandler: function(err) {
			console.log(err);
			this.emit('end');
		}
	}))
	 .pipe(rename({dirname: ''}))
	 .pipe(gulp.dest(fontDist))
});

// 清理 del()NPM提供的插件
gulp.task("clean",function(cb){          // 用一个回调函数（cb）确保在退出前完成任务。
del([
	"dist/www/*",
	"dist/css/*",
	"dist/js/*",
	"dist/img/*"
],cb);
});


/* 监听 .watch方法路径不要用 './xx' 
* 用'./xx' 开头作为当前路径开始，会导致无法监测到新增文件，所以直接省略掉 './' 即可。
* './img/*' === 'img/*'
*/
gulp.task("watch",function(){
gulp.watch(htmlSrc, ['html']);	
gulp.watch(styleSrc, ['styles']);              // 这里[styles]指的是gulp.task("styles",function(){})中任务名称
gulp.watch(scriptSrc, ['scripts']);
gulp.watch(imgSrc, ['images']);
gulp.watch(fontSrc, ['fonts']);
});

// 自动刷新页面
gulp.task("browserSync",function(){
browserSync({
  server: { baseDir: ["dist","src"]},    // 需要知道根目录
  files: [                               // 若少了这行，则找不到路径 
  "dist" + '/**'      
]
})
});

// 顺序执行
gulp.task('build', function (callback) {
runSequence('clean',
["html",'styles', 'scripts', 'images', 'fonts'],
callback
)
})

// 默人任务
gulp.task('default',function (callback) {
runSequence(["html",'styles',"scripts","images", "browserSync","fonts",'watch'],callback)
});