/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books} from 'collections/books'
import {RecordHelper} from './record/recordhelper'

declare var jQuery;

@Component({
    selector: "book-content",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookcontent.html",
    directives: [NgFor]
})
export class BookContent{
    private bookid: string;
    private bookname: string;
    records: Array<YiRecord>;

    private rdviews: Array<RecordHelper>;
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    get BookName(){
        return this.bookname;
    }

    get Records(){
        return this.rdviews;
    }
    
    ngOnInit(){
        this.bookid = this.routeParams.params['id']
        if(this.bookid && this.bookid != ''){
            let book = Books.findOne({_id: this.bookid})
            this.bookname = book.name;
        }else{
            this.bookname = '本地记录'
            this.records = LocalRecords
                .find({})
                .map(r => {
                    return {
                        _id: r._id,
                        gua: r.gua,
                        bazi: r.bazi,
                        question: r.question,
                        description: null,
                        owner: null,
                        feed: r.feed,
                        created: r.created,
                        modified: r.modified
                    };
                }).reverse();

            this.rdviews = [];
            for(let rd of this.records){
                let view  = new RecordHelper(rd);
                this.rdviews.push(view);
            }
        }

        jQuery(this.rootElement.nativeElement)
            .find('.ui.accordion')
            .accordion();
    }
    
    goBack(){
        this.router.parent.navigate(['./List']);
    }

    deleteRecords(){
        let ids = this.rdviews.filter(r => r.Checked).map(r => {return r.Id})
        if(ids.length == 0)return;

        jQuery('.delete.record.modal')
            .modal({
                closable  : false,
                onDeny    : function(){
                },
                onApprove : () => {
                    this.rdviews = this.rdviews.filter(r => !r.Checked);
                    for(let id of ids){
                        LocalRecords.remove(id)
                    }
                }
            })
            .modal('show')
    }

    openRecord(rd: RecordHelper){
        this.router.parent.navigate(['./BookRecord', {bid: this.bookid, rid: rd.Id}])
    }
}

