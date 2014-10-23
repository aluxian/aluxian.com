selectMenuItem = (items, i) ->
  item.classList.remove 'active' for item in items
  items[i].classList.add 'active'

menuItems = document.querySelectorAll 'nav ul li'
selectMenuItem menuItems, 0

phrases = [
  'FULL-STACK WEB CODER',
  'ANDROID DEVELOPER',
  'iOS BEGINNER',
  'MAC USER',
  'TECHNOLOGY ENTHUSIAST',
  'OCCASIONAL HACKER'
]

titleElement = document.querySelectorAll('.hero .title')[0]
lastIndex = 0

# Shuffle phrases
i = phrases.length
while i
  j = Math.floor Math.random() * i
  x = phrases[--i]
  phrases[i] = phrases[j]
  phrases[j] = x

nextIndex = ->
  lastIndex += 1
  lastIndex = 0 if lastIndex >= phrases.length
  lastIndex

switchClasses = ->
  titleElement.classList.remove 'fadeIn'
  titleElement.classList.add 'fadeOut'

animate = ->
  titleElement.innerHTML = phrases[nextIndex()]
  titleElement.classList.remove 'fadeOut'
  titleElement.classList.add 'fadeIn'
  setTimeout switchClasses, 2750

titleElement.innerHTML = phrases[0]
setInterval animate, 3000
