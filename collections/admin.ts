declare var CouchDB;
declare var Ground;
declare var Meteor;
declare var Mongo;

Ground.Collection(Meteor.users);

//['注册用户', '贵宾', '华鹤同门', '易学老师', '管理员']
enum gp {User = 1, Vip = 2, Huahe = 4, Master = 8 , Admin = 16, Super = 32, Owner = 64}

export var DelResource = new CouchDB.Database('delresource')
DelResource.allow({
    insert: function() {
        var user = Meteor.user();
        return !!user;
    },
    update: function() {
        var user = Meteor.user();
        return !!user && user.profile.group > gp.Master;
    },
    remove: function() {
        var user = Meteor.user();
        return !!user && user.profile.group > gp.Master;
    }
});