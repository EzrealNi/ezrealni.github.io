var settings = {
  async: true,
  crossDomain: true,
  url: '/simplechat/getresponse?workflow=Q20',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    // referer: 'http://webapps.msxiaobing.com/mindreader',
    // 'cache-control': 'no-cache',
    'postman-token': '8a81196d-446d-7d07-d94a-ab3d484b3a2c'
  },
  processData: false,
  data: '{"SenderId":"a807ef23-31d7-47c0-4879-3a2e019f87f3","Content":{"Text":"是","Image":""}}'
};

var cookie =
  'ai_user=JLCW1|2018-02-13T07:14:28.916Z; cookieid=0ca905e7ed924b3883233f6bdbcaca0b; ARRAffinity=bb32e599325eed805161e22ec9ff5b8fe49afd6b5985853814f2774ec11da2dc; ai_session=AAah6|1519701392590|1519702027641.3; ai_user=JLCW1|2018-02-13T07:14:28.916Z; cookieid=0ca905e7ed924b3883233f6bdbcaca0b; ARRAffinity=bb32e599325eed805161e22ec9ff5b8fe49afd6b5985853814f2774ec11da2dc; ai_session=AAah6|1519701392590|1519702090359.6';

cookie.split(';').forEach(function(c) {
  document.cookie = c;
});

$.ajax(settings).done(function(response) {
  document.write(response);
});
