window.onload = function() {
  setAnimationFrame();
  drawRings();
};

const data = [
  {
    cx: 200,
    cy: 200,
    r: 100,
    opacity: 0.8,
    fill: '#127fc4'
  },
  {
    cx: 400,
    cy: 200,
    r: 100,
    opacity: 0.8,
    fill: '#000000'
  },
  {
    cx: 600,
    cy: 200,
    r: 100,
    opacity: 0.8,
    fill: '#dd0c22'
  },
  {
    cx: 300,
    cy: 300,
    r: 100,
    opacity: 0.8,
    fill: '#f7c62b'
  },
  {
    cx: 500,
    cy: 300,
    r: 100,
    opacity: 0.8,
    fill: '#11963d'
  }
];

const setAnimationFrame = function() {
  // requestAnimationFrame的兼容处理
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(fn) {
      setTimeout(fn, 17);
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
};

const drawRings = function() {
  data.forEach((d, i) => {
    d['data-index'] = i;
    ring.draw(d);
  });

  bindEvent();
};

const bindEvent = function() {
  const circles = document.querySelectorAll('circle');
  circles.forEach(circle => {
    circle.addEventListener('mouseenter', e => {
      ring.moveUp(e.target);
      ring.flashOut(e.target);
    });
    circle.addEventListener('mouseleave', e => {
      ring.flashIn(e.target);
    });
  });
};

const ring = {
  draw: function(targetData) {
    const svg = document.getElementById('svg');
    const target = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    Object.keys(targetData).forEach(k => {
      target.setAttribute(k, targetData[k]);
    });
    svg.appendChild(target);
  },
  flashOut: function(target) {
    ring.animation(target, 'r', 150, 600);
  },
  flashIn: function(target) {
    ring.animation(target, 'r', 100, 600);
  },
  moveUp: function(target) {
    const parentNode = target.parentNode;
    parentNode.removeChild(target);
    parentNode.append(target);
  },
  animation: function(target, attribute, value, speed = 1000) {
    const start = parseFloat(target.getAttribute(attribute));
    const end = parseFloat(value);
    const startTime = new Date().getTime();

    const animationFrame = function() {
      window.cancelAnimationFrame(target.AnimationFrame);
      target.AnimationFrame = window.requestAnimationFrame(() => {
        const currentTime = new Date().getTime();
        const passTime = currentTime - startTime;
        const currentValue = ring.Tween.Cubic.easeOut(passTime, start, end - start, speed);
        target.setAttribute(attribute, currentValue);
        if (passTime < speed) {
          animationFrame();
        }
      });
    };
    animationFrame();
  },
  Tween: {
    Linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    Cubic: {
      easeIn: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOut: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    }
  }
};
