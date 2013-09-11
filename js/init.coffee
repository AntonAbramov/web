$ = jQuery

$(document).ready ->
	if $('#slides').length
		initSlider()

	if $('#mycarousel').length
		initCarusel()

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


	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/sidebar.html'
		dataType: 'html'
		success: (data) ->
			$('#sv-leftcolumn').append data
			initTabs()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/registrationpopup.html'
		dataType: 'html'
		success: (data) ->
			$('.registration-popup').append data
			registrationPopupLogic()

	#delete ajax and return html to the page
	$.ajax
		url: 'ajax/cart.html'
		dataType: 'html'
		success: (data) ->
			$('.cart-section .cart').append data
			cartLogic()


	return #end Window load

initSlider = ->
	$('#slides').slidesjs({
			width: 940,
			height: 324,
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
	$('#mycarousel').jcarousel({
		scroll : 1,
		visible : 3,
		wrap: 'circular' # замыкание карусели
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

	$("body").on 'click', (e) ->
		if not($(e.target).closest('#registration-popup').length) and not($(e.target).closest('#enter').length)
			$('#enter').parent().removeClass('opened')
			$("#registration-popup").fadeOut()

	return #end registrationPopupLogic

searchTyping = ->
	$("#search").on 'keyup', ->
		if $("#search").val().length >= 3
			$(".search-output").show()
		else
			$(".search-output").hide()

	return #searchTyping