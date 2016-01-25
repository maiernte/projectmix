/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {FormBuilder, ControlGroup, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {MeteorComponent} from 'angular2-meteor';

import {Books} from 'collections/books'

declare var jQuery;

@Component({
    selector: "book-edit",
    pipes:[TranslatePipe],
    templateUrl: "client/books/editbook.html",
    directives: [FORM_DIRECTIVES]
})

export class BookEditor extends MeteorComponent{
    private book: Book;
    Name: string;
    Desc: string;
    Author: string;

    Loaded = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
        super()
    }
    
    ngOnInit(){
        let id = this.routeParams.params['id']
        if(id){
            this.subscribe('books', () => {
                this.book = Books.findOne({_id: id})
                this.Name = this.book.name;
                this.Desc = this.book.description;
                this.Author = this.book.author;
                this.ngZone.run(() => {
                    this.Loaded = true;
                })
            })
        }else{
            this.Loaded = true;
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
            owner: Meteor.userId(),
            readpermission: 0,
            writepermission: 0,
            created: Date.now(),
            modified: Date.now(),
            public: false
        }, (err, id) => {
            if(err){
                jQuery('.negative.editbook.message').transition('fade')
            }else{
                jQuery('.positive.editbook.message').transition('fade')
            }
        });
    }
    
    private updateBook(){
        /*this.book.name = this.Name;
        this.book.description = this.Desc;
        this.book.author = this.Author;
        this.book.modified = Date.now()*/

        /*Books.update(this.book, false, (err, res) => {
            if(err){
                jQuery(this.rootElement.nativeElement)
                    .find('.negative.message')
                    .transition('fade')
            }else{
                jQuery(this.rootElement.nativeElement)
                    .find('.positive.message')
                    .transition('fade')
            }
        })*/

        this.Loaded = false
        Books.update(this.book._id, {
            $set: {
                name: this.Name,
                description: this.Desc,
                author: this.Author,
                modified: Date.now()
            }
        }, (err, res) => {
            this.ngZone.run(() => {
                this.Loaded = true;
            })

            if(err){
                jQuery('.negative.editbook.message').transition('fade')
            }else{
                jQuery('.positive.editbook.message').transition('fade')
            }
        })
    }
}