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
})
export class UserLogin{

    Username = ''
    Password = ''
    SaveUsername = true
    AutoSignIn = false

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting: GlobalSetting,
                private rootElement: ElementRef){
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

        this.glsetting.SignIn(this.Username.trim(), this.Password).then(res => {
            this.glsetting.SetValue('username', this.SaveUsername ? this.Username : '')
            this.glsetting.SetValue('password', this.AutoSignIn ? this.Password : '')
            this.glsetting.SetValue('autosignin', this.AutoSignIn)

            this.ngZone.run(() => {
                this.router.parent.navigate(['Profile'])
            })
            
        }).catch(err => {
            let msg = err.error == 403 ? '用户名或密码不正确.' : err.message;
            this.glsetting.ShowMessage("登录失败", msg)
        })
    }

    regist(){
        this.router.parent.navigate(['Regist'])
    }
}