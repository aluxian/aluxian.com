(function() {
  var belowFullscreen, fadeIn, fadeOut, fullscreen, height, i, item, j, lastIndex, menuItems, mouseOut, mouseOver, navList, nextIndex, phrases, popupNav, randomInt, selectedMenuItem, selectedMenuItemHighlighted, size, timeout, titleElement, trigger, update, x, _i, _len;
  menuItems = document.querySelectorAll('header > nav ul li');
  selectedMenuItem = 0;
  selectedMenuItemHighlighted = true;
  update = function() {
    if (selectedMenuItemHighlighted) {
      return menuItems[selectedMenuItem].classList.add('active');
    } else {
      return menuItems[selectedMenuItem].classList.remove('active');
    }
  };
  mouseOver = function(event) {
    selectedMenuItemHighlighted = event.target.parentElement === menuItems[selectedMenuItem];
    return update();
  };
  mouseOut = function() {
    var timeout;
    selectedMenuItemHighlighted = true;
    clearTimeout(timeout);
    return timeout = setTimeout(update, 300);
  };
  for (_i = 0, _len = menuItems.length; _i < _len; _i++) {
    item = menuItems[_i];
    item.addEventListener('mouseover', mouseOver, false);
    item.addEventListener('mouseout', mouseOut, false);
  }
  timeout = null;
  update();
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
  fadeIn();
  popupNav = document.querySelector('.popup-nav');
  trigger = popupNav.querySelector('.trigger');
  navList = popupNav.querySelector('nav ul');
  trigger.addEventListener('click', function() {
    trigger.classList.toggle('menu-is-open');
    return navList.classList.toggle('is-visible');
  });
  randomInt = Math.floor(Math.random() * 3);
  size = 1920;
  if (innerWidth <= 1440 && innerHeight <= 1024) {
    size = 1440;
  }
  if (innerWidth <= 768 && innerHeight <= 768) {
    size = 768;
  }
  if (innerWidth <= 480 && innerHeight <= 480) {
    size = 480;
  }
  document.querySelector('.fullscreen').style.backgroundImage = "url('../img/background-" + randomInt + "@" + size + ".jpg')";
  fullscreen = document.querySelector('.fullscreen');
  belowFullscreen = document.querySelector('.below-fullscreen');
  height = fullscreen.offsetHeight;
  if (innerWidth >= 480 && innerHeight < 600) {
    height = 600;
  } else if (innerHeight < 400) {
    height = 400;
  }
  fullscreen.style.height = height + 'px';
  belowFullscreen.style.top = height + 'px';
  return smoothScroll.init({
    callbackAfter: function(toggle) {
      var _j, _len1;
      for (i = _j = 0, _len1 = menuItems.length; _j < _len1; i = ++_j) {
        item = menuItems[i];
        if (item.childNodes[0] === toggle) {
          menuItems[selectedMenuItem].classList.remove('active');
          selectedMenuItem = i;
          menuItems[selectedMenuItem].classList.add('active');
        }
      }
      trigger.classList.remove('menu-is-open');
      return navList.classList.remove('is-visible');
    }
  });
})();
