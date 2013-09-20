$ = jQuery

$(document).ready ->
	if $('#slides').length
		initSlider()



	if $('.tab-section').length
		initTabs()


	$(".triger-brand").on 'click', ->
		$(@).parents('.brand-parts').toggleClass('closed')


	return #end document ready

jQuery(window).load ->

	if $('.cart-content').length
		cartLogic()
	if $('#registration-popup').length
		registrationPopupLogic()
	if $("#search").length
		searchTyping()
	if $('.trigger-shown').length
		changingLists()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/sidebar.html'
		method: 'get'
		dataType: 'html'
		success: (data) ->
			$('#sv-leftcolumn').append data
			initTabs()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/registrationpopup.html'
		method: 'get'
		dataType: 'html'
		success: (data) ->
			$('.registration-popup').append data
			registrationPopupLogic()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/cart.html'
		method: 'get'
		dataType: 'html'
		success: (data) ->
			$('.cart-section .cart').append data
			cartLogic()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/footer.html'
		method: 'get'
		dataType: 'html'
		success: (data) ->
			$('#sv-footer').append data

	if $('.carusel ul').length
		initCarusel()



	if $(".sorting-content").length

		$(".sorting-content .sorting-nav").find("li").on 'click', ->
			if not($(@).hasClass('active'))
				$(".sorting-content .sorting-nav").find("li").removeClass("active")
				$(".sorting-body > div").hide()
				$(@).addClass("active");
				idx = $(@).index()
				$(".sorting-body > div").eq(idx).show()
		$(".sorting-content .sorting-nav").find("li").first().click()

	if $(".product-image").length
		$(".product-preview").find("img").each ->
			that = $(@)
			h = that.height()/2
			w = that.width()/2
			that.css
				'marginTop': -h + 'px'
				'marginLeft': -w + 'px'
		$(".product-preview").find("a").on 'click', (ev) ->
			ev.preventDefault()
			src = $(@).data("pic")
			$(".product-image").find("img").fadeOut ->
				$(@).attr('src', src)
			.fadeIn()

	$(".filter").find("header h2.title").on 'click', ->
		$(@).parent().toggleClass("active")




	return #end Window load

initSlider = ->
	$('#slides').slidesjs({
			width: 940,
			play: {
				active: false,
				# [boolean] Generate the play and stop buttons.
				# You cannot use your own buttons. Sorry.
				effect: "slide",
				# [string] Can be either "slide" or "fade".
				interval: 40000,
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

initCarusel = ->
	$('.carusel ul').jcarousel({
		scroll : 1,
		visible : 5
		#wrap: 'circular' # замыкание карусели
	})

initTabs = ->
	$(".tab-nav").find('a').on 'click', (event) ->
		event.preventDefault()
		if not($(@).hasClass('active'))
			#idx = $(@).index()
			id = $(@).attr('href')
			$(".tab-nav").find('.active').removeClass('active')
			$(@).addClass('active')
			$(".tab").hide()
			$(id).show()
	$('.tab-nav').find('a').first().click()

cartLogic = ->
	$('.cart-title').on 'click', ->
		if $(@).hasClass('opened')
			$(@).removeClass('opened')
			$('.cart-content').fadeOut()
		else
			$(@).addClass('opened')
			$('.cart-content').fadeIn()
	#cart logic
	$(".cart").find('.icons-delete-button').on 'click', ->
		$(@).parents('.cart-content').fadeOut()
		$('.cart-title').removeClass('opened')

	#delete item from cart
	$('.item-delete').find('.icons-close-small').on 'click', (e) ->
		e.stopPropagation()
		$(@).parents('.item-holder').remove()

	$("body").on 'click', (e) ->
		if $("#registration-popup").is(":visible")
			if not($(e.target).closest('#registration-popup').length) and not($(e.target).closest('#enter').length)
				$('#enter').parent().removeClass('opened')
				$("#registration-popup").fadeOut()
		if $(".cart-content").is(":visible")
			if not($(e.target).closest('.cart-content').length) and not($(e.target).closest('.cart-title').length)
				$('.cart-title').removeClass('opened')
				$(".cart-content").fadeOut()

	return #cart logic

registrationPopupLogic = ->
	$('#enter').on 'click', (event) ->
		event.preventDefault()
		if $(@).parent().hasClass('opened')
			$(@).parent().removeClass('opened')
			$("#registration-popup").fadeOut()
		else
			$(@).parent().addClass('opened')
			$('#registration-popup').fadeIn()
	#popup logic
	$("#registration-popup").find('.icons-close-button-gray').on 'click', ->
		$('#registration-popup').fadeOut()
		$(@).parents('li').removeClass('opened')

	return #registrationPopupLogic


searchTyping = ->
	$("#search").on 'keyup', ->
		if $("#search").val().length >= 3
			$(".search-output").show()
		else
			$(".search-output").hide()

	return #searchTyping

changingLists = ->
	$(".trigger-shown").find('a').on 'click', (event) ->
		event.preventDefault()
		if not($(@).hasClass('active'))
			$(".trigger-shown").find('a').removeClass('active')
			$(@).addClass('active')
			if $(@).hasClass("block-icon")
				$("#sv-wrapper").removeClass("lists").addClass("blocks")
			else
				$("#sv-wrapper").removeClass("blocks").addClass("lists")