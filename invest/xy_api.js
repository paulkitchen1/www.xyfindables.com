/*
  Global
    navigator, $, console, X_API_KEY
  Dependencies
    js-cookie
*/


var XY;
window.XY = window.XY || {};

(function() {
  "use strict";
  XY.versionNumber = "1.0";
  function postSettings(url, action, objects, settings) {
    var apiURL;
    switch(document.domain.toLowerCase()){
      case 'localhost':
      case 'beta.my.xyfindit.com':
        apiURL = 'https://devapi.xyfindit.com/2.2/';
        break;
      default:
        apiURL = 'https://api.xyfindit.com/2.2/';
    }
    var s = {
      async: true,
      crossDomain: true,
      url: apiURL + url,
      method: "POST",
      headers: {
        "x-api-key": X_API_KEY,
        "content-type": "application/json",
        "authorization": XY.token
      },
      processData: false,
      data: {
        action: action,
        host: {
          os: navigator.platform,
          osVersion: navigator.appVersion,
          app: "XY JS API",
          appVersion: XY.versionNumber
        },
        settings: {
          verbose: true
        }
      }
    };
    if (objects) {
      Object.keys(objects).forEach(function(key) {
        if (objects.hasOwnProperty(key)) {
          s.data[key] = objects[key];
        }
      });
    }
    if (settings) {
      Object.keys(settings).forEach(function(key) {
        if (settings.hasOwnProperty(key)) {
          s.data.settings[key] = settings[key];
        }
      });
    }
    return s;
  }

  function makeCall(settings, onSuccess, onError, passData) {
    settings.data = JSON.stringify(settings.data);
    settings.settings = JSON.stringify(settings.settings);
    $.ajax(settings).done(
      function(response) {
        if (response.authorization !== undefined) {
          XY.token = response.authorization;
        }
        if (onSuccess !== undefined) {
          onSuccess(response, passData);
        }
      }
    ).fail(function(f) {
      if (onError) {
        onError(f);
      }
    });
  }
  XY.API = XY.API || {
    makeCall: makeCall,
    postSettings: postSettings,
    /* TODO preflight checks, currently allows you invoke methods without required params*/
    about: {
      get: function (onSuccess, onError) {
        makeCall(postSettings("about", "get", {}), onSuccess, onError);
      }
    },
    account: {
      read: function(user, onSuccess, onError) {
        makeCall(postSettings("account", "read", {
          user: user
        }), onSuccess, onError);
      },
      signin: function(user, onSuccess, onError) {
        makeCall(postSettings("account", "signin", {
          user: user
        }), onSuccess, onError);
      },
      signup: function(user, onSuccess, onError) {
        makeCall(postSettings("account", "add", {
          user: user
        }), onSuccess, onError);
      },
      sendVerification: function(user, onSuccess, onError) {
        makeCall(postSettings("account", "sendVerification", {
          user: user
        }), onSuccess, onError);
      },
      update: function(user, onSuccess, onError) {
        makeCall(postSettings("account", "update", {
          user: user
        }), onSuccess, onError);
      },
      reset: function(email, onSuccess, onError) {
        makeCall(postSettings("account", "reset", {
          user: {
            email: email
          }
        }), onSuccess, onError);
      },
      intercom: function(email, onSuccess, onError) {
        var settings = postSettings("intercom", "authorize", {
          user: {
            email: email
          }
        });
        settings.url = "https://devapi.xyfindit.com/2.2/intercom";
        // TODO fix this : )
        makeCall(settings, onSuccess, function (e) {
          if (e.status == 200) {
            onSuccess(e.responseText);
          }
          else {
            onError(e);
          }
        });
      }
    },
    beacon: {
      read: function(onSuccess, onError, s, ids) {
        var settings = postSettings("beacon", "read", {
          ids: ids
        }, s);
        settings.url = "https://devapi.xyfindit.com/2.2/beacon";
        // TODO fix this to prod api
        makeCall(settings, onSuccess, onError);
      },
      sync: function(beacon, onSuccess, onError) {
        beacon.updateTime = new Date();
        var settings = postSettings("beacon", "sync", {
          beacon: beacon
        });
        settings.url = "https://devapi.xyfindit.com/2.2/beacon";
        makeCall(settings, onSuccess, onError);
      }
    },
    beaconevent: {
      add: function(events, onSuccess, onError) {
        makeCall(postSettings("beaconevent", "add", {
          beaconEvents: events
        }), onSuccess, onError);
      },
      read: function(ids, maxCount, onSuccess, onError) {
        makeCall(postSettings("beaconevent", "read", {
          ids: ids,
          maxCount: maxCount
        }), onSuccess, onError);
      }
    },
    beaconsubscription: {
      read: function(serial, onSuccess, onError) {
        var params = {
          serial: serial
        };
        makeCall(
          postSettings('beaconsubscription', 'read', params),
          onSuccess,
          onError
        );
      },
      activate: function(serialOrBeaconId, onSuccess, onError) {
        var params = { };
        if(serialOrBeaconId.indexOf('xy') > -1){
          params.beaconId = serialOrBeaconId;
        }else {
          params.serial = serialOrBeaconId;
        }
        makeCall(
          postSettings('beaconsubscription', 'activate', params),
          onSuccess,
          onError
        );
      },
      search: function(serial, onSuccess, onError) {
        var params = { serial: serial };
        makeCall(
          postSettings('beaconsubscription', 'search', params),
          onSuccess,
          onError
        );
      }
    },
    config: {
      read: function(platform, onSuccess, onError) {
        makeCall(postSettings("config", "read", {
          platform: platform
        }), onSuccess, onError);
      },
      update: function(platform, config, onSuccess, onError) {
        makeCall(postSettings("config", "update", {
          platform: platform,
          config: config
        }), onSuccess, onError);
      },
      reset: function(platform, onSuccess, onError) {
        makeCall(postSettings("config", "reset", {
          platform: platform
        }), onSuccess, onError);
      }
    },
    image: {
      upload: function(inputExtension, base64Image, onSuccess, onError) {
        makeCall(postSettings("image", "upload", {
          inputExtension: inputExtension,
          base64Image: base64Image
        }), onSuccess, onError);
      }
    },
    ifttt: {
      trigger: function(id, type, onSuccess, onError) {
        makeCall(postSettings("ifttt/v1/triggers", "trigger", {
          id: id,
          type: type
        }), onSuccess, onError);
      }
    },
    zapier: {
      trigger: function(id, type, onSuccess, onError) {
        makeCall(postSettings("zapier/triggers", "trigger", {
          id: id,
          type: type
        }), onSuccess, onError);
      }
    },
    developer: {
      id: "",
      signup: function(onSuccess, onError) {
        makeCall(postSettings("developer", "createDeveloper", {}), onSuccess, onError);
      },
      webhook: {
        get: function(onSuccess, onError) {
          makeCall(postSettings("developer", "getWebhooks", {
            developerId: XY.API.developer.id
          }), onSuccess, onError);
        },
        add: function(url, eventType, onSuccess, onError) {
          makeCall(postSettings("developer", "addWebhook", {
            webhook: {
              event: eventType,
              url: url
            },
            developerId: XY.API.developer.id
          }), onSuccess, onError);
        },
        remove: function(eventType, onSuccess, onError) {
          makeCall(postSettings("developer", "removeWebhook", {
            webhook: {
              event: eventType
            },
            developerId: XY.API.developer.id
          }), onSuccess, onError);
        },
        test: function(eventType, onSuccess, onError) {
          makeCall(postSettings("developer", "testWebhook", {
            event: eventType,
            developerId: XY.API.developer.id
          }), onSuccess, onError);
        },
        target: {
          add: function(id, eventType, onSuccess, onError) {
            makeCall(postSettings("developer", "addWebhookTarget", {
              webhook: {
                event: eventType,
                target: id
              },
              developerId: XY.API.developer.id
            }), onSuccess, onError);
          },
          remove: function(id, eventType, onSuccess, onError) {
            makeCall(postSettings("developer", "removeWebhookTarget", {
              webhook: {
                event: eventType,
                target: id
              },
              developerId: XY.API.developer.id
            }), onSuccess, onError);
          }
        }
      }
    }
  };
}());
