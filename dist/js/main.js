var fadeIn, fadeOut, i, j, lastIndex, menuItems, nextIndex, phrases, selectMenuItem, titleElement, x;

selectMenuItem = function(items, i) {
  var item, _i, _len;
  for (_i = 0, _len = items.length; _i < _len; _i++) {
    item = items[_i];
    item.classList.remove('active');
  }
  return items[i].classList.add('active');
};

menuItems = document.querySelectorAll('nav ul li');

selectMenuItem(menuItems, 0);

phrases = ['FULL-STACK WEB CODER', 'ANDROID DEVELOPER', 'iOS BEGINNER', 'MAC USER', 'TECHNOLOGY ENTHUSIAST', 'OCCASIONAL HACKER'];

titleElement = document.querySelectorAll('.hero .title')[0];

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
