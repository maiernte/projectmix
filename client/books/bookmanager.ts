/// <reference path="../../typings/meteor/meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Books, BkRecords, LocalBooks, LocalRecords} from 'collections/books'

declare var Promise: any;

export class Bookmanager{
    
    private pbbooks: Array<Book>;
    
    constructor(){
    }
    
    get MyBooks(){
        return LocalBooks.find({}, {sort: {readed: 'desc'}}).fetch();
    }
    
    GetPublic(reload: boolean): any{
        let promise = new Promise((resolve, reject) => {
            if(this.pbbooks && reload != true){
                resolve(this.pbbooks)
                return
            }
        
            Meteor.subscribe('books', (err) => {
                if(err){
                    resolve([])
                    return
                }
            
                this.pbbooks = Books.find({public: true}).fetch()
                resolve(this.pbbooks)
            });
        })
        
        return promise
    }
    
    DownloadBooks(): any{
        let promise = new Promise((resolve, reject) => {
            Meteor.subscribe('books', (err) => {
                if(err){
                    resolve(false)
                    return
                }
            
                let books = Books.find().fetch()
                for(let bk of books){
                    if(!bk.readed){
                        bk['readed'] = bk.modified
                    }
                    
                    bk['cloud'] = true
                    let localbk = LocalBooks.findOne({_id: bk._id})
                    if(!localbk){
                        LocalBooks.insert(bk)
                    }else{
                        if(bk.modified > localbk.modified){
                            this.UpdateBook(bk)
                        }
                    }
                }
                
                resolve(true)
            });
        })
        
        return promise
    }
    
    UploadBook(bookid: string): any{
        let promise = new Promise((resolve, reject) => {
            let book = LocalBooks.findOne({_id: bookid})
            if(!book) return;

            if(book.cloud == false){
                book.cloud = true;
                book.owner = Meteor.userId();

                Books.insert(book, (err, id) => {
                    if(err){
                        reject(err)
                    }else{
                        LocalBooks.update({_id:bookid}, {
                            $set: {
                                cloud: true,
                                owner: Meteor.userId()
                            }
                        })

                        resolve(true)
                    }
                })
            }else{
                Books.update(book, (err, res) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(true)
                    }
                })
            }
        })
        
        return promise;
    }
    
    DeleteBook(bookid: string): any{
        let promise = new Promise((resolve, reject) => {
            let book = LocalBooks.findOne({_id: bookid})
            if(book.cloud == false){
                LocalRecords.remove({book: bookid})
                LocalBooks.remove({_id: bookid})
                resolve(null)
            }else{
                book.deleted = true
                book.modified = Date.now()

                Books.update(book, (err, res) => {
                    if(!err){
                        LocalRecords.remove({book: bookid})
                        LocalBooks.remove({_id: bookid})
                        resolve(null)
                    }else{
                        resolve(err)
                    }
                })
            }
        })
        
        return promise
    }
    
    private addDefaultBook(){
        LocalBooks.insert({
            name: '本地书集',
            description: '',
            icon: null,
            author: '我本人',
            owner: null,
            readpermission: 0,
            writepermission: 0,
            created: Date.now(),
            modified: Date.now(),
            readed: Date.now(),
            cloud: false,
            public: false,
            deleted: false
        })
    }
    
    private UpdateBook(bk: Book){
        LocalBooks.update({_id: bk._id}, {
            $set: {
                name: bk.name,
                description: bk.description,
                icon: bk.icon,
                author: bk.author,
                owner: bk.owner,
                readpermission: bk.readpermission,
                writepermission: bk.writepermission,
                created: bk.created,
                modified: bk.modified,
                readed: bk.readed,
                cloud: bk.cloud,
                deleted: bk.deleted,
                public: bk.public
            }
        })
    }
}