var getHotels;

// saved params for setting in callbacks (list are loaded with ajax)
//var usingHash = false;
var countryId = 0;
var autoStart = false;

$(document).ready(function(){

    // form data object and main result values for updating
    var formData = {};
    var requestID = 0;
    var offerID = 0;
    var sourceID = 0;

    // request status params
    var requestComplete = false;
    var requestUpdater = 0;
    var lastProcessed = 0;

    // saved params for setting in callbacks (list are loaded with ajax)
//    var usingHash = false;
//    var countryId = 0;
    var resortIds = 0;
    var hotelIds = 0;

    // calendar selector
    var formCalendar = $('#main_search_from .calendar_popup');

    // BINDING EVENTS
    //resort list
    var hotelUl = $('#hotel_list');
    var anyResort = $('#resort_list').find('input[name="resort_any"]');
    anyResort.on('change', function(){
        if ($(this).is(':checked')) {
            $('#popular_li, #other_li')
                .find('input[type="checkbox"]').removeAttr('checked')
                .closest('.ez-checkbox').removeClass('ez-checked');

            hotelUl.find('li.jit').show().addClass('shown');
        }
    });

    $('#popular_li, #other_li').on('change', 'input[type="checkbox"]', function(){
        //console.log('click any resort');
        var isFirstResort = false;
        if (anyResort.is(':checked')) {
            console.log('first hotel clicked');
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
        if ($('#popular_li, #other_li').find('input:checked').length === 0
            && !anyResort.is(':checked')) {

            anyResort.click();
        }

        hotelUl.closest('.block_scroll').data('jsp').reinitialise();
    });

    // resort list
    var anyHotel = hotelUl.find('input[name="hotel_any"]');
    anyHotel.on('change', function(){
        if ($(this).is(':checked')) {
            var target =  $('#hotel_list');
            target.find('input[type="checkbox"]').removeAttr('checked')
                .closest('.ez-checkbox').removeClass('ez-checked');

            target.find('li.jit').show().addClass('shown');
        }
    });

    hotelUl.on('change', 'li.jit input', function(){
        console.log(anyHotel);
        //if (anyHotel.is(':checked')) {
            anyHotel.trigger('click');
        //}
    });

    // hotel checkboxes
    var hotelStars = $('#hotel_cat_block');
    hotelStars.find('input[name="hotel_cat_any"]').on('change', function(e){
        if ($(this).is(':checked')) {
            hotelStars.find('ul li input[type="checkbox"]').each(function(){
                if ($(this).is(':checked')) {
                    $(this).removeAttr('checked')
                        .closest('.ez-checkbox').removeClass('ez-checked');
                }
            });
        }
    });
    hotelStars.find('ul li input[type="checkbox"]').on('change', function(){
        var anyHotelCat = hotelStars.find('input[name="hotel_cat_any"]');
        if (anyHotelCat.is(':checked')) anyHotelCat.click();
    });

    // meals checkboxes
    var meals = $('#meal_block');
    meals.find('input[name="meal_any"]').on('change', function(e){
        if ($(this).is(':checked')) {
            meals.find('ul li input[type="checkbox"]').each(function(){
                if ($(this).is(':checked')) {
                    $(this).removeAttr('checked')
                        .closest('.ez-checkbox').removeClass('ez-checked');
                }
            });
        }
    });
    meals.find('ul li input[type="checkbox"]').on('change', function(){
        var anyMeal = meals.find('input[name="meal_any"]');
        if (anyMeal.is(':checked')) anyMeal.click();
    });

    // pager
    $('#search_result_list').on('click', '.paginator .search_pager', function(){
        var page = parseInt($(this).attr('value'));
        if (formData['page'] != page) {
            stopRequest();
            $('#search_result').empty();
            formData['page'] = page;
            refreshTourList();
        }

        return false;
    }).on('click', '.paginator .page_before', function(){
        var page = parseInt($(this).attr('value'));
        if (formData['page'] > 1) {
            stopRequest();
            $('#search_result').empty();
            formData['page'] = formData['page'] - 1;
            refreshTourList();
        }

        return false;
    }).on('click', '.paginator .page_after', function(){
        var page = parseInt($(this).attr('value'));
        if (formData['page'] < Math.ceil(getFoundNum()/formData['on_page'])) {
            stopRequest();
            $('#search_result').empty();
            formData['page'] = formData['page'] + 1;
            refreshTourList();
        }

        return false;
    });

    // on page change
    $('#search_on_page').on('click', 'a', function(){
        var num = parseInt($(this).attr('value'));
        if (!isNaN(num) && formData['on_page'] != num) {
            stopRequest();
            $('#search_result').empty();
            $('.paginator').remove();
            formData['on_page'] = num;
            formData['page'] = 1;
            refreshTourList();
            $(this).closest('ul').find('li').removeClass('active');
            $(this).closest('li').addClass('active');
        }

        return false;
    });

    var months = {'01':'Янв','02':'Фев','03':'Мар','04':'Апр','05':'Май','06':'Июн',
        '07':'Июл','08':'Авг','09':'Сен','10':'Окт','11':'Ноя','12':'Дек'};
    var monthsReverse = {'Янв':'01','Фев':'02','Мар':'03','Апр':'04','Май':'05','Июн':'06',
        'Июл':'07','Авг':'08','Сен':'09','Окт':'10','Ноя':'11','Дек':'12'};

    // GEOLOCATION
    function tryGeolocation() {
        ymaps.ready(function(){

            var cityList = $('#city_list');
            var locationFound = false;
            var geolocation = ymaps.geolocation;

            console.log(geolocation.city);
            cityList.find('a[city_name]').each(function(){
                if ($(this).attr('city_name') == geolocation.city) {
                    locationFound = true;
                    $(this).click();
                }
            });

            if (!locationFound) {
                cityList.find('a[city_name]').eq(0).click();
            }
        });
    }

    function setKids(kids) {
        if (typeof kids === 'undefined') return false;

        var kidsNum = kids.length;
        var kidsAgeSelector = $('.age_select');
        //console.log($('.people_count.children').find('li:nth-child('+(kidsNum+1)+') a'));
        $('.people_count.children').find('li:nth-child('+(kidsNum+1)+') a').click();

        for(var i in kids) {
            var select = kidsAgeSelector.find('select[name="kid_' + parseInt(parseInt(i)+1) + '_age"]');
            //console.log(select);
            select.find('option[value="'+kids[i]+'"]').attr('selected','selected');
            refreshSelect(select);
        }
    }

    // reload country list on depart city change
    $('input[name="city_id"]').on('change', function(){
        var id = $(this).val();
        //console.log('on city change' + countryId);
        getCountries(id, '#country_list'/*, countryId*/);
    });

    // reload resorts and hotels on country selection
    $('input[name="country_id"]').on('change', function(){
        var id = $(this).val();
        getResorts(id, '', getHotels);
    });

    // list for searching
    var hotelList = {};

    getHotels = function getHotels(country_id, resort_ids) {
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
                        ul = $('#hotel_list').empty();
                        ul.append(createListItem('any', 'Любой', 'hotel'));
                        for (i in hotelList) {
                            ul.append(createListItem(i, hotelList[i]['name'], 'hotel', hotelList[i]['townId'], true));
                        }
                    }

                    $('label > .custom_check').ezMark();
                    ul.closest('.block_scroll').data('jsp').reinitialise();

                    // set from saved settings (hash or smth else)
                    setResortsAndHotels();

                    // init searcher
                    $('#hotel_block').find('input[name="hotel_name"]').on('keyup', function(){
                        var ul = $('#hotel_list');

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

                    if (autoStart) {
                        $('input[name="send_request"]').click();
                        autoStart = false;
                    }
                }
            }
        );
    };

    function setResortsAndHotels() {
        // first set resorts to exclude not needed hotels
        var resortCount = 0, hotelCount = 0, input;
        var targetR = $('#resort_full_list');
        var targetH = $('#hotel_list');

        if (resortIds !== 0 && resortIds !== '') {
            for (var rc in resortIds) {
                input = targetR.find('li.jit input[name="resort_' + resortIds[rc] + '"]');
                if (input.length && !input.is(':checked')) {
                    input.click();
                    resortCount++;
                }
            }
        }
        // if nothing set click to "any"
        if (resortCount === 0){
            //console.log('any resort');
            var anyResort = targetR.find('#resort_list input');
            anyResort.click();
            if (!anyResort.closest('.ez-checkbox').hasClass('ez-checked')) {
                anyResort.closest('.ez-checkbox').addClass('ez-checked');
            }
        }

        // now set hotels
        if (hotelIds !== 0 && hotelIds !== '') {
            for (var hc in hotelIds) {
                input = targetH.find('li.jit input[name="hotel_' + hotelIds[hc] + '"]');
                if (input.length && !input.is(':checked')) {
                    input.click();
                    hotelCount++;
                }
            }
        }
        // if nothing set click to "any"
        if (hotelCount === 0){
            //console.log('any hotel');
            targetH.find('input[name="hotel_any"]').click();
        }
    }

    // send request button event
    $('input[name="send_request"]').on('click', function(){
        var form = $(this).closest('form');
        formData = getFormData(form);
        console.log(formData);

        // dates
        var from = form.find('input[name="date_from"]').val().split(' ');
        if (parseInt(from[0]) < 10) from[0] = '0' + from[0];
        formData['date_from'] = from[0] + '.' + monthsReverse[from[1]] + '.'
            + form.find('input[name="date_from_year"]').val();

        var to = form.find('input[name="date_to"]').val().split(' ');
        if (parseInt(to[0]) < 10) to[0] = '0' + to[0];
        formData['date_to'] = to[0] + '.' + monthsReverse[to[1]] + '.'
            + form.find('input[name="date_to_year"]').val();

        var hash = generateSearchHash();
        // check if we need redirect
        if (parseInt(form.find('input[name="start"]').val())) {
            document.location.href = '/search' + hash + '&start=1';
        } else {
            document.location.hash = hash;
        }

        startTourSearch(formData);
    });

    // start search (initializing and getting requestID!)
    function startTourSearch() {
        requestComplete = false;
        $('#progress_bar').css({width: '0%'});
        $('#percent_num').html('0');
        $('.paginator').remove();
        $('#empty_search_results').hide();
        $('#search_result').empty();

        $('.search_title_block, .search_head').hide();

        $.ajax(
            '/search/startSearch',
            {
                data: formData,
                type: 'POST',
                success: function(data){
                    console.log('search started successfully');

                    data = $.parseJSON(data);
                    setFoundNum(data.foundNum);
                    var operatorsInProgress = data.raw.LoadState.OperatorLoadState.length;
                    if (typeof operatorsInProgress === 'undefined') {
                        // check if its not array
                        if (typeof data.raw.LoadState.OperatorLoadState.RowsCount !== 'undefined') {
                            operatorsInProgress = 1;
                        }
                    }
                    console.log(data.raw.LoadState.OperatorLoadState);
                    if (operatorsInProgress > 0) {
                        requestID = parseInt(data.requestID);
                        formData.requestId = requestID;

                        $('#search_result_list').show();

                        if (parseInt(data.foundNum) > 0) {
                            // TODO del from here
                            offerID = data.tourData[0].OfferId;
                            sourceID = data.tourData[0].SourceId;

                            formResultList(data);
                        }

                        getRequestStatus();
                        requestUpdater = setInterval(function(){getRequestStatus()}, 4000);

                        //setTimeout(function(){actualizePrice(offerID, sourceID, 60000);}, 60000);
                    } else {
                        stopRequest();
                    }
                }
            }
        );

        $('.search_block_loader').show();
        $('#stop_search').show();
    }

    function refreshTourList() {
        console.log('-- refreshing started');
        $.ajax(
            '/search/startSearch',
            {
                data: formData,
                type: 'POST',
                success: function(data){
                    data = $.parseJSON(data);
                    console.log(data);

                    if (parseInt(data.foundNum) > 0) {
                        formResultList(data);
                    }

                    generateSearchHash();
                }
            }
        );
    }

    function getRequestStatus() {
        console.log('-- status requested');
        if (!requestComplete) {
            $.ajax(
                '/search/getRequestStatus',
                {
                    data: {requestID : requestID},
                    type: 'POST',
                    success: function(data){
                        console.log('refresh started successfully');
                        var response = $.parseJSON(data);
                        console.log(response);

                        // count execution percent
                        var processed = 0;
                        var operatorList = response.GetLoadStateResult.OperatorLoadState;
                        var toProcess;

                        if (typeof operatorList.IsProcessed !== 'undefined') {
                            var tmp = operatorList;
                            operatorList = [tmp];
                        }

                        toProcess = operatorList.length;
                        for (var k in operatorList) {
                            if (operatorList[k].IsProcessed === true) {
                                processed++;
                            }
                        }

                        console.log('processed: ' + processed);
                        if (processed >= toProcess) {
                            stopRequest();
                            console.log('refresher killed!');
                        }
                        var percent = Math.ceil(processed/toProcess*100);
                        $('#progress_bar').css({width: percent + '%'});
                        $('#percent_num').html(percent);
                        console.log('percent: ' + percent);

                        if (lastProcessed != processed) {
                            refreshTourList();
                        }
                        lastProcessed = processed;
                    }
                }
            );
        } else {
            stopRequest();
        }
    }

    function actualizePrice(offerId, sourceId, time) {
        console.log('-- actualizing price request: ' + time/1000 + ' sec passed');
        $.ajax(
            '/search/actualizePrice',
            {
                data: {requestId : requestID, offerId: offerId, sourceId: sourceId},
                type: 'POST',
                success: function(data){
                    console.log($.parseJSON(data));
                }
            }
        );
    }

    function stopRequest() {
        //if (!requestComplete) {
            clearInterval(requestUpdater);
            requestComplete = true;
            // hide gif and stop button
            $('#stop_search').hide();

            var percent = 100;
            $('#progress_bar').css({width: percent + '%'});
            $('#percent_num').html(percent);

            if (getFoundNum() == 0) {
                $('#empty_search_results').show();
            }
        //}
    }

    function getFoundNum() {
        return parseInt($('#foundNumInput').val());
    }

    function setFoundNum(num) {
        $('#foundNumInput').val(num);
    }

    $('#stop_search').click(function(){
        stopRequest();
        return false;
    });

    //function updateRequestResults() {}

    /** ---------- SEARCH RESULT HTML GENERATION ------------------ **/

    var _imageBlock = '<a href="{hotelLink}">' +
            '<img src="{HotelTitleImageUrl}" alt="">' +
        '</a>' +
        '<ul class="result_social_icons">' +
            '<li><a class="result_google_map" target="_blank" href="{gmapLink}"></a></li>' +
            '<li><a class="result_ya_map" target="_blank" href="{ymapLink}"></a></li>' +
        '</ul>';

    var _mainData = '<div class="start_country">' +
            '<a href="{placeLink}">{CountryName}, {ResortName}</a>' +
            '<ul class="dop_info_place">' +
                '<li><a href="{hotelLink}">{HotelName}</a></li>' +
                '<li>{StarId}</li>' +
            '</ul>' +
            '<p>Номер: {RoomName}</p>' +
        '</div>' +
        '<div class="heart_rating">' +
            '<a href="#">{HotelRating}</a>' +
        '</div>' +
        '<ul class="dop_information">' +
            '<li>' +
                '<span>{MealName}</span>' +
                '<p>{mealTranscription}</p>' +
            '</li>' +
            '<li>' +
                '<span>{HtPlaceName}</span>' +
                '<p>{placeTranscription}</p>' +
            '</li>' +
        '</ul>' +
        '<p>Тур: {TourName}</p>';

    var _infoBlock = '<ul class="the_legend">' +
            '<li><div class="legend_place"><span class="{HotelIsInStop}"></span></div></li>' +
            '<li><div class="legend_billet"><span class="{EconomTicketsDpt}"></span></div></li>' +
            '<li><div class="legend_billet_back"><span class="{EconomTicketsRtn}"></span></div></li> ' +
            '<li><div class="legend_class"><span class="{BusinessTicketsDpt}"></span></div></li>' +
            '<li><div class="legend_class_back"><span class="{BusinessTicketsRtn}"></span></div></li>' +
        '</ul>' +
        '<div class="surcharge">' +
            '<span>Доплаты:</span>' +
            '<p>топливный сбор: {OilTaxes}</p>' +
            '<p>визовый сбор: {Visa}</p>' +
            '<a class="question_icon" href="#"></a>' +
        '</div>';

    var _priceBlock = '<span>{Price}</span>$<!--<img src="/img/icons/green_rub.png" alt="">-->' +
        '<a class="price_read_more" target="_blank" href="{tourLink}"><span>Подробнее</span></a>';

    var replacement = {
        'imageBlock': ['hotelLink', 'gmapLink', 'ymapLink', 'HotelTitleImageUrl'],
        'mainData': ['ResortName', 'CountryName', 'HotelName', 'StarId', 'RoomName',
            'TourName', 'HotelRating', 'MealName', 'HtPlaceName', 'mealTranscription', 'placeTranscription'],
        'infoBlock': ['OilTaxes', 'Visa'],
        'priceBlock': ['Price','tourLink']
    };

    var requestInfo = {
        'HotelIsInStop': 'FewPlacesInHotel',
        'EconomTicketsDpt': 'FewEconomTicketsDpt',
        'EconomTicketsRtn': 'FewEconomTicketsRtn',
        'BusinessTicketsDpt': 'FewBusinessTicketsDpt',
        'BusinessTicketsRtn': 'FewBusinessTicketsRtn'
    };
    var disks = {
        0: 'green_disk',
        1: 'orange_disk',
        'NotAvailable': 'red_disk',
        'Stop': 'red_disk',
        'Request': 'black_disk',
        'Unknown': 'black_disk'
    };

    var mealTranscription = {
        /*'AI': 'все включено, завтрак, обед и ужин',
        'BB': 'только завтрак (шведский стол) и напитки',
        'FB': 'полный пансион, завтрак, обед и ужин',
        'FB+': 'расширенный полный пансион, завтрак, обед и ужин',
        'HB': 'полупансион',
        'HB+': 'полупансион, завтрак и ужин (шведский стол)',
        'RO': 'без питания',
        'UAI': 'завтрак, поздний завтрак, обед, полдник и ужин'*/
        'AI': 'все включено',
        'BB': 'только завтрак',
        'FB': 'полный пансион',
        'FB+': 'расширенный полный пансион',
        'HB': 'полупансион',
        'HB+': 'полупансион, завтрак и ужин',
        'RO': 'без питания',
        'UAI': 'завтрак, поздний завтрак, обед, полдник и ужин'
    };

    var placeTranscription = {
        'DBL': 'двухместный номер',
        'SGL': 'одноместный номер',
        'EXB': 'двухместный + доп. кровать',
        'ch': 'маленький ребёнок (0-6 лет)',
        'CH': 'большой ребёнок (до 12 лет)',
        'Sc': 'маленький ребенок + 1 взрослый',
        'SC': 'большой ребенок + 1 взрослый',
        'Dc': 'маленький ребенок + 2 взрослых',
        'DC': 'большой ребенок + 2 взрослых'
    };

    var starsTranscription = {
        401: '2',
        402: '3',
        403: '4',
        404: '5',
        405: 'Apts',
        406: 'Villas',
        407: 'HV-1',
        408: 'HV-2'
    };

    function formResultList(resultData){
        if (resultData.foundNum > 0) {
            // set found num and points
            $('.search_title_block, .search_head').show();

            $('#found_num').html(getMultipleForm(resultData.foundNum, 'туров', 'тур', 'тура'));

            $('#departure_city').html(resultData.tourData[0].CityFromName);
            $('#destination_country').html(resultData.tourData[0].CountryName);

            if (typeof resultData.tourData.ResortId !== 'undefined') {
                // single response - pack to array
                var response = resultData.tourData;
                resultData.tourData = [response];
            }

            var block = $('#search_result').empty();
            for (var i in resultData.tourData) {
                addResultRow(resultData.tourData[i], block, resultData.raw);
            }

            addPager(formData['page'], Math.ceil(resultData.foundNum/formData['on_page']));
        }
    }

    function addResultRow(rowData, targetBlock, additionalData) {

        rowData['StarId'] = starsTranscription[rowData['StarId']];
        if (!isNaN(parseInt(rowData['StarId']))) {
            rowData['StarId'] = '<a class="one_rating" href="#">'+rowData['StarId']+'</a>';
        }

        rowData['mealTranscription'] = mealTranscription[rowData['MealName']];
        rowData['placeTranscription'] = placeTranscription[rowData['HtPlaceName']];
        rowData['ymapLink'] = 'http://maps.yandex.ru?text='
            + encodeURIComponent(rowData['CountryName'] + ' ' + rowData['ResortName'] + ' ' + rowData['HotelName']);
        rowData['gmapLink'] = 'http://maps.google.ru?hl=ru&q='
            + encodeURIComponent(rowData['CountryName'] + ' ' + rowData['ResortName'] + ' ' + rowData['HotelName']);

        rowData['OilTaxes'] = (typeof additionalData.OilTaxes !== 'undefined' && additionalData.OilTaxes !== '')
             ? additionalData.OilTaxes
            : '-';
        rowData['Visa'] =  (typeof additionalData.Visa !== 'undefined' && additionalData.Visa !== '')
            ? additionalData.Visa.Price + ' ' + additionalData.Visa.CurrencyName + '/чел'
            : '-';

        var imageBlock = replacer(replacement['imageBlock'], rowData, _imageBlock);
        var mainData = replacer(replacement['mainData'], rowData, _mainData);
        var infoBlock = replacer(replacement['infoBlock'], rowData, _infoBlock);

        for (var field in requestInfo) {
            //console.log(rowData[field]);
            if (rowData[field] === 'Available') {
                infoBlock = infoBlock.replace('{'+field+'}', disks[rowData[requestInfo[field]]]);
            } else {
                infoBlock = infoBlock.replace('{'+field+'}', disks[rowData[field]]);
            }
        }

        // tour link
        rowData['tourLink'] = '/tour/' + rowData['OfferId'] + '?sourceId='
            + rowData['SourceId'] + '&requestId=' + requestID;

        //console.log('-----------------------------------');

        var priceBlock = replacer(replacement['priceBlock'], rowData, _priceBlock);

        var block = $('<li class="result_item">' +
            '<div class="result_item_image">' + imageBlock + '</div>' +
            '<div class="result_three_block">' + mainData + '</div>' +
            '<div class="date_start">213</div>' +
            '<div class="information_hotel">'+ infoBlock +'</div>' +
            '<div class="all_price">'+ priceBlock +'</div>' +
        '</li>');

        targetBlock.append(block);
    }

    function addPager(current, total) {
        if (total < 2) return false;
        current = parseInt(current);

        function pageLine(current, i) {
            var line = $('<li><a href="#" class="search_pager" value="'+i+'">' + i + '</a></li>');
            if (current == i) {
                line.addClass('active');
            }
            return line;
        }

        var pager = $('<div class="paginator"><ul></ul></div>');
        if (current != 1) {
            pager.prepend($('<a href="#" class="page_before"><span>&lt&lt</span> предыдущая</a>'));
        }
        if (current != total) {
            pager.append($('<a href="#" class="page_after">следующая <span>&gt&gt</span></a>'));
        }

        var ul = pager.find('ul');
        ul.append(pageLine(current, 1));
        if(current > 3){
            if(current == 4){
                ul.append(pageLine(current, 2));
            } else {
                ul.append(pageLine(current, '...'));
            }
        }
        if(current > 2){
            ul.append(pageLine(current, current - 1));
        }

        if(current > 1 && current < total){
            ul.append(pageLine(current, current));
        }

        if(current < total - 1){
            ul.append(pageLine(current, current + 1));
        }
        if(current == 1 && total > 3){
            ul.append(pageLine(current, current+2));
        }
        if(current < total - 3){
            if(current == total - 3){
                ul.append(pageLine(current, total - 1));
            } else {
                ul.append(pageLine(current, '...'));
            }
        }
        ul.append(pageLine(current, total));

        $('.paginator').remove();
        $('#search_result_list').append(pager);
    }

    function replacer(replacement, dataSource, block) {
        var result = block;
        for(var i in replacement) {
            if (typeof dataSource[replacement[i]] !== 'undefined') {
                //console.log('replacing ' + '{'+replacement[i]+'} for ' + dataSource[replacement[i]]);
                result = result.replace('{'+replacement[i]+'}', dataSource[replacement[i]]);
            }
        }

        return result;
    }

    /** -------------- WORKING WITH REQUEST PARAMS AND HASH ---------------- **/

    function generateSearchHash(){
        var request = {};
        var form = $('form[name="search_form"]');

        request['city_id'] = form.find('input[name="city_id"]').val();
        request['country_id'] = form.find('input[name="country_id"]').val();

        // resorts
        var resortList = $('#resort_full_list');
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
        var hotelList = $('#hotel_list');
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

        // hotel categories
        var hotelBlock = $('#hotel_cat_block');
        if (hotelBlock.find('input[name="hotel_cat_any"]').is(':checked')) {
            request['hotel_cat'] = [0];
        } else {
            request['hotel_cat'] = [];
            hotelBlock.find('ul li input[type="checkbox"]').each(function(){
                if (($(this).is(':checked'))) {
                    request['hotel_cat'].push($(this).attr('name').split('_')[2]);
                }
            });
        }
        request['hotel_cat'] = (typeof request['hotel_cat'] !== 'undefined') ? request['hotel_cat'].join(',') : 0;

        // meals
        var mealsBlock = $('#meal_block');
        if (mealsBlock.find('input[name="meal_any"]').is(':checked')) {
            request['meals_cat'] = [0];
        } else {
            request['meals_cat'] = [];
            mealsBlock.find('ul li input[type="checkbox"]').each(function(){
                if (($(this).is(':checked'))) {
                    request['meals_cat'].push($(this).attr('name').split('_')[1]);
                }
            });
        }
        request['meals_cat'] = (typeof request['meals_cat'] !== 'undefined') ? request['meals_cat'].join(',') : 0;

        // prices
        request['price_from'] = form.find('input[name="price_from"]').val();
        request['price_to'] = form.find('input[name="price_to"]').val();

        // people
        request['adults'] = form.find('input[name="adults"]').val();
        request['kids'] = form.find('input[name="kids"]').val();

        // kids
        if (request['kids'] > 0) {
            request['kid1'] = form.find('select[name="kid_1_age"] option:selected').val();

            if (request['kids'] > 1) {
                request['kid2'] = form.find('select[name="kid_2_age"] option:selected').val();

                if (request['kids'] > 2) {
                    request['kid3'] = form.find('select[name="kid_3_age"] option:selected').val();
                }
            }
        }

        request['tickets_aval'] = (form.find('input[name="tickets_aval"]').is(':checked')) ? 1 : 0;
        request['flight_included'] = (form.find('input[name="flight_included"]').is(':checked')) ? 1 : 0;
        request['bying_aval'] = (form.find('input[name="bying_aval"]').is(':checked')) ? 1 : 0;

        request['page'] = (form.find('input[name="page"]').val())
            ? form.find('input[name="page"]').val() : 1;

        request['on_page'] = (form.find('input[name="on_page"]').val())
            ? form.find('input[name="on_page"]').val() : 50;

        var requestString = [];
        for(var i in request) {
            requestString.push(i + '=' + request[i]);
        }
        requestString = requestString.join('&');
        return '#!' + requestString;
    }

    function setFormFromHash(){
        var hash = document.location.hash;

        formData = {};
        countryId = 0;
        resortIds = 0;
        hotelIds = 0;

        autoStart = false;

        if (hash) {
            var request = hash.split('#!')[1].split('&');
            var tmp;
            var dateFrom, dateTo, nightsFrom, nightsTo, priceFrom, priceTo, list, target;
            var dateExp = new RegExp('[\d]{1,2}\.[\d]{2}\.[\d]{4}');

            for (var k in request) {
                tmp = request[k].split('=');
                if (typeof tmp[0] !== 'undefined' && typeof tmp[1] !== 'undefined') {

                    switch(tmp[0]) {
                        case 'city_id':
                            formData[tmp[0]] = tmp[1];
                            var city = parseInt(tmp[1]);
                            if (!isNaN(city) && city > 0) {
                                //console.log('trying to set city by id');
                                $('#city_list').find('li[value="'+tmp[1]+'"] a').click();
                            } else {
                                tryGeolocation();
                            }
                            break;
                        case 'country_id':
                            countryId = tmp[1];
                            console.log(countryId);
                            formData[tmp[0]] = tmp[1];
                            break;
                        case 'resorts':
                            resortIds = (tmp[1] === '0' || tmp[1] == '')
                                ? 0 : tmp[1].split(',');
                            formData[tmp[0]] = tmp[1];
                            break;
                        case 'hotels':
                            hotelIds = (tmp[1] === '0' || tmp[1] == '')
                                ? 0 : tmp[1].split(',');
                            formData[tmp[0]] = tmp[1];
                            break;
                        case 'date_from':
                            dateFrom = tmp[1]; //(dateExp.test(tmp[1])) ? tmp[1] : false;
                            break;
                        case 'date_to':
                            dateTo = tmp[1]; //(dateExp.test(tmp[1])) ? tmp[1] : false;
                            break;
                        case 'nights_from':
                            nightsFrom = parseInt(tmp[1]);
                            nightsFrom = (!isNaN(nightsFrom)) ? tmp[1] : 7;
                            break;
                        case 'nights_to':
                            nightsTo = parseInt(tmp[1]);
                            nightsTo = (!isNaN(nightsFrom)) ? tmp[1] : 14;
                            break;
                        case 'price_from':
                            priceFrom = parseInt(tmp[1]);
                            priceFrom = (!isNaN(priceFrom)) ? tmp[1] : 1000;
                            break;
                        case 'price_to':
                            priceTo = parseInt(tmp[1]);
                            priceTo = (!isNaN(priceTo)) ? tmp[1] : 4000;
                            break;
                        case 'hotel_cat':
                            formData[tmp[0]] = tmp[1];
                            target = $('#hotel_cat_block');
                            if (tmp[1] === '0' || tmp[1] == '') {
                                var input = target.find('input[name="hotel_cat_any"]');
                                if (!input.is(':checked')) {
                                    input.click();
                                }
                            } else {
                                list = tmp[1].split(',');
                                for (var hc in list) {
                                    var cb = target.find('input[name="hotel_cat_'+list[hc]+'"]');
                                    if (!cb.is(':checked')) {
                                        cb.click();
                                    }
                                }
                            }
                            break;
                        case 'meals_cat':
                            formData[tmp[0]] = tmp[1];
                            target = $('#meal_block');
                            if (tmp[1] === '0' || tmp[1] == '') {
                                var input = target.find('input[name="meal_any"]');
                                if (!input.is(':checked')) {
                                    input.click();
                                }
                            } else {
                                list = tmp[1].split(',');
                                for (var mc in list) {
                                    var cb = target.find('input[name="meal_'+list[mc]+'"]');
                                    if (!cb.is(':checked')) {
                                        cb.click();
                                    }
                                }
                            }
                            break;
                        case 'adults':
                            formData[tmp[0]] = tmp[1];
                            list = parseInt(tmp[1]);
                            if (!isNaN(list) && list < 5) {
                                $('.people_count:first-child').find('li:nth-child('+list+') a').click();
                            }
                            break;
                        case 'flight_included':
                        case 'tickets_aval':
                        case 'bying_aval':
                            var cb = $('.search_item_adds').find('input[name="'+tmp[0]+'"]');
                            if (!cb.is(':checked') && tmp[1] === "1") {
                                cb.click();
                            }
                            formData[tmp[0]] = tmp[1];
                            break;
                        case 'start':
                            autoStart = true;
                            break;
                        default:
                            formData[tmp[0]] = tmp[1];
                    }
                }
            }

            // set dates
            if (dateFrom && dateTo) {
                setDates(formCalendar, dateFrom.split('.'), dateTo.split('.'));
            } else if (dateFrom) {
                setDates(formCalendar, dateFrom.split('.'));
            } else {
                setDates(formCalendar);
            }

            // set nights
            var slider = $('.slider_days');
            slider.slider('option', 'values', [nightsFrom, nightsTo]);

            // set price
            slider = $('.slider_price');
            slider.slider('option', 'values', [priceFrom, priceTo]);

            var kidNames = ['kid1','kid2','kid3'], kids = [];
            for (var i in kidNames) {
                if (typeof formData[kidNames[i]] !== 'undefined') kids.push(formData[kidNames[i]]);
            }
            setKids(kids);

            console.log(formData);

            return true;
        }

        return false;
    }

    if (!setFormFromHash()) {
        tryGeolocation();
        setDates(formCalendar);
    }
});

// set dates (from hash or now + 7 days)
function setDates(calendar, datesFrom, datesTo) {

    if (typeof datesFrom === 'undefined') {
        var from = new Date();
        from.setDate(from.getDate());
        datesFrom = [from.getDate(), from.getMonth()+1, from.getFullYear()];

        var to = from;
        to.setDate(from.getDate() + 7);
        datesTo = [to.getDate(), to.getMonth()+1, to.getFullYear()];
    }

    //console.log(datesFrom, datesTo);

    var /*calendar,*/ head, body, next, indexFrom, indexTo, tdFrom, tdTo;
    //calendar = $('.calendar_popup');
    head = calendar.find('.res_date_monthsname');
    body = calendar.find('.res_date_monthsday');
    //next = body.find('.nextmonth');

    indexFrom = head.find('li[year="' + parseInt(datesFrom[2]) + '"][month="'+parseInt(datesFrom[1])+'"]').index();
    indexTo = head.find('li[year="' + parseInt(datesTo[2]) + '"][month="'+parseInt(datesTo[1])+'"]').index();

    // set dates and selection
    tdFrom = body.find('table').get(indexFrom);
    $(tdFrom).find('td[day="'+parseInt(datesFrom[0])+'"] span').click();
    tdTo = body.find('table').get(indexTo);
    $(tdTo).find('td[day="'+parseInt(datesTo[0])+'"] span').click();

    // move calendar
    head.find('li').removeClass('active_m');
    body.find('li').removeClass('active_body');

    var nameWidth = head.find('li').outerWidth(true);
    head.find('li:nth-child('+(indexFrom + 1)+')').addClass('active_m');
    head.find('ul').css({left: (nameWidth * indexFrom) * (-1)});

    var monthWidth = body.find('li').outerWidth(true);
    body.find('li:nth-child('+(indexFrom + 1)+')').addClass('active_body');
    body.css({left: monthWidth * indexFrom * (-1)});
}

function getCountries(id, target/*, countryId*/) {
    $.ajax(
        '/search/getCountries',
        {
            data: {'depart_city_id' : id, target: target},
            type: 'POST',
            success: function(data){
                data = $.parseJSON(data);
                var list = data.countries;
                var countries = $(data.target);

                countries.empty();
                for (var i in list) {
                    countries.append($('<li value="'+i+'"><a href="#" country_name="'+list[i]+'">'+list[i]+'</a></li>'));
                }
                var scroll = countries.closest('.block_scroll');
                if (scroll.data('jsp')) {
                    scroll.data('jsp').reinitialise();
                } else {
                    scroll.jScrollPane({
                        verticalDragMaxHeight: 70,
                        height: 200
                    });
                }

                var target;
                console.log(countryId);
                if (countryId > 0) {
                    target = countries.find('li[value="'+countryId+'"] a');
                } else {
                    // try to find default country value
                    var defCountry = countries.closest('form').find('#default_country').val();
                    if (typeof defCountry !== 'undefined' && defCountry !== '') {
                        target = countries.find('a[country_name="'+defCountry+'"]');
                    }

                    // else set Egypt as default for now
                    if (typeof target === 'undefined') {
                        target = countries.find('a[country_name="Египет"]');
                    }
                }

                if (target.length) {
                    target.click();
                } else {
                    countries.find('a[country_name]').get(0).click();
                }
            }
        }
    );
}

function getResorts(id, postfix, hotelsFinder) {
    if (typeof postfix === 'undefined') postfix = '';
    $.ajax(
        '/search/getResorts',
        {
            data: {'country_id' : id},
            type: 'POST',
            success: function(data){
                var list = $.parseJSON(data);
                var resort_ids = [];

                $('#resort_list').find('input').removeAttr('checked');

                var ul, i;
                if (typeof list.popular !== 'undefined') {
                    ul = $('#popular_resorts'+postfix).empty();
                    for (i in list.popular) {
                        ul.append(createListItem(i, list.popular[i], 'resort'));
                        resort_ids.push(i);
                    }
                    $('#popular_li'+postfix).removeClass('hidden');
                }

                if (typeof list.other !== 'undefined') {
                    ul = $('#other_resorts'+postfix).empty();
                    for (i in list.other) {
                        ul.append(createListItem(i, list.other[i], 'resort'));
                        resort_ids.push(i);
                    }
                    $('#other_li'+postfix).removeClass('hidden');
                }

                $('label > .custom_check').ezMark();
                ul.closest('.block_scroll').data('jsp').reinitialise();

                if (resort_ids.length) {
                    hotelsFinder(id, resort_ids);
                }
            }
        }
    );
}

// creating list with checkboxes on search form updating
function createListItem(id, val, name, parent, hide) {
    parent = (typeof parent !== 'undefined') ? parent : '';
    hide = !!hide;

    var item =  $('<li class="jit" object_id="'+id+'"><label>' +
        '<input type="checkbox" class="custom_check" name="' + name + '_' + id + '"/>' + val +
        '</label></li>');

    if (parent) {
        item.attr('parent_id', parent);
    }

    if (hide) {
        item.css({display: 'none'});
    }

    return item;
}