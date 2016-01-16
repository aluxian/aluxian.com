$(document).foundation();
var magellan = Foundation.libs['magellan-expedition'];
magellan.namespace = '';
magellan.init();

FastClick.attach(document.body);

$('.profile-picture').imageScroll();
$.localScroll({
    offset: {
        top: -80
    }
});
