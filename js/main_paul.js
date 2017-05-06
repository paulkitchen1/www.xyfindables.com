jQuery(function ($) {
    'use strict',

    //#main-slider
        $(function () {
            $('#main-slider.carousel').carousel({
                interval: 1000
            });
            $("#btn-discount").click(function () { CheckDiscountCode2() });
            $("#btn_gps_email").click(function () { SendGPSInterest() });

        });


    // accordian
    $('.accordion-toggle').on('click', function () {
        $(this).closest('.panel-group').children().each(function () {
            $(this).find('>.panel-heading').removeClass('active');
        });

        $(this).closest('.panel-heading').toggleClass('active');
    });

    //Initiat WOW JS
    new WOW().init();

    // portfolio filter
    $(window).load(function () {
        'use strict';
        var $portfolio_selectors = $('.portfolio-filter >li>a');
        var $portfolio = $('.portfolio-items');
        $portfolio.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $portfolio_selectors.on('click', function () {
            $portfolio_selectors.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $portfolio.isotope({ filter: selector });
            return false;
        });
    });

    // Contact form
    var form = $('#main-contact-form');
    form.submit(function (event) {
        event.preventDefault();
        var form_status = $('<div class="form_status"></div>');
        $.ajax({
            url: $(this).attr('action'),

            beforeSend: function () {
                form.prepend(form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn());
            }
        }).done(function (data) {
            form_status.html('<p class="text-success">' + data.message + '</p>').delay(3000).fadeOut();
        });
    });


    //goto top
    $('.gototop').click(function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });

    //Pretty Photo
    $("a[rel^='prettyPhoto']").prettyPhoto({
        social_tools: false
    });

    $.fn.showLoading = function (option) {
        var DefautOption = {
            icon: 'fa fa-spin fa-spinner',
            text: 'Please wait...'
        }
        $.extend(DefautOption, DefautOption, option)
        return this.each(function () {
            $icon = '<i class="' + DefautOption.icon + '"></i>';
            $text = DefautOption.text;
            $valign = 25;
            $obj = $('<div class="loading"></div>');
            $obj.html('<label style="top:45%;position:relative;">' + $icon + ' ' + $text + '</label>');
            $(this).append($obj);
        });
    }

    $.fn.hideLoding = function () {
        return this.each(function () {
            $(this).find('.loading').remove();
        });
    }
});

function CheckDiscountCode2() {
    var c = $("[name=discount_code]").val();
    var senddata = '{ discount: { code: "' + c + '", cart: "' + $("#frmCart #cart_token").val() + '" } }';
    $.ajax({ url: "https://www.xyfindit.com/api/checkdiscount", method: "post", headers: { "content-type": "application/json", "x-api-key": "nJUi4EOxR93mCwrSt4H6S6mpSeg2jSByzQGww8z5" }, data: senddata, success: function (e) { ApplyCode(e) }, error: function (e) { console.log(e);  } });
    Utils.sendGA('CheckDiscount');
    Utils.sevt('CheckDiscount', c);
}

function SendGPSInterest()
{
    var em = $("#gps_email").val();
    if (!Utils.validateEmail(em)) {
        alert("Email address not valid.")
    }
    else {
        Utils.sevt("gps_email", em);
        $("#gps_email").val("");
        alert("Thank you. We have received your email.")
    }
    return false;
}


function ApplyCode(code) {
    if (code.Code) {
        $(".discount-row").show();
        $("#frmCart #cart_code").remove();
        $("#frmCart #cart_code_amount").remove();
        $("#frmCart").append('<input id="cart_code" type="hidden" value="' + code.Code + '" >');
        $("#frmCart").append('<input id="cart_code_amount" type="hidden" value="' + code.Amount + '" >');
        Utils.sevt('CodeApplied', code.Code);
        UpdateTotals();
        $("[name=discount_code]").val("");
    }
    else {
        alert('Invalid Discount');
        Utils.sevt('InvalidCode', $("[name=discount_code]").val());
    }
    $(".pp-loading").hide();
}


function SendShipping() {
    var senddata = '';
    $(".shipping-form :input").each(function () {
        if ($(this).attr('name') != 'undefined') {
            if (!$(this).is(':checkbox'))
                senddata += $(this).attr('name') + "=" + encodeURIComponent($(this).val()) + "&";
            else
                senddata += $(this).attr('name') + "=" + ((this).checked ? $(this).val() : "0") + "&";
        }shipping
    });
    var vid = $("#frmData #visitor_id").val();
    senddata += 'visitor_id=' + vid + '&';
    var cart = $("#frmCart #cart_token").val();
    senddata += 'cart_token=' + cart + '&';
    try {
        senddata += location.search.substring(1, location.search.length);
    } catch (ex) { console.log(ex) }

    $.ajax({
        url: "https://www.xyfindit.com/api/shipping",
        type: "POST",
        timeout: 15000,
        data: senddata,
        dataType: "json",
        success: function (data) { UpdateCart(data) },
        error: function (ex) { Utils.sendGA('error/createshipping/' + encodeURIComponent(JSON.stringify(ex))) }
    }
);
}
