/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgZone} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'


import {Books, LocalRecords} from 'collections/books'

declare var jQuery;
declare var CouchDB: any;
declare var Mongo;

@Component({
    selector: "book-market",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookmarket.html",
    directives: [NgFor]
})
export class BookMarket{
    private books: Array<BookView>;
    private bookCur: Mongo.Cursor<Book>;

    Market = 'private'
    Loading = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    get Books(){
        return this.books;
    }
    
    showMenu(hide) {
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    } 
    
    ngOnInit() {
        let hideMenu = true;
        this.showMenu(hideMenu);
        this.loadBooks(false);
    }
    
    deleteBook(book: BookView){
        jQuery('.delete.book.modal')
        .modal({
            closable  : false,
            onDeny    : function(){
            },
            onApprove : () => {
                // need to update records 
                
                Books.remove(book.Id, (err) => {
                    if(!err){
                        this.loadBooks(true)
                    }else{
                        this.glsetting.ShowMessage('操作失败', err)
                    }
                });
            }
        })
        .modal('show')
    }
    
    editBook(book: BookView){
        console.log(this.glsetting.Signed)
        if(book){
            this.router.parent.navigate(['./EditBook', {id: book.Id}])
        }else{
            if(this.glsetting.Signed == false){
                this.glsetting.ShowMessage('创建书集', '您还没有注册或者登录, 无法创建在线书集.')
            }else{
                this.router.parent.navigate(['./EditBook', {id: null}])
            }
        }
    }
    
    openBook(book: BookView){
        let bookid = book.Id ? book.Id : ''
        this.router.parent.navigate(['./BookContent', {id: bookid}])
    }
    
    private loadBooks(reload){
        this.Loading = true;
        this.books = []
        this.glsetting.LoadBooks(reload).then(bks => {
            for(let bk of bks){
                this.books.push(new BookView(bk))
            }
            
            this.ngZone.run(() => {
                this.Loading = false
            })
        }).catch(err => {
            console.log('load book error', err)
            this.ngZone.run(() => {
                this.Loading = false
            })
        })
    }
}

class BookView{
    constructor(private book: Book){
        
    }
    
    get Id(){
        return this.book._id;
    }
    
    get Name(){
        return this.book.name;
    }
    
    get Desc(){
        return this.book.description;
    }
    
    get Author(){
        let res = this.book.author ? this.book.author : '';
        res = res.trim();
        return res == '' ? '当前用户' : res;
    }
    
    get IsCloud(){
        return this.book._id != null;
    }
    
    get Editable(){
        return this.book._id != null;
    }
    
    get Created(){
        let date = this.book.created ? new Date(this.book.created) : new Date(Date.now())
        return this.toChina(date);
    }
    
    get Modified(){
        let date = this.book.modified ? new Date(this.book.modified) : new Date(Date.now())
        return this.toChina(date);
    }
    
    private toChina(d: Date): string{
        let res = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
        return res;
    }
}