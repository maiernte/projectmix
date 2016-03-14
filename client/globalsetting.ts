/// <reference path="../typings/meteor/meteor.d.ts" />
/// <reference path="../typings/book.d.ts" />

declare var jQuery;
declare var html2canvas;
declare var Promise;
declare var SemanticModal;
declare var alertify;

import {saveAs} from './lib/FileSaver'
import {TranslatePipe} from './allgemein/translatePipe'

import {Bookmanager} from 'client/books/bookmanager'

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
        {Name: 'userid', Value: ''},
        {Name: 'autosignin', Value: false},
        {Name: 'book-pagerd', Value: 4},
        {Name: 'gua-arrow', Value: true}
    ]

    private language: boolean; // 是否使用繁体字
    private translator: TranslatePipe;
    private books: Array<Book>;
    private signed = false
    private isCordova

    Clipboard: Object
    BookManager: Bookmanager;

    constructor(){
        this.initSetting();
        this.translator = new TranslatePipe();
        this.BookManager = new Bookmanager();
        
        TranslatePipe.setLanguage(this.lang)

        let user = this.GetSetting('username').toString()
        let pw = this.GetSetting('password').toString();
        let userid = this.GetSetting('userid').toString();

        Session.set('userid', userid == '' ? null : userid)
        console.log("glsetting init", user, pw, userid)

        /*this.SignIn(user, pw).catch(err => {
            console.log("login error", err.toString())
        })*/
    }
    
    get Signed(){
        return this.signed
    }
    
    get IsCordova(){
        if(this.isCordova == null || this.isCordova == undefined){
            this.isCordova = Meteor.isCordova;
        }
        
        return this.isCordova;
    }
    
    get Ios(){
        let ios = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)
        return ios;
    }
    
    get Android(){
        let android = navigator.userAgent.match(/Android/i)
        return android;
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
        return this.setting.filter(s => s.Name == 'lang')[0]['Value'] == true
    }

    get PageSize(){
        let size = this.GetSetting('book-pagerd')
        if(size > 4){
            return size;
        }else{
            return this.IsCordova ? 10 : 25;
        }
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
                    this.Alert('图片保存', '路径：' + msg)
                },
                function (err) {
                    //console.log('fehler : ' + err);
                    this.Alert('保存图片出错', err)
                },
                canva
            );
        }else{
            canva.toBlob(function (blob) {
                saveAs(blob, fileName + '.png');
            }, "image/png");
        }
    }
    
    Notify(message: string, type: number){
        message = this.translator.transform(message, null)
        let flag = type >= 0 ? 'success' : 'warning'
        
        alertify.notify(message, flag, 5)
    }
    
    Alert(title, message){
        title = (title || '华鹤易学')
        message = this.translator.transform(message, null)
        title = this.translator.transform(title, null)
        //alertify.alert(title, message).set({'labels': {ok:'好的'}, 'transition': 'zoom'});
        alertify.alert().setting({
            title: title,
            message: message,
            labels: '好的',
            transition: 'zoom'
        }).show()
    }
    
    Confirm(title, message, onok, oncancel){
        title = this.translator.transform(title, null)
        message = this.translator.transform(message, null)
        let oktext = this.translator.transform('确定', null)
        let canceltext = this.translator.transform('取消', null)
        
        alertify.confirm(title, message, () => {
            if(onok){
                onok()
            }
        }, () => {
            if(oncancel){
                oncancel();
            } 
        }).set('labels', {ok:oktext, cancel:canceltext});
    }

    ConnectMeteor(): boolean {
        let status = Meteor.status();
        if(status['connected'] == false){
            let count = 0
            let id = Meteor.setInterval(() => {
                //status = Meteor.status();
                console.log(status)

                if(status['connected'] == true){
                    this.Alert('成功连接服务器', '您现在可以进行云数据操作. 但为了减少负荷, 将在20分钟后自动转为离线状态.')
                    Meteor.clearInterval(id)
                    return
                }

                if(++count > 6){
                    this.Alert('连接服务器', '看来暂时连不上, 请稍后再试!')
                    Meteor.clearInterval(id)
                    return
                }
            }, 20 * 1000)

            alertify.alert().setting({
                title: '连接服务器',
                message: `<div class="ui active inverted dimmer">
                            <div class="ui text loader">正在连接...请等待两分钟</div>
                          </div>`,
                closable: false,
                transition: 'zoom',
            }).show()

            return false
        }else{
            return true;
        }
    }

    SignIn(user: string, pw: string): any{
        let promise = new Promise((resolve, reject) => {
            if(user == '' || pw == '' || !user || !pw){
                reject('用户名或者密码错误！')
            }else{
                let connectErr = this.ConnectMeteor()
                if(this.ConnectMeteor() == false){
                    reject(new Error())
                    return
                }

                console.log("try signin ", user, pw)
                Meteor.loginWithPassword(user, pw, err => {
                    console.log('sign in err: ', err)
                    if(err){
                        reject(err)
                    }else{
                        this.signed = true
                        this.SetValue('username', user)
                        this.SetValue('password', pw)
                        this.SetValue('userid', Meteor.userId())

                        Session.set('userid', Meteor.userId())
                        Session.set('username', user)
                        Session.set('password', pw)
                        resolve(true)
                    }
                })
            }
        })

        return promise;
    }

    SignOut(){
        let promise = new Promise((resolve, reject) => {
            Meteor.logout(err => {
                if(err){
                    reject(err)
                }else{
                    //this.GetSetting('autosignin')
                    this.SetValue('autosignin', false)
                    this.signed = false
                    this.SetValue('password', '')
                    this.SetValue('userid', '')

                    Session.set('userid', null)
                    Session.set('username', '')
                    Session.set('password', '')
                    resolve(true)
                }
            })
        })
        
        return promise;
    }

    RegistUser(name: string, email: string, pw: string, profile: Object): any{
        console.log('profile', profile)
        let promise = new Promise((resolve, reject) => {
            Accounts.createUser({
                username: name,
                email: email,
                password: pw,
                profile: profile
            }, (err) => {
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            });
        })

        return promise;
    }
    
    RandomStr(length: number){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
    
    CheckEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    ParseDate(text: string){
        let res = new Date(Date.parse(text))
        if(res.toString() != 'Invalid Date'){
            return res;
        }
        
        if(!text || text == '' || typeof text != 'string'){
            return null
        }

        let item = text.split(' ')
        let date = item[0].split('-')
        let time = item.length >= 2 ? item[1].split(':') : null


        var y = parseInt(date[0])
        var m = parseInt(date[1]) - 1
        var d = parseInt(date[2])

        var hh = time ? parseInt(time[0]) : 0
        var mm = time ? parseInt(time[1]) : 0

        res = new Date(y, m, d, hh, mm)
        return res;
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
