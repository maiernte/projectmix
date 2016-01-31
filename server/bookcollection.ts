import {Books, LocalRecords, BkRecords} from 'collections/books'
import {UserImages, DelImages} from  'collections/admin'

declare var Meteor;
declare var Counts;

Meteor.publish('books', function() {
    return Books.find({owner: this.userId});
});

function buildQuery(bookid?: string): Object {
    var isAvailable = {
        $and: [
            {owner: this.userId},
            {book: bookid},
            {created: {$gt: 0}}
        ]
    };

    return isAvailable;
}

Meteor.publish('bkrecord', function(bookid: string, options: Object) {
    return BkRecords.find(buildQuery.call(this, bookid), options);
});

Meteor.publish('userimg', function() {
    return UserImages.find();
})

Meteor.publish('delimg', function() {
    return DelImages.find();
})
