import {loadBooks} from 'server/load_books'
import './bookcollection';

declare var Meteor;
declare var Mailgun;

function writeEmail(user, url){
    var items = url.split('/')
    
    let http = "https://huahemeteor-maiernte.c9users.io/#/verify/" + items[items.length - 1]
    let mail = {
        to: user.emails[0].address,
        from: 'huahe@huaheyixue.com',
        html: `<html>
                <head>华鹤易学</head>
                <body>
                    <p>感谢您的使用!</p>
                    <br/>
                    <a href='${http}'>点击确认邮箱地址</a>
                </body>
               </html>`,
        text: 'Text',
        subject: '邮箱验证'
    }
    
    return mail
}

Meteor.startup(function(){
    loadBooks();
    var options = {
            apiKey: 'key-f1c82d8c2b8c0ab791faf1e1819d8f33',
            domain: 'sandboxdbf0d92981a346b1b8a136edfeeedd3e.mailgun.org'
        }
        
    var smtp = {
        username: 'postmaster@sandboxdbf0d92981a346b1b8a136edfeeedd3e.mailgun.org',
        password: 'Todayfine1',
        server: 'smtp.mailgun.org',
        port: '587'
    };
    
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port
                                
    Accounts.emailTemplates = {
        from: 'Administrator <user@example.com>',
        siteName: 'YourSite',
        verifyEmail: {
            subject: function(user) {
              return 'Verification email from Example.com';
            },
            text: function(user, url) {
                let mail = writeEmail(user, url)
                Meteor.call('sendMail', mail);
                return 'Hi,\n' + 'Please open the link below to verify your account on Example.com:\n' + url;
            }
        }
    };
        
    var NigerianPrinceGun = new Mailgun(options);
    Meteor.methods({
        sendMail: function(mail){
            NigerianPrinceGun.send({
                'to': mail.to,
                'from': mail.from,
                'html': mail.html,
                'text': mail.text,
                'subject': mail.subject,
            });
        },
        
        sendVerifyMail: function(uid, mail){
            try{
                let user = Meteor.users.findOne({_id: uid})
                console.log('send verifyEmail', user, mail)
                /*Meteor.setTimeout(function() {
                    Accounts.sendVerificationEmail(uid, mail);
                }, 1 * 1000);*/
                return true
            }catch(err){
                return err
            }
        }
    })
}); 