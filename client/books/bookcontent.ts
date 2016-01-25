/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />
/// <reference path="../../typings/ng2-pagination.d.ts" />

import {Component, Inject, NgZone, ElementRef} from 'angular2/core'
import {NgFor, NgIf} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books, BkRecords} from 'collections/books'
import {RecordHelper} from './record/recordhelper'

import {MeteorComponent} from 'angular2-meteor';
import {PaginationService, PaginatePipe, PaginationControlsCpm} from 'ng2-pagination';

declare var jQuery;
declare var Promise;
declare var CouchDB: any;

@Component({
    selector: "book-content",
    pipes:[TranslatePipe, PaginatePipe],
    templateUrl: "client/books/bookcontent.html",
    directives: [NgFor, NgIf, PaginationControlsCpm],
    viewProviders: [PaginationService]
})
export class BookContent extends MeteorComponent{
    private bookid: string;
    private bookname: string;
    records: Array<YiRecord>;

    private rdviews: Array<RecordHelper>;

    Loaded = false;
    pageSize: number = 2;
    curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
    sumItems: number = this.pageSize
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
        super()
    }
    
    get BookName(){
        return this.bookname;
    }
    
    set BookName(value){
        this.bookname = value
    }

    get Records(){
        return this.rdviews;
    }

    set Records(value){
        this.rdviews = value
    }
    
    ngOnInit(){
        this.bookid = this.routeParams.params['id']
        this.bookname = ''
        //this.loadRecordes();
        this.loadContent()
    }
    
    goBack(){
        this.router.parent.navigate(['./List']);
    }

    deleteRecords(){
        let ids = this.rdviews.filter(r => r.Checked).map(r => {return r.Id})
        if(ids.length == 0){
            jQuery('.no-record.modal').modal('show')
            return;
        }

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
                /*this.ngZone.run(() => {
                    return this.loadRecordes();
                })*/
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

    onPageChanged(page: number) {
        this.curPage.set(page);
    }

    private loadContent(){
        this.subscribe('books', () => {
            let book = Books.findOne({_id: this.bookid})
            this.BookName = book.name;
        })

        this.records = []
        this.rdviews = []

        this.records = LocalRecords
            .find({book: this.bookid})
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

        this.sumItems = this.records.length
        this.buildRecordView();
        this.Loaded = true;
    }

    private loadRecordes(): any{
        this.Loaded = false;

        let promise = new Promise((resolve, reject) => {
            if(this.bookid && this.bookid != ''){
                this.subscribe('books', () => {
                    let book = Books.findOne({_id: this.bookid})
                    this.BookName = book.name;
                })

                this.records = []
                this.rdviews = []

                this.autorun(() => {
                    /*Meteor.setTimeout(() => {
                        let countOpt = {
                            fields : ['_id']
                        }
                        this.subscribe('bkrecord', this.bookid, countOpt, () => {
                            this.ngZone.run(() => {
                                this.sumItems = BkRecords.find().count();
                            })
                        })
                    }, 2 * 1000)*/

                    Meteor.setTimeout(() => {
                        this.subscribe('bkrecordsum', this.bookid, () => {
                            this.ngZone.run(() => {
                                this.sumItems = BkRecords.find().count();
                            })
                        })
                    }, 2 * 1000)


                    let options = {
                        limit: this.pageSize,
                        skip: (this.curPage.get() - 1) * this.pageSize,
                        sort: {created: 'desc'}
                    }

                    this.subscribe('bkrecord', this.bookid, options, () => {
                        this.records = BkRecords
                            .find()
                            .fetch()
                        this.buildRecordView()
                        this.ngZone.run(() => {
                            this.Loaded = true;
                        })
                    })
                }, true);
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

                this.sumItems = this.records.length
                this.buildRecordView();
                this.Loaded = true;
            }
        })

        return promise;
    }
    
    private buildRecordView(){
        let tmp = [];
        for(let rd of this.records){
            let view  = new RecordHelper(rd);
            tmp.push(view);
        }

        this.ngZone.run(() => {
            this.Records = tmp;    
        })
    }

    private doaddRecord(): any{
        let promise = new Promise((resolve, reject) => {
            let rd = this.glsetting.Clipboard;
            if(!rd){
                jQuery('.add-record.modal').modal('show')
            }else{
                if(this.bookid){
                    this.glsetting.Clipboard['book'] = this.bookid
                    this.glsetting.Clipboard['owner'] = Meteor.userId()
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

