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
  titleElement = document.querySelector('.hero .title');
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
  var checkMenu, navTrigger, offset, popupNav, popupNavList;
  offset = 900;
  popupNav = document.querySelector('.popup-nav.fixed');
  navTrigger = popupNav.querySelector('.trigger');
  popupNavList = popupNav.querySelector('nav ul');
  checkMenu = function() {
    var animCallback, c, cb, type, types, _i, _j, _k, _len, _len1, _len2, _ref, _results, _results1;
    if (window.scrollY > offset && !popupNav.classList.contains('visible')) {
      popupNav.classList.add('visible');
      types = ['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend'];
      animCallback = function(type) {
        popupNavList.classList.add('has-transitions');
        return navTrigger.removeEventListener(type, animCallback);
      };
      _results = [];
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        _results.push(navTrigger.addEventListener(type, animCallback.bind(null, type)));
      }
      return _results;
    } else if (window.scrollY <= offset - 500) {
      if (popupNavList.classList.contains('is-visible')) {
        popupNavList.classList.add('is-hidden');
        types = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'];
        cb = function(type) {
          var c, _j, _len1, _ref;
          _ref = ['is-visible', 'is-hidden', 'has-transitions'];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            c = _ref[_j];
            popupNavList.classList.remove(c);
          }
          popupNav.classList.remove('visible');
          navTrigger.classList.remove('menu-is-open');
          return navTrigger.removeEventListener(type, cb);
        };
        _results1 = [];
        for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
          type = types[_j];
          _results1.push(popupNavList.addEventListener(type, cb.bind(null, type)));
        }
        return _results1;
      } else if (popupNavList.classList.contains('is-visible')) {
        _ref = ['is-visible', 'has-transitions'];
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          c = _ref[_k];
          popupNavList.classList.remove(c);
        }
        popupNav.classList.remove('visible');
        return navTrigger.classList.remove('menu-is-open');
      } else {
        popupNav.classList.remove('visible');
        return popupNavList.classList.remove('has-transitions');
      }
    }
  };
  checkMenu();
  window.onscroll = checkMenu;
  return navTrigger.addEventListener('click', function() {
    var type, types, _i, _len;
    navTrigger.classList.toggle('menu-is-open');
    types = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'];
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      type = types[_i];
      popupNavList.removeEventListener(type);
    }
    return popupNavList.classList.toggle('is-visible');
  });
})();
