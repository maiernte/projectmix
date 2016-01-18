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
    private static viewInited = false;

    private islogin = false;
    loginForm: ControlGroup;
    registerForm: ControlGroup;

    Username = ''
    SaveUsername = false;
    AutoSignIn = true;
    
    constructor(@Inject(GlobalSetting) public glsetting: GlobalSetting,
                private rootElement: ElementRef){
        var fbLogin = new FormBuilder();
        this.loginForm = fbLogin.group({
            name: ['', Validators.compose([Validators.required, nameValidator])],
            pw: ['', Validators.compose([Validators.required, pwValidator])]
        });
        
        var fbRegister = new FormBuilder();
        this.registerForm = fbRegister.group({
            name: ['', Validators.compose([Validators.required, nameValidator])],
            email: [''],
            pw1: ['', Validators.compose([Validators.required, pwValidator])],
            pw2: ['', Validators.compose([Validators.required, pwValidator])]
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

        this.AutoSignIn = this.glsetting.GetSetting('autosignin')
        this.SaveUsername = true;
    }

    ngAfterViewInit(){
        let name = this.glsetting.GetSetting('username')

        if(this.glsetting.Signed){
            this.Username = name

            if(UserPage.viewInited == false){
                UserPage.viewInited = true
                this.changeView('loged-part', 'loging-part', ['fade down', 'fade up'])
            }
        }else{
            setTimeout(() => {
                (this.loginForm.controls['name']).updateValue(name);
            }, 500)
        }
    }
    
    login(user){
        if(!this.loginForm.valid){
            this.glsetting.ShowMessage("用户名或密码错误", 
                "用户名和密码都要求在20个字符以内, 并且不能有空格。")
        }else{
            console.log('login input', user)
            this.Username = user.name;

            this.glsetting.SignIn(user.name, user.pw).then(res => {
                if(this.SaveUsername){
                    this.glsetting.SetValue('username', user.name)
                }else{
                    this.glsetting.SetValue('username', '')
                }

                if(this.AutoSignIn){
                    this.glsetting.SetValue('password', user.pw)
                    this.glsetting.SetValue('autosignin', true)
                }else{
                    this.glsetting.SetValue('password', '')
                    this.glsetting.SetValue('autosignin', false)
                }

                (this.loginForm.controls['name']).updateValue('');
                (this.loginForm.controls['pw']).updateValue('');
                this.changeView('loged-part', 'loging-part', ['fade down', 'fade up'])
            }).catch(err => {
                this.glsetting.ShowMessage("登录失败", err)
            })
        }
    }
    
    logout(){

        this.glsetting.SetValue('username', '')
        this.glsetting.SetValue('password', '')
        this.changeView('loging-part', 'loged-part', ['fade down', 'fade up'])
    }
    
    regist(user){
        if(!this.registerForm.valid){
            this.glsetting.ShowMessage("用户名或密码错误", 
                "用户名要求2至50个字符(包括中文字符), 但不允许有空格。密码要求6至20个任意字符。")
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