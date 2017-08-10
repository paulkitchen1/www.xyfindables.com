
var Utils;
Utils = Utils || {
    validateEmail: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    getUrlParameter: function(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },
    guid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    cancelBubble: function(e) {
        var evt = e ? e : window.event;
        if (evt.stopPropagation) evt.stopPropagation();
        if (evt.cancelBubble != null) evt.cancelBubble = true;
    },

    sendGA: function(page) {
        if (typeof(ga) != 'undefined') {
            ga('send', 'pageview', page);
        }
    },

    SendfbEvent: function(type, values) {
        if (typeof(fbq) != 'undefined') {
            if (values)
                fbq(['track', type, values]);
            else
                fbq(['track', type]);

        }
    },

    createCookie: function(name, value, days) {
        try {
            if (localStorage) {
                localStorage.setItem(name, value)
            } else {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toGMTString();
                } else var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            }
        } catch (err) {
            return null
        };
    },



    readCookie: function(name) {
        if (localStorage) {
            return localStorage.getItem(name)
        } else {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    },

    getCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    setCookie: function(name, value, days) {
        try {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        } catch (err) {
            return null
        };
    },

    conversion: function(cart_token) {
        if (cart_token) {
            var senddata = 'cart_token=' + cart_token;
            $.ajax({
                url: "/api/convert",
                type: "POST",
                timeout: 5000,
                data: senddata
            });
        }
    },

    sevt: function(event_type, event_value) {
        if (event_type) {
            var vid = $("#frmData #visitor_id").val();
            var senddata = 'visitor_id=' + vid + '&event_type=' + event_type;
            if (event_value)
                senddata += '&event_value=' + event_value;
            $.ajax({
                url: "/api/event",
                type: "POST",
                timeout: 2000,
                data: senddata
            });
        }
    },

    SendUtmData: function() {
        var senddata = '';
        $("#frmData :input").each(function() {
            senddata += $(this).attr('name') + "=" + $(this).val() + "&";
        });
        if ($("#frmData[name=refer]").length == 0) {
            if (Utils.readCookie("_refer"))
                senddata += "refer=" + Utils.readCookie("_refer");
        }
        $.ajax({
            url: "/api/createorder",
            type: "POST",
            timeout: 2000,
            data: senddata
        });
    }


}

$.fn.showLoading = function(option) {
    var DefautOption = {
        icon: 'fa fa-spin fa-spinner',
        text: 'Please wait...'
    }
    $.extend(DefautOption, DefautOption, option)
    return this.each(function() {
        $icon = '<i class="' + DefautOption.icon + '"></i>';
        $text = DefautOption.text;
        $valign = 25;
        $obj = $('<div class="loading"></div>');
        $obj.html('<label style="top:45%;position:relative;">' + $icon + ' ' + $text + '</label>');
        $(this).append($obj);
    });
}

$.fn.hideLoding = function() {
    return this.each(function() {
        $(this).find('.loading').remove();
    });
}
