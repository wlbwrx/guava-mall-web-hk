function Map() {
	this.obj = {};
	this.count = 0;
}
Map.prototype.put = function(key, value) {
	var oldValue = this.obj[key];
	if(oldValue == undefined) {
		this.count++;
	}
	this.obj[key] = value;
}
Map.prototype.get = function(key) {
	return this.obj[key];
}
Map.prototype.remove = function(key) {
	var oldValue = this.obj[key];
	if(oldValue != undefined) {
		this.count--;
		delete this.obj[key];
	}
}
Map.prototype.size = function() {
	return this.count;
}
var cacheCookie = {
	setCache: function(name, value, days) {
		var Days = days || 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(JSON.stringify(value)) + '; path=/' + "; expires=" + exp.toGMTString(); //直接设置
	},
	getCache: function(name) {
		var arr = document.cookie.split('; '); //多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
		if(arr && arr.length > 0){
			for(var i = 0; i < arr.length; i++) {
				var arr2 = arr[i].split('='); //原来割好的数组是：user=simon，再用split('=')分割成：user simon 这样可以通过arr2[0] arr2[1]来分别获取user和simon 
				if(arr2 && arr2[0] && arr2[0] == name) { //如果数组的属性名等于传进来的name
					return JSON.parse(unescape(arr2[1])); //就返回属性名对应的值
				}
			}
		}
		return null; //没找到就返回空
	},
	clearCookie: function() {
		var _hasClear = cacheCookie.getCache('hasClearCookie');
		if(_hasClear && _hasClear != '') {
			return;
		}
		var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));
		// 删除所有cookie  
		for(var i in rs) {
			document.cookie = rs[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; ";
		}
		cacheCookie.setCache('hasClearCookie', 'true', 90);
	}
}
var cacheSessionStorage = {
	setCache: function(name, value) {
		sessionStorage.setItem(name, escape(JSON.stringify(value)));
	},
	getCache: function(name) {
		var _value = sessionStorage.getItem(name);
		if(_value && _value != '') {
			return JSON.parse(unescape(_value));
		}
		return null;
	},
	removeCache : function(name){
		sessionStorage.removeItem(name);
	},
	canUse: function(){
		if(cacheSessionStorage.getCache('test')){
			return true;
		}
		try {
			cacheSessionStorage.setCache('test', 'testValue')
			return true;
		} catch (error) {
			return false;
		}
	}
}
var singleInfo = {
    data:{
        hostCustomerMap: null
    },
    // rem转px
    remTopx: function (){
        let docEl = document.documentElement, 
        // orientationchange方向改变事件(横屏或者是竖屏)
        // 判断窗口有没有orientationchange这个方法，有就赋值给一个变量，没有就返回resize方法。
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            let clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //把document的fontSize大小设置成跟窗口成一定比例的大小，从而实现响应式效果。
            //docEl.style.fontSize = 100 * (调试设备宽度 / 设计图宽度) + 'px';
            // 在写页面的过程中保持 调试设备宽度 等于 设计图宽度 就可以。
            // 这样就又可以愉快的使用123px是1.23rem的计算了
            if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
                    //TODO
                docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'; 
            }else{
                if(clientWidth == 375){
                    docEl.style.fontSize = 100 + "px"
                }else{
                    docEl.style.fontSize = 100 * (750 / 375) + 'px';
                }
            }
        };
        if (!document.addEventListener) return;
        //addEventListener事件方法接受三个参数：第一个是事件名称比如点击事件onclick，第二个是要执行的函数，第三个是布尔值
        window.addEventListener(resizeEvt, recalc, false); 
        //绑定浏览器缩放与加载时间
        document.addEventListener('DOMContentLoaded', recalc, false); 
    },
    // 接口请求
    urlMap: null,
    websitePrefix: function (){
        if(singleInfo.urlMap == null) singleInfo.initUrlMap();
		return singleInfo.urlMap.get(window.location.hostname) || 'http://' + window.location.hostname + ":8080";
    },
    initUrlMap: function (){
        singleInfo.urlMap = new Map();
        singleInfo.urlMap.put('172.30.41.141', 'http://172.30.11.67:18080');
        singleInfo.urlMap.put('172.30.11.67', 'http://172.30.11.67:18080');
        singleInfo.urlMap.put('172.30.31.6', 'http://172.30.11.67:18080');
		singleInfo.urlMap.put('www.buytapp.com', 'https://api.buytapp.com');
    },
    // 预测到达日期
    planTime: function(){
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    },
    // 倒计时
    countDownFunc: function (time, time24, time00){
        let s = setInterval(function (){
            let dates =  singleInfo.countTimeFunc(time, time24, time00, "spr-time-down");
            if(dates<=0) {
                clearInterval(s)
            }
        },50)
    },
    // 隨機生成商品售出數量
    getRadomInt: function() {
		return(Math.random(100) * 3600).toFixed();
    },
    buyCountPro: function(productId) {
        let e = new Date();
        return productId%400+600+e.getHours()+e.getMinutes()
    },
    countTimeFuncNew: function(time){
        // 记录商品上架时间戳
        let shelfTime = new Date(time.replace(/-/g, "/"))
        
        // console.log(shelfTime.getHours() + '时' + shelfTime.getMinutes() +'分'+ shelfTime.getSeconds() + '秒')
        // 记录当前时间戳
        let nowTime = Number(new Date().getTime())
        // 新定义一个当天的时间
        let newShelf = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate() + ' ' + shelfTime.getHours() + ':' + shelfTime.getMinutes() +':'+ shelfTime.getSeconds()
        // 获得当日24时的时间戳
        let nowTime24 = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
        // 获得当日0时的时间戳
        let nowTime00 = new Date(new Date(new Date().toLocaleDateString()).getTime());
        // console.log(nowTime24)
        // console.log(nowTime00)
        singleInfo.countDownFunc(newShelf, nowTime24.getTime(), nowTime00.getTime())
    },
    countTimeFunc: function (time, time24, time00, id){
        let date = new Date();
        let now = Number(date.getTime());  
        let endDate = new Date(time.replace(/-/g, "/"));//设置截止时间
        let end = Number(endDate.getTime());
        let leftTime = 0; //时间差  
        
        if(now > end){
            leftTime = (time24 - now) + (end - time00)
        }else{
            leftTime =  (end - now)
        }
        let d, h, m, s, ms;
        if(leftTime >= 0) {
            d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
            m = Math.floor(leftTime / 1000 / 60 % 60);
            s = Math.floor(leftTime / 1000 % 60);
            ms = Math.floor(leftTime % 1000);
            if(ms < 100) {
                ms = "0" + ms;
            }
            if(s < 10) {
                s = "0" + s;
            }
            if(m < 10) {
                m = "0" + m;
            }
            if(h < 10) {
                h = "0" + h;
            }
            //将倒计时赋值到div中
            document.getElementById(id).innerHTML = "<span>" + h + "</span>" + ":" + "<span>" +  m + "</span>" + ":" + "<span>" +  s + "."+  (parseInt(ms/100)) + "</span>";
        } else {
            
            // 截止时触发的事件 重新开始
            document.getElementById(id).innerHTML = '活動進行中'
        }
        //递归每秒调用countTime方法，显示动态时间效果
        return leftTime
    },
    // 预计到达时间
    logisticsDeliveryTime: function(day1,day2,type){
        let date = new Date(),date2 = new Date();
        //这里的14就是你要加的天数，减也可以。年、月会相应加上去，值得注意的是date.getMonth()得到的月份比实际月份小1，所以实际月份是(date.getMonth()+1)
        // 設置預計到達時間1
        date.setDate(date.getDate() + day1);
        // 設置預計到達時間2
        date2.setDate(date2.getDate() + day2);
        let startMonth = (date.getMonth() + 1)  < 10 ?  ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1),endMonth = (date2.getMonth() + 1)  < 10 ?  ('0' + (date2.getMonth() + 1)) : (date2.getMonth() + 1)
        let startDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),endDate = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
        let startTime = date.getFullYear() + "." + startMonth + '.' + startDate
        let endTime = date2.getFullYear() + '.' + endMonth + '.' + endDate
        if(type == "TW"){
            return '預計'+ startTime + '~'+ endTime +'送達'
        }else if(type == 'EN'){
            return 'Expect to arrive on ' + startTime + '~' + endTime
        }else if(type == 'JAN'){
            return '10-15営業日到着'
        }
    },


    hkRegion : function () {
  
        let areaList = [
            {
                regionName:"新界",
                codeList:[100000,120000,130000,180000,220000,230000,250000,270000,290000]
            },
            {
                regionName:"離島",
                codeList:[200000,210000]
            },
            {
                regionName:"九龍半島",
                codeList:[150000,160000,170000,240000,280000]
            },
            {
                regionName:"香港島",
                codeList:[110000,140000,190000,260000,300000]
            },
        ]
        return areaList
    },
   
    hkCity : function () {
        let areaList = [
            {"provinceName":"北區","code":100000,"cityName":["北區","打鼓领","粉嶺","古洞","坪輋","沙头角","上水","文锦渡"]},
            {"provinceName":"長洲區","code":110000,"cityName":["長洲"]},
            {"provinceName":"大埔區","code":120000,"cityName":["大埔","太和"]},
            {"provinceName":"大嶼山區","code":130000,"cityName":["昂坪","貝澳","長沙","赤臘角","大澳","大澳碼頭","大嶼山","東涌","馬灣","梅窝","梅窝碼頭","石壁","塘福","天壇大佛","香港廸士尼","香港國際機場","愉景灣","竹篙灣"]},
            {"provinceName":"東區","code":140000,"cityName":["北角","柴灣","炮台山","筲箕灣","太古","太古城","天後","西灣河","小西灣","杏花村","鰂魚涌"]},
            {"provinceName":"觀塘區","code":150000,"cityName":["觀塘","九龍灣","藍田","牛頭角","順利","秀茂坪","油塘"]},
            {"provinceName":"黃大仙區","code":160000,"cityName":["彩虹","慈雲山","橫頭磡","黃大仙","樂富","牛池灣","新蒲崗","鑽石山"]},
            {"provinceName":"九龍城區","code":170000,"cityName":["何文田","紅磡","黃埔","九龍城","九龍塘","馬頭圍","啟德","土瓜灣"]},
            {"provinceName":"葵青區","code":180000,"cityName":["葵芳","葵興","葵涌","葵涌貨櫃碼頭","荔景","青衣","青衣嘉民領達中心"]},
            {"provinceName":"南區","code":190000,"cityName":["薄扶林","赤柱","舂坎角","大潭","華富","黃竹坑","淺水灣","深水灣","石澳","香港仔","鴨脷洲"]},
            {"provinceName":"南丫島區","code":200000,"cityName":["南丫島"]},
            {"provinceName":"坪洲區","code":210000,"cityName":["坪洲"]},
            {"provinceName":"荃灣區","code":220000,"cityName":["大窩口","荃灣","深井","汀九"]},
            {"provinceName":"沙田區","code":230000,"cityName":["大圍","禾輋","火炭","九肚山","馬鞍山","馬料水","沙田","石門","小瀝源"]},
            {"provinceName":"深水埗區","code":240000,"cityName":["昂船洲","長沙灣","荔枝角","美孚","南昌","深水埗","石硤尾"]},
            {"provinceName":"屯門區","code":250000,"cityName":["大欖","大欖涌","藍地","龍鼓灘","掃管笏","屯門","屯門內河碼頭","小欖","新墟"]},
            {"provinceName":"灣仔區","code":260000,"cityName":["大坑","跑馬地","銅鑼灣","灣仔","香港會議展覽中心"]},
            {"provinceName":"西貢區","code":270000,"cityName":["寶琳","調景嶺","將軍澳","康城","坑口","清水灣","西貢"]},
            {"provinceName":"油尖旺區","code":280000,"cityName":["大角咀","尖沙咀","柯士甸","太子","旺角","油麻地","佐敦"]},
            {"provinceName":"元朗區","code":290000,"cityName":["八鄉","大棠","洪水橋","錦上路","錦田","林村","流浮山","落馬洲","米埔","牛潭尾","屏山","石崗","天水圍","廈村","新田","元朗"]},
            {"provinceName":"中西區","code":300000,"cityName":["半山","堅尼地城","金鐘","山頂","山頂盧吉道","上環","西環","西營盤","中環"]}
        ]
        return areaList
    },
    // ////////////////////
    // 台灣  市  區
    provinceAcity: function(){
        let areaList = [
            {
                "provinceName":"高雄市",
                "code": "170000",
                "cityName": [
                   "新興區","前金區","苓雅區","鹽埕區","鼓山區","旗津區","前鎮區","三民區","楠梓區","小港區","左營區","仁武區","大社區","東沙群島","南沙群島","岡山區","路竹區","阿蓮區","田寮區","燕巢區","橋頭區","梓官區","彌陀區","永安區","湖內區","鳳山區","大寮區","林園區","鳥松區","大樹區","旗山區","美濃區","六龜區","內門區","杉林區","甲仙區","桃源區","那瑪夏區","茂林區","茄萣區"
                ]
            },
            {
                "provinceName":"花蓮縣",
                "code": "220000",
                "cityName": [
                    "花蓮市","新城鄉","秀林鄉","吉安鄉","壽豐鄉","鳳林鎮","光復鄉","豐濱鄉","瑞穗鄉","萬榮鄉","玉里鎮","卓溪鄉","富里"
                ]
            },{
                "provinceName":"基隆市",
                "code": "520000",
                "cityName":["仁愛區","信義區","中正區","中山區","安樂區","暖暖區","七堵區"]
            },{
                "provinceName":"嘉義市",
                "code": "130000",
                "cityName":["東區","西區"]
            },{
                "provinceName":"嘉義縣",
                "code": "140000",
                "cityName":[
                    "番路鄉","梅山鄉","竹崎鄉","阿里山鄉","中埔鄉","大埔鄉","水上鄉","鹿草鄉","太保市","朴子市","東石鄉","六腳鄉","新港鄉","民雄鄉","大林鎮","溪口鄉","義竹鄉","布袋鎮"]
            },{
                "provinceName":"金門縣",
                "code": "190000",
                "cityName":["金沙鎮","金湖鎮","金寧鄉","金城鎮","烈嶼鄉","烏坵鄉"]
            },{
                "provinceName":"連江縣",
                "code": "540000",
                "cityName":["南竿鄉","北竿鄉","莒光鄉","東引鄉"]
            },{
                "provinceName":"苗栗縣",
                "code": "590000",
                "cityName":["竹南鎮","頭份市","三灣鄉","南庄鄉","獅潭鄉","後龍鎮","通霄鎮","苑裡鎮","苗栗市","造橋鄉","頭屋鄉","公館鄉","大湖鄉","泰安鄉","銅鑼鄉","三義鄉","西湖鄉","卓蘭鎮"]
            },{
                "provinceName":"南投縣",
                "code": "120000",
                "cityName":["南投市","中寮鄉","草屯鎮","國姓鄉","埔里鎮","仁愛鄉","名間鄉","集集鎮","水里鄉","魚池鄉","信義鄉","竹山鎮","鹿谷鄉"]
            },{
                "provinceName":"澎湖縣",
                "code": "180000",
                "cityName":["馬公市","西嶼鄉","望安鄉","七美鄉","白沙鄉","湖西鄉"]
            },{
                "provinceName":"屏東縣",
                "code": "200000",
                "cityName": [
                    "屏東市","三地門鄉","霧臺鄉","瑪家鄉","九如鄉","里港鄉","高樹鄉","鹽埔鄉","長治鄉","麟洛鄉","竹田鄉","內埔鄉","萬丹鄉","潮州鎮","泰武鄉","來義鄉","萬巒鄉","崁頂鄉","新埤鄉","南州鄉","林邊鄉","東港鎮","琉球鄉","佳冬鄉","新園鄉","枋寮鄉","枋山鄉","春日鄉","獅子鄉","車城鄉","牡丹鄉","恆春鎮","滿州鄉"
                ]
            },{
                "provinceName":"臺北市",
                "code": "510000",
                "cityName":["中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區"]
            },{
                "provinceName":"桃園市",
                "code": "580000",
                "cityName":["中壢區","平鎮區","龍潭區","楊梅區","新屋區","觀音區","桃園區","龜山區","八德區","大溪區","復興區","大園區","蘆竹區"]
            },{
                "provinceName":"臺中市",
                "code": "100000",
                "cityName":["中區","東區","南區","西區","北區","北屯區","西屯區","南屯區","太平區","大里區","霧峰區","烏日區","豐原區","后里區","石岡區","東勢區","和平區","新社區","潭子區","大雅區","神岡區","大肚區","沙鹿區","龍井區","梧棲區","清水區","大甲區","外埔區","大安區"]
            },{
                "provinceName":"臺南市",
                "code": "160000",
                "cityName":["中西區","東區","南區","北區","安平區","安南區","永康區","歸仁區","新化區","左鎮區","玉井區","楠西區","南化區","仁德區","關廟區","龍崎區","官田區","麻豆區","佳里區","西港區","七股區","將軍區","學甲區","北門區","新營區","後壁區","白河區","東山區","六甲區","下營區","柳營區","鹽水區","善化區","大內區","山上區","新市區","安定區"]
            },{
                "provinceName":"臺東縣",
                "code": "210000",
                "cityName":["臺東市","綠島鄉","蘭嶼鄉","延平鄉","卑南鄉","鹿野鄉","關山鎮","海端鄉","池上鄉","東河鄉","成功鎮","長濱鄉","太麻里鄉","金峰鄉","大武鄉","達仁鄉"]
            },{
                "provinceName":"新北市",
                "code": "530000",
                "cityName":["萬里區","金山區","板橋區","汐止區","深坑區","石碇區","瑞芳區","平溪區","雙溪區","貢寮區","新店區","坪林區","烏來區","永和區","中和區","土城區","三峽區","樹林區","鶯歌區","三重區","新莊區","泰山區","林口區","蘆洲區","五股區","八里區","淡水區","三芝區","石門區"]
            },{
                "provinceName":"新竹市",
                "code": "560000",
                "cityName":["東區","北區","香山區"]
            },{
                "provinceName":"新竹縣",
                "code": "570000",
                "cityName":["竹北市","湖口鄉","新豐鄉","新埔鎮","關西鎮","芎林鄉","寶山鄉","竹東鎮","五峰鄉","橫山鄉","尖石鄉","北埔鄉","峨眉鄉"]
            },{
                "provinceName":"宜蘭縣",
                "code": "550000",
                "cityName":["宜蘭市","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","羅東鎮","三星鄉","大同鄉","五結鄉","冬山鄉","蘇澳鎮","南澳鄉"]
            },{
                "provinceName":"雲林縣",
                "code": "150000",
                "cityName":["斗南鎮","大埤鄉","虎尾鎮","土庫鎮","褒忠鄉","東勢鄉","臺西鄉","崙背鄉","麥寮鄉","斗六市","林內鄉","古坑鄉","莿桐鄉","西螺鎮","二崙鄉","北港鎮","水林鄉","口湖鄉","四湖鄉","元長鄉"]
            },{
                "provinceName":"彰化縣",
                "code": "110000",
                "cityName":["彰化市","芬園鄉","花壇鄉","秀水鄉","鹿港鎮","福興鄉","線西鄉","和美鎮","伸港鄉","員林市","社頭鄉","永靖鄉","埔心鄉","溪湖鎮","大村鄉","埔鹽鄉","田中鎮","北斗鎮","田尾鄉","埤頭鄉","溪州鄉","竹塘鄉","二林鎮","大城鄉","芳苑鄉","二水鄉"]
            }
        ]
        return areaList
    },
    // 接口请求 get请求
    singleGetData: function(url,header){
        return new Promise(function(resolve, reject){
            axios.get(url, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            }).then( res =>{
                resolve(res)
            }).catch(error =>{
                reject(error)
            })
        })
    },
    // 接口请求 post请求
    singlePostData: function(url, params , header){
        return new Promise(function(resolve, reject){
            axios.post(url, params,{
                headers: header
            }).then(res =>{
                resolve(res)
            }).catch( error => {
                reject(error)
            })
        })
    },
    // 获得地址栏参数
    getURLParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return '';
    },
    // 手機號檢驗
    phoneIs: function(phoneNumber){
        var phoneReg = /^[2|3|5|6|7|8|9][0-9]\d{6}$/
		if(!phoneReg.test(phoneNumber)){
            alert('手機號格式有誤')
            return false;
        }else{
            return true;
        }
    },
    // 判斷平台
    getPlatform: function(){
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
            return 'IOS';
        }else if (/(Android)/i.test(navigator.userAgent)){ 
            return 'Android';
        }else{ 
            return 'PC';
        };
    },
    initHostCustomerMap: function() {
        singleInfo.data.hostCustomerMap = new Map();
        singleInfo.data.hostCustomerMap.put('www.baleshop.tw', '417588292007052');
        singleInfo.data.hostCustomerMap.put('www.balebeauty.com.tw', '417588292007052');
        singleInfo.data.hostCustomerMap.put('www.blmall.tw', '551475355229000');
        singleInfo.data.hostCustomerMap.put('www.buytapp.com', '116515360197453');
        singleInfo.data.hostCustomerMap.put('young.91up.com.tw', '208138336429165');
        singleInfo.data.hostCustomerMap.put('www.91da.com.tw', '100842271337458');
    },
    getCustomerIdByHost: function() {
        if(singleInfo.data.hostCustomerMap == null) singleInfo.initHostCustomerMap();
        return singleInfo.data.hostCustomerMap.get(window.location.hostname) || '116515360197453';
    },
    // 監測
    addMonitor: function(data, event) {
		if(location.href.indexOf('consignee') > -1 && location.href.indexOf('district') > -1){return}
		if(data.eventName == 'SHOW' && data.aimsCategory == 'BANNER'){return}
		if(data.eventName == 'CLICK' && data.aimsCategory == 'PRODUCT'){return}
		var body = document.getElementsByTagName('body')[0];
		var log_pic = document.createElement('img');
		if(!data.aimsFromUrl || data.aimsFromUrl == ''){
			data['aimsFromUrl'] = encodeURIComponent(location.href);
		}else{
			data['aimsFromUrl'] = encodeURIComponent(data.aimsFromUrl);
		}
		log_pic.src = singleInfo.websitePrefix() + '/api/monitor/ut' + singleInfo.jsonToParameString(data);
		body.appendChild(log_pic);
		body.removeChild(log_pic);
    },
    addMonitorData: function(data,event) {
       
		data.map(function(e){
			if(data.aimsFromUrl == undefined || data.aimsFromUrl == ''){
                e.aimsFromUrl = location.href
			}
        });
        singleInfo.singlePostData(singleInfo.websitePrefix() + "/api/monitor", JSON.stringify(data),{'Content-Type': 'application/json;charset=UTF-8'}).then(res =>{

        })
	},
    jsonToParameString:function(json){
        var parameStr = '?';
        for(var i in json){
			if(typeof json[i] == 'object'){
				parameStr += i + '=' + encodeURI(JSON.stringify(json[i])) + '&'; 
			}else{
				parameStr += i + '=' + encodeURI(json[i]) + '&'; 
			} 
        }
        parameStr = parameStr.substring(0,parameStr.length - 1);
        return parameStr;
	},
    getFbPiexId: function() {
        singleInfo.initUrlPiexId();
		return singleInfo.fbPiexId;
	},
    initUrlPiexId: function() {
		var urlFbPiexId = singleInfo.getURLParam('pixelId');
		if(urlFbPiexId && urlFbPiexId.trim() != '') {
			cacheCookie.setCache('pixelId', urlFbPiexId, 28);
			singleInfo.fbPiexId = urlFbPiexId;
		} else {
			singleInfo.fbPiexId = cacheCookie.getCache('pixelId') || singleInfo.fbPiexId;
		}
    },
    getGATracking : function(){
		var GATrackingIdMap = new Map();
		GATrackingIdMap.put('www.vvshop.vip' , 'UA-117174835-2');
		GATrackingIdMap.put('www.blmall.tw' , 'UA-117174835-3');
		GATrackingIdMap.put('www.blshop.tw' , 'UA-117174835-4');
		GATrackingIdMap.put('www.blshop.com.tw' , 'UA-117174835-5');
		GATrackingIdMap.put('www.buytapp.com' , 'UA-117174835-7');
		var _hostname = window.location.hostname;
		return GATrackingIdMap.get(_hostname) || 'UA-117174835-7';
    },
    addUtJsAsync(path) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        script.async = true;
        head.appendChild(script); /*添加到HTML中*/
    }
}
singleInfo.remTopx()

// 旧的js
var commonConfig = {
	urlMap: null,
	hostCustomerMap: null,
	fbPiexId: '1053925108375173', //线上
	websitePrefix: function() {
		if(commonConfig.urlMap == null) commonConfig.initUrlMap();
		return commonConfig.urlMap.get(window.location.hostname) || 'http://' + window.location.hostname + ":8080";
	},
	initUrlMap: function() {
		commonConfig.urlMap = new Map();
        commonConfig.urlMap.put('172.30.30.155', 'http://172.30.11.67:18080');
        commonConfig.urlMap.put('172.30.30.207', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('172.30.11.67', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('127.0.0.1', 'http://172.30.30.176:8080');
		commonConfig.urlMap.put('www.buytapp.com', 'https://api.buytapp.com');
	},
	initHostCustomerMap: function() {
		commonConfig.hostCustomerMap = new Map();
		commonConfig.hostCustomerMap.put('www.buytapp.com', '116515360197453');
	},
	getFbPiexId: function() {
		commonConfig.initUrlPiexId();
		return commonConfig.fbPiexId;
	},
    getGATracking : function(){
        var GATrackingIdMap = new Map();
        GATrackingIdMap.put('www.buytapp.com' , 'UA-117174835-7');
        var _hostname = window.location.hostname;
        return GATrackingIdMap.get(_hostname) || 'UA-117174835-7';
    },
    /**
     * HTML动态加载js
     * @path {String} src 地址必须带有后缀名.js
     * */
    addUtJsAsync(path) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        script.async = true;
        head.appendChild(script); /*添加到HTML中*/
    },
	initUrlPiexId: function() {
		var urlFbPiexId = singleInfo.getURLParam('pixelId');
		if(urlFbPiexId && urlFbPiexId.trim() != '') {
			cacheCookie.setCache('pixelId', urlFbPiexId, 28);
			commonConfig.fbPiexId = urlFbPiexId;
		} else {
			commonConfig.fbPiexId = cacheCookie.getCache('pixelId') || commonConfig.fbPiexId;
		}
	},
	havDepletion: function(){
		var removeDepletionHostData = [];
		var state = 0;
		removeDepletionHostData.map(function(e){window.location.hostname == e && state++;});
		return state == 1 ? false : true;
	},
}
