jQuery(document).ready(function () {
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
					//holidays: holiDays,
					settings: {}
				}
			});
		}

//	jQuery.extend($.ech.multiselect.prototype.options, {
//			checkAllText: 'Отметить все',
//			uncheckAllText: 'Снять отметку со всех',
//			noneSelectedText: 'Выберите из списка',
//			selectedText: 'Выбрано #'
//		});
//		jQuery.extend($.ech.multiselectfilter.prototype.options, {
//			label: "",
//			placeholder: "Название отеля на английском"
//		});
//// Multiselect with filter
//		jQuery('select.hotel.multiselect').multiselect({
//			noneSelectedText: 'Все отели',
//			selectedText: 'Выбран$ # отел~',
//			classes: 'hotelsMultiselect'
//		}).multiselectfilter();
//		jQuery.extend($.ech.multiselectorig.prototype.options, {
//			checkAllText: 'Выбрать все',
//			uncheckAllText: 'Отменить все',
//			noneSelectedText: 'Выберите из списка',
//			selectedText: 'Выбрано #'
//		});
// Multiselect with filter
//		jQuery('select[name="toCity"]').multiselectorig({
//			noneSelectedText: 'Все курорты',
//			selectedText: 'Выбран$ # курорт~',
//			classes: 'resortMultiselect'
//		});
		jQuery('.dateDurationContainer .duration').on('change', function () {
			changeDuration($(this));
		});
		jQuery('.btn-send-request').on('click', function () {
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
		jQuery('.price-range-from,.price-range-to').on('change', function () {
			jQuery('.price-range').slider("values", [ isNaN(parseInt(jQuery(".price-range-from").val(), 10)) ? 10000 : parseInt(jQuery(".price-range-from").val(), 10),
				isNaN(parseInt(jQuery(".price-range-to").val(), 10)) || parseInt(jQuery(".price-range-to").val(), 10) > 300000 ? 300000 : parseInt(jQuery(".price-range-to").val(), 10) ]);
		});
	if($("select").length) {
		jQuery('select').selectmenu();
	}
	if($("select.multi").length){
		//$("select.multi").multiselect();
	}
	$(".side-additional-options").on('click', function(ev){
		ev.preventDefault();
		$(".additional_options").toggleSlide();
	})
});