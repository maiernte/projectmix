import {Books, LocalRecords, BkRecords} from 'collections/books'

export function loadBooks() {
    Books.find();
    BkRecords.find();
    LocalRecords.find();
};