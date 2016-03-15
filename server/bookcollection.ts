import {Books, LocalRecords, BkRecords} from 'collections/books'
import {UserImages, DelImages} from  'collections/admin'
import {LogDB} from 'lib/tylogger'

declare var Meteor;
declare var Counts;

Meteor.publish('books', function() {
    try{
        return Books.find({owner: this.userId, deleted: false});
    }catch(err){
        LogDB(err.toString(), 'publish books', this.userId)
        return null
    }
});

function buildQuery(bookid?: string): Object {
    try{
        var isAvailable = {
            $and: [
                {owner: this.userId},
                {book: bookid},
                {created: {$gt: 0}}
            ]
        };
    
        return isAvailable;
    }catch(err){
        LogDB(err.toString(), 'buildQuery: ' + bookid, this.userId)
        return false
    }
}

Meteor.publish('bkrecord', function(bookid: string, options: Object) {
    try{
        return BkRecords.find(buildQuery.call(this, bookid), options);
    }catch(err){
        LogDB(err.toString(), options, 'publish: ' + bookid)
        return null
    }
});

Meteor.publish('userimg', function() {
    try{
        return UserImages.find();
    }catch(err){
        LogDB(err.toString(), null, 'publish: userimg')
        return null
    }
})

Meteor.publish('delimg', function() {
    try{
        return DelImages.find();
    }catch(err){
        LogDB(err.toString(), null, 'publish: delimg')
        return null
    }
})
