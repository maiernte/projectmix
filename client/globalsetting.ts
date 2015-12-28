/// <reference path="../typings/meteor/meteor.d.ts" />

export  class GlobalSetting{
    lang: boolean; // 是否使用繁体字
    constructor(){
        this.lang = true;
        console.log('GlobalSetting constructor')
    }
    
    get IsCordova(){
        return Meteor.isCordova;
    }

    get GUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    Exit(){
        if(this.IsCordova){
            navigator['app'].exitApp();
        }else {
            console.log("Exit", navigator)
        }
    }
}
