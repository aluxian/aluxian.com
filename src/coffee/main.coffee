deselectMenuItems = (items) ->
  item.classList.remove('active') for item in items

selectMenuItem = (items, i) ->
  deselectMenuItems items
  items[i].classList.add 'active'

menuItems = document.querySelectorAll 'nav ul li'
selectMenuItem menuItems, 0
