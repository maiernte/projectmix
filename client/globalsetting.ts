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

    Exit(){
        if(this.IsCordova){
            navigator['app'].exitApp();
        }else {
            console.log("Exit", navigator)
        }
    }
}
