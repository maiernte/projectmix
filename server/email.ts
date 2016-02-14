import {LogDB} from 'server/tylogger'

declare var Meteor;
declare var Accounts;
declare var _;
declare var process;

var baseurl = (process.env.ROOT_URL || "https://huahe.eu-gb.mybluemix.net")
baseurl = baseurl.endsWith('/') ? baseurl + '#/' : baseurl + '/#/'

function validateEmail(email) {
    try{
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    }catch(err){
        LogDB(err.toString(), 'validateEmail()', this.userId)
        return false
    }
}

function writeVerifyEmail(address, token, name){
    try{
        let http = baseurl + 'verify/' + token
        let mail = {
            to: address,
            from: 'huahe@huaheyixue.com',
            html: `<html>
                    <head>华鹤易学</head>
                    <body>
                        <p>${name} 您好！感谢使用华鹤易学软件！我们致力为您提供最简洁，实用的易学平台。</p>
                        <br/>
                        <a href='${http}'>点击确认邮箱地址</a>
                    </body>
                   </html>`,
            text: '邮箱验证',
            subject: '邮箱验证'
        }
    
        return mail
    }catch(err){
        LogDB(err.toString(), 'writeVerifyEmail()', this.userId)
        return null
    }
}

function writeResetPasswordEmail(address, token, name){
    try{
        let http = baseurl + 'resetpw/' + token
        let mail = {
            to: address,
            from: 'huahe@huaheyixue.com',
            html: `<html>
                    <head>华鹤易学</head>
                    <body>
                        <p>${name} 您好！请点击以下链接设置您的新密码。</p>
                        <br/>
                        <a href='${http}'>点击重设密码</a>
                    </body>
                   </html>`,
            text: '重设密码',
            subject: '重设密码'
        }
    
        return mail
    }catch(err){
        LogDB(err.toString(), 'writeResetPasswordEmail()', this.userId)
        return null
    }
}

function RandomStr(length: number){
    try{
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }catch(err){
        LogDB(err.toString(), 'RandomStr()', this.userId)
        return ''
    }
}

export function changeEmail(uid, mail){
    try{
        if(!mail || !validateEmail(mail)){
            //throw new Error("无效邮件地址.");
            return "无效邮件地址！"
        }
    
        let user = Meteor.users.findOne({_id: uid})
        var oldmail = _.find(user.emails || [],
            function (e) { return e.address; });
        let address = (oldmail || {}).address;
        console.log(address, mail)
        if(address && address == mail){
            return 'mail is unchanged'
        }
    
        if(address){
            Accounts.removeEmail(uid, address)
        }
    
        Accounts.addEmail(uid, mail)
        return 'ok'
    }catch(err){
        LogDB(err.toString(), 'changeEmail()', uid)
        return err.toString()
    }
}

// return token
export function verificationMail(uid, address): Object{
    try{
        // Make sure the user exists, and address is one of their addresses.
        var user = Meteor.users.findOne({_id: uid});
        if (!user){
            //throw new Error("Can't find user");
            console.log('Cannot find user')
            return null
        }
    
    
        // pick the first unverified address if we weren't passed an address.
        if (!address) {
            var email = _.find(user.emails || [],
                             function (e) { return !e.verified; });
            address = (email || {}).address;
        }
    
        // make sure we have a valid address
        if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)){
            //throw new Error("No such email address for user.");
            console.log('no email')
            return null
        }
    
    
        var tokenRecord = {
            token: RandomStr(44),
            address: address,
            when: new Date()
        };
    
        Meteor.users.update({_id: uid}, {$push: {'services.email.verificationTokens': tokenRecord}});
    
        // before passing to template, update user object with new token
        Meteor._ensure(user, 'services', 'email');
            if (!user.services.email.verificationTokens) {
                user.services.email.verificationTokens = [];
            }
    
        user.services.email.verificationTokens.push(tokenRecord);
    
        //var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);
    
        var mailbody = writeVerifyEmail(address, tokenRecord.token, user.username)
        return mailbody;
    }catch(err){
        LogDB(err.toString(), 'verificationMail()', uid)
        return null
    }
}

export function sendResetPasswordEmail (userId, email) {
    try{
        // Make sure the user exists, and email is one of their addresses.
        var user = Meteor.users.findOne(userId);
        if (!user)
            throw new Error("Can't find user");
            
        // pick the first email if we weren't passed an email.
        if (!email && user.emails && user.emails[0])
            email = user.emails[0].address;
            
        // make sure we have a valid email
        if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))
            throw new Error("No such email for user.");
    
        var tokenRecord = {
            token: RandomStr(44),
            email: email,
            when: new Date()
        };
        
        Meteor.users.update(userId, {$set: {
            "services.password.reset": tokenRecord
        }});
        
        // before passing to template, update user object with new token
        Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
    
        var mailbody = writeResetPasswordEmail(email, tokenRecord.token, user.username)
        return mailbody;
    }catch(err){
        LogDB(err.toString(), 'sendResetPasswordEmail()', userId)
        return err.toString()
    }
};