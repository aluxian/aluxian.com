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
    item.addEventListener 'mouseout',  mouseOut,  false

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
  size = 1920

  size = 1440 if window.innerWidth <= 1440 and window.innerHeight <= 1024
  size = 768  if window.innerWidth <= 768  and window.innerHeight <= 768
  size = 480  if window.innerWidth <= 480  and window.innerHeight <= 480

  document.querySelector('.fullscreen').style.backgroundImage = "url('../img/background-#{randomInt}@#{size}.jpg')"
)()

(-> # Scrolling helper
  window.scrollTo = (to) ->
    firefox = navigator.userAgent.indexOf('Firefox')
    msie = navigator.userAgent.indexOf('MSIE')
    doc = if firefox != -1 or msie != -1 then document.documentElement else document.body

    easeInOutQuad = (t, b, c, d) ->
      t /= d/2
      if t < 1
        c/2*t*t + b
      else
        -c/2 * ((t-1)*(t-3) - 1) + b

    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || (callback) -> window.setTimeout(callback, 1000 / 60)

    start = doc.scrollTop
    change = to.offsetTop - start
    console.log to, to.offsetTop, start, change
    currentTime = 0
    increment = 20
    duration = 800

    animateScroll = ->
      currentTime += increment
      val = easeInOutQuad(currentTime, start, change, duration)
      doc.scrollTop = val

      if currentTime < duration
        requestAnimFrame(animateScroll)

    animateScroll()
)()

(-> # Make header size static
  fullscreen = document.querySelector '.fullscreen'
  belowFullscreen = document.querySelector '.below-fullscreen'
  height = fullscreen.offsetHeight

  if window.innerWidth >= 480 && window.innerHeight < 600
    height = 600
  else if window.innerHeight < 400
    height = 400

  fullscreen.style.height = height + 'px'
  belowFullscreen.style.top = height + 'px'

  onClick = -> window.scrollTo document.querySelector("a[name='#{this.hash.substring(1)}']")
  item.onclick = onClick for item in document.querySelectorAll 'nav a'
)()
