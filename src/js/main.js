function deselectMenuItems(menuItems) {
  menuItems.forEach(function(item) {
    item.classList.remove('active');
  });
}

function selectMenuItem(menuItems, id) {
  deselectMenuItems(menuItems);
  menuItems[i].classList.add('active');
}

document.onload = function() {
  var menuItems = document.querySelectorAll('.menu li');
  selectMenuItem(menuItems, 0);
};
