/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'
import {NgIf} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var Promise:any;

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
                this.glsetting.ShowMessage("更新数据失败", err)
            })
        }
    }
    
    sendVerifyEmail(){
        Meteor.call('sendVerificationEmail', Meteor.userId(), this.Email, (err, response) => {
            if(!err){
                console.log('email is sended!')
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
        
        this.profile = JSON.parse(JSON.stringify(user.profile));
        this.Username = user.username
        this.NickName = user.profile.nickname
        this.Moto = user.profile.moto

        let sum = user.profile.group
        this.Group = sum > 0 ? UerProfile.groupDef[1] : UerProfile.groupDef[0]
        this.Group = Math.floor(sum / 2) > 0 ? UerProfile.groupDef[2] : this.Group
        this.Group = Math.floor(sum / 4) > 0 ? UerProfile.groupDef[4] : this.Group
        this.Group = Math.floor(sum / 8) > 0 ? UerProfile.groupDef[8] : this.Group

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
        Meteor.call('changeMail', Meteor.userId(), newmail, (err, res) => {
            if(err){
                this.glsetting.ShowMessage("更改邮箱失败", err)
            }else{
                console.log('change mail successed:', res)
            }
        })
    }
}