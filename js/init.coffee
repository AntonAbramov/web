$ = jQuery

$(document).ready ->

	if $(".tabs").length
		$(".tabs-header").find("a").on 'click', (event) ->
			event.preventDefault()
			that = $(@)
			if not(that.hasClass('active'))
				idx = that.index()-1
				$(".tabs-header").find("a").removeClass("active")
				that.addClass("active")
				$(".tabs-content").find(".tab").hide().eq(idx).show()

	return #end document ready

jQuery(window).load ->

	if $(".tabs").length
		$(".tabs-header").find("a").first().click()

	return #end Window load
