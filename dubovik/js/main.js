/*function fid_134985912390225153932(ymaps) {
	var map = new ymaps.Map("ymaps-map-id_134985912390225153932", {
		center: [30.300937999999967, 59.90963350671851], 
		zoom: 13, 
		type: "yandex#map"
	});
	map.controls
		.add("zoomControl")
		.add("mapTools")
		.add(new ymaps.control.TypeSelector(["yandex#map", "yandex#satellite", "yandex#hybrid", "yandex#publicMap"]));
	map.geoObjects
	.add(new ymaps.Placemark([30.300938, 59.905064], {
		balloonContent: "Мир путешествий"
	}, {
		preset: "twirl#lightblueDotIcon"
	}));
}*/

$(document).ready(function() {
	$('.custom_check').ezMark();
 
	/*$('.ez-checked').parent().addClass('checked_label');
	
	$('.custom_check').on('click', function(){
		if($(this).attr('checked','checked')){
			$(this).parent().parent().addClass('checked_label'); 
		}
		else{
			$(this).parent().parent().removeClass('checked_label');
		}
	}); */
	
	$('.block_scroll:visible').jScrollPane({
		verticalDragMaxHeight: 70,
        height: 200
	});
	
	$('.people_count li:first-child').find('a').addClass('active_p');
	$('.people_count').each(function(){
		$(this).find('input').val($(this).find('.active_p').text());
	});
	
	$('.people_count a').on('click', function(){
		var childCount = $(this).parent().index() - 1;
		$(this).parents('.people_count').find('a').removeClass('active_p');
		$(this).addClass('active_p');
		$(this).parents('.people_count').find('input').val($(this).text());
		
		if($(this).parents('.people_count').hasClass('children')){
			$('.age_select li').each(function(){
				$(this).find('.custom_select').selectBox('disable');
				if($(this).index() == childCount){
					$(this).prevAll().find('.custom_select').selectBox('enable');
					$(this).find('.custom_select').selectBox('enable');
				}
			});
		}
		return false;
	});
	
	$('.custom_select').selectBox();
	$('.select_age').selectBox(
		'disable'
	);
	
	$('.flycity_link').on('click', function(){
		if(!$(this).next().hasClass('flycity_list_show')){
			$('.flycity_link').next().removeClass('flycity_list_show');
			$(this).next().addClass('flycity_list_show');
		}
		else{
			$('.flycity_link').next().removeClass('flycity_list_show');
		}
		return false;
	});

	$('.flycity_link').each(function(){
        if (!$(this).find('li.selected').length) {
            $(this).find('li:first-child').find('a').addClass('selected');
        }

		$(this).find('.flycity_text').text($(this).parent().find('.selected').text());
		$(this).parent().find('input').val($(this).parent().find('.selected').closest('li').attr('value'));
	});
	
	$('.spa_card_precisely .spa_card_link .spa_card_text').each(function(){
		$(this).text($(this).parent().next().find('.selected').text());
		$(this).parents('.flycity').find('input').val($(this).parent().parent().find('.selected').closest('li').attr('value'));
        //console.log($(this).parent().parent().find('.selected'));
	});
	
	$('.flycity_list').on('click', 'a', function(){
		$(this).parents('.flycity_list').find('a').removeClass('selected');
		$(this).addClass('selected');
		$(this).parents('.flycity').find('.flycity_link .flycity_text').text($(this).text());
		$(this).parents('.flycity').find('input').val($(this).closest('li').attr('value')).trigger('change');
		$(this).parents('.flycity_list ').removeClass('flycity_list_show');
		$(this).parents('.spa_card_precisely').find('.spa_card_link .spa_card_text').text($(this).text());

        $('input[name="city_id"]').val();
		return false;
	});
	
	$(document).on('click',function(event) {
		if ($(event.target).closest(".flycity_list").length) return;
		$(".flycity_list").removeClass('flycity_list_show');
		event.stopPropagation();
	});
	  
	$(".slider_days").slider({
        range: true,
        min: 0,
        max: 35,
        values: [ 7, 14 ],
        create: function( event, ui ) {
			var pos = $(this).slider("option", "values");
			$(".slider_days .ui-slider-handle").append("<div class = 'sl_balloon'></div>");
			$( ".slider_days a .sl_balloon" ).html( pos[0]  + ' ночей' );
			$( ".slider_days a+a .sl_balloon" ).html( pos[1]  + ' ночей');
			$(this).parents('.block_slider').find('.slider_item:first-child input').val(pos[0]);
			$(this).parents('.block_slider').find('.slider_item:last input').val(pos[1]);
			
		},
		stop: function(event, ui) {
			var pos = $(this).slider("option", "values");
			$(this).parents('.block_slider').find('.slider_item:first-child input').val(pos[0]);
			$(this).parents('.block_slider').find('.slider_item:last input').val(pos[1]);
		},
        slide: function(event, ui) {
            if (ui.values[1] - ui.values[0] < 3) {
                return false;
            }
            else {
                $( ".slider_days a .sl_balloon" ).text(ui.values[ 0 ] + ' ночей');
                $( ".slider_days a+a .sl_balloon" ).text(ui.values[ 1 ] + ' ночей');
                $(this).parents('.block_slider').find('.slider_item:first-child input').val(ui.values[0]);
                $(this).parents('.block_slider').find('.slider_item:last input').val(ui.values[1]);
            }
        },
        change: function(event, ui) {
            if (ui.values[1] - ui.values[0] < 3) {
                return false;
            } else {
                $( ".slider_days a .sl_balloon" ).text(ui.values[ 0 ] + ' ночей');
                $( ".slider_days a+a .sl_balloon" ).text(ui.values[ 1 ] + ' ночей');
                $(this).parents('.block_slider').find('.slider_item:first-child input').val(ui.values[0]);
                $(this).parents('.block_slider').find('.slider_item:last input').val(ui.values[1]);
            }
        }
	});
		
	/*$('.slider_days').on('slide', function(event, ui){
		if (ui.values[1] - ui.values[0] < 7) {
			return false;
		} 
		else {
			$( ".slider_days a .sl_balloon" ).text(ui.values[ 0 ] + ' ночей');
			$( ".slider_days a+a .sl_balloon" ).text(ui.values[ 1 ] + ' ночей');
		}
	});*/
	
	$('.slider_item').on('click', function(){
		if($(this).hasClass('slider_item_from')){
			$('.slider_popup').attr('class', 'search_block_back slider_popup');
			$(this).parent().find('.slider_popup').addClass('slider_popup_left');
		}
		else{
			$('.slider_popup').attr('class', 'search_block_back slider_popup');
			$(this).parent().find('.slider_popup').addClass('slider_popup_right');
		}
		return false;
	});
	
	$(document).on('click',function(event) {
		if ($(event.target).closest(".block_slider").length) return;
		$(".slider_popup").each(function(){
			$(".slider_popup").removeClass('slider_popup_left');
			$(".slider_popup").removeClass('slider_popup_right');;
		});
		event.stopPropagation();
	});
	
	$(".slider_price").slider({
	  	range: true,
	 	min: 0,
	  	max: 10000,
		values: [ 1000, 7000 ],
		create: function( event, ui ) {
			var pos = $(this).slider("option", "values");
			$(".slider_price .ui-slider-handle").append("<div class = 'sl_balloon'></div>");
			$( ".slider_price a .sl_balloon" ).html( pos[0]  + ' $' );
			$( ".slider_price a+a .sl_balloon" ).html( pos[1]  + ' $');
			$(this).parents('.block_slider').find('.slider_item:first-child input').val(pos[0]);
			$(this).parents('.block_slider').find('.slider_item:last input').val(pos[1]);

		},
		change: function(event, ui) {
			var pos = $(this).slider("option", "values");
			$(this).parents('.block_slider').find('.slider_item:first-child input').val(pos[0]);
			$(this).parents('.block_slider').find('.slider_item:last input').val(pos[1]);
            $( ".slider_price a .sl_balloon" ).text(ui.values[ 0 ] + ' $');
            $( ".slider_price a+a .sl_balloon" ).text(ui.values[ 1 ] + ' $');
		},
		slide: function(event, ui) {
			if (ui.values[1] - ui.values[0] < 500) {
				if($(ui.handle).index()==2){
					var other = ui.values[0];
					$(this).slider('values', [other, other+500]);
					$(this).parents('.block_slider').find('.slider_item:first-child input').val(other);
					$(this).parents('.block_slider').find('.slider_item:last input').val(other+500);
					$( ".slider_price a .sl_balloon" ).text(other + ' $');
					$( ".slider_price a+a .sl_balloon" ).text(other+500 + ' $');
				}
				else {
					var other = ui.values[1];
					$(this).slider('values', [other-500, other]);
					$(this).parents('.block_slider').find('.slider_item:first-child input').val(other-500);
					$(this).parents('.block_slider').find('.slider_item:last input').val(other);
					$( ".slider_price a .sl_balloon" ).text(other-500 + ' $');
					$( ".slider_price a+a .sl_balloon" ).text(other + ' $');				
				}
				
				return false
			} 
			else {
				var pos = $(this).slider("option", "values");
				$(this).parents('.block_slider').find('.slider_item:first-child input').val(pos[0]);
				$(this).parents('.block_slider').find('.slider_item:last input').val(pos[1]);
				$( ".slider_price a .sl_balloon" ).text(ui.values[ 0 ] + ' $');
				$( ".slider_price a+a .sl_balloon" ).text(ui.values[ 1 ] + ' $');
			}
		}
	});
		

	$('.autorize li .enter').on('click', function(){
		$('.overlay').fadeIn(200);
		$('.overlay .enter2_modal_block').fadeIn(200);
		return false;
	});
	
	$('.enter2_modal_close a').on('click', function(){
		$('.overlay').fadeOut(200);
		$('.overlay .enter2_modal_block').hide();
		$('.overlay .popup_map').hide();
		$('.overlay .popup_list').hide();
		$('.overlay .popup_low').hide();
        $('.overlay .popup_request').hide();
		$('.overlay .why_popup').hide();
		$('.overlay .popup_remember').hide();
		$('.overlay .popup_pass_send').hide();
		$('.overlay .popup_send').hide();
        $('.overlay .tez_comment_modal').hide();
        $('.overlay .popup_select').hide();
		$('.container_popup').removeClass('container_popup_show');
		return false;
	});
	
	$(document).on('click',function(event) {
		if ($(event.target).closest(".enter2_modal_block").length || $(event.target).closest(".tez_comment_modal").length || $(event.target).closest(".popup_map").length || $(event.target).closest(".popup_list").length || $(event.target).closest(".popup_low").length || $(event.target).closest(".why_popup").length || $(event.target).closest(".popup_remember").length|| $(event.target).closest(".popup_pass_send").length|| $(event.target).closest(".popup_send").length|| $(event.target).closest(".popup_select").length) return;
		$('.overlay').fadeOut(200, function(){
			
		});
		$('.overlay .enter2_modal_block').hide();
		$('.overlay .popup_map').hide();
		$('.overlay .popup_list').hide();
		$('.overlay .popup_low').hide();
		$('.overlay .popup_request').hide();
		$('.overlay .why_popup').hide();
		$('.overlay .popup_remember').hide();
		$('.overlay .popup_pass_send').hide();
		$('.overlay .popup_send').hide();
		$('.overlay .tez_comment_modal').hide();
        $('.overlay .popup_select').hide();
		$('.container_popup').removeClass('container_popup_show');
		event.stopPropagation();
	});
	
	$('.choose_link').on('click',function() {
		if (!$(this).next().hasClass('choose_block_show')){
			$(this).next().addClass('choose_block_show');
		}
		else{
			$(this).next().removeClass('choose_block_show');
		}
		return false;
	});
	
	$(document).on('click',function(event) {
		if ($(event.target).closest(".choose_block").length) return;
		$(".choose_block").removeClass('choose_block_show');
		event.stopPropagation();
	});
	
	$('.spa_card_link').on('click',function() {
		if(!$(this).next().hasClass('flycity_list_show')){
			$(this).next().addClass('flycity_list_show');
		}
		else{
			$(this).next().removeClass('flycity_list_show');
		}
		return false;
	});
	
	
	$('.tabs_nav li a').parent('li:first').addClass('active').click();
	
	$('.tabs_nav li a').on('click', function(){
		if(!$(this).parent().hasClass('active')){
			$('.tabs_nav li').removeClass('active');
			$(this).parent().addClass('active');
			
			var num = $(this).parent().index();
			$('.tabs_body > li').removeClass('active');
			$('.tabs_body > li').eq(num).addClass('active');
		}
		return false;
	});
	
	$('.why_reasons > li').each(function(index){
		$(this).attr('id', 'reason' + index);
	});
	$('.why_register_menu li').each(function(index){
		$(this).attr('id', 'button'+ index);
	});

	$('.why_register_menu a').on('click', function(){
		if(!$(this).parent().hasClass('active')){
			var activeTab=$(this).parent().attr('id');
			var activeReason='#' + activeTab.replace('button','reason');
			$('.why_register_menu li').removeClass('active');
			$(this).parent().addClass('active');
			$('.why_reasons').find('.active').fadeOut(200,function(){
				$(this).removeClass('active');
				$(activeReason).fadeIn(200);
				$(activeReason).addClass('active');
			});
		}
		return false;
	});
	
	$('.write_btn').on('click', function(){
		$('.overlay').fadeIn(200);
        $('.overlay .tez_comment_modal').fadeIn(200, function(){
            $('.block_scroll').not('.jspScrollable').jScrollPane({
                verticalDragMaxHeight: 70,
                height: 200
            });
        });

		$('.container_popup').addClass('container_popup_show');
		return false;
	});
	
	$('.other_turfirm_choice .choice_map').on('click', function(){
		$('.overlay').fadeIn(200);
		$('.overlay .popup_map').fadeIn(200);
		return false;
	});
	
	$('.other_turfirm_choice .choice_list').on('click', function(){
		$('.overlay').fadeIn(200);
		$('.overlay .popup_list').fadeIn(200);
		return false;
	});
	
	$('.popup_list .popup_list_name .agency_list a').on('click', function(){
		$(this).parents('.popup_list').fadeOut(200);
		$('.overlay .popup_map').fadeIn(200);
		return false;
	});
	
	$('.popup_map .popup_list_name .agency_list a').on('click', function(){
		$(this).parents('.popup_map').fadeOut(200);
		$('.overlay .popup_list').fadeIn(200);
		return false;
	});
	
	$('.advertising .set_phone').on('click', function(){
        $('.overlay .popup_text').fadeOut(0);
		$('.overlay').fadeIn(200);
		$('.overlay .popup_low').fadeIn(200);
		return false;
	});

    $('.advertising .set_request').on('click', function(){
        $('.overlay').fadeIn(200);
        $('.overlay .popup_request').fadeIn(200);
        return false;
    });
	
	$('.white_btn a.white_submit').on('click', function(){
        $('.overlay').fadeIn(200);
        $('.overlay .popup_select').fadeIn(200, function(){
            $(this).find('.block_scroll').jScrollPane({
                verticalDragMaxHeight: 70,
                height: 200
            });
        });
		return false;
	});
	
	$('.whatreg').on('click', function(){
		$('.overlay').fadeIn(200, function(){
			$('.why_popup').fadeIn(200);
		});
		return false;
	});
	
	$('.enter2_remember_pass a ').on('click', function(){
		$('.enter2_modal_block').fadeOut(200, function(){
			$('.popop_restore_input').fadeIn(200);
		});
		return false;
	});
	
	$('.popup_remember  .enter2_green_btn').on('click', function(){
		/*$('.popup_remember').fadeOut(200, function(){
			$('.popup_pass_send').fadeIn(200);
		});
		return false;*/
	});
	
	/*$('.reg_sec .enter2_green_btn input ').on('click', function(){
		$('.overlay').fadeIn(200, function(){
			$('.popup_send').fadeIn(200);
		});
		return false;
	});*/
	
	$('input[placeholder], textarea[placeholder]').placeholder();
	
	function setChecked(){
		$('.reg_sec .reg_col .first_registr_label input').removeAttr('checked');
		$('.reg_sec .registr_tourist .first_registr_label input').attr({"checked":"checked"});
		$('.reg_sec .reg_col .first_registr_label input').trigger('change');
	}
	//setChecked();
	
	$('.reg_sec .reg_col .first_registr_label input').on('click', function(){
		if($(this).attr({"checked":"checked"})){
			$(this).parents('.reg_sec_cols').find('.reg_col').removeClass('with_over');
			$(this).parents('.reg_col').addClass('with_over');
			$('.reg_sec .reg_col .first_registr_label input').attr({"checked":"checked"});
			$(this).removeAttr('checked');
			$('.reg_sec .reg_col .first_registr_label input').trigger('change');
		}
	});

	$('.reg_sec .reg_overlay').on('click', function(){
		$(this).parents('.reg_sec_cols').find('.reg_col').not('.with_over').find('.first_registr_label input').triggerHandler('click');
	});
	
	$('.sort_form .inside_spa_list').each(function(){
		$(this).find('li').removeClass('active');
		$(this).find('li:first').addClass('active');
		
		var inputVal = $(this).find('.active').children('a').attr('rel');
		$(this).parent().find('input').val(inputVal);
	});
	
	$('.sort_form .inside_spa_list a').on('click', function(){
		$(this).parent().parent().find('li').removeClass('active');
		$(this).parent().addClass('active');
		
		var inputVal = $(this).attr('rel');
		$(this).parent().parent().parent().find('input').val(inputVal);
		return false;
	});
	
	//Andrey's slider
	var activeElem = $('.hotel_slider_mini li:first').addClass('active');
	var oneSliderWidth = $('.hotel_slider_mini li').outerWidth(true);
	var sliderLi = $('.hotel_slider_mini li').length;
	var widthSlider = oneSliderWidth * sliderLi;
	var seeObl = $('.mini_slider_body').width();
	var maxWidth = widthSlider - seeObl;
	
	function proverkaActive(){
		var funcActive = $('.hotel_slider_mini li.active');
		if(funcActive.prev().length){
			$('.prev_mini_img').addClass('active');
		}else{
			$('.prev_mini_img').removeClass('active');
		}
		if(funcActive.nextAll().length > 4){
			$('.next_mini_img').addClass('active');
		}else{
			$('.next_mini_img').removeClass('active');
		}
	}
	
	$('.next_mini_img').on('click',function(){
		if($(this).hasClass('active')){
			$('.hotel_slider_mini').find('li.active').removeClass('active').next().addClass('active');
			var activePos = $('.hotel_slider_mini li.active').position().left;
			if(activePos > maxWidth){
				$('.hotel_slider_mini').animate({'left': maxWidth*(-1)}, 500);
			}else{
				$('.hotel_slider_mini').animate({'left': activePos*(-1)}, 500);
			}
			proverkaActive();
		}
		return false;
	});
	
	$('.prev_mini_img').on('click',function(){
		if($(this).hasClass('active')){
			$('.hotel_slider_mini').find('li.active').removeClass('active').prev().addClass('active');
			var activePos = $('.hotel_slider_mini li.active').position().left;
			if(activePos > maxWidth){
				$('.hotel_slider_mini').animate({'left': maxWidth*(-1)}, 500);
			}else{
				$('.hotel_slider_mini').animate({'left': activePos*(-1)}, 500);
			}
			proverkaActive();
		}
		return false;
	});
	
	$('.hotel_slider_mini li a').on('click',function(){
		var attrElem = $(this).attr('href');
		$('.slider_big_image img').attr('src', attrElem);
		return false;
	});
	
	//Calendar
	
	$('.date_item').on('click', function(){
		if($(this).hasClass('date_item_from')){
			$(this).parent().find('.calendar_popup ').attr('class', 'calendar_popup calendar_popup_left');
			$(this).parent().find('.calendar_popup').removeClass('slider_popup_right');
		}
		else{
			$(this).parent().find('.calendar_popup ').attr('class', 'calendar_popup calendar_popup_right');
			$(this).parent().find('.calendar_popup').removeClass('calendar_popup_left');
		}
		return false;
	});
	
	/*$('.reservation_date .prevmonth a').on('click', function(){
		var actMonth = $(this).parents('.res_date_monthsname').find('.active_m');
		if($(actMonth).prev('li').length){
			$(actMonth).fadeOut(200, function(){
				$(this).prev().fadeIn(200);
				$(this).prev().addClass('active_m');
				$(this).removeClass('active_m');
			});
			
			$(this).parents('.reservation_date').find('.active_body').fadeOut(200, function(){
				$(this).prev().fadeIn(200);
				$(this).prev().addClass('active_body');
				$(this).removeClass('active_body');
			});
		}
		return false;
	});
	
	$('.reservation_date .nextmonth a').on('click', function(){
		var actMonth = $(this).parents('.res_date_monthsname').find('.active_m');
		if($(actMonth).next('li').length){
			$(actMonth).fadeOut(200, function(){
				$(this).next().fadeIn(200);
				$(this).next().addClass('active_m');
				$(this).removeClass('active_m');
			});
			
			$(this).parents('.reservation_date').find('.active_body').fadeOut(200, function(){
				$(this).next().fadeIn(200);
				$(this).next().addClass('active_body');
				$(this).removeClass('active_body');
			});
		}
		return false;
	});*/
	
	$(document).on('click',function(event) {
		if ($(event.target).closest(".calendar_popup").length) return;
		$(".calendar_popup").attr('class','calendar_popup');
		event.stopPropagation();
	});
	
	//calendar slider
	
	var activeMonthName = $('.res_date_monthsname li:first-child').addClass('active_m');
	var activeMonthTable = $('.res_date_monthsday li:first-child').addClass('active_body');
	
	var MonthNameWidth = $('.res_date_monthsname li').outerWidth(true);
	var MonthTableWidth = $('.res_date_monthsday li').outerWidth(true);
	
	var MonthNameCount = $('.res_date_monthsname li').length;
	var MonthTableCount = $('.res_date_monthsday li').length;
	
	var MonthNameWidthUl = MonthNameWidth * MonthNameCount;
	var MonthTableWidthUl = MonthTableWidth * MonthTableCount;
	
	var areaMonthName = $('.res_date_monthsname').width();
	var areaMonthTable = $('.reservation_body').width();
	
	var maxWidthName = MonthNameWidthUl - areaMonthName;
	var maxWidthTable = MonthTableWidthUl - areaMonthTable;
	
	$('.reservation_date .nextmonth').on('click',function(){
		if($(this).parent().find('.active_body').next().next().length){
			$(this).parent().find('.active_body').removeClass('active_body').next().addClass('active_body');
			$(this).parent().find('.active_m').removeClass('active_m').next().addClass('active_m');
			var activePosTable = $(this).parent().find('.active_body').position().left;
			var activePosName = $(this).parent().find('.active_m').position().left;
			if(activePosTable > maxWidthTable){
				$(this).parent().find('.res_date_monthsday').animate({'left': maxWidthTable*(-1)}, 250);
			}else{
				$(this).parent().find('.res_date_monthsday').animate({'left': activePosTable*(-1)}, 250);
			}
			if(activePosName > maxWidthName){
				$(this).parent().find('.res_date_monthsname ul').animate({'left': maxWidthName*(-1)}, 250);
			}else{
				$(this).parent().find('.res_date_monthsname ul').animate({'left': activePosName*(-1)}, 250);
			}
		}
		return false;
	});
	
	$('.reservation_date .prevmonth').on('click',function(){
		if($(this).parent().find('.active_body').prev().length){
			$(this).parent().find('.active_body').removeClass('active_body').prev().addClass('active_body');
			$(this).parent().find('.active_m').removeClass('active_m').prev().addClass('active_m');
			var activePosTable = $(this).parent().find('.active_body').position().left;
			var activePosName = $(this).parent().find('.active_m').position().left;
			if(activePosTable > maxWidthTable){
				$(this).parent().find('.res_date_monthsday').animate({'left': maxWidthTable*(-1)}, 250);
			}else{
				$(this).parent().find('.res_date_monthsday').animate({'left': activePosTable*(-1)}, 250);
			}
			if(activePosName > maxWidthName){
				$(this).parent().find('.res_date_monthsname ul').animate({'left': maxWidthName*(-1)}, 250);
			}else{
				$(this).parent().find('.res_date_monthsname ul').animate({'left': activePosName*(-1)}, 250);
			}
		}
		return false;
	});
	
	$('.res_date_monthsday tbody td').removeClass();
	$('.res_date_monthsday tbody tr').removeClass();
	$('.res_date_monthsday tbody td').each(function(){
		if(!$(this).find('a').attr('href')){
			$(this).addClass('empty');
		}
	});
	
	function getIndex(elem){
		var clkTd = elem.closest('td');
		var clkTr = elem.closest('tr');
		var clkLi = elem.closest('li');
		var index = clkTd.index() + clkTr.index()*100 + clkLi.index()*10000;		
		return index
	}
	
	function addGreenMarkers(parent){
		var bol = false;
		var mark = false;
		parent.find('.res_date_monthsday tbody td').each(function(){
			if($(this).hasClass('firstdate')){
				if($('.lastdate').length){
					mark = true;
					if(($(this).index()!==6) && (!$(this).next().hasClass('empty'))){
						$(this).addClass('firstgreen');
					}
				}
			}
			if($(this).hasClass('lastdate')){
				bol = false;
				mark = false;
			}
			if(!(($(this).hasClass('lastdate')) || ($(this).hasClass('firstdate')))){
				if(bol){
					if(!$(this).hasClass('empty')){
						if($(this).index()==0 || $(this).prev().hasClass('empty')){
							$(this).addClass('firstgreen');
						}
						else if($(this).index()==6 || $(this).next().hasClass('empty')){
							$(this).addClass('endgreen');
						}
						else {
							$(this).addClass('middlegreen');
						}
					}
				}
				else {
					$(this).removeClass('firstgreen endgreen middlegreen');
				}
			}
			if (mark){
				bol = true;
			}
			else {
				bol = false;
			}
		});
	}
	
	$('.res_date_monthsday tbody a span').on('click',function() {
        var _parent = $(this).closest('.calendar_popup');
		addGreenMarkers(_parent);
		if($(this).parent().attr('href')){
			var link = $(this).parent();
			var clkTd = $(this).closest('td');
			var clkTr = $(this).closest('tr');
			var clkLi = $(this).closest('li');
			var clkInd = getIndex($(this));
			var strClass = '';

            var firstDate = _parent.find('.firstdate');
            var lastDate = _parent.find('.lastdate');

			if (firstDate.length){
				oldInd = getIndex(firstDate.find('span'));
				if(clkInd <= oldInd || lastDate.length){
					//New First Marker
                    firstDate.removeClass('firstdate firstgreen_round firstgreen middlegreen endgreen');
					if(lastDate.length){
                        lastDate.removeClass('lastdate endgreen firstgreen_round');
					}
					addGreenMarkers(_parent);
					$(this).closest('.block_dates').find('.date_item_from input:first-child').attr('value',function(){
						var str1 = clkTd.find('span').text();
						var str2 = " "+$('.res_date_monthsname ul li').eq(clkLi.index()).text();
                        $(this).next().val(clkLi.closest(".reservation_body").find('.res_date_monthsname li').eq(clkLi.index()).attr('year'));    
						return str1 + str2.substr(0,4);
					});
					strClass +=' firstdate firstgreen_round';
				} else {
					//New Second Marker
					strClass +=' lastdate';
					if(clkTd.index()!==0){
						strClass += ' endgreen';
					}
					else {
						strClass += ' firstgreen_round';
					}
					$(this).closest('.block_dates').find('.date_item_to input:first-child').attr('value',function(){
						var str1 = clkTd.find('span').text();
						var str2 = " "+$('.res_date_monthsname ul li').eq(clkLi.index()).text();
                        $(this).next().val(clkLi.closest(".reservation_body").find('.res_date_monthsname li').eq(clkLi.index()).attr('year'));    
						return str1 + str2.substr(0,4);
					});
					setTimeout(function(){
						$(".calendar_popup").attr('class','calendar_popup');
					},1000);
				}
			} else {
				strClass +=' firstdate firstgreen_round';
				$(this).closest('.block_dates').find('.date_item_from input:first-child').attr('value',function(){
					var str1 = clkTd.find('span').text();
					var str2 = " "+$('.res_date_monthsname ul li').eq(clkLi.index()).text();
                    $(this).next().val(clkLi.closest(".reservation_body").find('.res_date_monthsname ul li').eq(clkLi.index()).attr('year'));    
					return str1 + str2.substr(0,4);
				});
			}
			clkTd.addClass(strClass).removeClass('middlegreen');
			addGreenMarkers(_parent);
		}
		return false;
	});

    var currencyBlock = $('#currency_block');
    if (currencyBlock.length) {
        currencyBlock.find('a.fake').on('click', function(){return false;});
        var exchangeRate = parseFloat(currencyBlock.find('input[name="exchange"]').val());
        currencyBlock.on('keyup', 'input[type="text"]', function(){
            var _this = $(this);
            if (_this.attr('name') == 'from') {
                var from = parseFloat(_this.val());
                if (!isNaN(from)) {
                    currencyBlock.find('input[name="to"]').val((from / exchangeRate).toFixed(2));
                }
            } else if (_this.attr('name') == 'to') {
                var to = parseFloat(_this.val());
                if (!isNaN(to)) {
                    currencyBlock.find('input[name="from"]').val((to * exchangeRate).toFixed(2));
                }
            }
        });
    }

    $('.reload_link').on('click', function(){
        document.location.reload();
        return false;
    });

    $('body').on('click', '.special_from_item', function(){
        var href = $(this).attr('href');
        if (typeof href !== 'undefined') {
            document.location.href = href;
        }
    });
});

function fillFormData(data, name, value){
    if(-1 === name.indexOf('[')){
        data[name] = value;
        return data;
    }

    var currentName = name.substr(0, name.indexOf('['));
    var nextName = name.substr(name.indexOf('[')+1);
    nextName = nextName.substr(0, nextName.indexOf(']')) + nextName.substr(nextName.indexOf(']')+1);

    var index = parseInt(currentName);
    if(isNaN(index)){
        index = currentName;
    }

    if(nextName == ''){
        // add to array
        if(typeof data[index] !== 'object'){
            data[index] = {};
        }

        data[index][Object.keys(data[index]).length] = value;

        return data;
    }

    data[index] = fillFormData(data[currentName] || {}, nextName, value);
    return data;
}


function getFormData(form, removeEmpty) {
    removeEmpty = !!removeEmpty;

    var request = {};
    $(form).find('input').each(function(){
        if (!$(this).attr('name')){
            return;
        }

        var name = $(this).attr('name');
        var type = $(this).attr('type');
        var value = '';

        // checkboxes
        if (type == 'checkbox') {
            value = $(this).attr('checked') ? 1 : 0;
            request = fillFormData(request, name, value);

            // radio
        } else if (type == 'radio') {
            if ($(this).attr('checked')) {
                request = fillFormData(request, name, $(this).val());
            }
            // other
        } else {
            value = $(this).val() !== undefined ? $(this).val() : '';

            request = fillFormData(request, name, value);
        }
    });

    // textareas
    $(form).find('textarea').each(function(){
        request[$(this).attr('name')] = $(this).val();
    });

    // select
    $(form).find('select').each(function(){
        request[$(this).attr('name')] = $(this).find('option:selected').val();
    });
    //request.param.form_id = $(form).attr('id');

    return request;
}

function refreshSelect(select) {
    $(select)
        .selectBox('destroy')
        .selectBox()
}

function processResponse(data) {
    var response = $.parseJSON(data);
    console.log(response);
    if (typeof response.redirect !== 'undefined' && response.redirect.length) {
        document.location.href = response.redirect;
    }

    return response;
}

function getMultipleForm(n, form_1, form_2, form_3, separator) {
    if (typeof separator === 'undefined') separator = ' ';
    return n + separator + getMultipleFormText(n, form_1, form_2, form_3);
}

function getMultipleFormText(n, form_1, form_2, form_3) {
    n=n%100;
    if (n >= 11 && n <= 19)
        return form_1;
    else if (n % 10 == 1)
        return form_2;
    else if ((n % 10 == 2) || (n % 10 == 3) || (n % 10 == 4))
        return form_3;
    else
        return form_1;
}