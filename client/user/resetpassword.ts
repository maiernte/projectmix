/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, Inject, NgZone} from 'angular2/core'

import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery

@Component({
    templateUrl: 'client/user/resetpassword.html',
    pipes: [TranslatePipe],
})
export class ResetPassword{
    pw1 = ''
    pw2 = ''
    private token = ''
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
    }
    
    ngOnInit(){
        this.token = this.routeParams.params['tk']
        console.log(this.token)
        Meteor.logout(err => {
            console.log('logout:', err)
        })
    }
    
    resetpassword(){
        if(this.pw1 == '' || this.pw1 != this.pw2){
            this.glsetting.Alert('操作失败', '您的两次输入不一致。')
            return
        }
        
        if(this.pw1.length < 6 || this.pw1.length > 20){
            this.glsetting.Alert('操作失败', '系统只接受6到20位字符的密码。')
            return
        }
        
        Accounts.resetPassword(this.token, this.pw1, (err) => {
            if(!err){
                this.ngZone.run(() => {
                    this.router.parent.navigate(['User', 'Login'])
                })
            }else{
                this.glsetting.Alert('重设密码失败', err.toString())
            }
        })
    }
}