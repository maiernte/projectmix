/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'
import {NgIf} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'


@Component({
    templateUrl: 'client/user/userprofile.html',
    pipes: [TranslatePipe],
    directives: [NgIf],
})
export class UerProfile{
    private static groupDef = ['注册用户', '贵宾', '华鹤同门', '易学老师', '管理员']

    Username = ''
    Email = ''
    Moto = ''
    Icon = ''
    Group = ''
    NickName = ''
    MailVerified = false

    private EditName = false;
    private Editemail = false;
    private Editmoto = false;
    
    private profile: Object;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
    }

    changeNickName(){
        if(this.EditName == false){
            this.EditName = true;
        }else{
            this.EditName = false;
            
            console.log(this.profile)
            this.updateProfile(this.NickName)
        }
    }

    changeEmail(){
        if(this.Editemail == false){
            this.Editemail = true;
        }else{
            this.Editemail = false;
            // update Email
            //this.sendVerifyEmail();
            
            Meteor.call("sendVerifyMail", Meteor.userId(), this.Email,
            (err, res) => {
                if(err){
                    console.log('chang mail err: ', err)
                }else{
                    console.log('chang mail ok!', err)
                }
            })
        }
    }

    changeMoto(){
        if(this.Editmoto == false){
            this.Editmoto = true;
        }else{
            this.Editmoto = false;
            // update Moto
        }
    }
    
    sendVerifyEmail(){
        let code = this.glsetting.RandomStr(5)
        let url = "https://huahecloud-maiernte.c9users.io/#/verify/" + code
        let mail = {
            to: this.Email,
            from: 'huahe@huaheyixue.com',
            html: `<html>
                    <head>华鹤易学</head>
                    <body>
                        <p>感谢您的使用!</p>
                        <br/>
                        <a href='${url}'>点击确认邮箱地址</a>
                    </body>
                   </html>`,
            text: 'Text',
            subject: '邮箱验证'
        }
        
        Meteor.call('sendMail', mail, (err, response) => {
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
    
    private updateProfile(data){
        console.log("try update profile")
        Meteor.users.update(
            {_id: Meteor.userId()}, 
            {$set: {'profile.nickname': data}}, 
            (err, res) => {
                if(err){
                    this.glsetting.ShowMessage("更新数据失败", err)
                }else{
                    console.log("update profile")
                }
            });
    }
}