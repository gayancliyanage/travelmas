var SearchHotelsResultModel = function (options) {
    var urls = {};

    var inputNodes = {
        btnRoomView: $('.room_view'),
        btnSelectRoom: $('.hotel_box'),
        inputDiscount: $('.discount'),
        inputMealSupplement: $('.other-supplement'),
        inputSupplement: $('.meal-supplement')
    }

    this.init = function () {
        urls.roomUpgrade = options.roomUpgradeUrl;
     /*   $(document).on('click', '.room_view', function (e) {
            var args = {};
            args.paxroom = $(this).attr('paxroom');
            args.room = $(this).attr('room');
            args.hotel = $(this).attr('hotel');
            viewRoom(args);
        });*/

        $(document).on('click', '.hotel_box', function (e) {
            var args = {};
            args.paxroom = $(this).attr('paxroom');
            args.room = $(this).attr('room');
            args.hotel = $(this).attr('hotel');
            args.total = 0;
            selectRoom(args);
        });

    

        $(document).on('click', '.discount,.other-supplement,.meal-supplement', function (e) {
            var args = {};
            args.paxroom = $(this).attr('paxroom');
            args.room = $(this).attr('room');
            args.hotel = $(this).attr('hotel');
            args.contractid = $('#contractID_' + args.hotel).val();
            args.total = 0;
            roomUpgrades(args);
        });
    }

   /* function viewRoom(args) {
        if ($(this).text()=='hide') {
            $('#room_' + args.paxroom + '_' + args.hotel + '_' + args.room).hide();
            $(this).text('view');
        } else {
            $('#room_' + args.paxroom + '_' + args.hotel + '_' + args.room).show();
           $(this).text('hide');
        }
    }*/


    function selectRoom(args) {
            //should select the current room
            $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').addClass("btn-default");
            $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').removeClass("btn-primary");
            $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').removeClass("btn-default");
            $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').addClass("btn-primary");

            //pax details and total cost should be updated in the client side
            $("#paxroom-" + args.hotel + "-" + args.paxroom).html($("#pax-" + args.hotel + "-" + args.room + "-" + args.paxroom).html());

            //get the total
            $("span.paxtotalbox-" + args.hotel + "> input").each(function() {
                var a = $(this).val();
                args.total = parseInt(a) + parseInt(args.total);

            });

            $("#total-" + args.hotel).html(args.total);

            $(".hotel_" + args.hotel).hide();
            $("#room_" + args.paxroom + "_" + args.hotel + "_" + args.room).show();

            $('.room_view[hotel=' + args.hotel + ']').text('view');
            $('.room_view[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').text('hide');

            //update search query
            buildSearchQuery(args);

            if ($('.hotel-inquiry').length > 0) {
                updateInquiry(args);
            }
    }

    function updateInquiry(args) {
        $('#room-inquiry-' + args.paxroom).html($('#inquiry-' + args.hotel + '-' + args.room + '-' + args.paxroom).html());
        var total = 0;
        $("span.room-inquiry>input").each(function () {
            var a = $(this).val();
            total = parseInt(a) + parseInt(total);
        });
        $('.hotel-total').html(total);
        $('#customblock').show();
    }

    function roomUpgrades(args) {
        
       
        $.blockUI();
        $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').addClass("btn-default");
        $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').removeClass("btn-primary");
        $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').removeClass("btn-default");
        $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').addClass("btn-primary");


        var searchQuery = buildSearchQuery(args);

        //get the hotel partial view
        $.ajax({
            url: urls.roomUpgrade,
            data: {
                q: JSON.stringify(searchQuery)
            },
            type: 'GET',
            success: function (data) {
                $("#pax_" + args.hotel).hide();
                $("#pax_" + args.hotel).addClass('removepax');
                $("#pax_" + args.hotel).after(data['hotelRoomPax']);
                $(".removepax").remove();

                var source = $('<div>' + data['hotelRoomPartial'] + '</div>');
                var tempView = source.wrap('<p/>').parent().html();
                $("div#hotel_" + args.hotel).find('.room-list').html(tempView);

               
                selectRoom(args);
                var k = 0;
                searchQuery.Hotel.Rooms.forEach(function (roomdt) {

                    select_args = {};
                    select_args.paxroom = k;
                    select_args.hotel = args.hotel;
                    select_args.room = roomdt.RoomTypeID;
                    select_args.total = 0;
                    selectRoom(select_args);
                    k++;
                });
                $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').addClass("btn-default");
                $('.btn-primary[paxroom=' + args.paxroom + '][hotel=' + args.hotel + ']').removeClass("btn-primary");
                $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').removeClass("btn-default");
                $('.btn[paxroom=' + args.paxroom + '][hotel=' + args.hotel + '][room=' + args.room + ']').addClass("btn-primary");
                $('.hotel_' + args.hotel).hide();
                $('#room_' + args.paxroom + '_' + args.hotel + '_' + args.room).show();
                if ($('.hotel-inquiry').length > 0) {
                    var roomInquirySouce = $('<div>' + data['hotelInquiryPartial'] + '</div>');
                    var roomInquirytempView = roomInquirySouce.wrap('<p/>').parent().html();
                    $(".hotel-inquiry").html(roomInquirytempView);
                    $('.hotel-select').remove();
                    $('#searchQuery').val(JSON.stringify(searchQuery));
                }
                
            }
        });
    }

    this.load = function loadSelected() {
        $.blockUI();
       //get the hotel partial view
       var searchQuery = JSON.parse($('#searchQuery').val());
       var args = {};
       args.hotel = searchQuery.Hotel.HotelID;
      
       $.ajax({
            url: urls.roomUpgrade,
            data: {
                q: JSON.stringify(searchQuery)
            },
            type: 'GET',
            success: function (data) {
                $("#pax_" + args.hotel).hide();
                $("#pax_" + args.hotel).addClass('removepax');
                $("#pax_" + args.hotel).after(data['hotelRoomPax']);
                $(".removepax").remove();

                var source = $('<div>' + data['hotelRoomPartial'] + '</div>');
                var tempView = source.wrap('<p/>').parent().html();
                $("div#hotel_" + args.hotel).find('.room-list').html(tempView);


                selectRoom(args);
                var k = 0;
                searchQuery.Hotel.Rooms.forEach(function (roomdt) {

                    select_args = {};
                    select_args.paxroom = k;
                    select_args.hotel = args.hotel;
                    select_args.room = roomdt.RoomTypeID;
                    select_args.total = 0;
                    selectRoom(select_args);
                    k++;
                });
                $('.hotel_' + args.hotel).hide();
                $('.room_view ').text('view');
                $('.hotel-select').remove();
            }
        });
    }

    function buildSearchQuery(args) {
        var searchQuery = JSON.parse($('#searchQuery').val());
        searchQuery.Hotel.HotelID = args.hotel;
        searchQuery.Hotel.ContractID = args.contractid;
        var i = 0;
        searchQuery.Hotel.Rooms.forEach(function (roomdt) {

            var ms, ds = 'null';
            var sup = [];
            var roomTypeID = $('.btn-primary[paxroom=' + i + '][hotel=' + args.hotel + ']').attr('room');
            $(".meal-supplement[paxroom=" + i + "][room=" + roomTypeID + "][hotel=" + args.hotel + "]:checked").each(function () {
                ms = $(this).attr('ms');
                sup.push(ms);
            });

            $(".other-supplement[paxroom=" + i + "][room=" + roomTypeID + "][hotel=" + args.hotel + "]:checked").each(function () {
                var a = $(this).attr('sup');
                sup.push(a);

            });
            $(".discount[paxroom=" + i + "][room=" + roomTypeID + "][hotel=" + args.hotel + "]:checked").each(function () {
                ds = $(this).attr('ds');
            });
            roomdt.RoomTypeID = roomTypeID;
            roomdt.Supplements = sup;
            roomdt.DiscountGroup = ds;

            i++;
        });
        $('#searchQuery').val(JSON.stringify(searchQuery));
        return searchQuery;
    }

}



