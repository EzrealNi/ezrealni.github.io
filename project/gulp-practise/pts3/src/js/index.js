window.onload = function() {
  setInterval(function() {
    initPage();
  }, 5000);
};

function initPage() {
  var now = utils.now();
  $('.main').append('<p>' + now + '</p>');
}
