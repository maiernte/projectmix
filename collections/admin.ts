declare var CouchDB;
declare var Ground;
declare var Meteor;
declare var Mongo;

Ground.Collection(Meteor.users);

//['注册用户', '贵宾', '华鹤同门', '易学老师', '管理员']
enum gp {User = 1, Vip = 2, Huahe = 4, Master = 8 , Admin = 16, Super = 32, Owner = 64}

//{user: user._id, quote: 100, current: 0, del: []}
export var UserImages = new CouchDB.Database('userimg')
UserImages.allow({
    insert: function(userId, doc) {
        var user = Meteor.user();
        return !!user && user.profile.group > gp.Master;
    },
    update: function(userId, doc, modifiedDoc) {
        var user = Meteor.user();
        if(!user){
            return false
        }

        if(user.profile.group > gp.Master){
            return true
        }

        if(modifiedDoc.user != doc.user ||
            modifiedDoc.quote != doc.quote ||
            modifiedDoc.current < doc.current){
            return false
        }

        return user._id == userId;
    },
    remove: function(userId, doc) {
        var user = Meteor.user();
        return !!user && user.profile.group > gp.Master;
    }
});

