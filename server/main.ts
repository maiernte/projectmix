import {loadBooks} from 'server/load_books'
import './bookcollection';
import {changeEmail, verificationMail} from 'server/email'

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
        
        changeMail: function(uid, mail){
            return changeEmail(uid, mail)
        },

        sendVerificationEmail: function(uid, email){
            let mailbody = verificationMail(uid, email)
            //console.log('mail url', mailbody)
            NigerianPrinceGun.send(mailbody)
            return true
        }
    })
}); 