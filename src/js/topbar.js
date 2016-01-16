var topbar = $('.fixed.contain-to-grid'),
    changeHeaderOnOffset = 950,
    didScroll = false;

// Resize the topbar depending on the scroll position
var resizeTopbar = function () {
    var topOffset = window.pageYOffset || document.documentElement.scrollTop;

    if (topOffset >= changeHeaderOnOffset) {
        topbar.addClass('smaller');
    } else {
        topbar.removeClass('smaller');
    }

    didScroll = false;
};

// Handle page scroll events
$(window).scroll(function () {
    if (!didScroll) {
        didScroll = true;
        setTimeout(resizeTopbar, 250);
    }
});
