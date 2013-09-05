$ = jQuery

$(document).ready ->
	if $('#slides').length
		$('#slides').slidesjs({
			width: 940,
			height: 528,
			play: {
				active: false,
				# [boolean] Generate the play and stop buttons.
				# You cannot use your own buttons. Sorry.
				effect: "slide",
				# [string] Can be either "slide" or "fade".
				interval: 4000,
				# [number] Time spent on each slide in milliseconds.
				auto: true,
				# [boolean] Start playing the slideshow on load.
				swap: true,
				# [boolean] show/hide stop and play buttons
				pauseOnHover: false,
				# [boolean] pause a playing slideshow on hover
				restartDelay: 2500
				# [number] restart delay on inactive slideshow
			},
			navigation: true
		})

	if $('#mycarousel').length
		$('#mycarousel').jcarousel({
			scroll : 1,
			visible : 3,
			wrap: 'circular' # замыкание карусели
		})

	return #end document ready

jQuery(window).load ->


	return #end Window load