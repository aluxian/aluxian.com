// main.js


/* Global Variables */
var portfolioKeyword;
var safeMod = false;


// DOCUMENT READY
$(function() {
	
	
	// ------------------------------
	// DETECT TOUCH DEVICES
	if(jQuery.browser.touch) {
		$('html').addClass('touch');	
	}
	// ------------------------------
	
	
	
	// ------------------------------
	// PORTFOLIO DETAILS
	// if url contains a portfolio detail url
	portfolioKeyword = $('.portfolio').attr('id');
	initializeAnimations();
	var detailUrl = giveDetailUrl();
	// ------------------------------
	
	
	// ------------------------------
	// FULL BROWSER BACK BUTTON SUPPORT 
	$.address.change(function() {
		
			var detailUrl = giveDetailUrl();
			if(detailUrl != -1 ) {
				showProjectDetails(detailUrl);
			} else {
				if ($.address.path().indexOf("/"+ portfolioKeyword)!=-1) {
					hideProjectDetails(true,false);
				}
			}
		});
	// ------------------------------
	
	
	
	
	// ------------------------------
	// MOBILE SAFE MOD
	safeMod = $('html').attr('data-safeMod') === 'true';
	mobileSafeMod = $('html').attr('data-mobileSafeMod') === 'true' && jQuery.browser.mobile;
	safeMod = safeMod || mobileSafeMod || !Modernizr.csstransforms || !Modernizr.csstransforms3d;
	var pLoop = 0;
	if(safeMod) {
		
		$('html').removeClass('no-overflow').addClass('safe-mod');	
		
		setActivePage();
		$.address.change(function() {
			setActivePage();
			});
		
	}
	
	// CHANGE PAGE
	function setActivePage() {
		
			$('.page').removeClass('active').hide();
			var path = $.address.path();
			path = path.slice(1, path.length);
			path = giveDetailUrl() != -1 ? portfolioKeyword : path;
			if(path == "") {  // if hash tag doesnt exists - go to first page
				var firstPage = $('#header ul li').first().find('a').attr('href');
				path = firstPage.slice(2,firstPage.length);
				$.address.path(path);
				}
			
			
			if(Modernizr.csstransforms && Modernizr.csstransforms3d) { // modern browser
				$('#'+ path).show().removeClass('animated ' + safeModPageOutAnimation).addClass('animated ' + safeModPageInAnimation);
			} else { //old browser
				$('#'+ path).fadeIn();
				$('.page.active').hide();
			}	
			
			$('#'+ path).addClass('active');
			
			setTimeout(function() { setCurrentMenuItem(); }, 100 );
			
			if(path.indexOf(portfolioKeyword) != -1) {
				if(pLoop < 1) { // setup portfolio only once
					setTimeout(function() { setupPortfolio(); }, 400);
					pLoop++;
				}
			} 
			if ($('.page.resume').hasClass('active')) {
				emptyBars();
				animateBars();
			}
			$("body").scrollTop(0);
		
	}
	
	
	
	
	// if page url contains portfolio details url -> go to portfolio step
	if(detailUrl != -1 && !safeMod) {
		// remove detail url temporarly for jmpress to go to portfolio step immediately
		$.address.path(portfolioKeyword);
		}
		
	
	// ------------------------------
	// JMPRESS LAYOUT
	// setup jmpress
	if(!safeMod) { // don't run jmpress if mobile safe mode is on 
		$('#pages').jmpress({
			stepSelector: '.page',
			fullscreen : false,
			transitionDuration: duration,
			animation       : { transitionDuration : duration / 1000 + 's' },
			mouse: { clickSelects: false },
			idle : function() {
				setCurrentMenuItem();
				refreshScrollBars();
				},
			beforeChange : function( element, eventData ) { 
				var activePage = $(element[0]);
				if(activePage.hasClass('resume')) {
					animateBars();
					}
				}
		});
	}
	
	// ------------------------------
	
	
	// if page url contains portfolio details url -> show details and fix url (jmpress conflict)
	if(detailUrl != -1 ) {
		// revert back detail url after jmpress itializes
		setTimeout(function() { 
			$.address.path(portfolioKeyword + "/" + detailUrl ); 
			},2000);	
	}
	
	
	
	// ------------------------------
	// NAV MENU
	// setup menu clicks
	$('#header nav ul a').click( function() {
		if($(this).parent().hasClass('current-menu-item')) {
			return;	
		}
		$(this).addClass('waiting');
		$('#header nav ul li').removeClass('current-menu-item');
		});
	// ------------------------------
	
	
	
	// ------------------------------
	// MOBIL NAV MENU - SELECT LIST
	/* Clone our navigation */
	var mainNavigation = $('#header nav ul').clone();
	
	/* Replace unordered list with a "select" element to be populated with options, and create a variable to select our new empty option menu */
	$('#header nav').prepend('<select class="mobile-nav"></select>');
	var selectMenu = $('select.mobile-nav');
	
	/* Navigate our nav clone for information needed to populate options */
	$(mainNavigation).children('li').each(function() {
		 $(selectMenu).append(generateSelectLink($(this), ''));
	});
	
	function generateSelectLink(li, prefix) {
		var href = li.children('a').attr('href');
		var text = li.children('a').text();
		return '<option value="' + href+ '"> ' + prefix + text + '</option>';
	}
	
	/* When our select menu is changed, change the window location to match the value of the selected option. */
	$(selectMenu).change(function() {
		location = this.options[this.selectedIndex].value;
	});
	// ------------------------------
	
	
	
	
	// ------------------------------
	// SETUP SCROLLBARS
	if (!safeMod) {
		
		setupScrollBars();
		
		// ------------------------------
		// REFRESH SCROLLBARS ON RESIZE
		$(window).resize(function() {
		  refreshScrollBars();
		});
		// ------------------------------
		
	}
	// ------------------------------
	
	
	
	//**********************************
	// PORTFOLIO FILTERING : ISOTOPE
	if(!safeMod) {
		setupPortfolio();
	}
	//**********************************
	
	
	
	//**********************************
	// PORTFOLIO DETAILS
	
	// Show details
	$("a.ajax").live('click',function() {
		
		var returnVal;
		var url = $(this).attr('href');
		$.address.path(portfolioKeyword + "/" + url ); 
		
		//disable ajax page show for ie8
		if(jQuery.browser.version.substring(0, 2) == "8." || jQuery.browser.version.substring(0, 2) == "7.")
		{ 
			returnVal = true;
		} else {
			returnVal = false;
		}
		return returnVal;
		
		});
	//**********************************
	
	
	
	
	
	//**********************************
	// SHOW LOADER ON AJAX CALLS
	jQuery.ajaxSetup({
		beforeSend: function() {
			showLoader();
		},
		complete: function(){
			//hideLoader();
		},
		success: function() { 
			if(!giveDetailUrl) {
				setTimeout(function() { hideLoader(); },500);
			}
		}
	});
	//**********************************
	
	
	
	// LIGHTBOX
	//**********************************
	//html5 validate fix
	$('.lightbox').each(function(index, element) {
        $(this).attr('rel', $(this).attr('data-lightbox-gallery'));
    });
	setupLigtbox();
	//**********************************
	
	
	

});
// DOCUMENT READY




// WINDOW ONLOAD
window.onload = function() {

	// ------------------------------
	// REFRESH SCROLLBARS WHEN IMAGES ARE LOADED
	if (!safeMod) {
		refreshScrollBars();
	}
	// ------------------------------
	
};
// WINDOW ONLOAD




// ------------------------------
// AJAX PORTFOLIO DETAILS
var pActive, inAnimation, outAnimation, safeModPageInAnimation, safeModPageOutAnimation, lightboxInAnimation, duration;

function initializeAnimations() {
	inAnimation = $('html').attr('data-inAnimation');
	outAnimation = $('html').attr('data-outAnimation');
	safeModPageInAnimation = $('html').attr('data-safeModPageInAnimation');
	safeModPageOutAnimation = $('html').attr('data-safeModPageOutAnimation');
	lightboxInAnimation = $('html').attr('data-lightboxInAnimation');
	profileImageAnimation = $('html').attr('data-profileImageAnimation');
	duration = $('html').attr('data-jmpressAnimationDuration');
	$('.te-transition').addClass(profileImageAnimation);
}

function showProjectDetails(url) {
	
	// update url to include portfolio detail url
	$.address.path(portfolioKeyword + "/" + url ); 
	
	var p = $('.p-overlay:not(.active)').first();
	pActive = $('.p-overlay.active');
	$('html').removeClass('no-overflow');
	
	if(pActive.length) {
			hideProjectDetails();	  
		}
	
	// ajax : fill data
	p.empty().load(url + ' .portfolio-single', function() {
		
		// wait for images to be loaded
		p.waitForImages(function() {
			
			hideLoader();
			
			// responsive videos
			$(".portfolio-single").fitVids();
			
			if(Modernizr.csstransforms && Modernizr.csstransforms3d) { // modern browser
			p.removeClass('animated '+ outAnimation + " " + inAnimation ).addClass('animated '+ inAnimation).show();
			} else { //old browser
				p.fadeIn();	
			}
			p.addClass('active');
			
			if(safeMod) {
				$('#pages').css('max-height', p.height() - $('#header').outerHeight()).css('overflow','hidden');
			}
			
		},null,true);
	});
}

function hideProjectDetails(forever, safeClose) {
	
	$("body").scrollTop(0);
	
	// close completely by back link.
	if(forever) {
		pActive = $('.p-overlay.active');
		if(!safeMod) {
			$('html').addClass('no-overflow');
		}
		
		if(!safeClose) {
			// remove detail url
			$.address.path(portfolioKeyword);
		}
		
		if(safeMod) {
			$('#pages').css('max-height', 'none' ).css('overflow','visible');
		}
	}
	
	pActive.removeClass('active');
	
	if(Modernizr.csstransforms && Modernizr.csstransforms3d) { // modern browser
		pActive.removeClass('animated '+ inAnimation).addClass('animated '+ outAnimation);
		setTimeout(function() { pActive.hide().removeClass(outAnimation).empty(); } ,1010)
	} else { //old browser
		pActive.fadeOut().empty();	
	}
}

function giveDetailUrl() {
	var address = $.address.path();
	var detailUrl;
	
	if (address.indexOf("/"+ portfolioKeyword + "/")!=-1) {
		var total = address.length;
		detailUrl = address.slice(11,total);
	} else {
		detailUrl = -1;	
	}
	
	return detailUrl;
}

// ------------------------------



// ------------------------------
// FUNCTIONS

// SETUP SCROLLBARS
function setupScrollBars() {
	if(!safeMod) { // don't run jscroll if mobile safe mode is on 
		$(".iscroll-wrapper").jScroll({ 
			useTransition : jQuery.browser.touch ? true : false, //performance mode on for mobile devices
			fadeScrollbar : jQuery.browser.mobile ? false : true, //performance mode on for mobile devices
			lockDirection : false,
			hideScrollbar : true,
			forceIscroll : false
			});
	}
}

// REFRESH SCROLLBARS
function refreshScrollBars() {
	if(!safeMod) { // don't run jscroll if mobile safe mode is on 
	 $(".iscroll-wrapper").jScroll("refresh");
	}
}	

// SET CURRENT MENU ITEM
function setCurrentMenuItem() {
	var activePageId = $('#pages .active').attr('id');
	
	// set default nav menu
	$('#header nav ul a').removeClass('waiting');
	$('#header nav ul a[href$=' + activePageId +']').parent().addClass('current-menu-item').siblings().removeClass('current-menu-item');
	
	// set mobile nav menu
	$("select.mobile-nav option").attr("selected","");
	$('select.mobile-nav option[value$=' + activePageId +']').attr("selected","selected");
}	
	
	
//**********************************
// PORTFOLIO FILTERING - ISOTOPE
function setupPortfolio() {
	
	// cache container
	var $container = $('#portfolio-items');
	
	if($container.length) {
		$container.waitForImages(function() {
			
			// initialize isotope
			$container.isotope({
			  itemSelector : '.item',
			  layoutMode : 'masonry',
			  transformsEnabled : jQuery.browser.mobile ? false : true, //performance mode on for mobile devices
			  onLayout: function( $elems, instance ) { 
			  	if(!safeMod) { refreshScrollBars(); } 
				}
			});
			
			// filter items when filter link is clicked
			$('#filters a').click(function(){
			  var selector = $(this).attr('data-filter');
			  $container.isotope({ filter: selector });
			  $(this).parent().addClass('current').siblings().removeClass('current');
			  return false;
			});
			
		},null,true);
	}
}
// ------------------------------

	

// ------------------------------
// CSS3 ANIMATED PROGRESS BARS
function animateBars() {
	emptyBars();
	$('.bar').each(function() {
		 var bar = $(this);
		 setTimeout( function() { bar.find('.progress').addClass('easing-long').css('width', bar.attr('data-percent') + '%' ); } , duration);
		});
}	
function emptyBars() {	
	$('.bar').each(function() {
		 var bar = $(this);
		 bar.find('.progress').removeClass('easing-long').css('width', 0 ); 
		});
}
// ------------------------------	



// ------------------------------
// LIGHTBOX
function setupLigtbox() {
	if($("a[rel^='fancybox']").length) {
		$("a[rel^='fancybox']").fancybox({
			padding : 0,
			margin : jQuery.browser.mobile ? 0 : 44,
			width : 640,
			height : 360,
			transitionIn : 'none',
			transitionOut : 'none',
			overlayColor : '#000',
			overlayOpacity : '.5',
			onStart : function() { 
				showLoader();
				$('#fancybox-loading').remove();
				$('#fancybox-right-ico').html('=');
				$('#fancybox-left-ico').html('<');
				$('#fancybox-close').html('Â');
				$('#fancybox-wrap').removeClass('animated').addClass('animated '+ lightboxInAnimation);
			},
			onComplete : function() {
				hideLoader(); 
			},
			onCancel : function() {
				hideLoader(); 
			}
		});
	}	
}
// ------------------------------	


// ------------------------------
// AJAX LOADER
function showLoader() {
	$(".loader").show().spin({
	  lines: 7, // The number of lines to draw
	  length: 1, // The length of each line
	  width: 5, // The line thickness
	  radius: 7, // The radius of the inner circle
	  corners: 0, // Corner roundness (0..1)
	  rotate: 41, // The rotation offset
	  color: '#fff', // #rgb or #rrggbb
	  speed: 1.5, // Rounds per second
	  trail: 70, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: true, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: 10, // Top position relative to parent in px
	  left: 12 // Left position relative to parent in px
	});
}
function hideLoader() {
	$(".loader").spin(false).hide(); 
}
// ------------------------------