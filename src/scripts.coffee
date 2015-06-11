(->
  # Background size
  bgSize = 1920
  bgSize = 1440 if innerWidth <= 1440 and innerHeight <= 1024
  bgSize = 768  if innerWidth <= 768  and innerHeight <= 768
  bgSize = 480  if innerWidth <= 480  and innerHeight <= 480

  # Me photo size
  imageSize = 1920
  imageSize = 1440 if innerWidth <= 1440
  imageSize = 768  if innerWidth <= 768
  imageSize = 480  if innerWidth <= 480

  # Async load fonts
  # addFont = (source) ->
  #   style = document.createElement 'style'
  #   style.rel = 'stylesheet'
  #   style.textContent = source
  #   document.head.appendChild style
  #
  # try
  #   savedFonts = localStorage.fonts && JSON.parse(localStorage.fonts) || {}
  #
  #   if savedFonts.source && savedFonts.received + (7 * 24 * 60 * 60 * 1000) > Date.now()
  #     addFont savedFonts.source
  #   else
  #     request = new XMLHttpRequest()
  #     request.open 'GET', 'fonts.css', true
  #     request.onload = ->
  #       if request.status >= 200 and request.status < 400
  #         localStorage.fonts = {
  #           received: Date.now()
  #           source: request.responseText
  #         }
  #         addFont request.responseText
  #     request.send()
  # catch ex
  #   style = document.createElement 'style'
  #   style.rel = 'stylesheet'
  #   style.href = 'fonts.css'
  #   document.head.appendChild style

  # Choose a header background
  randomInt = Math.floor(Math.random() * 4 + 1)
  fullscreen = document.querySelector '.fullscreen'
  fullscreen.style.backgroundImage = "url('img/background-#{randomInt}@#{bgSize}.jpg')"

  # Async load images
  document.querySelector('img.me').src = "img/photo@#{imageSize}.jpg"

  # Menu
  menuItems = document.querySelectorAll 'header > nav ul li'

  selectedMenuItem = 0
  selectedMenuItemHighlighted = true

  for item, i in menuItems
    if item.childNodes[0].attributes.href.value == document.location.hash
      selectedMenuItem = i

  update = ->
    if selectedMenuItemHighlighted
      menuItems[selectedMenuItem].classList.add 'active'
    else
      menuItems[selectedMenuItem].classList.remove 'active'

  mouseOver = (event) ->
    selectedMenuItemHighlighted = event.target.parentElement == menuItems[selectedMenuItem]
    update()

  mouseOut = ->
    selectedMenuItemHighlighted = true
    clearTimeout timeout
    timeout = setTimeout update, 300

  for item in menuItems
    item.addEventListener 'mouseover', mouseOver, false
    item.addEventListener 'mouseout',  mouseOut,  false

  timeout = null
  update()

  # Title animation
  phrases = [
    'FULL-STACK WEB CODER',
    'ANDROID DEVELOPER',
    'iOS BEGINNER',
    'MAC USER',
    'TECHNOLOGY ENTHUSIAST',
    'OCCASIONAL HACKER',
    'PROBLEM SOLVER',
    'YOUNG & CREATIVE',
    'FRONTEND-ER',
    'BACKEND-ER'
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

  # Popup menu
  popupNav = document.querySelector '.popup-nav'
  trigger = popupNav.querySelector '.trigger'
  navList = popupNav.querySelector 'nav ul'

  trigger.addEventListener 'click', ->
    trigger.classList.toggle 'menu-is-open'
    navList.classList.toggle 'is-visible'

  # Make header size static
  belowFullscreen = document.querySelector '.below-fullscreen'
  height = fullscreen.offsetHeight

  if innerHeight < 700
    height = 700

  fullscreen.style.height = height + 'px'
  belowFullscreen.style.top = height + 'px'

  # Anchor smooth scrolling
  smoothScroll.init
    offset: -20
    callbackAfter: (toggle) ->
      for item, i in menuItems
        if item.childNodes[0] == toggle
          menuItems[selectedMenuItem].classList.remove 'active'
          selectedMenuItem = i
          menuItems[selectedMenuItem].classList.add 'active'

      trigger.classList.remove 'menu-is-open'
      navList.classList.remove 'is-visible'
)()
