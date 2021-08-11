template.defaults.imports.remainingAmount=function(t){var e=new Date;return t%100+83-e.getHours()-e.getMinutes()},
template.defaults.imports.remainingAmountWidth=function(t){var e=new Date;return 100*(t%100+83-e.getHours()-e.getMinutes())/181},
template.defaults.imports.buyCount=function(t){var e=new Date;return t%400+600+e.getHours()+e.getMinutes()},
template.defaults.imports.soldCount=function(){return Math.floor(800+3e3*Math.random())};
template.defaults.imports.isfuture=function(time){return new Date(time) - new Date() > 0};
template.defaults.imports.getHour=function(time){return (Math.floor((new Date(time) - new Date()) / 1000 / 60 / 60))};
template.defaults.imports.getMinutes=function(time){
    var m = (Math.floor((new Date(time) - new Date()) / 1000 / 60 % 60))
    return m == 0 ? 1 : m
};