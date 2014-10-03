var HotelResultFilterModel = function (options) {

    var inputNodes = {
        inputHotelResultModel: $('#hotelResultModel'),
        inputHotelType: $('#hotelName'),
        inputSlider: $('.slider'),
        inputHotelName: $('#hotelName'),
        
    }

    var model = jQuery.parseJSON($("#hotelResultModel").val());
    var min = parseInt($('#min-range').html());
    var max = parseInt($('#max-range').html());
    var dataObject = { results: [] };
    var hotellist = jQuery.parseJSON($("#hotelResultModel").val());

    this.init = function () {

        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                dataObject.results.push({ id: hotelData.HotelID, text: hotelData.HotelName });
            }
        });

        $("#hotelName").select2({
            placeholder: "Select a Hotel Name",
            allowClear: true,
            query: function (query) {
                query.callback(dataObject);
            }
        });

        //Price range value slider
        $('.slider').slider().on('slideStop', function (ev) {
            var range = $(this).data('slider').getValue();
            var min = parseInt(range[0]);
            var max = parseInt(range[1]);
            var minOriginal = $('#minOriginal').val();
            var maxOriginal = $('#maxOriginal').val();
            $('#min-range').html(min);
            $('#max-range').html(max);
            var i = 0;

            $.blockUI({
                message: '<h1>Processing</h1>',
                css: { border: '3px solid #000' }
            });

            setTimeout($.unblockUI, 250);

            $(".price-base-filter").each(function () {
                var price = parseInt($(this).attr('price'));
                if (min <= price && price <= max) {
                    $(this).show();
                    i++;
                } else {
                    $(this).hide();
                }
            });

            $('#hotel_count').text(i + ' Hotels');
            if (min != minOriginal || max != maxOriginal) {
                addTags(1, 'Price Range');
            } else {
                removeTags(1);
            }

            updatefilters(min, max);

        });

        $(document).on('click', '.starRating,.propertyType,.facilityType,.activity,.roomFacility,.mealPlans,.supplements', function () {
            filterHotelResults();
        });

        $(document).on('click', '.glyphicon-remove', function () {
            var tagID = $(this).attr('tag');
            removeTag(tagID);
        });

        $(document).on('click', '#nameFilter', function () {
            filterByHotelName();
        });

    }

  

    function updatefilters(min, max) {
        updateStarFilters(min, max);
        updatePropertyTypeFilter(min, max);
        updateFacilityFilter(min, max);
        updateActivityFilter(min, max);
        updateRoomFacilityFilter(min, max);
        updateMealPlanFilter(min, max);
        updateSupplementsFilter(min,max);
        updateTextSearch(min, max);
    }

    function updateStarFilters(min, max) {

        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var startFilterObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                var starRating = {};
                if (jQuery.isEmptyObject(startFilterObject)) {
                    starRating.rating = hotelData.StarRating;
                    starRating.count = 1;
                    startFilterObject = { 'items': [starRating] };
                } else {
                    var check = true;
                    $.each(startFilterObject.items, function (i, filterData) {
                        if (filterData.rating == hotelData.StarRating) {
                            filterData.count = filterData.count + 1;
                            check = true;
                        } else {
                            check = false;
                        }
                    });
                    if (!check) {
                        starRating.rating = hotelData.StarRating;
                        starRating.count = 1;
                        startFilterObject.items.push(starRating);
                    }
                }
            }
        });
        $('#starRating').html('');
        //set html content to filter area
        $.each(startFilterObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="starRating" type="checkbox" value="' + filterData.rating + '"><span class="sidebar-filter">' + filterData.rating + ' Star(' + filterData.count + ')</span></label></div></li>';
            $('#starRating').append(source);
        });
    }

    function updatePropertyTypeFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var propertyTypeFilterObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                var propertyType = {};
                if (jQuery.isEmptyObject(propertyTypeFilterObject)) {
                    propertyType.propertyType = hotelData.PropertyType;
                    propertyType.count = 1;
                    propertyTypeFilterObject = { 'items': [propertyType] };
                } else {
                    var check = true;
                    $.each(propertyTypeFilterObject.items, function (i, filterData) {
                        if (filterData.propertyType == hotelData.PropertyType) {
                            filterData.count = filterData.count + 1;
                            check = true;
                        } else {
                            check = false;
                        }
                    });
                    if (!check) {
                        propertyType.propertyType = hotelData.PropertyType;
                        propertyType.count = 1;
                        propertyTypeFilterObject.items.push(propertyType);
                    }
                }
            }
        });
        $('#propertyType').html('');
        //set html content to filter area
        $.each(propertyTypeFilterObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="propertyType" type="checkbox" value="' + filterData.propertyType + '"><span class="sidebar-filter">' + filterData.propertyType + ' Property Type (' + filterData.count + ')</span></label></div></li>';
            $('#propertyType').append(source);
        });
    }

    function updateFacilityFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var facilityTypeFilterObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                $.each(hotelData.Facilities, function (k, facilityData) {
                    var facilityType = {};
                    if (jQuery.isEmptyObject(facilityTypeFilterObject)) {
                        facilityType.facitliyType = facilityData;
                        facilityType.count = 1;
                        facilityTypeFilterObject = { 'items': [facilityType] };
                    } else {
                        var check = true;
                        $.each(facilityTypeFilterObject.items, function (i, filterData) {
                            if (filterData.facitliyType == facilityData) {
                                filterData.count = filterData.count + 1;
                                check = true;
                                return false;
                            } else {
                                check = false;
                            }
                        });
                        if (!check) {
                            facilityType.facitliyType = facilityData;
                            facilityType.count = 1;
                            facilityTypeFilterObject.items.push(facilityType);
                        }
                    }
                });
            }
        });
        $('#facilities').html('');
        //set html content to filter area
        $.each(facilityTypeFilterObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="facilityType" type="checkbox" value="' + filterData.facitliyType + '"><span class="sidebar-filter">' + filterData.facitliyType + ' Facility (' + filterData.count + ')</span></label></div></li>';
            $('#facilities').append(source);
        });
    }

    function updateActivityFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var activityTypeFilterObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                $.each(hotelData.Activities, function (k, activityData) {
                    var activityType = {};
                    if (jQuery.isEmptyObject(activityTypeFilterObject)) {
                        activityType.activityType = activityData;
                        activityType.count = 1;
                        activityTypeFilterObject = { 'items': [activityType] };
                    } else {
                        var check = true;
                        $.each(activityTypeFilterObject.items, function (i, filterData) {
                            if (filterData.activityType == activityData) {
                                filterData.count = filterData.count + 1;
                                check = true;
                                return false;
                            } else {
                                check = false;
                            }
                        });
                        if (!check) {
                            activityType.activityType = activityData;
                            activityType.count = 1;
                            activityTypeFilterObject.items.push(activityType);
                        }
                    }
                });
            }
        });
        $('#activities').html('');
        //set html content to filter area
        $.each(activityTypeFilterObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="activity" type="checkbox" value="' + filterData.activityType + '"><span class="sidebar-filter">' + filterData.activityType + ' Activity (' + filterData.count + ')</span></label></div></li>';
            $('#activities').append(source);
        });
    }

    function updateRoomFacilityFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var roomFacilitiesFilterObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                $.each(hotelData.RoomFacilities, function (k, roomFacilityData) {
                    var roomFacilityType = {};
                    if (jQuery.isEmptyObject(roomFacilitiesFilterObject)) {
                        roomFacilityType.roomFacilityType = roomFacilityData;
                        roomFacilityType.count = 1;
                        roomFacilitiesFilterObject = { 'items': [roomFacilityType] };
                    } else {
                        var check = true;
                        $.each(roomFacilitiesFilterObject.items, function (i, filterData) {
                            if (filterData.roomFacilityType == roomFacilityData) {
                                filterData.count = filterData.count + 1;
                                check = true;
                                return false;
                            } else {
                                check = false;
                            }
                        });
                        if (!check) {
                            roomFacilityType.roomFacilityType = roomFacilityData;
                            roomFacilityType.count = 1;
                            roomFacilitiesFilterObject.items.push(roomFacilityType);
                        }
                    }
                });
            }
        });
        $('#roomfacility').html('');
        //set html content to filter area
        $.each(roomFacilitiesFilterObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="roomFacility" type="checkbox" value="' + filterData.roomFacilityType + '"><span class="sidebar-filter">' + filterData.roomFacilityType + ' Room Facitliy (' + filterData.count + ')</span></label></div></li>';
            $('#roomfacility').append(source);
        });
    }

    function updateMealPlanFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var mealPlanTypeObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                $.each(hotelData.MealPlans, function (k, mealPlanData) {
                    var mealPlanType = {};
                    if (jQuery.isEmptyObject(mealPlanTypeObject)) {
                        mealPlanType.mealPlanType = mealPlanData;
                        mealPlanType.count = 1;
                        mealPlanTypeObject = { 'items': [mealPlanType] };
                    } else {
                        var check = true;
                        $.each(mealPlanTypeObject.items, function (i, filterData) {
                            if (filterData.mealPlanType == mealPlanData) {
                                filterData.count = filterData.count + 1;
                                check = true;
                                return false;
                            } else {
                                check = false;
                            }
                        });
                        if (!check) {
                            mealPlanType.mealPlanType = mealPlanData;
                            mealPlanType.count = 1;
                            mealPlanTypeObject.items.push(mealPlanType);
                        }
                    }
                });
            }
        });
        $('#mealplan').html('');
        //set html content to filter area
        $.each(mealPlanTypeObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="mealPlans" type="checkbox" value="' + filterData.mealPlanType + '"><span class="sidebar-filter">' + filterData.mealPlanType + ' Meal Plan (' + filterData.count + ')</span></label></div></li>';
            $('#mealplan').append(source);
        });
    }

    function updateSupplementsFilter(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        var supplementsObject = {};
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                $.each(hotelData.Supplements, function (k, supplementData) {
                    var supplementType = {};
                    if (jQuery.isEmptyObject(supplementsObject)) {
                        supplementType.supplement = supplementData;
                        supplementType.count = 1;
                        supplementsObject = { 'items': [supplementType] };
                    } else {
                        var check = true;
                        $.each(supplementsObject.items, function (i, filterData) {
                            if (filterData.supplement == supplementData) {
                                filterData.count = filterData.count + 1;
                                check = true;
                                return false;
                            } else {
                                check = false;
                            }
                        });
                        if (!check) {
                            supplementType.supplement = supplementData;
                            supplementType.count = 1;
                            supplementsObject.items.push(supplementType);
                        }
                    }
                });
            }
        });
        $('#mealplan').html('');
        //set html content to filter area
        $.each(supplementsObject.items, function (i, filterData) {
            var source = '<li><div class="checkbox"><label><input class="mealPlans" type="checkbox" value="' + filterData.supplement + '"><span class="sidebar-filter">' + filterData.mealPlanType + ' (' + filterData.count + ')</span></label></div></li>';
           // $('#mealplan').append(source);
        });
    }

    function filterHotelResults() {
        var min = parseInt($('#min-range').html());
        var max = parseInt($('#max-range').html());
        var starRatingArr = new Array();
        var propertyType = new Array();
        var facilityType = new Array();
        var activity = new Array();
        var roomFacility = new Array();
        var mealPlans = new Array();
        var supplements = new Array();
        var starRatingVisible = new Array();
        var propertyTypeVisible = new Array();
        var facilityTypeVisible = new Array();
        var activityTypeVisible = new Array();
        var roomFacilityVisible = new Array();
        var mealPlanVisible = new Array();
        var supplementsVisible = new Array();

        $('.starRating:checkbox:checked').each(function () {
            starRatingArr.push(parseInt($(this).val()));
        });

        $('.propertyType:checkbox:checked').each(function () {
            propertyType.push(parseInt($(this).val()));
        });

        $('.facilityType:checkbox:checked').each(function () {
            facilityType.push(parseInt($(this).val()));
        });

        $('.activity:checkbox:checked').each(function () {
            activity.push(parseInt($(this).val()));
        });

        $('.roomFacility:checkbox:checked').each(function () {
            roomFacility.push(parseInt($(this).val()));
        });

        $('.mealPlans:checkbox:checked').each(function () {
            mealPlans.push(parseInt($(this).val()));
        });

        $('.supplements:checkbox:checked').each(function() {
            supplements.push(parseInt($(this).val()));
        });

        var model = jQuery.parseJSON($("#hotelResultModel").val());
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                if (starRatingArr.length > 0) {
                    if (starRatingArr.indexOf(hotelData.StarRating) >= 0) {
                        starRatingVisible.push(hotelData.HotelID);
                    }
                    addTags(2, 'Star Rating');
                } else {
                    starRatingVisible.push(hotelData.HotelID);
                    removeTags(2);
                }

                if (propertyType.length > 0) {
                    if (propertyType.indexOf(hotelData.PropertyType) >= 0) {
                        propertyTypeVisible.push(hotelData.HotelID);
                    }
                    addTags(3, 'Property Type');
                } else {
                    propertyTypeVisible.push(hotelData.HotelID);
                    removeTags(3);
                }

                if (facilityType.length > 0) {
                    if ($.arrayIntersect(facilityType, hotelData.Facilities).length > 0) {
                        facilityTypeVisible.push(hotelData.HotelID);
                    }
                    addTags(4, 'Facilities');
                } else {
                    facilityTypeVisible.push(hotelData.HotelID);
                    removeTags(4);
                }

                if (activity.length > 0) {
                    if ($.arrayIntersect(activity, hotelData.Activities).length > 0) {
                        activityTypeVisible.push(hotelData.HotelID);
                    }
                    addTags(5, 'Activities');
                } else {
                    activityTypeVisible.push(hotelData.HotelID);
                    removeTags(5);
                }

                if (roomFacility.length > 0) {
                    if ($.arrayIntersect(roomFacility, hotelData.RoomFacilities).length > 0) {
                        roomFacilityVisible.push(hotelData.HotelID);
                    }
                    addTags(6, 'Room Facilities');
                } else {
                    roomFacilityVisible.push(hotelData.HotelID);
                    removeTags(6);
                }

                if (mealPlans.length > 0) {
                    if ($.arrayIntersect(mealPlans, hotelData.MealPlans).length > 0) {
                        mealPlanVisible.push(hotelData.HotelID);
                    }
                    addTags(7, 'Meal Plans');
                } else {
                    mealPlanVisible.push(hotelData.HotelID);
                    removeTags(7);
                }

                if (supplements.length > 0) {//here is the last point
                    if ($.arrayIntersect(supplements, hotelData.Supplements).length > 0) {
                        supplementsVisible.push(hotelData.HotelID);
                    }
                    addTags(8, 'Supplements');
                } else {
                    supplementsVisible.push(hotelData.HotelID);
                    removeTags(8);
                }
            }

        });
        var visible = $.arrayIntersect($.arrayIntersect($.arrayIntersect($.arrayIntersect($.arrayIntersect($.arrayIntersect(starRatingVisible, propertyTypeVisible), facilityTypeVisible), activityTypeVisible), roomFacilityVisible), mealPlanVisible),supplementsVisible);
        $.each(model, function (i, hotelData) {
            if (visible.indexOf(hotelData.HotelID) >= 0) {
                $('#hotel_' + hotelData.HotelID).show();
            } else {
                $('#hotel_' + hotelData.HotelID).hide();
            }
        });
    }

    function updateTextSearch(min, max) {
        var model = jQuery.parseJSON($("#hotelResultModel").val());
        dataObject.results = [];
        $.each(model, function (i, hotelData) {
            if (min <= hotelData.TotalPrice && hotelData.TotalPrice <= max) {
                dataObject.results.push({ id: hotelData.HotelID, text: hotelData.HotelName });
            }
        });
        $("#hotelName").select2({
            placeholder: "Select a Hotel Name",
            allowClear: true,
            data: dataObject
        });
    }

    $.arrayIntersect = function (a, b) {
        return $.grep(a, function (i) {
            return $.inArray(i, b) > -1;
        });
    };

    function filterByHotelName() {
        var hotelID = $('#hotelName').select2("val");
        if (hotelID != "") {
            var check = 1;
            $.each(hotellist, function (i, v) {
                $('html, body').animate({
                    scrollTop: ($("#hotel_" + hotelID).offset().top - $(".navbar").height())
                }, 1000);
                if ($("#hotel_" + hotelID).is(":visible")) {
                    check = 2;
                }
                return false;
            });
            if (check == 1) {
                $("#errormsg").html('error').fadeIn('slow').delay(2000).hide(1);;
            }
        } else {
            $("#errormsg").html('Empty Filed').fadeIn('slow').delay(2000).hide(1);
        }
    }

    function addTags(id, text) {
        if ($('#tag_' + id).length == 0) {
            $('#tags').append('<button type="button" class="btn btn-success btn-xs" id="tag_' + id + '" style="margin:3px;"><span class="glyphicon glyphicon-remove" tag="' + id + '"></span>  ' + text + '</button>');
        }
    }

    function removeTags(id) {
        if ($('#tag_' + id).length) {
            $('#tag_' + id).remove();
        }
    }

    function removeTag(tagID) {    
        var btnID = "tag_" + tagID;
        var d = document.getElementById(btnID);

        d.remove();

        if (btnID == 'tag_1') {
            /*$(".slider").slider();
            var minOriginal = $('#minOriginal').val();
            var maxOriginal = $('#maxOriginal').val();
            $('#min-range').html(minOriginal);
            $('#max-range').html(maxOriginal);
            alert(minOriginal + " and " + maxOriginal);*/
            //$(".slider").data('refresh');
            $(".slider").slider('setValue', newValue, 'slide')
            updatefilters(min, max);
        }
        else if (btnID == 'tag_2') {
            $(".starRating").prop("checked", false);
            updateStarFilters(min, max);
        }
        else if(btnID=='tag_3'){
            $(".propertyType").prop("checked", false);
            updatePropertyTypeFilter(min, max);
        }
        else if (btnID == 'tag_4') {
            $(".facilityType").prop("checked", false);
            updateFacilityFilter(min, max);
        }
        else if (btnID == 'tag_5') {
            $(".activity").prop("checked", false);
            updateActivityFilter(min, max);
        }
        else if (btnID == 'tag_6') {
            $(".roomFacility").prop("checked", false);
            updateRoomFacilityFilter(min, max);
        }
        else if (btnID == 'tag_7') {
            $(".mealPlans").prop("checked", false);
            updateMealPlanFilter(min, max);
        }
    }

}
