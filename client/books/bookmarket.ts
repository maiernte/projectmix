/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgFor} from 'angular2/angular2'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {Books} from 'collections/books'

declare var jQuery;

@Component({
    selector: "book-market",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookmarket.html",
    directives: [NgFor]
})
export class BookMarket{
    private books: Array<BookView>;
    
    glsetting:GlobalSetting;
    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
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
    
    onInit() {
        let hideMenu = true;
        this.showMenu(hideMenu);
        
        this.loadBooks();
    }
    
    deleteBook(book: BookView){
        jQuery('.delete.book.modal')
        .modal({
            closable  : false,
            onDeny    : function(){
            },
            onApprove : () => {
              Books.remove(book.Id);
              this.loadBooks();
            }
        })
        .modal('show')
    }
    
    editBook(book: BookView){
        this.router.parent.navigate(['./EditBook', {id: book.Id}])
    }
    
    private loadBooks(){
        let tmp = Books.find().fetch()
        
        this.books = new Array<BookView>();
        let localbook = {
            _id: null,
            name: '本地记录',
            description: '同时保存卦例、八字等排盘记录。本地记录只能被当前移动设备访问。',
            icon: null,
            owner: null,
            readpermission: 0,
            writepermission: 0,
            author: null,
            created: this.glsetting.GetSetting('created'),
            modified: this.glsetting.GetSetting('modified'),
        }
        
        this.books.push(new BookView(localbook));
        for(let b of tmp){
            this.books.push(new BookView(b))
        }
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
    
    createNewBook(){
        //     declare type Book = {
        //     _id?: string,
        //     name: string,
        //     description?: string,
        //     icon?: string,
        //     owner?: string,
        //     readpermission: number,
        //     writepermission: number,
        //     author?: string,
        //     created: number,
        //     modified: number,
        // }
        
        // Parties.insert({
        //     name: party.name,
        //     description: party.description,
        //     location: party.location
        // });
    }
    
    private toChina(d: Date): string{
        let res = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
        return res;
    }
}