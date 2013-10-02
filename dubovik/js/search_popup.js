$(document).ready(function(){

    var monthsReverse = {'Янв':'01','Фев':'02','Мар':'03','Апр':'04','Май':'05','Июн':'06',
        'Июл':'07','Авг':'08','Сен':'09','Окт':'10','Ноя':'11','Дек':'12'};

    var popup = $('.popup_select');
    setDates(popup.find('.calendar_popup'));

    //resort list
    var hotelUl = $('#hotel_list_p');
    var anyResort = $('#resort_list_p').find('input[name="resort_any"]');
    anyResort.on('change', function(){
        if ($(this).is(':checked')) {
            $('#popular_li_p, #other_li_p')
                .find('input[type="checkbox"]').removeAttr('checked')
                .closest('.ez-checkbox').removeClass('ez-checked');

            hotelUl.find('li.jit').show().addClass('shown');
        }
    });

    $('#popular_li_p, #other_li_p').on('change', 'input[type="checkbox"]', function(){
        //console.log('click any resort');
        var isFirstResort = false;
        if (anyResort.is(':checked')) {
            //console.log('first hotel clicked');
            anyResort.click();
            isFirstResort = true;
        }
        var parentId = $(this).closest('li.jit').attr('object_id');
        if ($(this).is(':checked')) {
            if (isFirstResort) {
                hotelUl.find('li.jit').hide().removeClass('shown');
                hotelUl.find('li.jit[object_id="any"]').show().addClass('shown');
            }
            hotelUl.find('li.jit[parent_id="'+parentId+'"]').show().addClass('shown');
        } else {
            hotelUl.find('li.jit[parent_id="'+parentId+'"]').hide().removeClass('shown');
        }

        // check full hotel count
        if ($('#popular_li_p, #other_li_p').find('input:checked').length === 0
            && !anyResort.is(':checked')) {

            anyResort.click();
        }

        hotelUl.closest('.block_scroll').data('jsp').reinitialise();
    });

    // resort list
    var anyHotel = hotelUl.find('input[name="hotel_any"]');
    anyHotel.on('change', function(){
        if ($(this).is(':checked')) {
            var target =  $('#hotel_list_p');
            target.find('input[type="checkbox"]').removeAttr('checked')
                .closest('.ez-checkbox').removeClass('ez-checked');

            target.find('li.jit').show().addClass('shown');
        }
    });

    hotelUl.on('change', 'li.jit input', function(){
        //console.log(anyHotel);
        //if (anyHotel.is(':checked')) {
            anyHotel.trigger('click');
        //}
    });

    var hotelList = {};

    var getHotelsPopup = function getHotels(country_id, resort_ids) {
        $.ajax(
            '/search/getHotels',
            {
                data: {
                    'country_id' : country_id,
                    'resort_ids' : resort_ids.join(',')
                },
                type: 'POST',
                success: function(data){
                    var hotelList = $.parseJSON(data);
                    var ul, i;

                    if (typeof hotelList !== 'undefined') {
                        ul = $('#hotel_list_p').empty();
                        ul.append(createListItem('any', 'Любой', 'hotel'));
                        for (i in hotelList) {
                            ul.append(createListItem(i, hotelList[i]['name'], 'hotel', hotelList[i]['townId'], true));
                        }
                    }

                    $('label > .custom_check').ezMark();
                    ul.closest('.block_scroll').data('jsp').reinitialise();

                    // init searcher
                    $('#hotel_block_p').find('input[name="hotel_name"]').on('keyup', function(){
                        var ul = $('#hotel_list_p');

                        if ($(this).val() !== '') {
                            var exp = new RegExp('.*'+$(this).val()+'.*', 'i');

                            for (var i in hotelList) {
                                var li = ul.find('li[object_id="'+i+'"]');

                                (exp.test(hotelList[i]['name']))
                                    ? li.show()
                                    : li.hide().find('input[type="checkbox"]').removeAttr('checked')
                                        .closest('.ez-checkbox').removeClass('ez-checked');
                            }
                        } else {
                            ul.find('li.shown').show();
                        }
                    });
                }
            }
        );
    }

    // reload country list on depart city change
    $('input[name="city_id_p"]').on('change', function(){
        var id = $(this).val();
        getCountries(id, '#country_list_p', 0);
    });

    // reload resorts and hotels on country selection
    $('input[name="country_id_p"]').on('change', function(){
        var id = $(this).val();
        getResorts(id, '_p', getHotelsPopup);
    });

    $('#send_search_order').on('click', function(){
        var form = $('form[name="application_form"]');
        var hash = generateSearchHash(form);

        form.find('input[name="search_link"]').val(hash);

        $.post('/search/Order',
            getFormData(form),
            function(response){
                console.log(response);
                if (response.status === 'error') {
                    form.find('.enter2_input_item').removeClass('incorrect');
                    for(var i in response.errors) {
                        form.find('input[name="'+i+'"]')
                            .closest('.enter2_input_item').addClass('incorrect');
                    }
                } else if (response.status === 'ok') {
                    var textPopup = $('.popup_text');
                    textPopup.find('.title').text('Заявка');
                    textPopup.find('p.text').text('Ваша заявка успешно отправлена!');
                    $('.popup_select').fadeOut(100, function(){
                        textPopup.fadeIn(200);
                    });
                }
            },
            'JSON'
        );
    });

    $('#timing').find('li[value="7"] a').trigger('click');

    function generateSearchHash(form){
        var request = {};

        request['city_id'] = form.find('input[name="city_id_p"]').val();
        request['country_id'] = form.find('input[name="country_id_p"]').val();

        // resorts
        var resortList = $('#resort_full_list_p');
        if (resortList.find('input[name="resort_any"]').is(':checked')) {
            request['resorts'] = [0];
        } else {
            request['resorts'] = [];
            $('#popular_li, #other_li').find('input[type="checkbox"]').each(function(){
                if ($(this).is(':checked')) {
                    request['resorts'].push($(this).closest('li').attr('object_id'));
                }
            });
        }
        request['resorts'] = (typeof request['resorts'] !== 'undefined') ? request['resorts'].join(',') : 0;

        // hotels
        var hotelList = $('#hotel_list_p');
        if (hotelList.find('input[name="hotel_any"]').is(':checked')) {
            request['hotels'] = [0];
        } else {
            request['hotels'] = [];
            hotelList.find('input[type="checkbox"]').each(function(){
                if ($(this).is(':checked')) {
                    request['hotels'].push($(this).closest('li.jit').attr('object_id'));
                }
            });
        }
        request['hotels'] = (typeof request['hotels'] !== 'undefined') ? request['hotels'].join(',') : 0;

        // dates
        var from = form.find('input[name="date_from"]').val().split(' ');
        //if (parseInt(from[0]) < 10) from[0] = '0' + from[0];
        request['date_from'] = from[0] + '.' + monthsReverse[from[1]] + '.'
            + form.find('input[name="date_from_year"]').val();

        var to = form.find('input[name="date_to"]').val().split(' ');
        //if (parseInt(to[0]) < 10) to[0] = '0' + to[0];
        request['date_to'] = to[0] + '.' + monthsReverse[to[1]] + '.'
            + form.find('input[name="date_to_year"]').val();

        // days num
        request['nights_from'] = form.find('input[name="nights_from"]').val();
        request['nights_to'] = form.find('input[name="nights_to"]').val();

        // prices
        request['price_from'] = form.find('input[name="price_from"]').val();
        request['price_to'] = form.find('input[name="price_to"]').val();

        var requestString = [];
        for(var i in request) {
            requestString.push(i + '=' + request[i]);
        }
        requestString = requestString.join('&');
        return '#!' + requestString;
    }
});