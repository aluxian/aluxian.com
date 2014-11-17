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

(-> # Fixed menu
  offset = 900

  popupNav = document.querySelector '.popup-nav.fixed'
  navTrigger = popupNav.querySelector '.trigger'
  popupNavList = popupNav.querySelector 'nav ul'

  checkMenu = ->
    if window.scrollY > offset and not popupNav.classList.contains 'visible'
      popupNav.classList.add 'visible'

      animCallback = (type) ->
        popupNavList.classList.add 'has-transitions'
        navTrigger.removeEventListener type, animCallback

      for type in ['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend']
        navTrigger.addEventListener type, animCallback.bind(null, type)

    else if window.scrollY <= offset - 500

      if popupNavList.classList.contains 'is-visible'
        popupNavList.classList.add 'is-hidden'

        cb = (type) ->
          popupNavList.classList.remove c for c in ['is-visible', 'is-hidden', 'has-transitions']
          popupNav.classList.remove 'visible'
          navTrigger.classList.remove 'menu-is-open'
          navTrigger.removeEventListener type, cb

        for type in ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend']
          popupNavList.addEventListener type, cb.bind(null, type)

      else if popupNavList.classList.contains 'is-visible'
        popupNavList.classList.remove c for c in ['is-visible', 'has-transitions']
        popupNav.classList.remove 'visible'
        navTrigger.classList.remove 'menu-is-open'

      else
        popupNav.classList.remove 'visible'
        popupNavList.classList.remove 'has-transitions'

  checkMenu()
  window.onscroll = checkMenu

  navTrigger.addEventListener 'click', ->
    navTrigger.classList.toggle 'menu-is-open'

    for type in ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend']
      popupNavList.removeEventListener type

    popupNavList.classList.toggle 'is-visible'
)()

(-> # Choose a header background
  randomInt = Math.floor(Math.random() * 4)
  document.querySelector('.fullscreen').style.backgroundImage = "url('../img/background-#{randomInt}.jpg')"
)()
