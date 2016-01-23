import {Books, LocalRecords, BkRecords} from 'collections/books'

declare var Meteor;

Meteor.publish('books', function() {
    return Books.find({owner: this.userId});
});

Meteor.publish('bkrecord', function(bookid) {
    return BkRecords.find({
        $and: [
            {owner: this.userId},
            {book: bookid}
        ]
    });
});
