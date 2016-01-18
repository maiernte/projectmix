/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, ElementRef} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {FormBuilder, ControlGroup, Validators, Control} from 'angular2/common';

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'user-page',
    templateUrl: 'client/user/userpage.html',
    pipes: [TranslatePipe],
})
export class UserPage{
    private islogin = false;
    loginForm: ControlGroup;
    registerForm: ControlGroup;
    
    Username = ''
    
    constructor(@Inject(GlobalSetting) public glsetting: GlobalSetting,
                private rootElement: ElementRef){
        var fbLogin = new FormBuilder();
        this.loginForm = fbLogin.group({
            name: ['', Validators.compose([Validators.required, loginValidator])],
            pw: ['', Validators.compose([Validators.required, loginValidator])]
        });
        
        var fbRegister = new FormBuilder();
        this.registerForm = fbRegister.group({
            name: ['', Validators.compose([Validators.required, loginValidator])],
            email: [''],
            pw1: ['', Validators.compose([Validators.required, loginValidator])],
            pw2: ['', Validators.compose([Validators.required, loginValidator])]
        })
    }
    
    get Logined(){
        return this.islogin;
    }
    
    showMenu(hide){
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }
    
    ngOnInit(){
        let hideMenu = true;
        this.showMenu(hideMenu);
        
        let username = this.glsetting.GetSetting('username')
        let password = this.glsetting.GetSetting('password')
        this.signIn(username, password).then(res => {
            this.Username = username;
            this.islogin = true;
        }).catch(err => {
            this.islogin = false;
            console.log("sign in error", err)
        })
    }
    
    login(user){
        if(!this.loginForm.valid){
            this.glsetting.ShowMessage("用户名或密码错误", 
                "用户名和密码都要求在20个字符以内, 并且不能有空格。")
        }else{
            console.log('login input', user)
            this.Username = user.name;
            
            
            this.signIn(user.name, user.pw).then(res => {
                (this.loginForm.controls['name']).updateValue('');
                (this.loginForm.controls['pw']).updateValue('');
                this.changeView('loged-part', 'loging-part', ['fade down', 'fade up'])
            }).catch(err => {
                this.glsetting.ShowMessage("登录失败", err)
            })
        }
    }
    
    logout(){
        this.Username = ''
        this.changeView('loging-part', 'loged-part', ['fade down', 'fade up'])
    }
    
    regist(user){
        if(!this.registerForm.valid){
            this.glsetting.ShowMessage("用户名或密码错误", 
                "用户名和密码都要求在20个字符以内, 并且不能有空格。")
            return;
        }
        
        if(user.pw1 != user.pw2){
            this.glsetting.ShowMessage("密码错误", 
                "两次密码必须完全相同。")
            return;
        }
        
        if(!user.email || user.email.trim() == ''){
             this.glsetting.ShowMessage("注册邮箱", 
                "您还没有填写注册邮箱。忘记密码的时候无法取回密码。" 
                + "提醒您登录后在用户设置中填写有效邮箱。")
        }
        
        console.log('login input', user)
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
    
    private signIn(user: string, pw: string): any{
        let promise = new Promise((resolve, reject) => {
            console.log('connect server...')
            if(user == '' || pw == '' || user != 'tianya1'){
                reject('用户名或者密码错误！')
            }
            
            resolve(true)
        })
        
        return promise;
    }
}

function loginValidator(control: Control): { [s: string]: boolean } { 
    let input = control.value.trim();
    let invalid = input == '' || 
                input.length < 6 || 
                input.length > 20 ||
                input.indexOf(' ') > 0
    
    if (invalid) {  
        return {invalid: true};  
    }
}