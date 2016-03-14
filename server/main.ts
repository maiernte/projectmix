/// <reference path="../typings/book.d.ts" />

import './bookcollection';
import {changeEmail, verificationMail, sendResetPasswordEmail} from 'server/email'
import {BkRecords} from 'collections/books'
import {UserImages} from 'collections/admin'
import {initQiniu} from "./qiniu"

import {LogDB} from 'server/tylogger'

declare var Meteor;
declare var Mailgun;
declare var Accounts;
declare var process;

Meteor.startup(function(){
    initQiniu()
    console.log("baseurl", process.env.ROOT_URL)

    Meteor.onConnection(function(evt) {
        console.log('onConnection  : ' + evt.clientAddress)
    })
    
    var options = {
            apiKey: 'key-f1c82d8c2b8c0ab791faf1e1819d8f33',
            domain: 'sandboxdbf0d92981a346b1b8a136edfeeedd3e.mailgun.org'
        }
        
    var NigerianPrinceGun = new Mailgun(options);
        
    Accounts.onCreateUser(function(options, user) {
        try{
            Meteor.setTimeout(function() {
                let mailbody = verificationMail(user._id, null)
                if(mailbody){
                    NigerianPrinceGun.send(mailbody)
                }

                UserImages.insert({user: user._id, quote: 100, current: 0, del: []})
            }, 5 * 1000);
        }catch(err){
            LogDB(err.toString(), options, 'onCreateUser')
            console.log(err)
        }
        
        if (options.profile){
            user.profile = options.profile;
        }

        return user;
    });

    Meteor.methods({
        changeMail: function(uid, mail){
            return changeEmail(uid, mail)
        },

        sendVerificationEmail: function(uid, email){
            try{
                let mailbody = verificationMail(uid, email)
                NigerianPrinceGun.send(mailbody)
                return true
            }catch(err){
                LogDB(err.toString(), email, uid)
                return false
            }
        },
        
        sendResetPasswordEmail: function(email){
            try{
                let user = Accounts.findUserByEmail(email)
                if(!user){
                    return "找不到使用这个信箱的用户。"
                }
                
                let mailbody = sendResetPasswordEmail(user._id, email)
                NigerianPrinceGun.send(mailbody)
                console.log('reset password email is sended.')
                return null
            }catch(err){
                LogDB(err.toString(), email, this.userId)
                return err.toString()
            }
        },
        
        reportToAdmin: function(content){
            try{
                let mail = {
                    to: 'meerbusch@sina.com',
                    from: 'huahe@huaheyixue.com',
                    html: `<html>
                            <head>华鹤易学</head>
                            <body>
                                ${content}
                            </body>
                           </html>`,
                    text: '用户报告',
                    subject: '华鹤易学'
                }
                
                NigerianPrinceGun.send(mail)
                return null
            }catch(err){
                LogDB(err.toString(), content, this.userId)
                return err.toString()
            }
        },

        upsertRecord: function(record: YiRecord){
            try{
                BkRecords.upsert(record)
            }catch(err){
                LogDB(err.toString(), record, this.userId)
            }
        }
    })
}); 