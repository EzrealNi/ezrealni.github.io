(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientHeight = docEl.clientHeight;
      if (!clientHeight) return;
      docEl.style.width = '1920px';
      docEl.style.height = '1080px';
      docEl.style.backgroundColor = '#fff';
      docEl.style.transformOrigin = '275% 0';
      docEl.style.transform = 'scale(' + clientHeight / 1080 + ')';
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
