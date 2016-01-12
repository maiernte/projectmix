/// <reference path="../typings/meteor/meteor.d.ts" />

declare var jQuery;
declare var html2canvas;
declare var Promise;

import {saveAs} from './lib/FileSaver'

export  class GlobalSetting{
    private setting = [
        {Name: 'lang', Value: true},
        {Name: 'gua-shensha', Value: 5},
        {Name: 'gua-simple', Value: false},
        {Name: 'bazi-shensha', Value: 5},
        {Name: 'desktop-tip', Value: true},
    ]

    private language: boolean; // 是否使用繁体字

    constructor(){
        this.initSetting();
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

    // 是否使用繁体字
    get lang(){
        return this.setting.filter(s => s.Name == 'lang')[0]['Value']
    }

    GetSetting(name: string): any{
        let res = this.setting.filter(s => s.Name == name);
        if(res && res.length == 1){
            return res[0]['Value']
        }else{
            return undefined;
        }
    }

    SetValue(key: string, value: any){
        let res = this.setting.filter(s => s.Name == key);
        if(res && res.length == 1){
            window.localStorage.setItem(key, value);
            res[0].Value = value
        }
    }

    Html2Canva(element, w, h): any{
        let promise = new Promise((resolve, reject) => {
            if (w != undefined && h != undefined && w > 0 && h > 0) {
                html2canvas(element, {
                    onrendered: function (canvas) {
                        resolve(canvas)
                    },

                    width: w,
                    height: h
                });
            }
            else {
                html2canvas(element, {
                    onrendered: function (canvas) {
                        resolve(canvas)
                    }
                });
            }
        })

        return promise
    }

    SaveCanva2Disk(canva, fileName: string){
        if(this.IsCordova){
            console.log('cordova save canvas to disk')
            window['canvas2ImagePlugin'].saveImageDataToLibrary(
                function (msg) {
                    //console.log(msg);
                    alert('图片保存到 ' + msg)
                },
                function (err) {
                    //console.log('fehler : ' + err);
                    alert('保存图片出错：' + err)
                },
                canva
            );
        }else{
            canva.toBlob(function (blob) {
                saveAs(blob, fileName + '.png');
            }, "image/png");
        }
    }

    Exit(){
        if(this.IsCordova){
            navigator['app'].exitApp();
        }else {
            console.log("Exit", navigator)
        }
    }

    private getValue(key: string){
        let value = window.localStorage.getItem(key);
        if(value){
            if(value == 'true'){
                return true;
            }else if(value == 'false'){
                return false;
            }else{
                let num = parseInt(value)
                if(num != NaN){
                    return num;
                }else{
                    return value
                }
            }
        }

        return null;
    }

    private initSetting(){
        for(let cat of this.setting){
            let value = this.getValue(cat.Name)
            if(value === null || value === undefined){
                this.SetValue(cat.Name, cat.Value)
            }else{
                cat.Value = value;
            }
        }
    }
}
