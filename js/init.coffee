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

	$(".nav ul:eq(0)").find("li").on 'mouseover', ->
		window.sliderWidth = $("#slides").outerWidth()
		$(@).addClass('hover')
		if $('.main').length
			if $(window).width() < 680
				window.sliderWidth = $('.mision').outerWidth() + 10
		idx = $(@).index()
		if idx != 0
			$(".nav").find('.sub-menu').width(window.sliderWidth).eq(idx-1).show()
			$('.side-nav').addClass('brd-red')
	.on 'mouseleave', ->
		$('.sub-menu').hide()
		$('.brd-red').removeClass('brd-red')
		$("li.hover").removeClass('hover')
	$('.sub-menu').on 'mouseover', ->
		idx = $(@).index()
		$(".nav").find('ul').first().find('li').eq(idx).addClass('hover')
		$(@).show()
		$('.side-nav').addClass('brd-red')
	.on 'mouseleave', ->
		$(@).hide()
		$('.brd-red').removeClass('brd-red')
		$("li.hover").removeClass('hover')



	$(".nav").find('ul').first().find('li').first().on 'click', ->
		if $(window).width() < 600
			$(".side-nav").toggleClass('show')

	if $('#mycarousel').length
		if $(window).width() < 1000
			$('#mycarousel').jcarousel({
				scroll : 1,
				visible : 3,
				wrap: 'circular' # замыкание карусели
			})
		else
			$('#mycarousel').jcarousel({
				scroll : 1,
				visible : 5,
				wrap: 'circular' # замыкание карусели
			})

	$(".news-section").on 'mouseleave', ->
		$(@).removeClass('active')

	$(".news-link-icon").on 'mouseover', ->
		$(@).parents(".news-section").addClass('active')
	$(".photo-galery").find("a").on 'click', (ev) ->
		ev.preventDefault()
		if $(@).hasClass('next-pic')
			if $(".photo-galery").find(".active").index() == $(@).parents(".photo-galery").find("a").length-2
				return false
			else
				$(".photo-galery").find(".active").removeClass('active').next().click()
		else if not ($(@).hasClass('active'))
			$(".photo-galery").find(".active").removeClass('active')
			$(@).addClass('active')
			srcImg = $(@).attr('href')
			$(".big-pic").find('img').fadeOut(->
				$(".big-pic").find('img').attr('src', srcImg)
			).fadeIn()
	$(".content-galery-small .photo-galery").find("a").on 'click', ->
		if $(".photo-galery").find(".active").next().index()%3 == 0
			currentMargin = $(".content-galery-small .photo-galery").find('li > div').css('marginTop')
			currentMarginMath = parseInt(currentMargin.substring(0, currentMargin.length-2))
			min = currentMarginMath-45
			$(".content-galery-small .photo-galery").find('li > div').css
				marginTop: min + 'px'




	return 
#Document ready end

jQuery(window).load ->
	w = ($('#slides').find('.slidesjs-pagination-item').length * 15) / 2
	$(".slidesjs-pagination").css
		'marginLeft': -w + 'px'

	#fix height
	$('.w940').each ->
		h = $(@).outerHeight()
		$(@).find(".h-fix").css
			'height' : h + 'px'
	#fix height
	if $(".section3 .news-list").length
		liHeight = 0
		$(".section3 .news-list").find('li').each ->
			curHeight = $(this).outerHeight()
			if curHeight >= liHeight
				liHeight = curHeight
		$(".news-list").find('li').css
			'height' : liHeight + 'px'

	#fix height
	$('.side-nav').height($("#slides").outerHeight());

	$(".photo-galery").find("a").first().click()

	$(window).resize =>

		$('.side-nav').height($("#slides").outerHeight());
		liHeight = 0
		$(".section3 .news-list").find('li').each ->
			curHeight = $(this).outerHeight()
			if curHeight >= liHeight
				liHeight = curHeight
		$(".news-list").find('li').css
			'height' : liHeight + 'px'
			#alert 1
		if $("#sv-wrapper").outerHeight() > $('.bg2').height()
			$('.bg2').height($("#sv-wrapper").outerHeight()-250)

		if $('#mycarousel').length
			if $(window).width() < 1000
				$('#mycarousel').jcarousel({
					scroll : 1,
					visible : 3,
					wrap: 'circular' # замыкание карусели
				})


	if $("a.galery-group").length
		$("a.galery-group").fancybox({

			openEffect : 'elastic',
			openSpeed  : 150,

			closeEffect : 'elastic',
			closeSpeed  : 150,

			closeClick : true,
			helpers : {
				overlay : null
			}
		})
	if $("#sv-wrapper").outerHeight() > $('.bg2').height()
		$('.bg2').height($("#sv-wrapper").outerHeight()-250)

	return