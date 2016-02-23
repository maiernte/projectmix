/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;
@Component({
    selector: 'user-regist',
    templateUrl: 'client/user/userregist.html',
    pipes: [TranslatePipe],
})
export class UserRegist{
    registerForm: ControlGroup;
    Signing = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
        var fbRegister = new FormBuilder();
        this.registerForm = fbRegister.group({
            name: ['', Validators.compose([Validators.required, nameValidator])],
            email: [''],
            pw1: ['', Validators.compose([Validators.required, pwValidator])],
            pw2: ['', Validators.compose([Validators.required, pwValidator])]
        })
    }

    gologin(){
        this.router.parent.navigate(['Login'])
    }

    regist(user){
        if(!this.registerForm.valid){
            this.glsetting.Alert("用户名或密码错误",
                "用户名要求2至50个字符(包括中文字符), 但不允许有空格。密码要求6至20个任意字符。")
            return;
        }

        if(user.pw1 != user.pw2){
            this.glsetting.Alert("密码错误",
                "两次密码必须完全相同。")
            return;
        }

        if(!user.email || user.email.trim() == ''){
            let msg = "您还没有填写注册邮箱。忘记密码的时候无法取回密码。"
            msg += "提醒您登录后在用户设置中填写有效邮箱。"
            this.glsetting.Notify(msg, -1)
        }

        let profile = {
            nickname: user.name,
            icon: '',
            moto: '我的签名',
            group: 0
        }

        this.Signing = true
        this.glsetting.RegistUser(user.name, user.email, user.pw1, profile)
            .then(res => {
                /*this.ngZone.run(() => {
                    this.router.parent.navigate(['Profile'])
                })*/
                this.ngZone.run(() => {
                    this.Signing = false
                    this.router.parent.navigate(['Login'])
                })

                this.glsetting.Notify('恭喜您注册成功！请登录, 更多功能等待着您！', 1)
            }).catch(err => {
                this.ngZone.run(() => {
                    this.Signing = false
                })
                let msg = err.error == 403 ? '用户名或邮箱已经注册过.' : err.message;
                this.glsetting.Alert('注册失败', '非常抱歉, 注册没有成功. 原因是: ' + msg)
            })
    }
}

function nameValidator(control: Control): { [s: string]: boolean } {
    let input = control.value.trim();
    let invalid = input == '' ||
        input.length < 2 ||
        input.length > 50 ||
        input.indexOf(' ') > 0

    if (invalid) {
        return {invalid: true};
    }
}

function pwValidator(control: Control): {[s: string]: boolean}{
    let input = control.value;
    let invalid = input == '' ||
        input.length < 6 ||
        input.length > 20

    if (invalid) {
        return {invalid: true};
    }
    /*if(!input.match(/^[a-z0-9]{6,20}$/i)){
     console.log('pwValidator not match')
     return {invalid: true}
     }*/
}

