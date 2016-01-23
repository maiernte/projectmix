/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, Inject} from 'angular2/core'

import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery

@Component({
    templateUrl: 'client/user/mailverify.html',
    pipes: [TranslatePipe],
})
export class MailVerified{
    private para: string;
    
    Username = ''
    Password = ''
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
                    
    }
    
    ngOnInit(){
        this.para = this.routeParams.params['ad']
        console.log(this.para)
        
    }
    
    login(){
        Accounts.verifyEmail(this.para, (err) => {
            console.log('verify....', err)
        })
        return;
        
        this.glsetting.SignIn(this.Username.trim(), this.Password).then(res => {
            let uid = Meteor.userId()
            if(uid == this.para){
                this.showSuccess('verify-successed')
            }else{
                this.showSuccess('verify-failed')
            }
        }).catch(err => {
            let msg = err.error == 403 ? '用户名或密码不正确.' : err.message;
            this.glsetting.ShowMessage("登录失败", msg)
        })
    }
    
    showSuccess(view){
        let action = ['fade left', 'fade right']
        jQuery('#verify-login')
            .transition(action[0], () => {
                jQuery('#' + view).transition(action[1]);
            });
    }
}