var hotelsData;
var formatNumber = function (_number, _decimal, _separator) {
	var decimal = (typeof(_decimal) != 'undefined') ? _decimal : 2,
		separator = (typeof(_separator) != 'undefined') ? _separator : '',
		r = parseFloat(_number),
		exp10 = Math.pow(10, decimal);
	r = Math.round(r * exp10) / exp10;
	var rr = Number(r).toFixed(decimal).toString().split('.'),
		b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);
	r = (rr[1] ? b + '.' + rr[1] : b);
	return r;
};
var clearNumber = function (string) {
	return parseInt(string.replace(/[^0-9.]/g, ""), 10);
};
function showLoader() {
	jQuery.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
// if(jQuery.browser.chrome){
// jQuery(".loader").show();
// }
//hide then show the earth again, fix for ie
	if (jQuery.browser.msie) {
		jQuery("#gifloading").attr('src', '');
		jQuery(".loader").show(250, function () {
			jQuery("#gifloading").attr('src', '/skin/frontend/default/malina/images/preloader.gif');
		});
	}
	jQuery(".loader").show();
	jQuery(".l-mainarea").hide();
}
function hideLoader() {
	jQuery(".loader").hide();
	jQuery(".l-mainarea").removeClass("reduceHeight").show();
}
function initPagination() {
	var firstTime = true;

	function pageselectCallback(page_index, jq) {
		var new_content = jQuery('#hiddenresult div.result:eq(' + page_index + ')').clone();
		jQuery('#Searchresult').empty().append(new_content);
		var totalPages = jQuery('#Pagination').find('ul').find('li').length - 2;
		var pageNumber = (page_index + 1).toString();
		if (firstTime) {
			firstTime = false;
		} else {
			jQuery('html, body').animate({scrollTop: jQuery('.search-result-quicknav').offset().top - 100}, 700);
			_gaq.push(['_trackEvent', 'SearchResults', 'Paginator', pageNumber]);
		}
		setTimeout(function () {
			jQuery('#Searchresult .accordion').accordion({
				collapsible: true,
				active: false
			});
		}, 10);
		return false;
	}

	if (typeof(jQuery("#Pagination ul").pagination) !== 'undefined') {
		jQuery("#Pagination ul").pagination(jQuery('#hiddenresult div.result').length, {
			callback: pageselectCallback,
			items_per_page: 1
		});
	}
}
function serializeArray(object) {
	var result = {},
		object = object ? object : {};
	for (var i = 0; i < object.length; i++) {
		if (result[object[i].name]) {
			if (typeof(result[object[i].name]) == "object") {
				if (result[object[i].name][0] !== "all") {
					result[object[i].name].push(object[i].value);
				}
			} else {
				var temp = result[object[i].name];
				if (temp == "all") {
					result[object[i].name] = [temp];
				} else {
					result[object[i].name] = [temp, object[i].value];
				}
			}
		} else {
			result[object[i].name] = object[i].value;
		}
	}
	return result;
}
function stringArrays(object) {
	if (object['children'] === "0") {
		delete(object['ages']);
	}
	for (var i in object) {
		if (typeof(object[i]) === "object") {
			object[i] = object[i].join('.');
		}
	}
	return object;
}
var buildOptions = function (from, to, current) {
	var html = '';
	for (var i = from; i <= to; i++) {
		html += '<option value="' + i + '"' + (current == i ? ' selected' : '') + '>' + i + '</option>';
	}
	return html;
};
function changeDuration($element, inFrom, inTo) {
	var maxDays = 29, current, $toElement, html, to, from;
	$toElement = jQuery('.dateDurationContainer .duration').not($element);
	if ($element.hasClass('tour-duration-from')) {
		from = inFrom ? inFrom : $element.val();
		to = maxDays;
		current = inTo ? inTo : $toElement.val();
	} else {
		from = 1;
		to = inTo ? inTo : $element.val();
		current = inFrom ? inFrom : $toElement.val();
	}
	html = buildOptions(from, to, current);
	$toElement.html(html);
	$toElement.selectmenu();
}
(function ($) {
	function highlightError(element) {
		element.addClass('errorLighted');
	}

	function hideError(element) {
		if (element.hasClass('errorLighted')) {
			element.removeClass('errorLighted');
		}
	}

	function validateForm() {
		var nightFrom = parseInt(jQuery('input[name=nightFrom]').val());
		var nightTo = parseInt(jQuery('input[name=nightTo]').val());
		if (nightFrom < 1) {
			highlightError(jQuery('input[name=nightFrom]'));
			showErrorMessage(jQuery('.errorContainerDuration'), 'Неверное количество ночей');
			return false;
		}
		if (nightFrom > nightTo) {
			highlightError(jQuery('input[name=nightFrom]'));
			highlightError(jQuery('input[name=nightTo]'));
			showErrorMessage(jQuery('.errorContainerDuration'), 'Неверное количество ночей');
			return false;
		}
		hideError(jQuery('input[name=nightFrom]'));
		hideError(jQuery('input[name=nightTo]'));
		hideErrorMessage(jQuery('.errorContainerDuration'));
		return true;
	}

	function showErrorMessage(element, error) {
		element.text(error);
		element.removeClass('hide');
	}

	function hideErrorMessage(element) {
		element.text('');
		element.addClass('hide');
	}

	function loadHotelsHandler(data) {
		hotelsData = data;
		jQuery('select.hotel.multiselect').addClass('updated');
	}

	jQuery(document).ready(function () {
		if (typeof jQuery('#telephone').mask != "undefined" || jQuery('#r-telephone').mask != "undefined") {
			jQuery('#telephone, #r-telephone').mask("+7 (999) 999-99-99");
		}
		jQuery.datepicker.regional[ "ru" ] = {
			closeText: 'Закрыть',
			prevText: '&#x3c;Пред',
			nextText: 'След&#x3e;',
			currentText: 'Сегодня',
			monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
				'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
				'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
			dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
			dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			dateFormat: 'dd.mm.yy',
			firstDay: 1,
			isRTL: false
		};
		jQuery.datepicker.setDefaults(jQuery.datepicker.regional[ "ru" ]);
// check javascript
		jQuery('html').removeClass('no-js');

		// place for footer at the bottom of the page
		jQuery('.l-mainarea').css('paddingBottom', '+=' + jQuery('.l-footer').outerHeight())
		function currencyParser(value) {
			var value = value + '', parts = Math.floor(value.length / 3), finalValue = ''
			for (var i = 0; i < parts; i++) finalValue = value.substr(-i * 3 - 3, 3) + ' ' + finalValue;
			return value.length % 3 === 0 ? finalValue : value.substr(0, value.length - parts * 3) + ' ' + finalValue
		}

		jQuery('.fline select:not(.hotel, .notMenu)').selectmenu();
		jQuery('.photoupload').uniform({
			fileDefaultText: 'Выбрать фотографию...',
			fileBtnText: ''
		});
		if (jQuery('input.date').hasClass('prev')) {
			jQuery('input.date').datepicker({
				maxDate: '+1d',
				dateFormat: "dd.mm.yy",
				hightlight: {
					format: "dd.mm.yy",
					holidays: holiDays,
					settings: {}
				}
			});
		} else {
			jQuery('input.date').datepicker({
				minDate: '+1d',
				maxDate: '+1y',
				defaultDate: '+14d',
				dateFormat: "dd.mm.yy",
				hightlight: {
					format: "dd.mm.yy",
					holidays: holiDays,
					settings: {}
				}
			});
		}
		jQuery.extend($.ech.multiselect.prototype.options, {
			checkAllText: 'Отметить все',
			uncheckAllText: 'Снять отметку со всех',
			noneSelectedText: 'Выберите из списка',
			selectedText: 'Выбрано #'
		});
		jQuery.extend($.ech.multiselectfilter.prototype.options, {
			label: "",
			placeholder: "Название отеля на английском"
		});
// Multiselect with filter
		jQuery('select.hotel.multiselect').multiselect({
			noneSelectedText: 'Все отели',
			selectedText: 'Выбран$ # отел~',
			classes: 'hotelsMultiselect'
		}).multiselectfilter();
		jQuery.extend($.ech.multiselectorig.prototype.options, {
			checkAllText: 'Выбрать все',
			uncheckAllText: 'Отменить все',
			noneSelectedText: 'Выберите из списка',
			selectedText: 'Выбрано #'
		});
// Multiselect with filter
		jQuery('select[name="toCity"]').multiselectorig({
			noneSelectedText: 'Все курорты',
			selectedText: 'Выбран$ # курорт~',
			classes: 'resortMultiselect'
		});
		jQuery('.dateDurationContainer .duration').live('change', function () {
			changeDuration($(this));
		});
		jQuery('.btn-send-request').live('click', function () {
			_gaq.push(['_trackEvent', 'Leadform_Bottom', 'Submit']);
			contactForm.submit();
			return false;
		});
		jQuery('.price-range').slider({
			range: true,
			min: 10000,
			max: 300000,
			values: [ jQuery(".price-range-from").val(), jQuery(".price-range-to").val() ],
			step: 1000,
			slide: function (e, ui) {
				jQuery('.price-range-from').val(ui.values[0]);
				jQuery('.price-range-to').val(ui.values[1]);
			}
		});
		jQuery('.price-range-from,.price-range-to').live('change', function () {
			jQuery('.price-range').slider("values", [ isNaN(parseInt(jQuery(".price-range-from").val(), 10)) ? 10000 : parseInt(jQuery(".price-range-from").val(), 10),
				isNaN(parseInt(jQuery(".price-range-to").val(), 10)) || parseInt(jQuery(".price-range-to").val(), 10) > 300000 ? 300000 : parseInt(jQuery(".price-range-to").val(), 10) ]);
		});
		if (jQuery('.main-slide-area') && jQuery.fn.jCarouselLite) {
			jQuery('.main-slide-area').jCarouselLite({
				auto: 10000,
				speed: 500,
				scroll: 1,
				count: 3,
				visible: 1,
				start: 0,
				vertical: false,
				btnPrev: '.main-slider-prev',
				btnNext: '.main-slider-next',
				btnNav: [".slider-nav"]
			});
		}
		if (jQuery('.testimotionals-tabs .common-block-content') && jQuery.fn.jCarouselLite) {
			jQuery('.testimotionals-tabs .common-block-content').jCarouselLite({
				auto: null,
				speed: 500,
				scroll: 1,
				visible: 1,
				start: 0,
				vertical: false,
				btnPrev: '.prev',
				btnNext: '.next',
				btnNav: [".feedback-slider-controls"],
				beforeStart: function ($element) {
					$element.find('.hde').removeClass('hde').hide(200, function () {
						jQuery(this).addClass('hidden');
						$element.find('.rem, .readmore').show();
					});
				}
			});
			jQuery('.testimotionals-tabs .common-block-content .readmore').click(function () {
				var $li = jQuery(this).parents('li');
				$li.find('.rem, .readmore').hide();
				$li.css('height', 'auto');
				$li.find('.hidden').removeClass('hidden').addClass('hde').hide().show(200);//.slideDown(2000);
			});
		}
		jQuery('.main-slide-area li').on('click', function (e) {
			if (navigator.userAgent.indexOf('Firefox') !== -1) {
				jQuery(this).find('.btn-details').get(0).click();
			}
			if (navigator.userAgent.indexOf('Macintosh') !== -1 && navigator.userAgent.indexOf('Safari') !== -1) {
				e.preventDefault();
				var self = this;
				jQuery.get(jQuery(this).find('.btn-details').attr('href'), function () {
					window.location = jQuery(self).find('.btn-details').attr('href');
				});
			} else {
				window.location = jQuery(this).find('.btn-details').attr('href');
			}
			showLoader();
		});
		jQuery('#hotelsListData').on('click', '#moreCriteria', function (e) {
			var params = {},
				parameterNames = $.address.queryString();
			if (parameterNames.indexOf('fromCity') !== -1) {
				params['fromCity'] = $.address.parameter('fromCity');
				params['dateFlexible'] = 'on';
			}
			if (parameterNames.indexOf('toCountry') !== -1) {
				params['toCountry'] = $.address.parameter('toCountry');
			}
			if (parameterNames.indexOf('dateFrom') !== -1) {
				params['dateFrom'] = $.address.parameter('dateFrom');
			}
			if (parameterNames.indexOf('adults') !== -1) {
				params['adults'] = $.address.parameter('adults');
			}
			if (parameterNames.indexOf('children') !== -1) {
				params['children'] = $.address.parameter('children');
				if (parameterNames.indexOf('ages') !== -1) {
					params['ages'] = $.address.parameter('ages');
				}
			}
			delete(jQuery.address);
			document.location.hash = '?' + $.param(params);
			document.location.reload();
			showLoader();
			return false;
		});
		jQuery('.content-tabbed-nav li').zTabs();
//top banner
		var $hBanner = jQuery('.h-banner'),
			$lHeader = jQuery('.l-header');
		var hToplineHeight = $lHeader.find('.topline').outerHeight(),
			hBannerHeight = $hBanner.height(),
			hContentHeight = $lHeader.find('.h-content').outerHeight();
		if ($hBanner.is('div') && jQuery.cookie('showBanner') === "toShow" && jQuery.cookie('userClosedBanner') !== "true") {
			$hBanner.hide();
			$hBanner.slideDown(500, function () {
				$lHeader.css('height', hToplineHeight + hBannerHeight + hContentHeight);
				startingTopPosition = hToplineHeight + hBannerHeight;
			});
			$hBanner.find('.close').click(function () {
				$lHeader.css('height', 'auto');
				$hBanner.slideUp(500, function () {
					$lHeader.css('height', hToplineHeight + hContentHeight);
				});
				startingTopPosition = hToplineHeight;
				jQuery.cookie('userClosedBanner', 'true', { path: '/', expires: 999 });
				clearInterval(animation);
			});
			var animation = setInterval(function () {
				$hBanner.find('li').first().animate({
					marginTop: 0
				}, 500, function () {
					var $element = $hBanner.find('li').last().detach();
					$hBanner.find('ul').prepend($element.addClass('first'));
					jQuery(this).removeAttr('style').removeClass('first');
				});
			}, 5000);
		} else {
			$hBanner.hide();
			$lHeader.css('height', hToplineHeight + hContentHeight);
		}
		//var startingTopPosition = jQuery('.h-content').position().top;
		if (!jQuery('body').hasClass('no-sticky-line')) {
			jQuery('.h-content').affix({
				offset: {
					top: function () {
						return startingTopPosition;
					},
					bottom: 0
				}
			});
		}
		;
// On click event for tour-item on main page
		jQuery('.tour-category-item').on('click', function (e) {
			if (navigator.userAgent.indexOf('Firefox') !== -1) {
				jQuery(this).find('.btn-details').get(0).click();
			}
			if (navigator.userAgent.indexOf('Macintosh') !== -1 && navigator.userAgent.indexOf('Safari') !== -1) {
				e.preventDefault();
				var self = this;
				jQuery.get(jQuery(this).find('.btn-details').attr('href'), function () {
					window.location = jQuery(self).find('.btn-details').attr('href');
				});
			} else {
				window.location = jQuery(this).find('.btn-details').attr('href');
			}
			showLoader();
		});
// On click event for search results items
		jQuery('#hotelsListData').unbind().on('click', '.tour-search-item', function (event) {
			var $target = $(event.target).parents('a').is('a') ? $(event.target).parents('a') : $(event.target);
			if ($target.is('a')) {
				if ($target.hasClass('ClImage')) {
					_gaq.push(['_trackEvent', 'Hotel_Card', 'Visit_the_hotel', 'image_hotel']);
				} else if ($target.hasClass('ClHName')) {
					_gaq.push(['_trackEvent', 'Hotel_Card', 'Visit_the_hotel', 'hotel_name']);
				} else if ($target.hasClass('ClAllTours')) {
					_gaq.push(['_trackEvent', 'Hotel_Card', 'Visit_the_hotel', 'all_tours']);
				} else if ($target.hasClass('ClDate')) {
					_gaq.push(['_trackEvent', 'Hotel_Card', 'Visit_the_hotel', 'date_price']);
				}
			} else {
				_gaq.push(['_trackEvent', 'Hotel_Card', 'Visit_the_hotel', 'empty_space']);
				window.open(jQuery(this).find('.btn-more').attr('href'), '_blank');
			}
		});
// gallery
		$.fn.tn3.translate("Close", "Закрыть");
		$.fn.tn3.translate("Maximize", "На весь экран");
		$.fn.tn3.translate("Minimize", "Свернуть");
		$.fn.tn3.translate("Next Image", "Следующее изображение");
		$.fn.tn3.translate("Next Page", "Следующая страница");
		$.fn.tn3.translate("Previous Image", "Предыдущее изображение");
		$.fn.tn3.translate("Previous Page", "Предыдущая страница");
		$.fn.tn3.translate("Start Slideshow", "Слайдшоу");
		$.fn.tn3.translate("Stop Slideshow", "Остановить слайдшоу");
		$('.content-gallery').tn3({
			skinDir: "/skin/frontend/default/travelatav2/css",
			skin: "tn3a",
			imageClick: "fullscreen",
			image: {
				maxZoom: 2,
				crop: true,
				clickEvent: "dblclick"
			},
			touch: {
				skin: "tn3t",
				albums: false,
				fsMode: "hide"
			}
		});
// rating filter logic
		jQuery('.rate-filter').zRate();
// show rewiew form
		jQuery('.content-review-form_open-form-link a').on('click', function (e) {
			e.preventDefault();
			jQuery(this).parent().next('form').show().end().hide();
		});
// Fancybox galleries
		jQuery('.fancy').fancybox();
		/* More / Less parameter on left sidebar search */
		jQuery('.side-additional-options-open').click(function () {
			if (jQuery('.side-additional-options-open').hasClass('close')) {
				jQuery('.icnz.icn-plus').html('+');
				jQuery('.side-additional-options-open').removeClass('close');
				jQuery('.additional_options').slideUp();
			} else {
				jQuery('.icnz.icn-plus').html('-');
				jQuery('.side-additional-options-open').addClass('close');
				jQuery('.additional_options').slideDown();
			}
		});
		jQuery('input[name=nightFrom], input[name=nightTo]').change(validateForm);
		/* button search for tour */
		jQuery('.btn-search').click(function () {
			if (!validateForm()) {
				return false;
			}
			_gaq.push(['_trackEvent', 'SearchForm', 'Submit']);
			var $form = jQuery('#search-tour'),
				url = $form.attr('action'),
				data = stringArrays(serializeArray($form.serializeArray()));
			window.location = url + '#?' + jQuery.param(data);
			return false;
		});
		jQuery('#hotel-stars-all').change(function () {
			if (jQuery(this).attr('checked')) {
				jQuery('.hotelStars').attr('checked', 'checked');
// jQuery('.hotelStars').attr('disabled', 'disabled');
			} else {
				jQuery('.hotelStars').removeAttr('checked');
// jQuery('.hotelStars').removeAttr('disabled');
			}
		});
		jQuery('.hotelStars').change(function () {
			jQuery('#hotel-stars-all').removeAttr('checked');
		});
		jQuery('.resortType').change(function () {
			jQuery('#resort-type-all').removeAttr('checked');
		});
		jQuery('#resort-type-all').change(function () {
			if (jQuery(this).attr('checked')) {
				jQuery('.resortType').attr('checked', 'checked');
// jQuery('.resortType').attr('disabled', 'disabled');
			} else {
// jQuery('.resortType').removeAttr('disabled');
				jQuery('.resortType').removeAttr('checked');
			}
		});
		jQuery('.mealType').live('change', function () {
			jQuery('#meal-type-all').removeAttr('checked');
		});
		jQuery('#meal-type-all').live('change', function () {
			if (jQuery(this).attr('checked')) {
				jQuery('.mealType').attr('checked', 'checked');
			} else {
				jQuery('.mealType').removeAttr('checked');
			}
		});
		jQuery(".to_country").change(function () {
			var src = jQuery(this).val(),
				hotelClass = [];
			jQuery(".resort:not(.notMenu)").selectmenu('disable');
			jQuery('.resort-selected span').html('<img src="http://travelata.local/skin/frontend/default/travelatav2/img/loading_bar.gif" class="loader-input" />');
			jQuery('input[name="hotelClass"]:checked').each(function () {
				hotelClass.push(jQuery(this).val());
			});
			jQuery.ajax({
				type: 'POST',
				url: '/countrychange/ajax/getResort/',
				dataType: 'json',
				data: {
					country: src
				},
				success: function (data) {
					jQuery('.resort').html(data);
					var cities = jQuery.address.parameter('toCity');
					if (cities) {
						if (typeof jQuery('.resort.notMenu').multiselectorig !== "undefined") {
							cities = cities.split('.');
						}
						jQuery('.resort').val(cities);
					}
					jQuery('.resort:not(.notMenu)').selectmenu('enable').selectmenu();
					if (typeof jQuery('.resort.notMenu').multiselectorig !== "undefined") {
						jQuery('.resort.notMenu').multiselectorig("refresh");
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
			jQuery.ajax({
				type: 'POST',
				url: '/gate_exchange/tour/hotel/',
				dataType: 'json',
				data: {
					country: src,
					hotelclass: hotelClass,
					hotels: jQuery.address.parameter('hotels') ? jQuery.address.parameter('hotels') : null
				},
				success: loadHotelsHandler,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		});
		jQuery(".resort").change(function () {
			var country = jQuery(".to_country").val(),
				hotelClass = [],
				city = $(this).val();
			jQuery('input[name="hotelClass"]:checked').each(function () {
				hotelClass.push(jQuery(this).val());
			});
			jQuery.ajax({
				type: 'POST',
				url: '/gate_exchange/tour/hotel/',
				dataType: 'json',
				data: {
					country: country,
					city: city,
					hotelclass: hotelClass,
					hotels: jQuery.address.parameter('hotels') ? jQuery.address.parameter('hotels') : null
				},
				success: loadHotelsHandler,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		});
		jQuery('input[name="hotelClass"]').change(function () {
			var country = jQuery(".to_country").val(),
				hotelClass = [],
				city = jQuery('select[name="toCity"]').val();
			jQuery('input[name="hotelClass"]:checked').each(function () {
				hotelClass.push(jQuery(this).val());
			});
			jQuery.ajax({
				type: 'POST',
				url: '/gate_exchange/tour/hotel/',
				dataType: 'json',
				data: {
					country: country,
					city: city,
					hotelclass: hotelClass,
					hotels: jQuery.address.parameter('hotels') ? jQuery.address.parameter('hotels') : null
				},
				success: loadHotelsHandler,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		});
		/* change the number of children + display age */
		jQuery('#nb_children').live('change', function () {
			if (jQuery(this).val() == 0) {
				jQuery('#budgetForTour').text('бюджет на ' + jQuery('select[name=adults]').val() + ' взрослых');
				jQuery('.kid1, .kid2, kid3').addClass('hidden');
				jQuery('#age_children_1, #age_children_2, #age_children_3').val('').selectmenu();
			} else {
				jQuery('#budgetForTour').text('бюджет на ' + jQuery('select[name=adults]').val() + ' взрослых и ' + jQuery('#nb_children').val() + ' детей');
			}
			if (jQuery(this).val() == 1) {
				jQuery('.kid1').removeClass('hidden');
				jQuery('.kid2, .kid3').addClass('hidden');
				jQuery('#age_children_2, #age_children_3').val('').selectmenu();
			}
			if (jQuery(this).val() == 2) {
				jQuery('.kid1, .kid2').removeClass('hidden');
				jQuery('.kid3').addClass('hidden');
				jQuery('#age_children_3').val('').selectmenu();
			}
			if (jQuery(this).val() == 3) {
				jQuery('.kid1, .kid2, .kid3').removeClass('hidden');
			}
		});
		jQuery('select[name=adults]').change(function () {
			if (jQuery('#nb_children').val() == 0) {
				jQuery('#budgetForTour').text('бюджет на ' + jQuery('select[name=adults]').val() + ' взрослых');
			} else {
				jQuery('#budgetForTour').text('бюджет на ' + jQuery('select[name=adults]').val() + ' взрослых и ' + jQuery('#nb_children').val() + ' детей');
			}
		});
		jQuery('#profile-change-pass').change(function () {
			if (jQuery(this).attr('checked')) {
				return jQuery('#profile-password-container').removeClass('hidden');
			}
			jQuery('#profile-password-container').addClass('hidden');
		});
		initPagination();
		function showMagazineAnimation() {
			var supports3D = (function () {
				if (document.body && document.body.style.perspective !== undefined) {
					return true;
				}
				var _tempDiv = document.createElement("div"),
					style = _tempDiv.style,
					a = ["Webkit", "Moz", "O", "Ms", "ms", "o"],
					i = a.length;
				if (_tempDiv.style.perspective !== undefined) {
					return true;
				}
				while (--i > -1) {
					if (style[a[i] + "Perspective"] !== undefined) {
						return true;
					}
				}
				return false;
			}());
			var supportTransform = (function () {
				var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
				for (var i = 0; i < prefixes.length; i++) {
					if (document.createElement('div').style[prefixes[i]] !== undefined) {
						return prefixes[i];
					}
				}
				return false;
			}());

			if (!supportTransform) {
				jQuery('#mirBanner').addClass('withoutTransform')
				jQuery('#mirBanner').hover(function () {
						$(this).addClass('hover');
					},
					function () {
						$(this).removeClass('hover');
					});
			}
			if (!jQuery.cookie('journalSended')) {
				jQuery('#mirBanner').show();
			}
			jQuery('#mirBanner').click(function () {
				var $self = $(this);
				if (supports3D) {
					$self.removeClass('animation');
					$self.addClass('preState');
					setTimeout(function () {
						$self.addClass('animation');
						$self.addClass('clicked');
					}, 20);
					setTimeout(function () {
						$self.addClass('secondPage');
					}, 90);
					setTimeout(function () {
						$self.find('form').addClass('show');
						$self.find('.close').addClass('show');
					}, 300);
				} else {
					if (supportTransform) {
						$self.removeClass('animation');
						setTimeout(function () {
							$self.addClass('animation');
						}, 20);
					}
					$self.addClass('openedWithoutAnimation');
					$self.find('form').addClass('show');
				}
				jQuery('#mirBannerShadow').height(jQuery(document).height()).addClass('show');
			});
			jQuery('#mirBanner .close, #mirBannerShadow').click(function () {
				var $self = jQuery('#mirBanner');
				if (supports3D) {
					$self.addClass('clickedClose');
					setTimeout(function () {
						$self.removeClass('clicked');
					}, 250);
					setTimeout(function () {
						$self.removeClass('animation');
						setTimeout(function () {
							$self.removeClass('preState secondPage clickedClose').addClass('afterState');
							setTimeout(function () {
								$self.addClass('animation');
								$self.removeClass('afterState');
							}, 20);
						}, 20);
					}, 260);
				} else {
					if (supportTransform) {
						$self.removeClass('animation');
						setTimeout(function () {
							$self.addClass('animation');
						}, 20);
					}
					$self.removeClass('openedWithoutAnimation');
				}
				$self.find('form').removeClass('show');
				$self.find('.close').removeClass('show');
				jQuery('#mirBannerShadow').removeClass('show').addClass('ovhide');
				setTimeout(function () {
					jQuery('#mirBannerShadow').removeClass('ovhide');
					if (jQuery('#mirBanner form').hasClass('sended')) {
						jQuery.cookie('journalSended', 'true', { path: '/', expires: 999 });
						jQuery('#mirBanner').css('opacity', 0);
					}
				}, 350);
				return false;
			});
			jQuery('#mirBanner form').validate({
				errorElement: 'div',
				errorClass: 'err',
				rules: {
					email: {
						required: true,
						email: true
					}
				},
				messages: {
					email: {
						required: "Пожалуйста, введите Email",
						email: "Email введен неверно"
					}
				}
			});
			jQuery('#mirBanner form').on('submit', function () {
				var $self = jQuery(this),
					action = $self.attr('action'),
					email = $self.find('[name="email"]').val();
				if (!$self.hasClass('disabled') && $self.valid()) {
					$self.addClass('disabled');
					jQuery.ajax({
						dataType: 'json',
						url: action,
						data: {
							email: email
						}
					}).done(function (response) {
							if (response.success == true || response.success == "true") {
								$self.addClass('sended');
								$self.find('.result .text strong').text(email);
								_gaq.push(['_trackEvent', 'Subscription', 'Subscription_success', 'Afisha_Mir']);
							}
						});
				}
				return false;
			});
		}

		if (jQuery('#mirBanner').length) {
			showMagazineAnimation();
		}
	});
})(jQuery);
function processingSidebarSize() {
	function sidebarResize() {
		var $resortContainerCrop,
			$content = jQuery('.l-mainarea.wblock'),
			windowHeight = jQuery(window).height(),
			$resortContainer = jQuery('.fline.resortContainer'),
			limit = 700;
		if (windowHeight < limit) {
			if (!$content.hasClass('lowHeight')) {
				$content.addClass('lowHeight');
				$resortContainerCrop = $resortContainer.detach();
				jQuery('.additional_options').prepend($resortContainerCrop);
			}
		} else {
			if ($content.hasClass('lowHeight')) {
				$content.removeClass('lowHeight');
				$resortContainerCrop = $resortContainer.detach();
				jQuery('.to_country.countriesList').parent().after($resortContainerCrop);
			}
		}
	}

	jQuery(function () {
		jQuery(window).bind('resize', sidebarResize);
		sidebarResize();
	});
}