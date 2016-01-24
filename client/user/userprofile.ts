/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'
import {NgIf} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var Promise: any;
declare var jQuery: any

@Component({
    templateUrl: 'client/user/userprofile.html',
    pipes: [TranslatePipe],
    directives: [NgIf],
})
export class UerProfile{
    private static groupDef = ['注册用户', '贵宾', '华鹤同门', '易学老师', '管理员']
    private profile: Object;

    Username = ''
    Email = ''
    Moto = ''
    Icon = ''
    Group = ''
    NickName = ''
    MailVerified = false

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

                this.glsetting.ShowMessage("更新数据失败", err)
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
        if(this.glsetting.CheckEmail(this.Email)){
            this.glsetting.ShowMessage('无效地址', '邮箱地址不正确, 无法发送验证邮件！')
            return;
        }

        Meteor.call('sendVerificationEmail', Meteor.userId(), this.Email, (err, response) => {
            if(!err){
                console.log('email is sended!')
                this.glsetting.ShowMessage('邮件发送成功', '验证邮件已经发送到您的注册邮箱中！')
            }else{
                console.log('Error : ', err)
            }
        })
    }

    ngOnInit(){
        let user = Meteor.user();
        if(!user){
            this.router.parent.navigate(['Login'])
            return;
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
            this.glsetting.ShowMessage("退出失败", err)
        })
    }

    resetpassword(){
        if(this.pw == '' || this.pw1 == ''){
            this.glsetting.ShowMessage('更改密码', '请输入旧密码和新密码。')
            return
        }

        if(this.pw == this.pw1){
            this.glsetting.ShowMessage('更改密码', '旧密码和新密码是一样的, 没有改变。')
            return
        }

        if(this.pw1 == '' || this.pw1 != this.pw2){
            this.glsetting.ShowMessage('操作失败', '您的两次输入不一致。')
            return
        }

        if(this.pw1.length < 6 || this.pw1.length > 20){
            this.glsetting.ShowMessage('操作失败', '系统只接受6到20位字符的密码。')
            return
        }

        this.changingpw = true;
        Accounts.changePassword(this.pw, this.pw1, (err) => {
            if(!err){
                this.glsetting.ShowMessage("操作成功", "您的密码已经更改!")
                this.ngZone.run(() => {
                    this.changingpw = false
                    this.PwModel = false;
                })
            }else{
                this.ngZone.run(() => {
                    this.changingpw = false
                })

                this.glsetting.ShowMessage('更改密码失败', err)
            }
        })
    }
    
    private updateProfile(nickname: string, moto: string): any{
        let promise = new Promise((resolve, reject) => {
            Meteor.users.update(
                {_id: Meteor.userId()},
                {$set: {'profile.nickname': nickname, 'profile.moto': moto}},
                (err, res) => {
                    if(err){
                        //this.glsetting.ShowMessage("更新数据失败", err)
                        reject(err)
                    }else{
                        console.log("update profile successed!")
                        resolve(true)
                    }
                });
        })

        return promise;
    }

    private changEmail(newmail: string){
        if(!this.glsetting.CheckEmail(this.Email)){
            this.glsetting.ShowMessage("更改邮箱失败", '您输入的是一个无效信箱地址.')
            return;
        }

        Meteor.call('changeMail', Meteor.userId(), newmail, (err, res) => {
            if(err){
                this.glsetting.ShowMessage("更改邮箱失败", err)
            }else{
                console.log('change mail successed:', res)
            }
        })
    }

    changeView(inId, outId, effect){
        let action = effect ? effect : ['fade left', 'fade right']
        jQuery(this.rootElement.nativeElement)
            .find('#' + outId)
            .transition(action[0], () => {
                jQuery(this.rootElement.nativeElement)
                    .find('#' + inId).transition(action[1]);
            });
    }
}