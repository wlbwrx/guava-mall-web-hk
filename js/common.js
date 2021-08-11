// 配置参数
var configurationParameter = {
	shopcart_countdown: 20 * 60000,  //分钟转毫秒
	currencyName: {'TWD': 'NT$','HKD': 'HK$','CNY': '¥','USD': '$'},  //国际化
	luxuryHost: 'luxury.91up.com.tw',  //轻奢 域名
}



/**
 *  JS 模拟MAP
    var map = new Map();
	map.put("key","map");
	map.put("key","map1");
	alert(map.get("key"));   //map1
	map.remove("key");
	alert(map.get("key"));   //undefined
 */
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
		commonConfig.urlMap.put('172.30.31.6', 'http://172.30.11.67:18080');
		
		commonConfig.urlMap.put('172.30.41.141', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('172.30.11.67', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('172.30.41.86', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('127.0.0.1', 'http://172.30.11.67:18080');
		commonConfig.urlMap.put('www.buytapp.com', 'https://api.buytapp.com');
	},
	initHostCustomerMap: function() {
		commonConfig.hostCustomerMap = new Map();
		commonConfig.hostCustomerMap.put('www.buytapp.com', '116515360197453');
	},

	getCustomerIdByHost: function() {
		if(commonConfig.hostCustomerMap == null) commonConfig.initHostCustomerMap();
		return commonConfig.hostCustomerMap.get(window.location.hostname) || '116515360197453';
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
		var urlFbPiexId = tools.getURLParam('pixelId');
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
// 用來判斷頁面朝向的參數
var scrollAction = {x: 'undefined', y: 'undefined'}, scrollDirection;
// //////////////////
var tools = {
	// 打开搜索页面
	initSearch: function(){
		if($$('meta[name="searchTool"]').length > 0) {
			$$('<a id="initSearch" class="text-icon-options" href="javascript:void(0)"><img src="../image/icon/search-1.png"><span class="text-foot">搜索</span></a>').appendTo('.mdui-toolbar-title .top-right-options');
			$$("#initSearch").off().on("click",function(){
				tools.openSearch()
			})
		}
	},
	openSearch: function(){
		window.location.href = "../shop/search.html"
	},
	testSearch: function(val){
		return /^[\u4e00-\u9fa5a-zA-Z0-9\s\/（）()-]+$/.test(val)
	},
	focusSearch: function(){
		$$(document).ready(function() {
			var last;
			$$('.search_box .search_input')
			.after('<img src="../image/icon/input-del.png" style="display:none" class="search_input_del"/>')
			.on('focus' , function(){
				$$(this).css({
					'opacity': 1
				})
				.parent().parent().find('.search_box_bg').hide()
				if($$(this).val() != ''){
					$$(this).next().show()
				}
			})
			.on('blur' , function(){
				if($$(this).val().trim() == ''){
					$$(this).css({
						'opacity': 0
					}).parent().parent().find('.search_box_bg').show()
				}
			})
			.on('keyup', function(event){
				var val = $$(this).val().trim()
				if(val == ''){
					$$(this).next().hide()
					return
				}else{
					$$(this).next().show()
				}
				if(event.keyCode ==13){
					// 規則校驗 中英數字空格
					if(!tools.testSearch(val)){
						mdui.snackbar({message: '不可以輸入特殊符號哦...',position: 'top'});
						return
					}
					window.location.href = "../shop/s_list.html?key=" + escape(val.trim())
				}
			})
			.next()
			.on('click', function(){
				$$(this).prev().val('')[0].focus()
				$$(this).hide()
			})
			// $$('.search_input_del')
			if($$('.associate_box').length == 1){
				$$('.search_box .search_input')[0].oninput = function(event){
					var val = $$(this).val().trim()
					if(val == ''){
						return
					}
					if(!tools.testSearch(val)){
						return
					}
					last=event.timeStamp;
					setTimeout(function(){
						if(last-event.timeStamp==0){
							$$.ajax({
								url : commonConfig.websitePrefix() + '/search/product/associate?keyword=' + val,
								success: function (data) {
									if(data.body.associateList.length > 0){
										var html = ''
										data.body.associateList.map(function(e){
											var v_html = ''
											e.name.split(val).map(function(_e, i){
												v_html += (i > 0 ? '<span style="color:#777">'+val+'</span>' : '') + '<span>'+_e+'</span>'
											})
											html += `<div>
												<span>${v_html}</span>
												<i class="mdui-icon material-icons mdui-text-color-grey-500">keyboard_arrow_right</i>
											</div>`
										})
										window.alreadyScroll = window.scrollY
										$$('.associate_box').html(html).show().find('div').on('click', function(){
											var val = $$(this).find('span').text()
											window.location.href = "../shop/s_list.html?key=" + escape(val)
										})
									}else{
										$$('.associate_box').html('').hide()
									}
									if(window.location.pathname.indexOf('s_list.html') > -1){
										// 列表页
										if(data.body.associateList.length > 0){
											$$('.mdui-toolbar-tab').hide()
											$$('.mdui-empty').hide()
											$$('.mdui-number').hide()
											$$('.mdui-page-container').hide()
											$$('.mdui-appbar-with-toolbar').css('padding-top', '40px')
											window.scrollTo(0,0);
										}else{
											$$('.mdui-toolbar-tab').show()
											$$('.mdui-number').html() != '' && $$('.mdui-number').show()
											if($$('.mdui-page-container .module-31 .module-31-card').length == 0){
												$$('.mdui-empty').show()
											}else{
												$$('.mdui-page-container').show()
											}
											$$('.mdui-appbar-with-toolbar').css('padding-top', '81px')
											if(window.alreadyScroll){
												window.scrollTo(0,window.alreadyScroll);
											}
										}
									}else if(window.location.pathname.indexOf('search.html') > -1){
										// 搜索页
										if(data.body.associateList.length > 0){
											$$('.mdui-page-container').hide()
										}else{
											$$('.hot_list').text() != '' && $$('.hot_box').show()
											$$('.history_list').text() != '' && $$('.history_box').show()
										}
									}
								},
							});
						}
					}, 200);
				}
			}
			setTimeout(function(){
				$$('.search_box .search_input').trigger('click')[0].focus()
			},200);
		})
	},
	// 是否显示头部下载链接
	initDepletion: function(){
		// if (window.location.hostname != '127.0.0.1') {
		// if (window.location.hostname != 'www.buytapp.com') {
		// 	$$('body > .mdui-appbar').removeClass('mdui-appbar-scroll-toolbar-hide').addClass('stopAppBarScroll').find('.mdui-depletion').hide();
		// }
	},
	openTech: function(){
		if(tools.getPlatform() == 'Android'){
			// 监测,每次
			newMonitor.addMonitor({
				'eventAims':'Download',
				'eventName': 'CLICK',
				'aimsCategory': 'EVENT',
			});
			if(navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Chrome") == 78){
				$$('body').append('<a href="https://play.google.com/store/apps/details?id=io.dcloud.UNI7A85DF0" id="downLoad"></a>')
			}else{
				$$('body').append('<a href="../91up.apk" id="downLoad"></a>')
			}
			$$('#downLoad')[0].click()
			$$('#downLoad').remove()
			return
		}
		if(tools.getPlatform() == 'IOS'){
			// 监测,每次
			newMonitor.addMonitor({
				'eventAims':'Download_IOS',
				'eventName': 'CLICK',
				'aimsCategory': 'EVENT',
			});
			$$('body').append('<a href="https://apps.apple.com/cn/app/%E9%98%BF%E5%99%97%E7%89%B9%E8%B3%A3-%E4%BD%8E%E8%87%B31%E6%8A%98%E6%9C%8D%E9%A3%BE%E7%BE%8E%E5%A6%9D%E9%9E%8B%E5%8C%85%E9%85%8D%E9%A3%BE/id1481554817" id="downLoad"></a>')
			$$('#downLoad')[0].click()
			$$('#downLoad').remove()
			return
		}
		// PC
		if($$('.techView.view-bottom').length < 1){
			$$('body').append('<div class="techView view-bottom"><div class="view-bottom-box view-bottom-box-big view-move-in"><div class="view-bottom-head"><button class="close"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-back.png" class="close-pub"></button><span>下載APP</span><button><img style="height:28px" src="https://d3o2c7bn83e5x8.cloudfront.net/image/shareIcon-mini.jpg"/></button></div><div class="view-bottom-content tech-home"><div style="text-align:center; padding: 32px 0 2px;">使用LINE掃描下方QR碼，下載APP</div><img style="display:block; margin: 0 auto; width: 296px" src="https://d3o2c7bn83e5x8.cloudfront.net/image/download_qrcode.jpg"/></div></div></div>')
		}
		tipWindow.bottomView.open($$('.techView'));
	},
	closeTech: function(){
		$$('.mdui-depletion').hide();
		$$('.mdui-appbar-with-toolbar').css({'padding-top':$$('.mdui-appbar').height()+'px'})
		tools.loadCssCode('.mdui-appbar-scroll-toolbar-hide.mdui-headroom-unpinned-toolbar{-webkit-transform: translate3d(0,0,0)!important;transform: translate3d(0,0,0)!important;}','pageCustom-tech');
		return false
	},
	openTechTip: function(){
		if($$('.tech-tip.tip-center').length < 1){
			$$('body').append('<div class="tech-tip tip-center"><div class="tip-center-box"><div class="tip-center-head"><span>無法添加到主屏幕？</span></div><div class="tip-center-content tech-tip-content"><p>請確認手機設定裏，是否已授權您使用的瀏覽器添加快捷方式的權限。</p><p>壹般路徑為：【設定】-【xx瀏覽器】-打開【創建桌面快捷方式】權限。</p><button class="close">知道了</button></div></div></div>');
		}
		tipWindow.center.open($$('.tech-tip'));
	},
	initScopeInfo: function(callback){
		var p_name = tools.isSpHost() ? 'sp-scope' : 'scope'
		var scopeData = cacheSessionStorage.getCache(p_name);
		if(!scopeData){
			$$.ajax({
				url: commonConfig.websitePrefix() + '/api/aggregate/page/scope',
				success: function (data) {
					cacheSessionStorage.setCache(p_name , data.body);
					tools.initScopeTitle(data.body)
					callback && callback(data.body)
				}
			});
		}else{
			tools.initScopeTitle(scopeData);
			callback && callback(scopeData)
		}
	},
	initScopeTitle: function(scopeData){
		scopeData.name && scopeData.name != '' && (document.title = scopeData.name);
	},
	goBack: function(){
		history.go(-1);
		setTimeout(function(){
			window.location.href = '/';
		},300)
	},
	secrecyNow: function(){
		var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
		if (fs) {
			fs(window.TEMPORARY,100,function(){},function(){
				if(cacheSessionStorage.getCache('secrecyDone') != 'yes'){
					mdui.snackbar({message: '隱私/無痕模式效果會不太好哦!請切換到正常模式',position: 'top',timeout: 1000});
					cacheSessionStorage.setCache('secrecyDone', 'yes')
				}
			});
		}
	},
	postForm : function(URL, PARAMS){
		PARAMS.requestHost = window.location.host ;
		var temp = document.createElement("form");
        temp.action = URL;
        temp.method = "POST";
        temp.style.display = "NONE";
        for (var x in PARAMS) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = PARAMS[x];
            temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        return temp;
	},
	specialStringToArray: function(string){
		// 特殊字符串转换为数组
        var data = [];
        string.split(' &,& ').map(function(e){
            var _data = {};
            e.replace('{','').replace('}','').split(',').map(function(_e){
                var d = _e.split(':');
                var s = '';
                if(d[1] == 'http'){
                    s += d[1] + ':' + d[2];
                }else{
                    s += d[1];
                }
                _data[d[0]] = s;
            })
            data.push(_data);
        })
        return data;
	},
	gePosition: function(event){
		// 获取当前时间的点击位子
		var xy;
		if(event && event.clientX){
			xy = event.clientX + 'x' + event.clientY;
		}else{
			xy = null;
		}
		return xy;
	},
	initAffiliate: function() {
		// 初始化投放信息
		var _affiliate = tools.getURLParam('affiliate') || tools.getURLParam('utm_source') , 
			_pixelId = tools.getURLParam('pixelId'),
			_adlk = tools.getURLParam('adlk');
		if(_affiliate != '' && _pixelId != ''){
			_adlk = _adlk || '0';
		}
		if(_affiliate != ''){
			cacheCookie.setCache('affiliate', _affiliate, 28);
		}
		if(_pixelId != ''){
			cacheCookie.setCache('pixelId', _pixelId, 28);
		
		}
		if(_adlk != ''){
			cacheSessionStorage.setCache('adlk', _adlk);
			cacheCookie.setCache('adlk', _adlk, 3);
		}
	},
	initPageFontSize: function() {
		// 初始化页面字号
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
	},
	initToTopfunction: function() {
		if($$("#shopcart-cart").length==1){
			$$("#toTop").hide();
			return

		}
		// 初始化回到顶部按钮
		$$("<div id='toTop'><img src='https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-to-top.png' /></div>").appendTo('body');
		if((document.body.scrollTop || document.documentElement.scrollTop) == 0) {
			$$("#toTop").hide();
		}
		window.onscroll = function(event) {
			if(document.body.scrollTop <= 480 && document.documentElement.scrollTop <= 480) {
				$$("#toTop").hide();
			} else {
				$$("#toTop").show();
			}
		}
		$$("#toTop").on('click', function(e) {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		});
	},
	initCustomerService: function() {
		// 初始化客服按钮
		if($$('meta[name="customerService"]').length > 0) {
			$$("<a id='customer_service' class='text-icon-options' href='"+ (tools.getPlatform() == 'PC' ? "https://www.facebook.com/messages/t/" : "https://m.facebook.com/messages/thread/") + commonConfig.getCustomerIdByHost() + "' target='_blank'><img src='https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-customer-service.png' /><span class='text-service'>客服</span></a>")
			.appendTo('.mdui-toolbar-title .top-right-options');
	
			$$('#customer_service').on('click', function(e){
				newMonitor.addMonitor({
					'eventAims':'CUSTOM_SERVICE',
					'eventName': 'CLICK',
					'aimsCategory': 'EVENT',
				});
			});
		}
	},
	initAjaxSetup: function() {
		// AJAX默认设置
		// var host = tools.isSpHost() ? 'luxury.91up.com.tw' : window.location.host;
		$$.ajaxSetup({
			headers: {
				requestId: $$.guid(),
				requestTime: (new Date()).valueOf(),
				requestHost: window.location.host,
				userTerminal: 'h5'
			},
			dataType: 'json'
		});
	},
	isSpHost: function(){
		if(window.location.search.indexOf("luxury=true") > -1){
			return true
		}else{
			return false
		}
	},
	getPlatform: function(){
		if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
			return 'IOS';
		}else if (/(Android)/i.test(navigator.userAgent)){ 
			return 'Android';
		}else{ 
			return 'PC';
		};
	},
	getBrowerForm: function(){
		if(navigator.userAgent.indexOf('FBAV') > -1 || navigator.userAgent.indexOf("FBAN") > -1){
			return 'FB'
		}else{
			return ''
		}
	},
	getCurrencyName: function(name) {
		var temp = configurationParameter.currencyName[name];
		return '<span>' + (temp || 'HK$') + '</span>';
	},
	obj2key: function(obj, keys) {
		//将对象元素转换成字符串以作比较
		var n = keys.length,
			key = [];
		while(n--) {
			key.push(obj[keys[n]]);
		}
		return key.join('|');
	},
	uniqeByKeys: function(array, keys) {
		//對象數組去重操作
		var arr = [];
		var hash = {};
		for(var i = 0, j = array.length; i < j; i++) {
			var k = tools.obj2key(array[i], keys);
			if(!(k in hash)) {
				hash[k] = true;
				arr.push(array[i]);
			}
		}
		return arr;
	},
	shareFacebook: function() {
		window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(document.location.href) + '&t=阿噗購物', 'sharer', 'toolbar=0,status=0,width=626,height=436');
		return false;
	},
	addURLParam: function(name, val) {
		if(tools.getURLParam(name) == ''){
			return location.origin + location.pathname + location.search + (location.search == '' ? '?' : '&') + name + '=' + escape(val) + location.hash;
		}else{
			var data = [];
			location.search.replace(/\?/,'').split('&').map(function(e){
				data.push(e.split('=')[0] == name ? (name + '=' + val) : e	);
			});
			return location.origin + location.pathname + '?' + data.join('&') + location.hash;
		}
	},
	getURLParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return '';
	},
	loading: function(zindex) {
		$$.showOverlay(zindex || 6200);
		$$('<div class="loader"></div>').appendTo('body');
		$$('.mdui-overlay').on('click', function(){
			return false
		}).on('touch', function(){
			return false
		})
	},
	hideLoading: function() {
		$$.hideOverlay(true);
		$$('body .loader').remove();
	},
	loadCssCode: function(code,pageCustomVal){
		var style = document.createElement('style');
		style.type = 'text/css' , style.rel = 'stylesheet' , style.pageCustom = pageCustomVal;
		try{
			style.appendChild(document.createTextNode(code));
		}catch(ex){
			style.styleSheet.cssText = code;
		}
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(style);
	},
	removeCustomPageCssCode: function(){
		var styles = $$('style');
		$$.each(styles , function(index ,style){
			if(style.pageCustom && style.pageCustom == 'pageCustom'){
				style.remove();
			}
		});
	},
	getShopCartProductsNum: function(){
		var shoppingcartNum = 0;
		// console.log(getCache('orderProducts'))
		try {
			if(getCache('orderProducts')) {
				var products = getCache('orderProducts');
				$$.each(products, function(index , product) {
					if(!product.soldOut){
						shoppingcartNum += parseInt(product.quantity);
						if(product.presents){
							shoppingcartNum += product.presents.length;
						}
					}
				});
			}
		} catch(e) {
			console.log(e);
		}
		return shoppingcartNum;
	},
	getShopCartProductsPrice: function(){
		var shoppingcartPrice = 0;
		try {
			if(getCache('orderProducts')) {
				var products = getCache('orderProducts');
				$$.each(products, function(index , product) {
					if(product.isSelect && !product.soldOut){
						shoppingcartPrice +=   (product.price * parseInt(product.quantity));
					}
				});
			}
		} catch(e) {
			console.log(e);
		}
		return shoppingcartPrice;
	},
	scrollEvent: function(){
		// 新增方法为判断页面滚动方向
		if (typeof scrollAction.x == 'undefined') {
			scrollAction.x = window.pageXOffset;
			scrollAction.y = window.pageYOffset;
		}
		var diffX = scrollAction.x - window.pageXOffset;
		var diffY = scrollAction.y - window.pageYOffset;
		if (diffX < 0) {
			// Scroll right
			scrollDirection = 'right';
		} else if (diffX > 0) {
			// Scroll left
			scrollDirection = 'left';
		} else if (diffY < 0) {
			// Scroll down
			scrollDirection = 'down';
		} else if (diffY > 0) {
			// Scroll up
			scrollDirection = 'up';
		} else {
			// First scroll event
		}
		scrollAction.x = window.pageXOffset;
		scrollAction.y = window.pageYOffset;
	},
	getShopCartProductsShow: function(){
		var shoppingcartShow = false;
		try {
			if(getCache('orderProducts')) {
				var products = getCache('orderProducts');
				$$.each(products, function(index , product) {
					if(!product.soldOut){
						if(product.shoppingType==2&&product.isSelect){
							shoppingcartShow = true
						}
					}
				});
			}
		} catch(e) {
			console.log(e);
		}
		return shoppingcartShow;
	},
	getShopCartPrice: function(){
		var shoppingcartPrice = 0;
		try {
			if(getCache('orderProducts')) {
				var products = getCache('orderProducts');
				$$.each(products, function(index , product) {
					shoppingcartNum += parseInt(product.quantity);
					if(product.presents){
						shoppingcartNum += product.presents.length;
					}
				});
			}
		} catch(e) {
			console.log(e);
		}
		return shoppingcartNum;
	}
};
var newMonitor = {
	// 监测JS方式,需要remove
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
		log_pic.src = commonConfig.websitePrefix() + '/api/monitor/ut' + newMonitor.jsonToParameString(data);
		body.appendChild(log_pic);
		body.removeChild(log_pic);
	},
    addMonitorData: function(data,event) {
		data.map(function(e){
			if(!data.aimsFromUrl || data.aimsFromUrl == ''){
				e['aimsFromUrl'] = location.href;
			}
		});
		$$.ajax({
			url: commonConfig.websitePrefix() + "/api/monitor",
			method: 'POST',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify(data),
		});
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
	initDefaultEvents: function(){
		newMonitor.addMonitor({'aimsCategory': 'PAGE','eventName': 'OPEN'});
		var click_module = cacheSessionStorage.getCache("m_click_module");
		if(click_module){
			// 模块的点击监测
			newMonitor.addMonitor(click_module);
			cacheSessionStorage.removeCache('m_click_module');
		}
		var a_to_page = cacheSessionStorage.getCache("a_to_page");
		if(a_to_page){
			// 导航的点击监测
			newMonitor.addMonitor(a_to_page);
			cacheSessionStorage.removeCache('a_to_page');
		}
	}
};
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
var cacheLocalstorage = {
	setCache: function(name, value, days) {
		if(days <= 0) localStorage.removeItem(name);

		localStorage.setItem(name, escape(JSON.stringify(value)));
	},
	getCache: function(name) {
		var _value = localStorage.getItem(name);
		if(_value && _value != '') {
			return JSON.parse(unescape(_value));
		}
		return null;
	},
	removeCache : function(name){
		localStorage.removeItem(name);
	},
	canUse: function(){
		if(cacheLocalstorage.getCache('test')){
			return true;
		}
		try {
			cacheLocalstorage.setCache('test', 'testValue')
			return true;
		} catch (error) {
			return false;
		}
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
var tipWindow = {
	center:{
		open: function(dom){
			if(!dom.hasClass('tip-center')){
				return;
			}
			var that = this;
			$$('body').addClass('open-center');dom.show();
			dom.show().off().on('click' , function(e){
				e.target.classList[1] == 'tip-center' && that.close(dom)
			}).find('.close').off().on('click' , function(e){
				that.close(dom)
			});
		},   
		close: function(dom){
			if(!dom.hasClass('tip-center')){
				return;
			}
			$$('body').removeClass('open-center');dom.hide();
		},
	},
	screen:{
		open: function(dom){
			if(!dom.hasClass('tip-screen')){
				return;
			}
			var that = this;
			$$('body').addClass('open-screen');
			dom.find('.tip-screen-box').addClass('tip-screen-box-open').removeClass('tip-screen-box-close')
			dom.show().off().on('click' , function(e){
				e.target.classList[1] == 'tip-screen' && that.close(dom)
			}).find('.close').off().on('click' , function(e){
				that.close(dom)
			});
		},
		close: function(dom){
			if(!dom.hasClass('tip-screen')){
				return;
			}
			dom.find('.tip-screen-box').addClass('tip-screen-box-close').removeClass('tip-screen-box-open')
			$$('body').removeClass('open-screen');
			setTimeout(function(){dom.hide();},300)
		},
	},
	bottomView:{
		open: function(dom){
			if(!dom.hasClass('view-bottom')){
				return;
			}
			var that = this;
			dom.find('.view-bottom-box').removeClass('view-move-out').addClass('view-move-in');
			dom.css({'background':'rgba(0,0,0,.6)'}).show().off().on('click' , function(e){
				e.target.classList[1] == 'view-bottom' && that.close(dom)
			}).find('.close').off().on('click' , function(e){
				that.close(dom)
			});
		},
		close: function(dom){
			if(dom.hasClass('selectDetail')){
				$$(".seeDetail").css("display","block")
				$$(".info").css("line-height","1.15")
			}
			if(!dom.hasClass('view-bottom')){
				return;
			}
			dom.find('.view-bottom-box').removeClass('view-move-in').addClass('view-move-out');
			dom.css({'background':'transparent'});
			window.scrollTo(0,0);
			setTimeout(function(){dom.hide();},500)
		},
		closeDetail: function(dom){
			if(dom.hasClass('selectDetail')){
				$$(".seeDetail").css("display","block")
				$$(".info").css("line-height","1.15")
			}
			if(!dom.hasClass('view-bottom')){
				return;
			}
			dom.find('.view-bottom-box').removeClass('view-move-in').addClass('view-move-out');
			dom.css({'background':'transparent'});
			window.scrollTo(0,0);
			dom.hide()
		},
	}
}
function canLocalstorageUse() {
	try {
		localStorage.setItem('localStorage-test', 1);
		localStorage.removeItem('localStorage-test');
		return true;
	} catch(e) {
		return false;
	};
}
function setCache(name, value, days) {
	if(canLocalstorageUse()) {
		cacheLocalstorage.setCache(name, value, days);
	} else {
		cacheCookie.setCache(name, value, days);
	}
}
function getCache(name) {
	if(canLocalstorageUse()) {
		return cacheLocalstorage.getCache(name);
	} else {
		return cacheCookie.getCache(name);
	}
}
var footprint = {
	init: function(){
		if($$('meta[name="footprint"]').length > 0) {
			footprint.initFootBtn($$('.mdui-toolbar-title .top-right-options'));	
			$$('#footprint').on('click', function(){
				var userFootprint = cacheLocalstorage.getCache('userFootprint');
				if($$('body .footBox').length == 0){
					footprint.initFootBox(userFootprint || []);
					footprint.initClose();	
				}
			})
		}
	},
	closeFoot:function(){
		$$('.footBox').hide();
		$$('body').css({'overflow':'auto','height':'auto'});
	},
	initFootBtn: function(openFootBtn){
		openFootBtn.append('<a id="footprint" class="text-icon-options" href="javascript:void(0)"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/footprint.png"><span class="text-foot">足跡</span></a>');
		$$('#footprint').off().on('click', function(e){
			newMonitor.addMonitor({
				'eventAims': 'FOOT',
				'eventName': 'CLICK',
				'aimsCategory': "EVENT",
			});
			if($$('.mdui-tab-flex .mdui-tab-navport').css('display') == 'block'){
				$$('.mdui-tab-flex .mdui-btn.arrow-down')[0].click()
			}
			$$('.footBox').show();
			$$('body').css({'overflow':'hidden','height':'100vh'});
		});
	},
	initClose: function(){
		$$('.footBox').on('click', function(e){
			if(e.toElement.className == 'footBox'){
				footprint.closeFoot();
			}
		})
	},
	initFootBox: function(userFootprint){
		var html = '<div class="footBox"><div class="foot-close" onclick="footprint.closeFoot()"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-close2.png"></div><div class="foot-header">瀏覽過商品(' + userFootprint.length + ')</div><div class="foot-content"><div class="foot-content-scroll">';
		if(userFootprint.length>0){
			userFootprint.map(function(e,i){
				html += '<a href="../product/index.html?id=' + e.id + '"><div class="mdui-card mdui-card-product"><div class="mdui-card-media"><img src="' + e.productImageUrl + '"/></div>'
				html += '<div class="mdui-card-content mdui-card-product-content"><div class="mdui-card-product-title">' + e.title + '</div><div class="mdui-card-product-discountprice">' + e.minPrice + '</div>'
				if(e.originalPrice > e.minPrice){
					html += '<div class="mdui-card-product-orignalprice">' + e.originalPrice + '</div>'
				}
				html += '</div></div></a>'
			})
		}else{
			html += '<span style="margin: 100px 0;display: block;color: #bcbcbc;text-align: center;line-height:20px;">您還沒有<br/>瀏覽過任何商品喲</span>'
		}
		html += '</div></div></div>'
		$$('body').append(html)
	}
};
var leftNav = {
	init: function(){
		if($$('meta[name="nav"]').length > 0 ) {
			if($$('.mdui-appbar .mdui-toolbar-title').length){
				$$('.mdui-appbar .mdui-toolbar-title').css({
					'height': '40px !important',
					'line-height': '40px !important'
				}).find('.top-left-options').prepend('<div class="left"><a href="javascript:void(0)" onclick="leftNav.openMenu()" class="mdui-btn mdui-btn-icon"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-menu.png" class="menuIcon openMenu" /></a></div>')
				// 加载菜单
				leftNav.initNav();
			}else if($$('.mdui-appbar .mdui-toolbar').length){
				$$('.mdui-appbar .mdui-toolbar').css({
					'height': '40px !important',
					'line-height': '40px !important'
				}).prepend('<div class="left"><a href="javascript:void(0)" onclick="leftNav.openMenu()" class="mdui-btn mdui-btn-icon"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-menu.png" class="menuIcon openMenu" /></a></div>')
				// 加载菜单
				leftNav.initNav();
			}
		}
	},
	initNav: function(){
		leftNav.initNavBox();
		// leftNav.initNavLogo();
		leftNav.initNavList(function(){
			leftNav.initEvent();
		});
	},
	initEvent: function(){
		$$('.mdui-menu-left').off().on('click',function(e){
			if($$(e.toElement).hasClass('mdui-menu-left')){
				leftNav.closeMenu();
			}
		})

		// 展開二級
		$$('.mdui-menu-left .levelA:not(.spNav) > li').off().on('click',function(){
			$$('.mdui-menu-left .levelA:not(.spNav) > li').removeClass('active')
			$$(this).addClass('active')
		})
		$$('.mdui-menu-left .levelA.spNav > li').off().on('click',function(){
			$$('.mdui-menu-left .levelA.spNav > li').removeClass('active')
			$$(this).addClass('active')
		})

		// 切换
		$$('.mdui-menu-left .mdui-toolbar-title .menu-tab span').off().on('click', function(){
			var state = $$(this).hasClass('spNav');
			if(state){
				cacheSessionStorage.setCache('menu-left-tab-state' , 1);
				$$('.mdui-menu-left .navBox ul:not(.spNav)').hide()
				$$('.mdui-menu-left .navBox ul.spNav').show()
				$$('.mdui-menu-left .menu-tab span:not(.spNav)').removeClass('active')
				$$('.mdui-menu-left .menu-tab span.spNav').addClass('active')
			}else{
				cacheSessionStorage.setCache('menu-left-tab-state' , 0);
				$$('.mdui-menu-left .navBox ul:not(.spNav)').show()
				$$('.mdui-menu-left .navBox ul.spNav').hide()
				$$('.mdui-menu-left .menu-tab span:not(.spNav)').addClass('active')
				$$('.mdui-menu-left .menu-tab span.spNav').removeClass('active')
			}
			// 初始化二級
			var nav_list = $$('.navBox .levelA' + (state ? '.spNav' : ':not(.spNav)'))
			if(nav_list && nav_list.children('li.active').length == 0){
				// 默認選擇第一個
				var f_menu = nav_list.children('li').eq(1).find('a');
				if(f_menu.attr('index') == undefined){
					// 鏈接
					$$('.navBox .levelB' + (state ? '.spNav' : ':not(.spNav)')).html('<div>請選擇左側類目</div>');
				}else{
					// 按鈕
					f_menu.trigger('click')
				}
			}
		})
	},
	havSecNav: function(data){
		var state = 0;
		data.map(function(e){
			if(e.isShow == true){
				state++
			}
		})
		return state == 0 ? false : true
	},
	initNavDom: function(navData, isSp){
		var navListDom = '<ul class="levelA '+(isSp ? 'spNav' : '')+'">';
		navData.map(function(e,i){
			if(e.isLeftNavigation){
				navListDom += '<li>';
				if (e.childrens && leftNav.havSecNav(e.childrens)){
					navListDom += '<a href="javascript:void(0)" index="'+i+'"><span>'+e.name+'</span></a>'
				}else{
					navListDom += '<a href="../shop/index.html?id='+e.id+(isSp ? '&luxury=true' : '')+'" id="'+e.id+'" type="NAV_F">'+e.name+'</a>'
				}
				navListDom += '</li>';
			}
		})
		navListDom += '</ul><ul class="levelB '+(isSp ? 'spNav' : '')+'"></ul>';
		$$('.mdui-menu-left .navBox').append(navListDom);		
		$$('.mdui-menu-left .navBox .levelA'+(isSp ? '.spNav' : ':not(.spNav)')+' a').off().on('click', function(e){
			e.stopPropagation();
			var id = $$(this).attr('id');
			var index = $$(this).attr('index');
			if(id && id != ''){
				// 直接跳轉，監測
				cacheSessionStorage.setCache("a_to_page", {
					'eventAims': $$(this).attr('id'),
					'eventName': 'CLICK',
					'aimsFromUrl': location.href,
					'aimsCategory': $$(this).attr('type'),
				});
			}else if(index != undefined){
				// 打開子級
				$$(this).parent().trigger('click');
				leftNav.initNavDomB(navData[index], isSp);
			}
		});
	},
	initNavDomB: function(navBData, isSp){
		var html = '';
		if(navBData && navBData.childrens && navBData.childrens.length > 0){
			navBData.childrens.map(function(e){
				if(e.isShow){
					html += '<li><a href="../shop/list.html?pageId='+navBData.id+'&subId='+e.id+'" id="'+e.id+'" type="NAV_S"><div class="level_img_box"><img src="'+e.thumb+'"/></div><span>'+e.name+'</span></a></li>'
				}
			})
		}
		$$('.mdui-menu-left .navBox .levelB'+(isSp ? '.spNav' : ':not(.spNav)')).html(html);
	},
	initNavList: function(callback){
		var second_nav = cacheSessionStorage.getCache('second-nav');
		if(second_nav && second_nav.length){
			leftNav.initNavDom(second_nav);
			callback && callback();
		}else{
			$$.ajax({
				url: commonConfig.websitePrefix() + "/api/aggregate/page/secondaryNavigation",
				success: function(data) {
					cacheSessionStorage.setCache('second-nav' , data.body);
					if(data.body.length){
						leftNav.initNavDom(data.body);
						callback && callback();
					}
				}
			})
		}
		// sp
//		var second_nav_sp = cacheSessionStorage.getCache('second-nav-sp');
//		if(second_nav_sp && second_nav_sp.length){
//			leftNav.initNavDom(second_nav_sp, true);
//			callback && callback();
//		}else{
//			$$.ajax({
//				url: commonConfig.websitePrefix() + "/api/aggregate/page/secondaryNavigation",
//				headers: {
//					requestId: $$.guid(),
//					requestTime: (new Date()).valueOf(),
//					requestHost: configurationParameter.luxuryHost
//				},
//				success: function(data) {
//					cacheSessionStorage.setCache('second-nav-sp' , data.body);
//					if(data.body.length){
//						leftNav.initNavDom(data.body, true);
//						callback && callback();
//					}
//				}
//			})
//		}
	},
	initNavBox: function(){
		$$('body').append('<div class="mdui-menu-left"><div class="mdui-bar mdui-shadow-0"><div class="mdui-toolbar-title"><div class="top-left-options"><a class="text-icon-options" href="javascript:void(0)" onclick="leftNav.closeMenu();"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-close2.png"></a></div><div class="mdui-center mdui-valign menu-tab"><span>普品</span><span class="spNav">輕奢</span></div><div class="top-right-options"><a style="visible:hidden" class="text-icon-options" ><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-customer-service.png"></a></div></div></div><div class="navBox"></div></div>')
	},
	openMenu: function(){
		// 折叠导航二级
		if($$('.mdui-tab-flex .mdui-tab-navport').css('display') == 'block'){
			$$('.mdui-tab-flex .mdui-btn.arrow-down')[0].click()
		}
		// 切换初始化
		var tabState = cacheSessionStorage.getCache('menu-left-tab-state')
		if(tabState != undefined && tabState != null){
			if(tabState == 0){
				$$('.mdui-menu-left .mdui-toolbar-title .menu-tab span:not(.spNav)').trigger('click')
			}else if(tabState == 1){
				$$('.mdui-menu-left .mdui-toolbar-title .menu-tab span.spNav').trigger('click')
			}
		}else{
			$$('.mdui-menu-left .mdui-toolbar-title .menu-tab span:not(.spNav)').trigger('click')
		}
		// 展开 
		if($$('.navBox').find('li').length > 0){
			$$('.mdui-menu-left').show()
			$$('body').css({'overflow':'hidden','height':'100vh'})
		}
	},
	closeMenu: function(){
		$$('.mdui-menu-left').hide()
		$$('body').css({'overflow':'auto','height':'auto'})
	},
};
var ad = {
	data:{
		tel: cacheSessionStorage.getCache("userTel"),
		hadShowAdTip: cacheSessionStorage.getCache("showAd"),
		securityToken: cacheCookie.getCache("securityToken"),
		couponData: cacheSessionStorage.getCache('couponAd'),
		countdownNum: null,
	},
	init: function(){
		if($$('meta[name="ad"]').length == 0) {
			return false;
		}
		ad.initAd();
		ad.initTipBox();
	},
	initAd: function(){
		if(!ad.data.couponData){
			$$.ajax({
				url: commonConfig.websitePrefix() + "/api/coupon/scope",
				success: function(data) {
					cacheSessionStorage.setCache('couponAd' , data.body);
					ad.data.couponData = data.body
					ad.initAdBanner(data.body);
					ad.initAdBox(data.body);
				}
			})
		}else{
			ad.initAdBanner(ad.data.couponData);
			ad.initAdBox(ad.data.couponData);
		}
	},
	initAdBanner: function(couponData){
		$$('.mdui-appbar').addClass('.mdui-appbar-scroll-toolbar-hide')
		// if($$('.mdui-appbar.mdui-appbar-scroll-toolbar-hide .mdui-discount').length == 0){
		// 	$$('.mdui-appbar.mdui-appbar-scroll-toolbar-hide').prepend('<div class="mdui-toolbar"></div>');
		// }
		if(couponData.length == 0){
			$$('.mdui-tab-flex').css('height','auto');
		}else{
			var couponList = '';
			couponData.slice(0,3).map(function(e){
				var typeText = '';
				switch(e.couponType){
					case 10:typeText='滿'+e.amountRestrict+'可用';break;
					case 50:typeText='無門檻券';break;
					case 70:typeText='在線支付券';break;
				}
				couponList += '<div class="coupon-one"><span class="coupon-num">'+e.denomination+'</span><span class="coupon-type">'+typeText+'</span></div>'
			})
			$$('.mdui-appbar.mdui-appbar-scroll-toolbar-hide .mdui-toolbar').append('<div class="mdui-coupon"><span>新人專享<br/>優惠碼禮包</span><div class="coupon-ad-list">'+couponList+'</div><span>點擊<br/>領取</span></div>')
			new mdui.Headroom($$('.mdui-appbar.mdui-appbar-scroll-toolbar-hide'));
		}
		if($$('.mdui-toolbar').length > 0){
			if($$("#product-index").length>0){
				var isNum = 750/window.screen.width
				var isHeight = Math.round(100/isNum)+1
				tools.loadCssCode('.mdui-appbar-scroll-toolbar-hide.mdui-headroom-unpinned-toolbar {-webkit-transform: translate3d(0,-'+isHeight+'px,0)!important;transform: translate3d(0,-'+isHeight+'px,0)!important;}','pageCustom_common')
			}else{
				tools.loadCssCode('.mdui-appbar-scroll-toolbar-hide.mdui-headroom-unpinned-toolbar {-webkit-transform: translate3d(0,-'+$$('.mdui-toolbar').height()+'px,0)!important;transform: translate3d(0,-'+$$('.mdui-toolbar').height()+'px,0)!important;}','pageCustom_common')
			}

		}else{
			tools.loadCssCode('.mdui-appbar-scroll-toolbar-hide.mdui-headroom-unpinned-toolbar {-webkit-transform: none!important;transform: none!important;}','pageCustom_common')
		}
		$$('.mdui-appbar-with-toolbar').css({'padding-top':$$('.mdui-appbar').height()+'px'})

	},
	initAdBox: function(couponData){
		if($$('body .couponView').length == 0){
			$$('body').append('<div class="couponView view-bottom"><div class="view-bottom-box view-bottom-box-big"><div class="view-bottom-head"><button class="close"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-close2.png" class="close-pub"></button><span>領券中心</span><button class="success" style="visibility: hidden;">確定</button></div><div class="view-bottom-content"></div></div></div>')
		}
		// 獲取已發
		if(ad.data.tel){
			$$.ajax({
				url: commonConfig.websitePrefix() + "/api/coupon/scope/tel/" + ad.data.tel,
				success: function(data) {
					// 筛选出未发
					var couponData_un = [];
					couponData.map(function(e,i){
						var state = 0;
						for(var a = 0;a<data.body.length;a++){
							if(e.id == data.body[a].id){
								state++;
							}
						}
						if(state == 0){
							couponData_un.push(e);
						}
					})
					ad.data.couponData_sent = data.body;
					ad.data.couponData_unsent = couponData_un;
					ad.initAdEvent();
				}
			})
		}else{
			ad.data.couponData_sent = [];
			ad.data.couponData_unsent = couponData;
			ad.initAdEvent();
		}
		// 渲染dom
		var unsentHtml = '',
			sentHtml = '';
		if(ad.data.couponData_unsent.length > 0){
			unsentHtml = '<div class="couponBox"><p>可領優惠碼<span>註：所有金額為新臺幣</span></p><div class="coupon-list unsent">' +	ad.couponDataToHtml(ad.data.couponData_unsent,'領取') + '</div></div>';
		}
		if(ad.data.couponData_sent.length > 0){
			sentHtml = '<div class="couponBox"><p>已領優惠碼</p><div class="coupon-list sent">' + ad.couponDataToHtml(ad.data.couponData_sent,'已領')+'</div></div>';
		}
		$$('.couponView .view-bottom-content').html(unsentHtml + sentHtml)
	},
	couponDataToHtml: function(data,typeVal){
		var html = ''
		if(data && data.length){
			data.map(function(e,i){
				var typeText = '';
				switch(e.couponType){
					case 10:typeText='滿'+e.amountRestrict+'新臺幣減' + e.denomination;break;
					case 50:typeText='無門檻/直減券';break;
					case 70:typeText='在線支付券';break;
				}
				html += '<div class="coupon-list-one">'
				if(typeVal == '已領' && e.link && /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(e.link)){
					html += '<a href="'+e.link+'">'	
				}
				html += '<span class="denomination">'+e.denomination+'</span><div><span class="labelIcon"><i>全場通用</i></span><p><i>'+typeText+'</i></p></div><span class="line"></span><div class="couponBtn" data-index="'+i+'"><span>'+typeVal+'</span></div>'
				if(typeVal == '已領' && e.link && /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(e.link)){
					html += '</a>'	
				}
				html += '</div>'
			});
		}else{
			html = '暫無相關優惠碼' 
		}
		return html;
	},
	initAdEvent: function(){
		$$('.mdui-coupon').off().on('click' , function(e){
			ad.openBottomViev($$('.couponView'))
		});
		$$('.couponView .close').off().on('click' , function(e){
			ad.closeBottomViev($$('.couponView'))
		});
		$$('.couponView').off().on('click' , function(e){
			if(e.target.classList[1] == 'view-bottom'){
				ad.closeBottomViev($$('.couponView'))
			}
		});
		$$('.couponView .coupon-list.unsent .couponBtn').off().on('click' , function(e){
			var _this = $$(this),
			couponId = ad.data.couponData_unsent[_this.data('index')].id;
			if(ad.data.tel && cacheCookie.getCache("securityToken")){
				mdui.snackbar({
					message: '正在領取請稍後...',
					position: 'top'
				});
				ad.getCouponAjax(couponId,_this.data('index'));
			}else{
				ad.openTipBox();
				ad.openGetPhone(couponId);
			}
		});
	},
	openBottomViev: function(e){
		e.css({'background':'rgba(0,0,0,.6)'})
		e.show()
		e.find('.view-bottom-box').removeClass('view-move-out').addClass('view-move-in')
		$$('body').css({'overflow':'hidden','height':'100vh'})
	},   
	closeBottomViev: function(e){
		e.find('.view-bottom-box').removeClass('view-move-in').addClass('view-move-out')
		e.css({'background':'transparent'})
		setTimeout(function(){
			e.hide()
		},500)
		$$('body').css({'overflow':'auto','height':'auto'})
	},
	initTipBox: function(){
		if(!ad.data.couponData || ad.data.couponData.length == 0){
			return false;
		}
		if(!ad.data.tel || !ad.data.securityToken){
			var typeText = '';
			switch(ad.data.couponData[0].couponType){
				case 10:typeText='滿'+ad.data.couponData[0].amountRestrict+'新臺幣減' + ad.data.couponData[0].denomination;break;
				case 50:typeText='無門檻/直減券';break;
				case 70:typeText='在線支付券';break;
			}
			$$('body').append('<div class="tipBox-coupon"><div class="tip-content"><div class="tip-close">+</div><h4>您的專享優惠碼<span>所有金額為新臺幣</span></h4><div class="tip-coupon"><span class="coupon-num">'+ad.data.couponData[0].denomination+'</span><span class="coupon-type">'+typeText+'</span></div><button>立即領取</button></div></div>')
			if(!ad.data.hadShowAdTip){
				ad.openTipBox();
			}
			ad.data.hadShowAdTip = cacheSessionStorage.setCache("showAd",true),
			ad.initTipEvent();
		}
	},
	openTipBox: function(){
		$$('.tipBox-coupon').show();
	},
	closeTipBox: function(){
		$$('.tipBox-coupon').hide();
		ad.initAdBox(ad.data.couponData);
	},
	initTipEvent: function(){
		$$('.tipBox-coupon .tip-close').off().on('click',function(){
			ad.closeTipBox();
		})
		$$('.tipBox-coupon .tip-content button').off().on('click',function(){
			ad.openGetPhone(ad.data.couponData[0].id)
		})
	},
	openGetPhone: function(couponId){
		$$('.tipBox-coupon .tip-content').html('<div class="tip-close">+</div><h4>領取專享優惠碼<span class="tipInfo">優惠碼將與此手機號碼關聯使用，<br/>建議填寫本人常用手機號</span></h4><div class="tip-form"><input name="phone" placeholder="請輸入手機號"><div><input name="verify" placeholder="請輸入驗證碼"><button>獲取驗證碼</button></div></div><button>確定</button>')
		ad.initGetPhoneEvent(couponId)
	},
	initCountDownNum:function(dom,text,couponId){
		clearInterval(ad.countdownNum);
		dom.html(text + 's').off();
		ad.countdownNum = setInterval(function(){
			if(text > 1){
				text--;
				dom.html(text + 's');
			}else{
				text = '獲取驗證碼'
				dom.html(text)
				clearInterval(ad.countdownNum);
				ad.initGetPhoneEvent(couponId);
			}
		},1000)
	},
	initGetPhoneEvent: function(couponId){
		$$('.tipBox-coupon .tip-close').off().on('click',function(){
			ad.closeTipBox();
		})
		$$('.tipBox-coupon .tip-content .tip-form button').off().on('click',function(){
			var _this = $$(this);
			// 发送验证码,地址合法性校验
			var phone = $$('.tipBox-coupon .tip-content .tip-form input[name="phone"]').val();
			var phoneReg = /^[2|3|5|6|7|8|9][0-9]\d{6}$/
			if(!phoneReg.test(phone)){
				mdui.snackbar({
					message: '手機號碼格式有誤。',
					position: 'top'
				});
				return false;
			}
			ad.data.tel = phone;
			// 倒计时
			ad.initCountDownNum(_this,120,couponId);
			$$.ajax({
				url: commonConfig.websitePrefix() + "/api/coupon/send/" + ad.data.tel,
				method: 'POST',
				contentType: 'application/json;charset=UTF-8',
				processData: false,
				success: function(data) {
					// $$('.tipBox-coupon .tip-content > button').removeAttr('disabled')
					data.body && mdui.snackbar({
						message: '驗證碼發送成功。',
						position: 'top'
					});
				},
				error: function(err){
					// $$('.tipBox-coupon .tip-content > button').removeAttr('disabled')
					var time = JSON.parse(err.response).body.message;
					mdui.snackbar({
						message: "剛剛給您發送過了，請"+ time +"秒后再試...",
						position: 'top'
					});
					ad.initCountDownNum(_this,time,couponId);
				}
			})
		});
		$$('.tipBox-coupon .tip-content > button:not(.close)').off().on('click',function(){
			// 校验
			var phone = $$('.tipBox-coupon .tip-content .tip-form input[name="phone"]').val();
			var phoneReg = /^[2|3|5|6|7|8|9][0-9]\d{6}$/
			if(!phoneReg.test(phone)){
				mdui.snackbar({
					message: '手機號碼格式有誤。',
					position: 'top'
				});
				return false;
			}
			var verify = $$('.tipBox-coupon .tip-content .tip-form input[name="verify"]').val().trim()
			if(!verify || verify == ''){
				mdui.snackbar({
					message: '請填寫驗證碼。',
					position: 'top'
				});
				return false;
			}else if(verify.length != 4){
				mdui.snackbar({
					message: '驗證碼格式有誤。',
					position: 'top'
				});
				return false;
			}
			$$.ajax({
				url: commonConfig.websitePrefix() + "/api/coupon/valid",
				method: 'POST',
				contentType: 'application/json;charset=UTF-8',
				processData: false,
				data: JSON.stringify({
					tel: ad.data.tel,
					code: verify
				}),
				success: function(data) {
					cacheSessionStorage.setCache("userTel",ad.data.tel)
					cacheCookie.setCache("securityToken", data.body, 7)
					ad.data.securityToken = data.body
					// 发券
					ad.getCouponAjax(couponId);
				},
				error: function(err){
					mdui.snackbar({
						message: JSON.parse(err.response).body.message,
						position: 'top'
					});
					cacheSessionStorage.removeCache("userTel")
				}
			})
		});
	},
	openSuccess: function(){
		if($$('body .tipBox-coupon').length == 0){
			$$('body').append('<div class="tipBox-coupon"><div class="tip-close">+</div><div class="tip-content"></div></div>')
		}
		$$('.tipBox-coupon .tip-content').html('<img src="https://d3o2c7bn83e5x8.cloudfront.net/image/coupon-tip-success.png"><h4>優惠碼領取成功<span>对应<i>優惠碼號</i>将在几分钟内发送到您的手机上，<br/>可在購物車結算時使用</span></h4><button class="close" onclick="ad.closeTipBox()">知道了</button>')
	},
	getCouponAjax: function(id,index){
		$$.ajax({ 
			url: commonConfig.websitePrefix() + "/api/coupon/bind/" + id,
			method: 'POST',
			contentType: 'application/json;charset=UTF-8',
			processData: false,
			data: JSON.stringify({
				tel: ad.data.tel,
				securityToken: ad.data.securityToken
			}),
			success: function(data) {
				cacheSessionStorage.setCache("userTel",ad.data.tel)
				index && $$('.couponView .unsent .couponBtn[data-index="' + index + '"]').find('span').text('已領').css({
					'color': '#B4272D',
					'background': 'transparent'
				})
				ad.openSuccess();
				ad.initAdBox(ad.data.couponData);
			},
			error: function(err){
				mdui.snackbar({
					message: JSON.parse(err.response).body.message,
					position: 'top'
				});
				if(JSON.parse(err.response).body.message == '该用户已经拥有此优惠券'){
					cacheSessionStorage.setCache("userTel",ad.data.tel)
				}else{
					cacheSessionStorage.removeCache("userTel")
				}
			}
		})
	}
}
var share = {
	init: function(){
		if($$('meta[name="share"]').length == 0) {
			return false;
		}
		share.initShare();
	},
	parseUrl: function(url){
		var result = {};
		var query = url.split("?")[1];
		if(query == undefined){
			return {}
		}
		var queryArr = query.split("&");
		queryArr.forEach(function(item){
			var value = item.split("=")[1];
			var key = item.split("=")[0];
			result[key] = value 
		});
		return result;
	},
	initShare: function(){
		var link_parame = share.parseUrl(window.location.href)
		link_parame['pixelId'] = commonConfig.getFbPiexId()
		link_parame['affiliate'] = 'share'
		var params = Object.keys(link_parame).map(function (key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(link_parame[key]);
		}).join("&");
		var link = window.location.origin + window.location.pathname + "?" + params;
		$$('body').append('<div class="shareDetail tip-screen"><div class="tip-screen-box"><div class="tip-screen-content share-content"><h3>分享到</h3><ul>'+
		'<li><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(link)+'&amp;src=sdkpreparse"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-facebook.png"><span>Facebook</span></a></li>'+
		'<li><a target="_blank" href="https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(link)+'"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-line.png"><span>Line</span></a></li>'+
		'<li><a target="_blank" href="fb-messenger://share?link=' + encodeURIComponent(link) + '&app_id=' + encodeURIComponent($$.guid()) + '"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-messenger.png"><span>Messenger</span></a></li>'+
		'<li><a target="_blank" href="sms:'+(tools.getPlatform() == "IOS" ? '&' : '?')+'body='+link+'"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-message.png"><span>訊息</span></a></li>'+
		'<li><a target="_blank" href="mailto:?Subject=分享一個購物網站給你！&Body='+link+'"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-Mail.png"><span>郵件</span></a></li>'+
		'<li><a data-clipboard-text="'+link+'" class="copy-btn"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-copy.png"><span>拷貝鏈接</span></a></li>'+
		'</ul></div><div class="tip-screen-footer close">取消</div></div></div>')
		$$('body > .mdui-appbar .mdui-toolbar-title .top-right-options').append('<a id="share" class="text-icon-options" onclick="share.openShare()" href="javascript:void(0)"><img src="https://d3o2c7bn83e5x8.cloudfront.net/image/icon-share.png"><span class="text-foot">分享</span></a>')
		// 复制
		var clipboard = new Clipboard('.copy-btn');
		clipboard.on('success', function(e) {
			mdui.snackbar({message: '複製成功!',position: 'top',timeout: 1000});
			newMonitor.addMonitor({
				'eventAims': 'COPY',
				'eventName': 'CLICK',
				'aimsCategory': 'EVENT',
			});
		}).on('error', function(e) {
			mdui.snackbar({message: '複製失敗,請您手動複製!',position: 'top',timeout: 2000});
		});
	},
	openShare: function(){
		newMonitor.addMonitor({
			'eventAims': 'SHARE',
			'eventName': 'CLICK',
			'aimsCategory': "EVENT",
		});
		tipWindow.screen.open($$('.shareDetail'))
	}
}
var ramdomComment = {
	texts: [
		'很棒的寶貝，很讚的商家，謝謝。',
		'買了很多東西，都非常滿意，很好的賣家，我會常來的。',
		'雖然網站不怎麼樣，但是不得不說，東西很好，希望會越做越好。',
		'還不錯，質量挺好的，是我喜歡的哪種。',
		'對得起這個價格，祝興隆。',
		'雖然有點小瑕疵，但是客服很快就幫我解決了，點讚。',
		'我是一個挑剔黨，這個商品我給4分。',
		'買來送人的，說不錯，挺喜歡的。',
		'早上剛收到，很是喜歡，已經推薦給朋友了，要是有折扣就更好了。',
		'貨晚到了幾天，不過東西還算OK，就不計較了。',
		'東西確實不錯，只是稍微貴了點，不過還是給好評，挺喜歡的。',
		'第二次買了，很開心，已經收藏店鋪了，希望更多人能發覺好物。',
		'最近比較忙，沒來得及評論，東西很好，包裝嚴實，沒有損壞，謝謝。',
		'已經申請換貨了，東西很好，只是我尺碼選小了，家人說，挺值的，就是自己選錯了，挺不好意思的。',
		'性價比高，不比別的網站差，第一次嘗試，給滿分。',
		'對比了好幾家，最終還是在這家買的，總體感覺，物有所值。',
		'默認好評。',
		'默認好評。'
	],
	getRadomTime: function() {
		var start = new Date();
		start.setMonth(start.getMonth() - 1);
		var temp = (start.getTime() + Math.random() * 28 * 24 * 60 * 60 * 1000).toFixed();
		var result = new Date(parseFloat(temp));
		return result.getFullYear() + '-' + (result.getMonth() + 1) + '-' + result.getDate() + ' ' + result.getHours() + ':' + result.getMinutes() + ':' + result.getSeconds();
	},
	getRadomNumber: function() {
		return '09xxxxx' + (Math.random(100) * 1000).toFixed();
	},
	getRadomText: function() {
		return ramdomComment.texts[parseInt((Math.random() * (ramdomComment.texts.length - 1)).toFixed())];
	},
	getRadomInt: function() {
		return(Math.random(100) * 3600).toFixed();
	},
	buyCountPro: function(productId) {
        let e = new Date();
        return productId%400+600+e.getHours()+e.getMinutes()
    },
}
var countdown = {
	time_type_0 : 999,
	addNumber : function(num){
		var num = (num > 9) ? num : ('0' + num);
    	return num;
	},
	initCountdown : function(domSelect){
		var timeoutInterval = null;
		if(countdown.time_type_0 > 0) {
			timeoutInterval = window.setInterval(function () {
				var endYear = new Date().getFullYear();
				var endMonth = new Date().getMonth() + 1;
				var endDay = new Date().getDate();
				var endTime = new Date(endYear, endMonth, endDay);

				countdown.time_type_0 = endTime - (new Date().getTime());
				var leftHours = countdown.addNumber(Math.floor(countdown.time_type_0 / 1000 / 60 / 60 % 24));
				var leftMinutes = countdown.addNumber(Math.floor(countdown.time_type_0 / 1000 / 60 % 60));
				var leftSeconds = countdown.addNumber(Math.floor(countdown.time_type_0 / 1000 % 60));
				var leftMSeconds = Math.floor((countdown.time_type_0 % 1000)/100);
				var $leftHours = $$(domSelect).find('.leftHours'),
					$leftMinutes = $$(domSelect).find('.leftMinutes'),
					$leftSeconds = $$(domSelect).find('.leftSeconds'),
					$leftMSeconds = $$(domSelect).find('.leftMSeconds');
				$leftHours.html() != leftHours && $leftHours.html(leftHours);
				$leftMinutes.html() != leftMinutes && $leftMinutes.html(leftMinutes);
				$leftSeconds.html() != leftSeconds && $leftSeconds.html(leftSeconds);
				$leftMSeconds.html() != leftMSeconds && $leftMSeconds.html(leftMSeconds);
			}, 100);
		} else {
			window.clearInterval(timeoutInterval);
		}
	},
	time_type_1 : 999,
	initCountdown1 : function(select, module){
		var timeoutInterval = null,
			$$domSelect = $$('#module_' + module.id + ' ' + select);
		if(countdown.time_type_1 > 0) {
			timeoutInterval = window.setInterval(function () {
				countdown.time_type_1 = new Date(module.name.replace(/\-/g, "/")) - (new Date().getTime());
				if(countdown.time_type_1<0){
					$$domSelect.html('<span class="day bg-black">0</span><span>天</span><span class="hour bg-black">0</span><span>時</span><span class="minute bg-black">0</span><span>分</span><span class="second bg-black">0.00</span><span>秒</span>')
					return false;
				}
				var day = countdown.addNumber(Math.floor(countdown.time_type_1 / 1000 / 60 / 60 / 24)),
					hour = countdown.addNumber(Math.floor(countdown.time_type_1 / 1000 / 60 / 60 % 24)),
					minute = countdown.addNumber(Math.floor(countdown.time_type_1 / 1000 / 60 % 60)),
					second = countdown.addNumber(Math.floor(countdown.time_type_1 / 1000 % 60)),
					mSecond = Math.floor((countdown.time_type_1 % 1000)/100),
					$day = $$domSelect.find('.day'),
					$hour = $$domSelect.find('.hour'),
					$minute = $$domSelect.find('.minute'),
					$second = $$domSelect.find('.second');
				if(day == '00'){
					$day.hide()
					$$domSelect.find('.day + span').hide()
				}else{
					$day.html() != day && $day.html(day);
				}
				$hour.html() != hour && $hour.html(hour);
				$minute.html() != minute && $minute.html(minute);
				$second.html() != second && $second.html(second+'.'+mSecond);
			}, 100);
		} else {
			window.clearInterval(timeoutInterval);
		}
	}
}

function initShoppingCart() {
	if($$('meta[name="shoppingCart"]').length > 0) {
		$$("<a id='shopping_cart' href='../product/indexCart.html'><img src='https://d3o2c7bn83e5x8.cloudfront.net/image/icon/icon-shopping-cart.png' /><label class='shoppingCart-num'>" + tools.getShopCartProductsNum() + "</label></a>").appendTo('body');
		$$('#shopping_cart').off().on('click', function(e){
			newMonitor.addMonitor({
				'aimsCategory': '购物车',
				'eventName': 'ACTION',
			},e);
		});
	}
}
function initShoppingCart2() {
	if($$('.mdui-toolbar-title .top-right-options > .text-icon-options > .shopping-cart-num').length > 0){
		$$('.mdui-toolbar-title .top-right-options > .text-icon-options > .shopping-cart-num').html('<span>' + tools.getShopCartProductsNum() + '</span>');
		if(shoppingcartNum == 0){
			$$('.shopping-cart-num').remove();
		}
	}
}

function navToDiffDevice(url){
    var data = url.split('@@')
    var a_url = data[0]
	var i_url = data[1]
	if(!a_url){return}
    if(!i_url){
		i_url = a_url
	}
	var endUrl = ''
    if(tools.getPlatform() == 'Android'){
		endUrl = a_url
	}else if(tools.getPlatform() == 'IOS'){
		endUrl = i_url
    }else{
		endUrl = a_url
	}
	if(a_url.indexOf(window.location.hostname) > -1){
		window.location.href = endUrl
	}else{
		window.open(endUrl)
	}
}


var $$ = mdui.JQ;
$$(function() {
	tools.secrecyNow();
	newMonitor.initDefaultEvents();
	tools.initPageFontSize();
	tools.initAffiliate();
	tools.initToTopfunction();
	// initShoppingCart();
	// initShoppingCart2();
	tools.initCustomerService();
	tools.initSearch();
	tools.initAjaxSetup();
	ad.init();
	footprint.init();
	leftNav.init();
	share.init();

});