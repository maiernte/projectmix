/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgFor, ElementRef} from 'angular2/angular2'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books} from 'collections/books'

@Component({
    selector: "book-market",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookcontent.html",
    directives: [NgFor]
})
export class BookContent{
    private bookid: string;
    private bookname: string;
    records: Array<YiRecord>;
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    get BookName(){
        return this.bookname;
    }
    
    onInit(){
        this.bookid = this.routeParams.params['id']
        if(this.bookid && this.bookid != ''){
            let book = Books.findOne({_id: this.bookid})
            this.bookname = book.name;
        }else{
            this.bookname = '本地记录'
            this.records = LocalRecords.find().fetch();
            console.log("local records", this.records)
        }
    }
    
    goBack(){
        this.router.parent.navigate(['./List']);
    }
}