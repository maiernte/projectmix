/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'user-login',
    templateUrl: 'client/user/userlogin.html',
    pipes: [TranslatePipe],
    directives: [NgIf]
})
export class UserLogin{

    Username = ''
    Password = ''
    Email = ''
    SaveUsername = true
    AutoSignIn = false

    Loging = false;
    Sendingmail = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
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

    ngOnInit(){
        this.Username = this.glsetting.GetSetting('username')
        this.Password = this.glsetting.GetSetting('password')
    }

    ngAfterViewInit(){
    }

    login(){
        if(this.Username.trim() == '' || this.Password == ''){
            this.glsetting.ShowMessage("用户名或密码错误",
                "用户名和密码都要求在20个字符以内, 并且不能有空格。")
            return;
        }

        this.Loging = true
        this.glsetting.SignIn(this.Username.trim(), this.Password).then(res => {
            this.glsetting.SetValue('username', this.SaveUsername ? this.Username : '')
            this.glsetting.SetValue('password', this.AutoSignIn ? this.Password : '')
            this.glsetting.SetValue('autosignin', this.AutoSignIn)

            this.ngZone.run(() => {
                this.Loging = false;
                this.router.parent.navigate(['Profile'])
            })
            
        }).catch(err => {
            this.ngZone.run(() => {
                this.Loging = false;
            })

            let msg = err.error == 403 ? '用户名或密码不正确.' : err.message;
            this.glsetting.ShowMessage("登录失败", msg)
        })
    }

    regist(){
        this.router.parent.navigate(['Regist'])
    }
    
    forgetPassword(){
        if(!this.glsetting.CheckEmail(this.Email)){
            this.glsetting.ShowMessage('无效邮箱地址', '请输入有效邮箱！')
            return
        }

        this.Sendingmail = true
        Meteor.call('sendResetPasswordEmail', this.Email, (res, err) => {

            this.ngZone.run(() => {
                this.Sendingmail = false;
            })

            if(!err){
                this.glsetting.ShowMessage('邮件发送成功', '验证邮件已经发送到您的注册邮箱中！')
            }else{
                this.glsetting.ShowMessage('操作失败', `抱歉，这个邮箱地址(${this.Email})没有被验证过，我们无法向您发送新密码。`)
            }
        })
    }
    
    reportAdmin(){
        let dom = jQuery('.report.admin')
        Meteor.call('reportToAdmin', dom[0].value, (res, err) => {
            this.ngZone.run(() => {
                this.Sendingmail = false;
            })

            if(!err){
                this.glsetting.ShowMessage('问题报告', '您的问题已经报告给管理员。请耐心等候回复。')
            }else{
                this.glsetting.ShowMessage('操作失败', err)
            }
        })
    }
}