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
  var checkMenu, fixedNav, mainNavigation, navTrigger, offset;
  offset = 900;
  fixedNav = document.querySelector('.fixed-nav');
  navTrigger = fixedNav.querySelector('.trigger');
  mainNavigation = fixedNav.querySelector('nav ul');
  checkMenu = function() {
    var animCallback, c, cb, htmlElem, type, types, _i, _j, _k, _len, _len1, _len2, _ref, _results, _results1;
    if ((window.scrollY > offset) && !(fixedNav.contains('is-fixed'))) {
      fixedNav.classList.add('is-fixed');
      types = ['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend'];
      animCallback = function(type) {
        mainNavigation.classList.add('has-transitions');
        return navTrigger.removeEventListener(type, animCallback);
      };
      _results = [];
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        _results.push(navTrigger.addEventListener(type, animCallback.bind(null, type)));
      }
      return _results;
    } else if (window.scrollY <= offset) {
      htmlElem = document.querySelector('html');
      if ((mainNavigation.classList.contains('is-visible')) && !(htmlElem.classList.contains('no-csstransitions'))) {
        mainNavigation.classList.add('is-hidden');
        types = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'];
        cb = function(type) {
          var c, _j, _len1, _ref;
          _ref = ['is-visible', 'is-hidden', 'has-transitions'];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            c = _ref[_j];
            mainNavigation.classList.remove(c);
          }
          fixedNav.classList.remove('is-fixed');
          navTrigger.classList.remove('menu-is-open');
          return navTrigger.removeEventListener(type, cb);
        };
        _results1 = [];
        for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
          type = types[_j];
          _results1.push(mainNavigation.addEventListener(type, cb.bind(null, type)));
        }
        return _results1;
      } else if ((mainNavigation.classList.contains('is-visible')) && (htmlElem.classList.contains('no-csstransitions'))) {
        _ref = ['is-visible', 'has-transitions'];
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          c = _ref[_k];
          mainNavigation.classList.remove(c);
        }
        fixedNav.classList.rmeove('is-fixed');
        return navTrigger.classList.remove('menu-is-open');
      } else {
        fixedNav.classList.remove('is-fixed');
        return mainNavigation.classList.remove('has-transitions');
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
      mainNavigation.removeEventListener(type);
    }
    return mainNavigation.classList.toggle('is-visible');
  });
})();
