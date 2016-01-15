declare var CouchDB;
declare var Ground;

export var Books = new CouchDB.Database("books");

export var LocalRecords = new Ground.Collection(null);