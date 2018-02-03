$(function() {
  getMixinPlayList();
});

var self = {
  getPlayList: function() {
    $.ajax({
      url: 'http://music.cheshirex.com/api.php',
      data: {
        types: 'userlist',
        uid: 52712950
      },
      dataType: 'json',
      type: 'post',
      success: function(data) {
        console.log(JSON.stringify(data));
      },
      error: function() {}
    });
  },
  getMixinPlayList: function() {
    $.getJSON('mixin.json', '', function(data) {
    });
  },
  render: function(data){
    
  }
};

Object.assign(window, self);
