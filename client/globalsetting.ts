/// <reference path="../typings/meteor/meteor.d.ts" />

declare var jQuery;
declare var html2canvas;
declare var Promise;
declare var SemanticModal;

import {saveAs} from './lib/FileSaver'
import {TranslatePipe} from './allgemein/translatePipe'

export  class GlobalSetting{
    private setting = [
        {Name: 'lang', Value: true},
        {Name: 'gua-shensha', Value: 5},
        {Name: 'gua-simple', Value: false},
        {Name: 'bazi-shensha', Value: 5},
        {Name: 'desktop-tip', Value: true},
        {Name: 'created', Value: Date.now()},
        {Name: 'modified', Value: Date.now()},
        {Name: 'username', Value: ''},
        {Name: 'password', Value: ''},
        {Name: 'autosignin', Value: false},
    ]

    private language: boolean; // 是否使用繁体字
    private translator: TranslatePipe;

    Clipboard: Object
    Signed = false;

    constructor(){
        this.initSetting();
        this.translator = new TranslatePipe();

        let autosignin = this.GetSetting('autosignin')
        if(autosignin){
            let user = this.GetSetting('username')
            let pw = this.GetSetting('password')
            this.SignIn(user, pw).then(res => {
                this.Signed = true;
            }).catch(err => {
                this.Signed = false;
            })
        }
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
    get lang(): boolean{
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
            console.log('setValue', value)
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
                    this.ShowMessage('图片保存', '路径：' + msg)
                },
                function (err) {
                    //console.log('fehler : ' + err);
                    this.ShowMessage('保存图片出错', err)
                },
                canva
            );
        }else{
            canva.toBlob(function (blob) {
                saveAs(blob, fileName + '.png');
            }, "image/png");
        }
    }
    
    ShowMessage(header: string, message: string){
        if(this.lang == true){
            header = this.translator.transform(header, [true]);
            message = this.translator.transform(message, [true]);
        }
        
        SemanticModal.confirmModal(
            {
                header: header,
                message: message,
                noButtons: true
            }
        );
    }

    SignIn(user: string, pw: string): any{
        let promise = new Promise((resolve, reject) => {

            if(user == '' || pw == ''){
                reject('用户名或者密码错误！')
            }

            resolve(true)
        })

        return promise;
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
                if(isNaN(num)){
                    return value
                }else{
                    return num;
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
