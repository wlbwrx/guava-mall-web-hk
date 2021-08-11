var kit = {
        httpDo: function (url, bd, type) {
            if (typeof(bd) == "funciton") bd = new db();
            url = httppre + url;
            return $.ajax({
                type: type || (bd ? "POST" : "GET"),
                url: url,
                data: bd,
                xhrFields: {
                    withCredentials: true
                }
            })
        }
        ,errorFn : function(text){
            $('.alert').html(text).show().css({
                'margin-top':-$('.alert').outerHeight()/2+'px'
            });

            setTimeout(function(){
                $('.alert').hide();
            },2000)
        }
        ,setCache : function (module, key, val) {
            // ios 上 开启无痕模式 localstorage 无法操作,改用cookie
            var self = this;
            var cache = self.getCache(module);
            if (cache == null) {
                cache = {};
            }
            cache[key] = val;
            var Days = 30; 
            var exp = new Date(); 
            exp.setTime(exp.getTime() + Days*24*60*60*1000); 
            document.cookie = module + "="+ escape(JSON.stringify(cache)) + ";expires=" + exp.toGMTString();
        }
        ,getCache : function (module, key) {
            var arr,reg=new RegExp("(^| )"+module+"=([^;]*)(;|$)");
            var cache;
            var val;
            if(arr=document.cookie.match(reg)){
                if(key != undefined){
                    cache = JSON.parse(unescape(arr[2]));
                    val = cache[key];
                }else{
                    val = JSON.parse(unescape(arr[2]));
                }
                return val; 
            }else{
                return null;
            }
        }
        ,tpl : function(selector, data){
            if (data == undefined || data == null) {
                data = {}
            }
            var tpl = $(selector).text();
            var html = _.template(tpl)({
                d: data
            });
            return html;
        }
        ,warning : function (ta) {
            ta.focus();
            ta.removeClass("anim_image_glow").addClass("anim_image_glow");
            $(ta).on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend", function () {
                $(this).removeClass("anim_image_glow");
            });
        }
        ,clearCache : function (module) {
            var self = this;
            //window.localStorage.removeItem(module);
            var exp = new Date(); 
            exp.setTime(exp.getTime() - 1);
            var cval=self.getCache(module);
            if(cval!=null) 
            document.cookie= module + "="+cval+";expires="+exp.toGMTString();
        }
        ,currency : {
            USD : 'US$',
            TWD : 'NT $',
            JPY : '円',
            AUD : '$',
            CHF : 'CHF',
            CZK : 'Kč',
            DKK : 'kr',
            EUR : '€',
            GBP : '£',
            HKD : '$',
            HUF : 'Ft',
            ILS : '₪',
            CAD : '$',
            MXN : '$',
            NOK : 'kr',
            NZD : '$',
            PHP : '₱' ,
            PLN : 'zł',
            RUB : 'RUB',
            SEK : 'kr',
            SGD : '$',
            THB : '฿',
            CNY : '¥'
        }
        ,getUrlParam : function (paramName) {
            var url = location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {}
            var j = null;
            for (var i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
            }
            var returnValue = paraObj[paramName.toLowerCase()];
            if (typeof (returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        },
        getWholeParam : function(url){
            var param = url.split('?')[1];
            if(param == undefined){
                param = '';
            }
            return param;
        },
        goBack : function(){
            $('#goBack').on('click',function(){
                 window.history.go(-1);
            })
        },
        generateGuid : function() { //UID
            var self = this;
            var guid = '';
            var time = new Date().getTime().toString();   
            time = time.substring(time.length - 3, time.length);
            var now = self.dateFormat(new Date(), "yyyyMMddHHmmss");
            guid = now + time + self.randomNumeric(6) + self.randomNumeric(6) + self.randomNumeric(6);
            return guid.toString();
        },
        dateFormat : function (time,fmt) { 
            var format = fmt;
            var date = new Date(time);
            var o = {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(), //day
                "h+" : date.getHours(), //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3), //quarter
                "S" : date.getMilliseconds() //millisecond
            };
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o){
                if(new RegExp("("+ k +")").test(format)){
                    format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        },
        randomNumeric : function(len){
            var num = '';
            var numLen = len;
            for(var i=0;i<numLen;i++){
               num += Math.floor(Math.random()*10);
            } 
            return num;
        },
        pageName : function(){
            var a = location.href;
            var b = a.split("/");
            var c = b.slice(b.length-1, b.length).toString(String).split(".");
            return c.slice(0, 1)[0];
        },
        recordTime: function(date1, date2 ,url){
            var self = this;

            var responseTime = parseInt(date2 - date1);
            var responseParam = {
                "requestUri" : url,
                'responseMilliTime' : responseTime
            }
            self.httpDo('/monitor/record',{param: JSON.stringify(responseParam)},'Post');
        }
    }

    