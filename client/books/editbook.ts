/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {FormBuilder, ControlGroup, Validators, FORM_DIRECTIVES, NgIf} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {MeteorComponent} from 'angular2-meteor';

import {LocalBooks} from 'collections/books'

declare var jQuery;

@Component({
    selector: "book-edit",
    pipes:[TranslatePipe],
    templateUrl: "client/books/editbook.html",
    directives: [FORM_DIRECTIVES, NgIf]
})

export class BookEditor extends MeteorComponent{
    private book: Book;
    Name: string;
    Desc: string;
    Author: string;
    Modified: string;

    Loaded = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
        super()
    }
    
    get IsCloud(){
        return this.book ? this.book.cloud : false
    }
    
    ngOnInit(){
        let id = this.routeParams.params['id']
        this.book = LocalBooks.findOne({_id: id})
        if(this.book){
            this.Name = this.book.name;
            this.Desc = this.book.description;
            this.Author = this.book.author;
            this.Modified = this.toChina(new Date(this.book.modified))
        }else{
            this.Name = ''
            this.Desc = ''
            this.Author = ''
            this.Modified = ''
        }
        
        this.Loaded = true;
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
        if(!this.Name || this.Name == ''){
            this.glsetting.ShowMessage("保存书集", "请给您的新书一个名字。")
            return
        }
        
        
        if(this.book){
            this.updateBook();
        }else{
            this.addBook();
        }
    }
    
    pushCloud(){
        if(this.book.cloud == true) return;
    
        let msg = "一旦转为云书集， 则不可以转为纯本地书集。要将此书集推送到云端吗？"
        this.glsetting.ShowMessage("推送云端", msg, () => {
            let bkmanager = this.glsetting.BookManager;
            bkmanager.UploadBook(this.book._id)
        })
    }
    
    private addBook(){
        LocalBooks.insert({
            name: this.Name,
            description: this.Desc,
            icon: null,
            author: this.Author,
            owner: Meteor.userId(),
            readpermission: 0,
            writepermission: 0,
            created: Date.now(),
            modified: Date.now(),
            readed: Date.now(),
            cloud: false,
            deleted: false,
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
        this.Loaded = false
        LocalBooks.update(this.book._id, {
            $set: {
                name: this.Name,
                description: this.Desc,
                author: this.Author,
                modified: Date.now(),
                readed: Date.now()
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
    
    private toChina(d: Date): string{
        let res = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + d.getHours() + "时" + d.getMinutes() + "分";
        return res;
    }
}