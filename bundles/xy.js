var Utils;Utils=Utils||{validateEmail:function(n){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(n)},getUrlParameter:function(n){for(var u=decodeURIComponent(window.location.search.substring(1)),r=u.split("&"),t,i=0;i<r.length;i++)if(t=r[i].split("="),t[0]===n)return t[1]===undefined?!0:t[1]},cancelBubble:function(n){var t=n?n:window.event;t.stopPropagation&&t.stopPropagation();t.cancelBubble!=null&&(t.cancelBubble=!0)},sendGA:function(n){typeof ga!="undefined"&&ga("send","pageview",n)},SendfbEvent:function(n,t){typeof fbq!="undefined"&&(t?fbq(["track",n,t]):fbq(["track",n]))},createCookie:function(n,t,i){var r,u;try{localStorage?localStorage.setItem(n,t):(i?(r=new Date,r.setTime(r.getTime()+i*864e5),u="; expires="+r.toGMTString()):u="",document.cookie=n+"="+t+u+"; path=/")}catch(f){return null}},readCookie:function(n){var r,u,i,t;if(localStorage)return localStorage.getItem(n);for(r=n+"=",u=document.cookie.split(";"),i=0;i<u.length;i++){for(t=u[i];t.charAt(0)==" ";)t=t.substring(1,t.length);if(t.indexOf(r)==0)return t.substring(r.length,t.length)}return null},getCookie:function(n){for(var r=n+"=",u=document.cookie.split(";"),t,i=0;i<u.length;i++){for(t=u[i];t.charAt(0)==" ";)t=t.substring(1,t.length);if(t.indexOf(r)==0)return t.substring(r.length,t.length)}return null},setCookie:function(n,t,i){var r,u;try{i?(r=new Date,r.setTime(r.getTime()+i*864e5),u="; expires="+r.toGMTString()):u="";document.cookie=n+"="+t+u+"; path=/"}catch(f){return null}},conversion:function(n){if(n){var t="cart_token="+n;$.ajax({url:"/api/convert",type:"POST",timeout:5e3,data:t})}},sevt:function(n,t){if(n){var r=$("#frmData #visitor_id").val(),i="visitor_id="+r+"&event_type="+n;t&&(i+="&event_value="+t);$.ajax({url:"/api/event",type:"POST",timeout:2e3,data:i})}},SendUtmData:function(){var n="";$("#frmData :input").each(function(){n+=$(this).attr("name")+"="+$(this).val()+"&"});$("#frmData[name=refer]").length==0&&Utils.readCookie("_refer")&&(n+="refer="+Utils.readCookie("_refer"));$.ajax({url:"/api/createorder",type:"POST",timeout:2e3,data:n})}};$.fn.showLoading=function(n){var t={icon:"fa fa-spin fa-spinner",text:"Please wait..."};return $.extend(t,t,n),this.each(function(){$icon='<i class="'+t.icon+'"><\/i>';$text=t.text;$valign=25;$obj=$('<div class="loading"><\/div>');$obj.html('<label style="top:45%;position:relative;">'+$icon+" "+$text+"<\/label>");$(this).append($obj)})};$.fn.hideLoding=function(){return this.each(function(){$(this).find(".loading").remove()})};typeof JSON!="object"&&(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function o(){return this.valueOf()}function s(n){return f.lastIndex=0,f.test(n)?'"'+n.replace(f,function(n){var t=h[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function u(i,f){var o,l,h,a,v=n,c,e=f[i];e&&typeof e=="object"&&typeof e.toJSON=="function"&&(e=e.toJSON(i));typeof t=="function"&&(e=t.call(f,i,e));switch(typeof e){case"string":return s(e);case"number":return isFinite(e)?String(e):"null";case"boolean":case"null":return String(e);case"object":if(!e)return"null";if(n+=r,c=[],Object.prototype.toString.apply(e)==="[object Array]"){for(a=e.length,o=0;o<a;o+=1)c[o]=u(o,e)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,o=0;o<a;o+=1)typeof t[o]=="string"&&(l=t[o],h=u(l,e),h&&c.push(s(l)+(n?": ":":")+h));else for(l in e)Object.prototype.hasOwnProperty.call(e,l)&&(h=u(l,e),h&&c.push(s(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}var c=/^[\],:{}\s]*$/,l=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,a=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,v=/(?:^|:|,)(?:\s*\[)+/g,f=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,r,h,t;typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=o,Number.prototype.toJSON=o,String.prototype.toJSON=o);typeof JSON.stringify!="function"&&(h={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(i,f,e){var o;if(n="",r="",typeof e=="number")for(o=0;o<e;o+=1)r+=" ";else typeof e=="string"&&(r=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return u("",{"":i})});typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(n,t){var r,u,i=n[t];if(i&&typeof i=="object")for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(u=walk(i,r),u!==undefined?i[r]=u:delete i[r]);return reviver.call(n,t,i)}var j;if(text=String(text),e.lastIndex=0,e.test(text)&&(text=text.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),c.test(text.replace(l,"@").replace(a,"]").replace(v,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse");})}()