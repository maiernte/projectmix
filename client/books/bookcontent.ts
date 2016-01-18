/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, ElementRef} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books, BkRecords} from 'collections/books'
import {RecordHelper} from './record/recordhelper'

declare var jQuery;
declare var Promise;

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

    set Records(value){
        this.rdviews = value
    }
    
    ngOnInit(){
        this.bookid = this.routeParams.params['id']
        this.loadRecordes();
    }
    
    goBack(){
        this.router.parent.navigate(['./List']);
    }

    deleteRecords(){
        let ids = this.rdviews.filter(r => r.Checked).map(r => {return r.Id})
        if(ids.length == 0){
            /*jQuery(this.rootElement.nativeElement)
                .find('.no-record.modal')
                .modal('show')*/
            jQuery('.no-record.modal').modal('show')
            return;
        }

        //jQuery(this.rootElement.nativeElement)
        //    .find('.delete.record.modal')
        jQuery('.delete.record.modal')
            .modal({
                closable  : false,
                onDeny    : function(){
                },
                onApprove : () => {
                    this.rdviews = this.rdviews.filter(r => !r.Checked);
                    for(let id of ids){
                        if(this.bookid){
                            BkRecords.remove(id)
                        }else{
                            LocalRecords.remove(id)
                        }
                    }
                }
            })
            .modal('show')
    }

    addRecord(){
        this.doaddRecord()
            .then(res => {
                this.glsetting.Clipboard = null;
                return this.loadRecordes();
        }).then(res => {
            //jQuery('.add-record-success.modal').modal('show')
            this.router.parent.navigate(['./BookContent', {id: this.bookid}])
        }).catch(err => {
            this.glsetting.ShowMessage("新建记录失败", err)
        })
    }

    openRecord(rd: RecordHelper){
        this.router.parent.navigate(['./BookRecord', {bid: this.bookid, rid: rd.Id}])
    }

    private loadRecordes(): any{
        let promise = new Promise((resolve, reject) => {
            if(this.bookid && this.bookid != ''){
                let book = Books.findOne({_id: this.bookid})
                this.bookname = book.name;
                this.records = BkRecords
                    .find({book: this.bookid}, {sort: {created: 'desc'}})
                    .fetch()
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
            }

            let tmp = [];
            for(let rd of this.records){
                let view  = new RecordHelper(rd);
                tmp.push(view);
            }

            this.Records = tmp;
            resolve(true);
        })

        return promise;
    }

    private doaddRecord(): any{
        let promise = new Promise((resolve, reject) => {
            let rd = this.glsetting.Clipboard;
            if(!rd){
                jQuery('.add-record.modal').modal('show')
            }else{
                if(this.bookid){
                    this.glsetting.Clipboard['book'] = this.bookid
                    console.log(this.glsetting.Clipboard)
                    BkRecords.insert(this.glsetting.Clipboard, (err, id) => {
                        if(err){
                            reject(err)
                        }else {
                            resolve(true)
                        }
                    });
                }else{
                    LocalRecords.insert(this.glsetting.Clipboard, (err, id) => {
                        if(err){
                            reject(err)
                        }else {
                            resolve(true)
                        }
                    })
                }
            }
        });

        return promise;
    }

}

