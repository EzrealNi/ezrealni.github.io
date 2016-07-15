$(function(){
  setKeyWidth();
});

function setKeyWidth(){
  var calculatorWidth = $(".calculator").width(),
      keyWidth = (calculatorWidth-5)/4,
      zeroWidth = keyWidth*2+1;
  $(".key:not(.screen,.zero)").width(keyWidth);
  $(".key.zero").width(zeroWidth);
  $(".key:not(.screen)").css("line-height",$(".key.zero").height()+"px");
}

$(window).resize(function() {
  setKeyWidth();
});
