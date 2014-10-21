var deselectMenuItems = (items) ->
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove('active');

function selectMenuItem(items, i) {
  deselectMenuItems(items);
  items[i].classList.add('active');
}

var menuItems = document.querySelectorAll('nav ul li');
selectMenuItem(menuItems, 0);
