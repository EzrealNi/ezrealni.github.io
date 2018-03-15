var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

gulp.task('server', function() {
  connect.server({
    root: ['src'],
    port: 8000,
    livereload: true,
    middleware: function(connect, opt) {
      return [
        proxy('/simplechat', {
          target: 'http://webapps.msxiaobing.com',
          changeOrigin: true,
          onProxyReq: function(proxyReq, req, res) {
            // proxyReq.setHeader(
            //   'cookie',
            //   'ai_user=JLCW1|2018-02-13T07:14:28.916Z; cookieid=0ca905e7ed924b3883233f6bdbcaca0b; ARRAffinity=bb32e599325eed805161e22ec9ff5b8fe49afd6b5985853814f2774ec11da2dc; ai_session=AAah6|1519701392590|1519702027641.3; ai_user=JLCW1|2018-02-13T07:14:28.916Z; cookieid=0ca905e7ed924b3883233f6bdbcaca0b; ARRAffinity=bb32e599325eed805161e22ec9ff5b8fe49afd6b5985853814f2774ec11da2dc; ai_session=AAah6|1519701392590|1519702090359.6'
            // );
            proxyReq.setHeader('referer', 'http://webapps.msxiaobing.com/mindreader');
            // proxyReq.setHeader('origin', 'http://webapps.msxiaobing.com');
          }
        })
      ];
    }
  });
});
