var deselectMenuItems = (items) ->
  for (var i = 0 i < items.length i++) {
    items[i].classList.remove('active')

function selectMenuItem(items, i) {
  deselectMenuItems(items)
  items[i].classList.add('active')
}

var menuItems = document.querySelectorAll('nav ul li')
selectMenuItem(menuItems, 0)

defaults =
  animation: "bounceIn"
  separator: ","
  speed: 2000
  complete: $.noop

Plugin = (element, options) ->
  this.element = $(element)

  this.settings = $.extend({}, defaults, options)
  this._defaults = defaults
  this._init()
}

    Plugin.prototype = {
        _init: function () {
            var $that = this
            this.phrases = []

            this.element.addClass("morphext")

            $.each(this.element.text().split(this.settings.separator), function (key, value) {
                $that.phrases.push(value.trim())
            })

            this.index = -1
            this.animate()
            this.start()
        },
        animate: function () {
            if ((this.index + 1) === this.phrases.length) {
                this.index = -1
            }
            ++this.index

            this.element[0].innerHTML = "<span class=\"animated " + this.settings.animation + "\">" + this.phrases[this.index] + "</span>"

            if ($.isFunction(this.settings.complete)) {
                this.settings.complete.call(this)
            }
        },
        start: function () {
            var $that = this
            this._interval = setInterval(function () {
                $that.animate()
            }, this.settings.speed)
        },
        stop: function () {
            this._interval = clearInterval(this._interval)
        }
    }

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options))
            }
        })
    }
})(jQuery)
