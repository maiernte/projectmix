/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/global.d.ts" />

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
    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
                    
    }
    
    ngOnInit(){
        let para = this.routeParams.params['ad']
        this.verify(para)
    }
    
    verify(para){
        Accounts.verifyEmail(para, (err) => {
            if(err){
                Log('verify....', err)
                this.showSuccess('verify-failed')
            }else{
                this.showSuccess('verify-successed')
            }
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