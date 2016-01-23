import {loadBooks} from 'server/load_books'
import './bookcollection';
import {changeEmail, verificationMail, sendResetPasswordEmail} from 'server/email'

declare var Meteor;
declare var Mailgun;
declare var process;

Meteor.startup(function(){
    loadBooks();
    var options = {
            apiKey: 'key-f1c82d8c2b8c0ab791faf1e1819d8f33',
            domain: 'sandboxdbf0d92981a346b1b8a136edfeeedd3e.mailgun.org'
        }
        
    var NigerianPrinceGun = new Mailgun(options);
        
    Accounts.onCreateUser(function(options, user) {
        try{
            Meteor.setTimeout(function() {
                let mailbody = verificationMail(user._id)
                if(mailbody){
                    NigerianPrinceGun.send(mailbody)
                }
            }, 5 * 1000);
        }catch(err){
            console.log(err)
        }
        
        if (options.profile)
            user.profile = options.profile;
        return user;
    });

    
    Meteor.methods({
        changeMail: function(uid, mail){
            return changeEmail(uid, mail)
        },

        sendVerificationEmail: function(uid, email){
            let mailbody = verificationMail(uid, email)
            NigerianPrinceGun.send(mailbody)
            return true
        },
        
        sendResetPasswordEmail: function(email){
            let user = Accounts.findUserByEmail(email)
            if(!user){
                let err = new Error("找不到使用这个信箱的用户。")
                console.log(err)
                return err
            }
            
            let mailbody = sendResetPasswordEmail(user._id, email)
            NigerianPrinceGun.send(mailbody)
            console.log('reset password email is sended.')
            return null
        },
        
        reportToAdmin: function(content){
            console.log(content)
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
        }
    })
}); 