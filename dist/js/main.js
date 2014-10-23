var animate, i, j, lastIndex, menuItems, nextIndex, phrases, selectMenuItem, switchClasses, titleElement, x;

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

lastIndex = 0;

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

switchClasses = function() {
  titleElement.classList.remove('fadeIn');
  return titleElement.classList.add('fadeOut');
};

animate = function() {
  titleElement.innerHTML = phrases[nextIndex()];
  titleElement.classList.remove('fadeOut');
  titleElement.classList.add('fadeIn');
  return setTimeout(switchClasses, 2750);
};

titleElement.innerHTML = phrases[0];

setInterval(animate, 3000);
