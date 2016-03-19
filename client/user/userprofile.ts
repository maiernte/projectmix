/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'
import {NgIf} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {UserImages, DelImages} from  'collections/admin'

declare var Promise: any;
declare var jQuery: any
declare var QiniuUploader;

@Component({
    templateUrl: 'client/user/userprofile.html',
    pipes: [TranslatePipe],
    directives: [NgIf],
})
export class UerProfile{
    private static groupDef = ['注册用户', '贵宾', '华鹤同门', '易学老师', '管理员']
    private profile: Object;
    private static iconurl = 'http://7xqidf.com1.z0.glb.clouddn.com'

    Username = ''
    Email = ''
    Moto = ''
    Icon = ''
    Group = ''
    NickName = ''
    MailVerified = false

    ChangingIcon = false

    pw = ''
    pw1 = ''
    pw2 = ''
    pwmodel = false
    changingpw = false;

    private editModel = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
    }

    get EditModel(){
        return this.editModel;
    }

    set EditModel(value){
        this.editModel = value;
        if(value === false){
            this.updateProfile(this.NickName, this.Moto).then((res) => {
                this.changEmail(this.Email)
            }).catch(err => {
                this.ngZone.run(() => {
                    this.ngOnInit()
                })

                this.glsetting.Alert("更新数据失败", err.toString())
            })
        }
    }

    get PwModel(){
        return this.pwmodel;
    }

    set PwModel(value){
        this.pwmodel = value
        if(value == true){
            this.pw = ''
            this.pw1 = ''
            this.pw2 = ''

            this.changeView('profile-changepw', 'profile-page', null)
        }else{
            this.changeView('profile-page', 'profile-changepw', null)
        }
    }
    
    sendVerifyEmail(){
        if(!this.glsetting.CheckEmail(this.Email)){
            this.glsetting.Alert('无效地址', '邮箱地址不正确, 无法发送验证邮件！')
            return;
        }

        Meteor.call('sendVerificationEmail', Session.get('userid'), this.Email, (err, response) => {
            if(!err){
                Log('email is sended!')
                this.glsetting.Notify('验证邮件已经发送到您的注册邮箱中！', 1)
            }else{
                Log('Error : ', err)
            }
        })
    }

    ngOnInit(){
        let user = Meteor.user();
        if(!user){
            this.router.parent.navigate(['Login'])
            return;
        }
        
        this.initQiniu()
        if(user.profile.icon && user.profile.icon != ''){
            this.Icon = UerProfile.iconurl + '/' + user.profile.icon + '?imageView2/2/w/64'
        }else{
            this.Icon = 'user_male.png'
        }
        
        if(user.profile){
            this.profile = JSON.parse(JSON.stringify(user.profile));
            this.Username = user.username
            this.NickName = user.profile.nickname
            this.Moto = user.profile.moto
    
            let sum = user.profile.group
            this.Group = sum > 0 ? UerProfile.groupDef[1] : UerProfile.groupDef[0]
            this.Group = Math.floor(sum / 2) > 0 ? UerProfile.groupDef[2] : this.Group
            this.Group = Math.floor(sum / 4) > 0 ? UerProfile.groupDef[4] : this.Group
            this.Group = Math.floor(sum / 8) > 0 ? UerProfile.groupDef[8] : this.Group
        }else{
            this.profile = {}
            this.Username = user.username
            this.NickName = user.username
            this.Moto = ''
            this.Group = UerProfile.groupDef[0]
        }
        
        if(user.emails && user.emails.length > 0){
            this.Email = user.emails[0].address
            this.MailVerified = user.emails[0].verified
        }else{
            this.Email = ''
            this.MailVerified = false;
        }
    }

    logout(){
        this.glsetting.SignOut().then(() => {
            this.ngZone.run(() => {
                this.router.parent.navigate(['Login'])
            })
        }).catch(err => {
            this.glsetting.Alert("退出失败", err.toString())
        })
    }
    
    private updateProfile(nickname: string, moto: string): any{
        let promise = new Promise((resolve, reject) => {
            Meteor.users.update(
                {_id: Session.get('userid')},
                {$set: {'profile.nickname': nickname, 'profile.moto': moto}},
                (err, res) => {
                    if(err){
                        reject(err)
                    }else{
                        Log("update profile successed!")
                        resolve(true)
                    }
                });
        })

        return promise;
    }

    private changEmail(newmail: string){
        if(!this.glsetting.CheckEmail(this.Email)){
            this.glsetting.Alert("更改邮箱失败", '您输入的是一个无效信箱地址。')
            return;
        }

        Meteor.call('changeMail', Session.get('userid'), newmail, (err, res) => {
            if(err){
                this.glsetting.Alert("更改邮箱失败", err.toString())
            }else{
                Log('change mail successed:', res)
            }
        })
    }

    removeImage(key: string): any{
        let del = {
            user: Session.get('userid'),
            bk: null,
            rd: null,
            key: key
        }

        let promise = new Promise((resolve, reject) => {
            DelImages.insert(del, (errqiniu) => {
                Log('insert to DelImge')
                if(!errqiniu){
                }else{
                    reject(errqiniu)
                }
            })
        })

        return promise
    }
    
    private initQiniu(){
        var settings = {
            bucket: 'huaheapp',
            browse_button: 'uploadQiniu',
            domain: 'http://7xqidf.com1.z0.glb.clouddn.com',
            max_file_size: '200kb',
            unique_names: false , 
            save_key: false,
            bindListeners: {
                'FilesAdded': (up, files) => {
                    var maxfiles = 1;
                    if(up.files.length > maxfiles )
                    {
                        up.splice(0);
                        this.glsetting.Alert("拒绝上传", "每次只允许上传一个文。")
                        return
                    }
                },
                
                'BeforeUpload': (up, file) => {
                    this.ngZone.run(() => {
                        this.ChangingIcon = true;
                    })
                },
                
                'UploadProgress': function(up, file) {
                },
                
                'FileUploaded': (up, file, info) => {
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    
                    let icon = JSON.parse(info)
                    this.profile['icon'] = icon.key

                    let oldicon = (Meteor.user().profile || {}).icon

                    Meteor.users.update(
                        {_id: Session.get('userid')},
                        {$set: {'profile.icon': icon.key}},
                        (err, res) => {
                            Log("update profile : ", err, res)
                        });

                    if(oldicon && oldicon != ''){
                        this.removeImage(oldicon)
                    }
                },
                'Error': function(up, err, errTip) {
                    Log('upload error', err, errTip)
                },
                'UploadComplete': () => {
                    this.ngZone.run(() => {
                        this.ChangingIcon = false;
                        this.Icon = UerProfile.iconurl + '/' + this.profile['icon'] + '?imageView2/2/w/64'
                    })
                },
                'Key': (up, file) => {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    let item = file.name.split('.')
                    let endung = item[item.length - 1]
                    let uid = Session.get('userid')
                    let name = this.glsetting.RandomStr(5)
                    var key = `uid-${uid}/icon/${name}.${endung}`
                    return key;
                }
            }
        }
        
        try{
            var uploader = new QiniuUploader(settings);
            uploader.settings.save_key = false
            uploader.settings.unique_names = false
            uploader.init();
        }catch(err){
            Log('init qiniu err:', err)
        }
    }

    changeView(inId, outId, effect){
        let action = effect ? effect : ['fade left', 'fade right']
        /*jQuery('#' + outId)
            .transition(action[0], () => {
                jQuery('#' + inId).transition(action[1]);
            });*/
        jQuery(this.rootElement.nativeElement)
            .find('#' + outId)
            .transition(action[0], () => {
                jQuery(this.rootElement.nativeElement)
                    .find('#' + inId).transition(action[1]);
            });
    }
}