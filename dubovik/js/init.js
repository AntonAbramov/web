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

//	jQuery.extend(jQuery.ech.multiselect.prototype.options, {
//			checkAllText: 'Отметить все',
//			uncheckAllText: 'Снять отметку со всех',
//			noneSelectedText: 'Выберите из списка',
//			selectedText: 'Выбрано #'
//		});
//		jQuery.extend(jQuery.ech.multiselectfilter.prototype.options, {
//			label: "",
//			placeholder: "Название отеля на английском"
//		});
//// Multiselect with filter
//		jQuery('select.hotel.multiselect').multiselect({
//			noneSelectedText: 'Все отели',
//			selectedText: 'ВыбранjQuery # отел~',
//			classes: 'hotelsMultiselect'
//		}).multiselectfilter();
//		jQuery.extend(jQuery.ech.multiselectorig.prototype.options, {
//			checkAllText: 'Выбрать все',
//			uncheckAllText: 'Отменить все',
//			noneSelectedText: 'Выберите из списка',
//			selectedText: 'Выбрано #'
//		});
// Multiselect with filter
//		jQuery('select[name="toCity"]').multiselectorig({
//			noneSelectedText: 'Все курорты',
//			selectedText: 'ВыбранjQuery # курорт~',
//			classes: 'resortMultiselect'
//		});
		jQuery('.dateDurationContainer .duration').on('change', function () {
			changeDuration(jQuery(this));
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
	if(jQuery("select").length) {
		jQuery('select').selectmenu();
	}
	if(jQuery("select.multi").length){
		//jQuery("select.multi").multiselect();
	}
	jQuery(".side-additional-options").on('click', function(ev){
		ev.preventDefault();
		jQuery(".additional_options").toggleSlide();
	})

	jQuery('#initiateAuth').on('click', function () {
		jQuery.ajax('/auth/go',
			{
				data: getFormData(jQuery('#form_auth form')),
				type: 'POST',
				success: function (response) {
					var data = jQuery.parseJSON(response);
					console.log(data);
					jQuery('.enter2_input_item').removeClass('incorrect');
					if (typeof data.errors !== 'undefined') {
						// set errors on form
						var form = jQuery('#form_auth');
						if (typeof data.errors.fields !== 'undefined') {
							//find field by name
							for (var i in data.errors.fields) {
								form.find('input[name="' + data.errors.fields[i] + '"]')
									.closest('.enter2_input_item').addClass('incorrect');
							}
						}

						var fields = ['email', 'phone', 'phone_code'];

						for (var k in fields) {
							if (typeof data.errors[fields[k]] !== 'undefined') {
								var inputBlock = form.find('input[name="User[' + fields[k] + ']"]')
									.closest('.enter2_input_item').addClass('incorrect');
								if (typeof data.errors[fields[k]] !== 'undefined') {
									inputBlock.find('.enter2_attention').html(' - ' + data.errors[fields[k]][0]);
								}
							}
						}
					}

					// need this?
					if (typeof data.redirect !== 'undefined') {
						document.location.href = data.redirect;
					}
				}
			}
		);

		return false;
	});


	jQuery('.show_all_resorts a').click(function () {
		jQuery('.show_all_resorts').remove();
		jQuery('.resorts_list').fadeIn();
	});
	jQuery('.show_price_range a').click(function () {
		jQuery('.show_price_range').remove();
		jQuery('.price_range').fadeIn();
	});


	jQuery('.kids select').change(function () {
		if (jQuery('.kids select option:selected').hasClass('kids_amount') && jQuery('.kids select option:selected').hasClass('one')) {
			jQuery('.add').remove();
			var one_child = '<span class="float_right add"><label>Возраст</label><select class="selectpicker show-tick age_choice" data-width="47px" title="1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></span>';
			jQuery('.travelers').append(one_child);
			jQuery('.age_choice').selectpicker('refresh');
		}
		else if (jQuery('.kids select option:selected').hasClass('kids_amount') && jQuery('.kids select option:selected').hasClass('two')) {
			jQuery('.add').remove();
			var one_child = '<span class="float_right add"><label>Возраст</label><select class="selectpicker show-tick age_choice" data-width="47px" title="1" multiple><optgroup label="1-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="2-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup></select></span>';
			jQuery('.travelers').append(one_child);
			jQuery('.age_choice').selectpicker('refresh');
		}
		else if (jQuery('.kids select option:selected').hasClass('kids_amount') && jQuery('.kids select option:selected').hasClass('three')) {
			jQuery('.add').remove();
			var one_child = '<span class="float_right add"><label>Возраст</label><select class="selectpicker show-tick age_choice" data-width="47px" title="1" multiple><optgroup label="1-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="2-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="3-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup></select></span>';
			jQuery('.travelers').append(one_child);
			jQuery('.age_choice').selectpicker('refresh');
		}
		else if (jQuery('.kids select option:selected').hasClass('kids_amount') && jQuery('.kids select option:selected').hasClass('four')) {
			jQuery('.add').remove();
			var one_child = '<span class="float_right add"><label>Возраст</label><select class="selectpicker show-tick age_choice" data-width="47px" title="1" multiple><optgroup label="1-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="2-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="3-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup><optgroup label="4-й ребенок"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></optgroup></select></span>';
			jQuery('.travelers').append(one_child);
			jQuery('.age_choice').selectpicker('refresh');
		}
		else {
			jQuery('.add').remove();
			var one_child = '<span class="float_right add"><label>Возраст</label><select class="selectpicker show-tick age_choice" data-width="47px"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></span>';
			jQuery('.travelers').append(one_child);
			jQuery('.age_choice').prop('disabled', true);
			jQuery('.age_choice').selectpicker('refresh');
		}
	});


	jQuery('.toggle_country_list').click(function () {
		jQuery('.country_list').fadeIn();
	});
	jQuery('.country_list .btn').click(function () {
		jQuery('.country_list').fadeOut();
	});


	jQuery('.c_checkbox').change(function () {
		var numSelected = jQuery("input.c_checkbox:checked").length;
		jQuery('.toggle_country_list a').remove();
		if (numSelected >= 5) {
			jQuery('.toggle_country_list').append('<a>Вы выбрали ' + numSelected + ' стран</a>');
		}
		else if (numSelected == 1) {
			jQuery('.toggle_country_list').append('<a>Вы выбрали ' + numSelected + ' страну</a>');
		}
		else if (numSelected < 1) {
			jQuery('.toggle_country_list').append('<a>Выберите 2-4 страны</a>');
		}
		else {
			jQuery('.toggle_country_list').append('<a>Вы выбрали ' + numSelected + ' страны</a>');
		}
	});

	jQuery('.special_request .btn').click(function () {
		jQuery('.request_form').fadeIn();
		jQuery('.screen_fill').fadeIn();
	});
	jQuery('.open_notify_form').click(function () {
		jQuery('.notify_form').fadeIn();
		jQuery('.screen_fill').fadeIn();
	});

	jQuery(".request_form #close_form").mousedown(function () {
		jQuery(this).addClass('mousedown');
	}).mouseup(function () {
			jQuery(this).removeClass('mousedown');
		});
	jQuery(".notify_form #close_form").mousedown(function () {
		jQuery(this).addClass('mousedown');
	}).mouseup(function () {
			jQuery(this).removeClass('mousedown');
		});

	jQuery(".request_form #close_form").click(function () {
		jQuery('.screen_fill').fadeOut();
		jQuery('.request_form').fadeOut();
	});

	jQuery(".notify_form #close_form").click(function () {
		jQuery('.screen_fill').fadeOut();
		jQuery('.notify_form').fadeOut();
	});

	jQuery('#email, #email2').bind('keyup', function () {
		jQuery(this).val(jQuery(this).val().replace(/[^a-z ]/i, ""));
	});

});