/// <reference path="../typings/book.d.ts" />

declare var CouchDB;
declare var Ground;
declare var Meteor;
declare var Mongo;

//export var Books = new CouchDB.Database("books");
//export var Books = new Meteor.Collection('books')
export var Books = new Mongo.Collection<Book>('books');

export var BkRecords = new CouchDB.Database('bkrecord')

export var LocalRecords = new Ground.Collection(null);

Books.allow({
    insert: function() {
        var user = Meteor.user();
        return !!user;
    },
    update: function() {
        var user = Meteor.user();
        return !!user;
    },
    remove: function() {
        var user = Meteor.user();
        return !!user;
    }
});

BkRecords.allow({
    insert: function() {
        var user = Meteor.user();
        return !!user;
    },
    update: function() {
        var user = Meteor.user();
        return !!user;
    },
    remove: function() {
        var user = Meteor.user();
        return !!user;
    }
});

if (Meteor.isCordova) {
    Ground.Collection(Books);
}
