import {Books, LocalRecords, BkRecords} from 'collections/books'

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

Meteor.publish('bkrecordsum', function(bookid: string) {
    return BkRecords.find(buildQuery.call(this, bookid), {
        fields : ['_id']
    });
});
