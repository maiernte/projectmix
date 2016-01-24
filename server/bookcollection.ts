import {Books, LocalRecords, BkRecords} from 'collections/books'

declare var Meteor;

function buildQuery(partyId?: string): Object {
    var isAvailable = {
        $or: [
            { public: true },
            {
                $and: [
                    { owner: this.userId },
                    { owner: { $exists: true } }
                ]
            }
        ]
    };

    if (partyId) {
        return { $and: [{ _id: partyId }, isAvailable] };
    }

    return isAvailable;
}

Meteor.publish('books', function() {
    return Books.find({owner: this.userId});
});

Meteor.publish('bkrecord', function(bookid: string, options: Object) {
    return BkRecords.find({
        $and: [
            {owner: this.userId},
            {book: bookid},
            {created: {$gt: 0}}
        ]
    }, options);
});
