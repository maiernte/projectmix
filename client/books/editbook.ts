/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject} from 'angular2/angular2'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {Books} from 'collections/books'

@Component({
    selector: "book-edit",
    pipes:[TranslatePipe],
    templateUrl: "client/books/editbook.html",
    directives: []
})

export class BookEditor{
    private book: Book;

    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    onInit(){
        console.log('BookEditor', this.routeParams.params['id'])
        let id = this.routeParams.params['id']
        this.book = Books.findOne({_id: id})
        console.log(this.book)
    }

    goBack(){
        this.router.parent.navigate(['./List']);
    }
}