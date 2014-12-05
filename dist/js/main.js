(function() {
  var activeItemSelected, activeMenuItem, item, menuItems, mouseOut, mouseOver, timeout, update, _i, _len;
  menuItems = document.querySelectorAll('nav ul li');
  activeMenuItem = 0;
  activeItemSelected = true;
  update = function() {
    if (activeItemSelected) {
      return menuItems[activeMenuItem].classList.add('active');
    } else {
      return menuItems[activeMenuItem].classList.remove('active');
    }
  };
  mouseOver = function(event) {
    activeItemSelected = event.target.parentElement === menuItems[activeMenuItem];
    return update();
  };
  mouseOut = function() {
    var timeout;
    activeItemSelected = true;
    clearTimeout(timeout);
    return timeout = setTimeout(update, 300);
  };
  for (_i = 0, _len = menuItems.length; _i < _len; _i++) {
    item = menuItems[_i];
    item.addEventListener('mouseover', mouseOver, false);
    item.addEventListener('mouseout', mouseOut, false);
  }
  timeout = null;
  return update();
})();

(function() {
  var fadeIn, fadeOut, i, j, lastIndex, nextIndex, phrases, titleElement, x;
  phrases = ['FULL-STACK WEB CODER', 'ANDROID DEVELOPER', 'iOS BEGINNER', 'MAC USER', 'TECHNOLOGY ENTHUSIAST', 'OCCASIONAL HACKER', 'COMMAND-LINE WIZARD'];
  titleElement = document.querySelector('.hero h2:last-child');
  lastIndex = -1;
  i = phrases.length;
  while (i) {
    j = Math.floor(Math.random() * i);
    x = phrases[--i];
    phrases[i] = phrases[j];
    phrases[j] = x;
  }
  nextIndex = function() {
    lastIndex += 1;
    if (lastIndex >= phrases.length) {
      lastIndex = 0;
    }
    return lastIndex;
  };
  fadeIn = function() {
    titleElement.innerHTML = phrases[nextIndex()];
    titleElement.style.opacity = 1;
    return setTimeout(fadeOut, 2750);
  };
  fadeOut = function() {
    titleElement.style.opacity = 0;
    return setTimeout(fadeIn, 250);
  };
  return fadeIn();
})();

(function() {
  var navList, popupNav, trigger;
  popupNav = document.querySelector('.popup-nav');
  trigger = popupNav.querySelector('.trigger');
  navList = popupNav.querySelector('nav ul');
  return trigger.addEventListener('click', function() {
    trigger.classList.toggle('menu-is-open');
    return navList.classList.toggle('is-visible');
  });
})();

(function() {
  var randomInt, size;
  randomInt = Math.floor(Math.random() * 3);
  size = 1920;
  if (window.innerWidth <= 1440 && window.innerHeight <= 1024) {
    size = 1440;
  }
  if (window.innerWidth <= 768 && window.innerHeight <= 768) {
    size = 768;
  }
  if (window.innerWidth <= 480 && window.innerHeight <= 480) {
    size = 480;
  }
  return document.querySelector('.fullscreen').style.backgroundImage = "url('../img/background-" + randomInt + "@" + size + ".jpg')";
})();

(function() {
  return window.scrollTo = function(to) {
    var animateScroll, change, currentTime, doc, duration, easeInOutQuad, firefox, increment, msie, requestAnimFrame, start;
    firefox = navigator.userAgent.indexOf('Firefox');
    msie = navigator.userAgent.indexOf('MSIE');
    doc = firefox !== -1 || msie !== -1 ? document.documentElement : document.body;
    easeInOutQuad = function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((t - 1) * (t - 3) - 1) + b;
      }
    };
    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
    start = doc.scrollTop;
    change = to.offsetTop - start;
    console.log(to, to.offsetTop, start, change);
    currentTime = 0;
    increment = 20;
    duration = 800;
    animateScroll = function() {
      var val;
      currentTime += increment;
      val = easeInOutQuad(currentTime, start, change, duration);
      doc.scrollTop = val;
      if (currentTime < duration) {
        return requestAnimFrame(animateScroll);
      }
    };
    return animateScroll();
  };
})();

(function() {
  var belowFullscreen, fullscreen, height, item, onClick, _i, _len, _ref, _results;
  fullscreen = document.querySelector('.fullscreen');
  belowFullscreen = document.querySelector('.below-fullscreen');
  height = fullscreen.offsetHeight;
  if (window.innerWidth >= 480 && window.innerHeight < 600) {
    height = 600;
  } else if (window.innerHeight < 400) {
    height = 400;
  }
  fullscreen.style.height = height + 'px';
  belowFullscreen.style.top = height + 'px';
  onClick = function() {
    return window.scrollTo(document.querySelector("a[name='" + (this.hash.substring(1)) + "']"));
  };
  _ref = document.querySelectorAll('nav a');
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    _results.push(item.onclick = onClick);
  }
  return _results;
})();
