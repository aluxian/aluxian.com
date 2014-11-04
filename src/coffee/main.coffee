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

  titleElement = document.querySelector '.hero .title'
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

  fixedNav = document.querySelector '.fixed-nav'
  navTrigger = fixedNav.querySelector '.trigger'
  mainNavigation = fixedNav.querySelector 'nav ul'

  checkMenu = ->
    if (window.scrollY > offset) and !(fixedNav.contains 'is-fixed')
      fixedNav.classList.add 'is-fixed'
      types = ['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend']

      animCallback = (type) ->
        mainNavigation.classList.add 'has-transitions'
        navTrigger.removeEventListener type, animCallback

      for type in types
        navTrigger.addEventListener type, animCallback.bind(null, type)

    else if window.scrollY <= offset

      htmlElem = document.querySelector 'html'

      if (mainNavigation.classList.contains 'is-visible') and !(htmlElem.classList.contains 'no-csstransitions')
        mainNavigation.classList.add 'is-hidden'

        types = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend']

        cb = (type) ->
          mainNavigation.classList.remove c for c in ['is-visible', 'is-hidden', 'has-transitions']
          fixedNav.classList.remove 'is-fixed'
          navTrigger.classList.remove 'menu-is-open'
          navTrigger.removeEventListener type, cb

        for type in types
          mainNavigation.addEventListener type, cb.bind(null, type)

      else if (mainNavigation.classList.contains 'is-visible') and (htmlElem.classList.contains 'no-csstransitions')
          mainNavigation.classList.remove c for c in ['is-visible', 'has-transitions']
          fixedNav.classList.rmeove 'is-fixed'
          navTrigger.classList.remove 'menu-is-open'

      else
        fixedNav.classList.remove 'is-fixed'
        mainNavigation.classList.remove 'has-transitions'

  checkMenu()
  window.onscroll = checkMenu

  navTrigger.addEventListener 'click', ->
    navTrigger.classList.toggle 'menu-is-open'

    types = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend']

    for type in types
      mainNavigation.removeEventListener type

    mainNavigation.classList.toggle 'is-visible'

)()
