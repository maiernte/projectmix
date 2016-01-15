/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef} from 'angular2/core'
import {FormBuilder, ControlGroup, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {Books} from 'collections/books'

declare var jQuery;

@Component({
    selector: "book-edit",
    pipes:[TranslatePipe],
    templateUrl: "client/books/editbook.html",
    directives: [FORM_DIRECTIVES]
})

export class BookEditor{
    private book: Book;
    Name: string;
    Desc: string;
    Author: string;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    ngOnInit(){
        let id = this.routeParams.params['id']
        if(id){
            this.book = Books.findOne({_id: id})
            this.Name = this.book.name;
            this.Desc = this.book.description;
            this.Author = this.book.author;
        }
        
        jQuery(this.rootElement.nativeElement)
            .find('.message .close')
            .on('click', function() {
                jQuery(this)
                  .closest('.message')
                  .transition('fade');
            });
    }

    goBack(){
        this.router.parent.navigate(['./List']);
    }
    
    saveBook(){
        //console.log("addBook", this.Name, this.Desc, this.Author)
        if(this.book){
            this.updateBook();
        }else{
            this.addBook();
        }
    }
    
    private addBook(){
        Books.insert({
            name: this.Name,
            description: this.Desc,
            icon: null,
            author: this.Author,
            owner: null,
            readpermission: 0,
            writepermission: 0,
            created: Date.now(),
            modified: Date.now(),
        }, (err, id) => {
            if(err){
                jQuery(this.rootElement.nativeElement)
                    .find('.negative.message')
                    .transition('fade')
            }else{
               jQuery(this.rootElement.nativeElement)
                    .find('.positive.message')
                    .transition('fade')
            }
        });
    }
    
    private updateBook(){
        this.book.name = this.Name;
        this.book.description = this.Desc;
        this.book.author = this.Author;
        this.book.modified = Date.now()
        
        Books.update(this.book, false, (err, res) => {
            if(err){
                jQuery(this.rootElement.nativeElement)
                    .find('.negative.message')
                    .transition('fade')
            }else{
                jQuery(this.rootElement.nativeElement)
                    .find('.positive.message')
                    .transition('fade')
            }
        })
    }
}