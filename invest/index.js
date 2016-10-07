/*global
XY, navigator, $, console, document, localStorage, window
*/
/* singleton invest system */
var XY;
XY = XY || {};
(function () {
  "use strict";

  XY.INVEST = {
    data: {}
  };

  $(document).ready(function () {
    var pageInit, dataChange, actions, setupAction, curPage, traverse;
    $("#fh5co-offcanvas").css("display", "none");
    $("#fh5co-offcanvas").css("z-index", "20");
    $(".fh5co-nav-toggle").on("click", function () {
      if ($("#fh5co-offcanvas").css("display") !== "none") {
        $("#fh5co-offcanvas").css("display", "none");
      } else {
        $("#fh5co-offcanvas").css("display", "block");
      }
    });
    $(window).on("scroll", function () {
      $("#fh5co-offcanvas").css("display", "none");
    });
    actions = {
      receipt: function (params) {
        var target = "." + params[0];
        $(target).html('XY Findables<br>' +
          'a California Corporation<br>' +
          XY.INVEST.data.numShares + ' Shares at $1.00 Per Share Minimum Investment: 10 Shares ($)<br>' +
          'FOR SOPHISTICATED INVESTORS ONLY<br>' +
          'INSTRUCTIONS FOR SUBSCRIPTION');
      },
      showPage: function (params) {
        var page = params[0],
          validate = params[1] === "true",
          j, i, inputs, cont = true,
          confirmResponse;
        if (validate && parseInt(page.replace("page", ""), 10) > parseInt(curPage.replace('page', ''), 10)) {
          for (j = parseInt(curPage.replace('page', ''), 10); j < parseInt(page.replace("page", ""), 10); j++) {
            inputs = $(".page" + j + " input, .page" + j + " select");
            for (i = 0; i < inputs.length; i++) {
              if ($(inputs[i]).attr("required") && ($(inputs[i]).val() === "" || ($(inputs[i]).attr("type") === "checkbox" && !$(inputs[i])[0].checked))) {
                $(inputs[i]).css("outline", "2px solid red");
                cont = false;
              } else if ($(inputs[i]).attr("action") && $(inputs[i]).attr("action").indexOf("confirm") > -1) {
                confirmResponse = $(inputs[i]).trigger("change")[0];
                if (confirmResponse.style.outline.indexOf("red") > -1) {
                  cont = false;
                } else {
                  $(inputs[i]).css("outline", "none");
                  if ($(inputs[i]).attr("data")) {
                    dataChange({
                      target: inputs[i],
                      preventDefault: traverse
                    });
                  }
                }
              } else {
                $(inputs[i]).css("outline", "none");
                if ($(inputs[i]).attr("data")) {
                  dataChange({
                    target: inputs[i],
                    preventDefault: traverse
                  });
                }
              }
            }
            if (!cont) {
              return;
            }
          }
        }
        for (i = 0; i < $(".page").length; i++) {
          $($(".page")[i]).css("display", "none");
        }
        $(".navButton").removeClass("selected");
        $(".nav" + parseInt(page.replace('page', ''), 10)).addClass("selected");
        $("." + page).css("display", "inline-block");
        curPage = page;
      },
      setText: function (params, e) {
        var target, content;
        target = params[0];
        content = params[1];
        content = content.replace("*|value|*", e.target.value);
        $(target).text(content);
      },
      confirm: function (params, e) {
        var target = $("." + params[0]);
        if (e.target.value !== target.val()) {
          e.target.style.outline = "2px solid red";
          return false;
        }
        return true;
      },
      toggleVisibility: function (params, e) {
        if (e.type === params[1]) {
          var target, dis;
          target = params[0];
          dis = $(target).css("display");
          $(target).css("display", ((dis === "none") ? "block" : "none"));
        }
      },
      submit: function () {
        $.getJSON('//freegeoip.net/json/?callback=?', function (ipInfo) {
          var s = {
            async: true,
            crossDomain: true,
            url: 'https://devapi.xyfindit.com/2.0/subscription',
            method: "POST",
            headers: {
              "x-api-key": "VFR1QKS1WP4qZKhK6jRYn44FptPrYw0hamkOcUzM",
              "content-type": "application/json"
            },
            processData: false,
            data: {
              action: "makeInvestment",
              subscription: {
                amount: XY.INVEST.data.numShares,
                shareCount: XY.INVEST.data.numShares,
                investor: {
                  city: XY.INVEST.data.person.address.city,
                  country: XY.INVEST.data.person.address.country,
                  date_of_birth: XY.INVEST.data.person.dob,
                  email: XY.INVEST.data.person.email,
                  name: XY.INVEST.data.person.firstName + " " + XY.INVEST.data.person.lastName,
                  phone: XY.INVEST.data.person.phone,
                  postal_code: XY.INVEST.data.person.address.zip,
                  region: XY.INVEST.data.person.address.state,
                  street_address_1: XY.INVEST.data.person.address.address1,
                  tax_id_number: XY.INVEST.data.person.govId
                },
                paymentMethod: XY.INVEST.data.invest.paymentMethod,
                paymentDetails: {
                  account_type: XY.INVEST.data.bank.accountType,
                  check_type: XY.INVEST.data.bank.checkType,
                  routing_number: XY.INVEST.data.bank.routing,
                  account_number: XY.INVEST.data.bank.account,
                  name_on_account: XY.INVEST.data.bank.name,
                  email: XY.INVEST.data.bank.email,
                  ip_address: ipInfo.ip,
                  user_agent: navigator.userAgent,
                  literal: XY.INVEST.data.bank.signature
                }
              }
            }
          };
          s.data = JSON.stringify(s.data);
          $.ajax(s).done(
            function () {
              actions.showPage(["page6", "true"]);
              if ($("page6").css("display") !== "none") {
                localStorage.removeItem("investData");
              }
            }
          );
        });
      },
      setTotal: function (params) {
        XY.INVEST.data.numShares = parseInt($(".shares").val(), 10);
        while (params[1].indexOf("{{val}}") > -1) {
          params[1] = params[1].replace("{{val}}", XY.INVEST.data.numShares);
        }
        $("." + params[0]).text(params[1]);
        localStorage.setItem("investData", JSON.stringify(XY.INVEST.data));
      },
    };

    setupAction = function (e) {
      e.preventDefault();
      var i, subs, val, params, func;
      val = e.target.getAttribute('action');
      subs = val.split(";");
      for (i = 0; i < subs.length; i++) {
        func = subs[i].split(":")[0];
        params = subs[i].split(":")[1].split(",");
        if (actions[func]) {
          actions[func](params, e);
        }
      }
    };

    dataChange = function (e) {
      var i, subs, index, val;
      val = e.target.getAttribute('data');
      e.preventDefault();
      $(e.target).css("outline", "none");
      if (val && val !== "") {
        subs = val.split(".");
        index = XY.INVEST.data;
        for (i = 0; i < subs.length - 1; i++) {
          if (!index[subs[i]]) {
            index[subs[i]] = {};
          }
          index = index[subs[i]];
        }
        index[subs[i]] = e.target.value;
      }
      localStorage.setItem("investData", JSON.stringify(XY.INVEST.data));
    };

    traverse = function (jsonObj, objName, func) {
      if (typeof jsonObj === "object") {
        $.each(jsonObj, function (k, v) {
          traverse(v, objName + "." + k, func);
        });
      } else {
        if (func) {
          func(objName, jsonObj);
        }
      }
    };

    pageInit = function () {
      var elements, element, i, s, settings = {
        async: true,
        crossDomain: true,
        url: 'https://devapi.xyfindit.com/2.0/subscription',
        method: "POST",
        headers: {
          "x-api-key": "VFR1QKS1WP4qZKhK6jRYn44FptPrYw0hamkOcUzM",
          "content-type": "application/json"
        },
        processData: false,
        data: {
          action: "achAgreement"
        }
      };
      settings.data = JSON.stringify(settings.data);
      $.ajax(settings).done(function (e) {
        if (e && e.response && e.response.agreement_html) {
          $(".achAgreement").html(e.response.agreement_html);
        }
      });
      s = localStorage.investData;
      if (s) {
        XY.INVEST.data = JSON.parse(s);
      }
      curPage = "page1";
      actions.showPage([curPage, "false"]);
      elements = $("input,select,button");
      if (XY.INVEST.data.numShares) {
        $(".investTotal").text(XY.INVEST.data.numShares + " shares selected for $" + XY.INVEST.data.numShares);
        actions.receipt(["receipt"]);
      }
      traverse(XY.INVEST.data, "", function (name, val) {
        for (i = 0; i < elements.length; i++) {
          element = $(elements[i]);
          if (element.attr("data") && element.attr("data") === name.replace(".", "")) {
            element.val(val);
            if (element.attr("type") === "checkbox") {
              element.attr("checked", true);
            }
          }
        }
      });
      for (i = 0; i < elements.length; i++) {
        element = $(elements[i]);
        element.on("change", dataChange);
        if (element.attr("action")) {
          element.on("change", setupAction);
          element.on("click", setupAction);
        }
      }
    };

    pageInit();
  });
}());
