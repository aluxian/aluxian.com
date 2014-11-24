(-> # Menu
  menuItems = document.querySelectorAll 'nav ul li'

  activeMenuItem = 0
  activeItemSelected = true

  update = ->
    if activeItemSelected
      menuItems[activeMenuItem].classList.add 'active'
    else
      menuItems[activeMenuItem].classList.remove 'active'

  mouseOver = (event) ->
    activeItemSelected = event.target.parentElement == menuItems[activeMenuItem]
    update()

  mouseOut = ->
    activeItemSelected = true
    clearTimeout timeout
    timeout = setTimeout update, 300

  for item in menuItems
    item.addEventListener 'mouseover', mouseOver, false
    item.addEventListener 'mouseout', mouseOut, false

  timeout = null
  update()
)()

(-> # Title animation
  phrases = [
    'FULL-STACK WEB CODER',
    'ANDROID DEVELOPER',
    'iOS BEGINNER',
    'MAC USER',
    'TECHNOLOGY ENTHUSIAST',
    'OCCASIONAL HACKER',
    'COMMAND-LINE WIZARD'
  ]

  titleElement = document.querySelector '.hero h2:last-child'
  lastIndex = -1

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

  fadeIn = ->
    titleElement.innerHTML = phrases[nextIndex()]
    titleElement.style.opacity = 1
    setTimeout fadeOut, 2750

  fadeOut = ->
    titleElement.style.opacity = 0
    setTimeout fadeIn, 250

  fadeIn()
)()

(-> # Popup menu
  popupNav = document.querySelector '.popup-nav'
  trigger = popupNav.querySelector '.trigger'
  navList = popupNav.querySelector 'nav ul'

  trigger.addEventListener 'click', ->
    trigger.classList.toggle 'menu-is-open'
    navList.classList.toggle 'is-visible'
)()

(-> # Choose a header background
  randomInt = Math.floor(Math.random() * 3)
  document.querySelector('.fullscreen').style.backgroundImage = "url('../img/background-#{randomInt}.jpg')"
)()

(-> # Make header size static
  fullscreen = document.querySelector '.fullscreen'
  belowFullscreen = document.querySelector '.below-fullscreen'
  fullscreen.style.height = fullscreen.offsetHeight + 'px'
  belowFullscreen.style.top = fullscreen.offsetHeight + 'px'
)()
