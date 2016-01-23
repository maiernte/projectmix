function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}

function writeVerifyEmail(address, token){
    let http = "https://huahemeteor-maiernte.c9users.io/#/verify/" + token
    let mail = {
        to: address,
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

var baseurl = ""

function RandomStr(length: number)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function changeEmail(uid, mail){
    if(!mail || !validateEmail(mail)){
        throw new Error("无效邮件地址.");
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
}

// return token
export function verificationMail(uid, address): Object{
    // Make sure the user exists, and address is one of their addresses.
    var user = Meteor.users.findOne({_id: uid});
    if (!user)
        throw new Error("Can't find user");

    // pick the first unverified address if we weren't passed an address.
    if (!address) {
        var email = _.find(user.emails || [],
                         function (e) { return !e.verified; });
        address = (email || {}).address;
    }

    // make sure we have a valid address
    if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address))
        throw new Error("No such email address for user.");

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

    var mailbody = writeVerifyEmail(address, tokenRecord.token)
    return mailbody;
}