var Apply;
Apply = Apply || {
  data: {},
  initVisitorId: function(message) {
    Utils.log("Apply.initVisitorId");
    if (Utils.readCookie('visitor_id') && Utils.readCookie('visitor_id') != null) {
      var vid = Utils.readCookie('visitor_id');
      if (vid && vid != null) {
        $("#frmData #visitor_id").val(vid);
        Utils.log("initCookie: vid=" + vid);
        return;
      }
    }
    Utils.createCookie('visitor_id', $("#frmData #visitor_id").val(), 100);
    Utils.log("initVisitorId: new vid=" + $("#frmData #visitor_id").val());
  },
  readUrlParams: function() {
    Utils.log("Apply.readUrlParams");
    Apply.loading = true;
    var vars = [],
      hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    $("[name=email_address]").val(decodeURIComponent(vars['email_address'] || Apply.data.investor.personal.email_address));
    $("[name=first_name]").val(decodeURIComponent(vars['first_name'] || Apply.data.investor.personal.first_name));
    $("[name=last_name]").val(decodeURIComponent(vars['last_name'] || Apply.data.investor.personal.last_name));
    $("[name=phone]").val(decodeURIComponent(vars['phone'] || Apply.data.investor.personal.phone));

    if ($("[name=email_address]").val().length > 0 &&
      $("[name=first_name]").val().length > 0 &&
      $("[name=last_name]").val().length > 0 &&
      $("[name=phone]").val().length > 0) {
      $(".btn-personal").click();
    }
    Apply.loading = false;
  },

  saveInvest: function() {
    Utils.log("Apply.saveInvest")
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);

    if (Apply.checkInputs(".container")) {
      event.stopPropagation();

      var postData = $("#frmInvest").serialize();

      $.ajax({
        url: "https://www.xyfindit.com/api/invest",
        type: "POST",
        timeout: 25000,
        data: postData,
        dataType: "json",
        success: function(data) {
          Utils.log("Apply.saveInvest:Success")
          Apply.checkSubmit(data)
        },
        error: function(ex) {
          Utils.logError(ex)
          Utils.sendGA('error/creatinginvestor/' + JSON.stringify(ex));
          $(".modal-overlay").remove();
        }
      });


    } else {
      Utils.sendGA('apply/entry-errors');
      alert("Please correct errors in red.")
      $(".modal-overlay").remove();
    }
    return false;
  },

  loading: false,

  isLoading: function() {
    return Apply.loading;
  },

  loadData: function() {
    Utils.log("Apply.loadData: " + JSON.stringify(Apply.data))
    Apply.loading = true;
    for (var p in Apply.data.investor.personal) {
      $("[name=" + p + "]").val(Apply.data.investor.personal[p]);
    }
    for (var p in Apply.data.investor.financial) {
      $("[name=" + p + "]").val(Apply.data.investor.financial[p]);
    }
    Apply.loading = false;
  },

  saveData: function() {
    Apply.data = Apply.defaultData();
    for (var p in Apply.data.investor.personal) {
      if ($("[name=" + p + "]").val().trim().length > 0) {
        Apply.data.investor.personal[p] = $("[name=" + p + "]").val().trim();
      }
    }

    if (Apply.data.investor.financial) {
      for (var p in Apply.data.investor.financial) {
        if ($("[name=" + p + "]").val().trim().length > 0) {
          Apply.data.investor.financial[p] = $("[name=" + p + "]").val().trim();
        }
      }
    }

    Utils.log("Apply.saveData: " + JSON.stringify(Apply.data))
    Utils.createCookie("xy-invest", JSON.stringify(Apply.data), 100);
  },

  submitInvestParts: function() {
    var params = $("#frmInvest").serialize();
    Utils.log("Apply.submitInvestParts: " + params);
    $.ajax({
      url: "https://www.xyfindit.com/api/investpart",
      type: "POST",
      timeout: 5000,
      data: params,
      dataType: "text",
      error: function(ex) {
        Utils.logError("Apply.submitInvestParts:" + ex.message);
        Utils.sendGA('error/investorpart/' + encodeURIComponent(JSON.stringify(ex)))
      }
    });
  },

  cityState: function(zip) {
    Utils.log("Apply.cityState")
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true",
      type: "GET",
      timeout: 2000,
      dataType: "JSON",
      error: function(ex) {
        Utils.logError("Apply.cityState:" + ex);
        Utils.sendGA('error/goStateZip/' + encodeURIComponent(JSON.stringify(ex)));
      },
      success: function(data) {
        if (Apply.data.status == 'OK') {
          try {
            if (Apply.data.results[0].address_components.filter(function(component) {
                return component.types.indexOf("postal_code") > -1;
              })[0].short_name == $("[name=zipcode]").val()) {

              $("[name=city]").val(Apply.data.results[0].address_components.filter(function(component) {
                return component.types.indexOf("locality") > -1;
              })[0].long_name).change();
              $("[name=state]").val(Apply.data.results[0].address_components.filter(function(component) {
                return component.types.indexOf("administrative_area_level_1") > -1;
              })[0].short_name).change();
              if ($("[name=state]").val() == null) {
                $("[name=state]").val("");
              }
            }
          } catch (ex) {}
        }
      }
    });
  },

  checkSubmit: function(data) {
    Utils.log("Apply.checkSubmit")
    if (Apply.data.error && !Apply.data.o) {
      $("[name=credit-error]").text(Apply.data.error);
      $("[name=credit-error]").show();
      $(".modal-overlay").remove();
      try {
        $("[name=credit-error]")[0].scrollIntoView();
      } catch (ex) {}
      alert("Please correct errors in red.");
    }
    //else if (Apply.data.o && Apply.data.o.entity) {
    //    $(".modal-overlay").remove();
    //    if (Apply.data.o.entity.tax_id_number) {
    //        $("[name=ssn]").closest(".form-control").addClass('had-error');
    //        $("[name=ssn]").change(function () { $(this).closest(".form-control").removeClass('had-error') });
    //        alert("Please correct errors in red.");
    //    }
    //}
    else if (Apply.data.o && Apply.data.o.ach_authorization) {
      $(".modal-overlay").remove();
      if (Apply.data.o.ach_authorization.routing_number) {
        $("[name=routingNumber]").closest(".form-control").addClass('had-error');
        $("[name=routingNumber]").change(function() {
          $(this).closest(".form-control").removeClass('had-error')
        });
        alert("Please correct errors in red.");
      }
    } else
      document.location = '/invest/review?shares=' + $("[name=numberOfShares]").val();
  },

  checkInputs: function(frm) {
    //validate fields
    fail = false;
    fail_log = '';
    $(frm).find('select, textarea, input').each(function() {
      if (!$(this).prop('required')) {} else {
        if ($(this).is(':visible') && !$(this).val().trim()) {
          $(this).closest(".form-control").addClass('had-error');
          $(this).change(function() {
            $(this).closest(".form-control").removeClass('had-error')
          });
          fail = true;
          name = $(this).attr('name');
          fail_log += name + " is required \n";
        }
      }
    });

    if ($("[name=disclaimer]").is(':visible') && !$("[name=disclaimer]").is(':checked')) {
      fail = true;
      $("[name=disclaimer").closest(".form-control").addClass('had-error');
      $("[name=disclaimer]").focus(function() {
        $("[name=disclaimer]").closest(".form-control").removeClass('had-error');
      });
    }
    if ($("[name=email_address]").is(':visible') && $("[name=email_address]").length > 0) {
      if (!Utils.validateEmail($("[name=email_address]").val())) {
        $("[name=email_address").closest(".form-control").addClass('had-error');
        $("[name=email_address]").focus(function() {
          $("[name=email_address]").closest(".form-control").removeClass('had-error')
        });
        fail = true;
        name = $("[name=email_address]").attr('name');
        fail_log += name + " is required \n";
      }
    }
    if ($("[name=numberOfShares]").is(':visible') && $.isNumeric($("[name=numberOfShares]").val())) {
      var equityError = "";
      $("[name=numberOfShares]").val(parseInt($("[name=numberOfShares]").val()));
      if ($("[name=numberOfShares]").val() < 350 || $("[name=numberOfShares]").val() > 500000) {
        $("[name=numberOfShares").closest(".form-control").addClass('had-error');
        $("[name=numberOfShares]").focus(function() {
          $("[name=numberOfShares]").closest(".form-control").removeClass('had-error');
          $(".text-danger").hide()
        });
        equityError += "Share limit is a minimum of 350 and a maximum of 500,000.";
        fail = true;
      } else {
        if ($("[name=annual_income]").is(':visible') && $.isNumeric($("[name=annual_income]").val()) && $("[name=net_worth]").val()) {
          if (($("[name=annual_income]").val() * .10) < $("[name=numberOfShares]").val() && ($("[name=net_worth]").val() * .10) < $("[name=numberOfShares]").val()) {
            $("[name=numberOfShares").closest(".form-control").addClass('had-error');
            $("[name=numberOfShares]").focus(function() {
              $("[name=numberOfShares]").closest(".form-control").removeClass('had-error');
              $(".text-danger").hide()
            });
            equityError += "Based on your annual income and net worth, this amount exceeds your Title IV limits."
            fail = true;
          }
        }
      }
      if (equityError != '') {
        $(".text-danger").text(equityError).show();
      }
    }
    if ($("[name=country]").is(':visible') && $("[name=country]").val() == 'US') {
      var zip = $("[name=zipcode]").val();
      if (zip.indexOf('-') > -1) {
        zip = zip.substring(0, zip.indexOf('-'));
        $("[name=zipcode]").val(zip);
      }
      if (!$.isNumeric(zip)) {
        $("[name=zipcode]").closest(".form-control").addClass('had-error');
        $("[name=zipcode]").focus(function() {
          $("[name=zipcode]").closest(".form-control").removeClass('had-error')
        });
        fail = true;
        name = $("[name=zipcode]").attr('name');
        fail_log += name + " is not numeric\n";
      }
      if (zip.length != 5) {
        $("[name=zipcode]").closest(".form-control").addClass('had-error');
        $("[name=zipcode]").focus(function() {
          $("[name=zipcode]").closest(".form-control").removeClass('had-error')
        });
        fail = true;
        name = $("[name=zipcode]").attr('name');
        fail_log += name + " is not 5 digits\n";
      }

    }
    //submit if fail never got set to true
    return (!fail);
  },
  openSubAgreement: function() {
    $("#subscription .modal-body").load("/invest/subscription?numberOfShares=" + encodeURIComponent($("[name=numberOfShares]").val().trim()) +
      "&first_name=" + encodeURIComponent($("[name=first_name]").val().trim()) + "&last_name=" + encodeURIComponent($("[name=last_name]").val().trim()) + "&address1=" + encodeURIComponent($("[name=address1]").val().trim()) +
      "&city=" + encodeURIComponent($("[name=city]").val().trim()) + "&state=" + encodeURIComponent($("[name=state]").val().trim()) + "&zipcode=" + encodeURIComponent($("[name=zipcode]").val().trim()) + "&d=" + +new Date());
  },

  defaultData: function() {
    Utils.log("Apply.defaultData");
    return JSON.parse(JSON.stringify({
      uid: "9f1ecbf1-502a-48f6-8010-9cda549bc9b4",
      investor: {
        personal: {
          first_name: "",
          last_name: "",
          email_address: "",
          phone: ""
        },
        financial: {
          numberOfShares: "",
          annual_income: "",
          net_worth: "",
          address1: "",
          address2: "",
          country: "",
          zipcode: "",
          city: "",
          state: "",
          region: ""
        },
        finalize: {
          paymentMethod: ""
        }
      },
      createDate: new Date(),
      visits: []
    }));
  },

  initData: function() {
    Utils.log("Apply.initData");

    var dataJson = Utils.readCookie("xy-invest");
    Utils.log("Apply.initData:get data from cookie: " + dataJson);

    Apply.data = JSON.parse(Utils.readCookie("xy-invest")) || Apply.defaultData();
    Utils.log("Apply.initData:get data: " + Apply.data);

    if (Apply.data === null || typeof Apply.data !== 'object') {
      Utils.log("Apply.initData:using default object");
      Apply.data = Apply.defaultData();
    }

    $("[name=uid]").val(Apply.data.uid);

    Apply.data.visits = Apply.data.visits || [];
    Apply.data.visits.push({
      page: location.href,
      visitDate: new Date()
    });

    Apply.loadData();

    Utils.createCookie("xy-invest", JSON.stringify(Apply.data));

    $.ajax({
      url: "https://www.xyfindit.com/api/ITag",
      type: "POST",
      timeout: 5000,
      data: "uid=" + Apply.data.uid + "&p=" + location.href,
      dataType: "text",
    });
  }
}

$(function() {
  Utils.log("Anonymous Function (Apply)");
  var appendthis = ("<div class='modal-overlay js-modal-close'></div>");

  $('a[data-modal-id]').click(function(e) {
    e.preventDefault();
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    //$(".js-modalbox").fadeIn(500);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + modalBox).fadeIn($(this).data());
  });


  $(".js-modal-close, .modal-overlay").click(function() {
    $(".modal-box, .modal-box2 ,.modal-overlay").fadeOut(500, function() {
      $(".modal-overlay").remove();
    });
  });

  $(window).resize(function() {
    $(".modal-box").css({
      top: $(window).scrollTop() + (($(window).height() - $(".modal-box").outerHeight()) / 3),
      left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
    $(".subscription-body").css({
      height: $(window).height() * (2 / 3)
    });
  });

  $(window).scroll(function() {
    $(".modal-box").css({
      top: $(window).scrollTop() + (($(window).height() - $(".modal-box").outerHeight()) / 3),
      left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
    $(".subscription-body").css({
      height: $(window).height() * (2 / 3)
    });


  });

  $(window).resize();

  Utils.SendfbEvent('InitiateCheckout');
  $(".schedule").click(function() {
    Utils.sendGA('Schedule')
  });
});

$(document).ready(function() {
  Utils.log("Apply:document.ready");
  Apply.initVisitorId();
  Apply.initData();
  Apply.loadData();
  Apply.readUrlParams();

  $(".se-tip-trigger").click(function() {
    $("[name=" + $(this).attr("data") + "]").show()
  });

  $(".continue-btn").click(function(e) {
    Apply.saveInvest();
  });

  $(".tip-close a").click(function() {
    $(this).closest(".se-tip").hide();
    return false
  });

  $("select").change(function() {
    $(this).find("option[value='']").attr("disabled", "")
  });

  $("[name=email_address]").on("blur", function() {
    if ($("[name=email_address]").val() != "") {
      var vid = $("[name=uid]").val();
      var senddata = 'visitor_id=' + vid + '&event_type=invest_email';
      senddata += '&event_value=' + $("[name=first_name]").val() + "~" + $("[name=last_name]").val() + "~" + $("[name=email_address]").val();
      $.ajax({
        url: "https://www.xyfindit.com/api/event",
        type: "POST",
        timeout: 2000,
        data: senddata
      });
    }
  });

  $("#frmInvest").find('select, textarea, input').change(function() {
    if (!Apply.isLoading()) {
      Apply.saveData();
    }
    Apply.submitInvestParts();
  });

  $("[name=paymentMethod]").change(function() {
    if ($(this).val() == "ach") {
      $("#ach-data").show();
      $("[name=credit-area]").hide();
    } else if ($(this).val() == "wire") {
      $("#ach-data").hide();
      $("[name=credit-area]").hide();
    } else if ($(this).val() == "credit") {
      $("#ach-data").hide();
      $("[name=credit-area]").show();
    } else {
      $("#ach-data").hide();
      $("[name=credit-area]").hide();
    }
  });
  $("[name=accountType]").val("");
  $("[name=dobMonth]").val("");
  $("[name=dobDay]").val("");
  $("[name=usCitizen]").prop('checked', ('us' == ''));
  $("[name=country]").val('US').change();

  $("[name=country]").change(function() {
    if ($("[name=country]").val() == "US") {
      $("[name=state]").show();
      $("[name=region]").hide();
    } else {
      $("[name=state]").hide();
      $("[name=region]").show()
    }
  });

  $("[name=zipcode]").keyup(function() {
    if ($("[name=country]").val() == "US" && $(this).val().length > 4) {
      Apply.cityState($(this).val())
    }
  });

  $("[name=credit]").keypress(function(event) {
    if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
      event.preventDefault(); //stop character from entering input
    } else {
      var num = /\d+/g;
      var cc = $(this).val().replace(/\D/g, '');;
      if (cc.length > 0) {
        var newcc = '';
        for (var x = 0; x < cc.length; x++) {
          newcc += cc.charAt(x);
          if ((x + 1) % 4 == 0) newcc += ' ';
        }
        $("[name=credit]").val(newcc);
      }
    }
  });

  $(".btn-call").click(function() {
    Calendly.showPopupWidget('https://calendly.com/investxy/call/')
  });
  $(".btn-personal").click(function() {
    if (Apply.checkInputs(".container")) {
      $("#personal").hide();
      $("#amount").show();
      $("#financial").show();
      Apply.saveData();
      Utils.sendGA('/invest/apply/2')
    }
  })
  $(".btn-pre-personal").click(function() {
    $("#personal").show();
    $("#amount").hide();
    $("#financial").hide();
  })

  $(".btn-financial").click(function() {
    if (Apply.checkInputs(".container")) {
      $("#amount").hide();
      $("#financial").hide();
      $("#final").show();
      $("#subAgreement").show();
      Apply.saveData();
      Utils.sendGA('/invest/apply/3')
    }
  })

  $(".btn-pre-financial").click(function() {
    $("#amount").show();
    $("#financial").show();
    $("#final").hide();
    $("#subAgreement").hide();
  })

  var authorization = 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI3OTc3Yzk4NzZmZWRhYzY1OTYzNGMyY2FmZDk4ODhjZDNmYTU2YzY4YjAwNGU2NmMzNmEzYjE2NDZhYjAzMTY2fGNyZWF0ZWRfYXQ9MjAxNy0wNS0wNVQyMTo1Mjo1NC4yMjM0ODIwMDQrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTY4a2hodjhzbmdjY25mNnJcdTAwMjZwdWJsaWNfa2V5PXdubWNxOHczNXc2a2dmbnoiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzY4a2hodjhzbmdjY25mNnIvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiY2hhbGxlbmdlcyI6WyJjdnYiXSwiZW52aXJvbm1lbnQiOiJwcm9kdWN0aW9uIiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuYnJhaW50cmVlZ2F0ZXdheS5jb206NDQzL21lcmNoYW50cy82OGtoaHY4c25nY2NuZjZyL2NsaWVudF9hcGkiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5icmFpbnRyZWVnYXRld2F5LmNvbS82OGtoaHY4c25nY2NuZjZyIn0sInRocmVlRFNlY3VyZUVuYWJsZWQiOmZhbHNlLCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiZGlzcGxheU5hbWUiOiJYWSAtIFRoZSBGaW5kYWJsZXMgQ29tcGFueSIsImNsaWVudElkIjoiQVVETkVPLUhtd2xQMFR0cTMzZ0hPM3hGNVcxSnhYcmdFMDdydXI2TzlDejAwQjg5ekpqZUJ5Wjd4anVmejFGVmphdUEyWDhWSWlMWGMzWWoiLCJwcml2YWN5VXJsIjoiaHR0cHM6Ly9zdG9yZS54eWZpbmRpdC5jb20vcGFnZXMvcHJpdmFjeS1wb2xpY3kiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cHM6Ly9zdG9yZS54eWZpbmRpdC5jb20vcGFnZXMvdGVybXMiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOmZhbHNlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6ZmFsc2UsImVudmlyb25tZW50IjoibGl2ZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6IkFSS3JZUkRoM0FHWER6VzdzT18zYlNrcS1VMUM3SEdfdVdOQy16NTdMallTRE5VT1NhT3RJYTlxNlZwVyIsImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwibWVyY2hhbnRBY2NvdW50SWQiOiJYWVRoZUZpbmRhYmxlc0NvbXBhbnlfaW5zdGFudCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiNjhraGh2OHNuZ2NjbmY2ciIsInZlbm1vIjoib2ZmIn0=';
  var submit = document.querySelector('.btn-credit');

});
