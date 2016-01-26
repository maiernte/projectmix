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
                        LocalRecords.update(id, {$set: {
                                question: '',
                                description: '',
                                feed: '',
                                gua: null,
                                bazi: null,
                                deleted: true,
                                modified: Date.now()
                            }
                        })
                    }
                    
                    this.loadContent();
                }
            })
            .modal('show')
    }

    openRecord(rd: RecordHelper){
        this.router.parent.navigate(['./BookRecord', {bid: this.bookid, rid: rd.Id}])
    }

    onPageChanged(page: number) {
        if(page <= 0){
            let idx = this.curPage.get() + (1 + page)
            let pages = Math.ceil(this.sumItems / this.pageSize)
            if(idx < 1 || idx > pages){
                console.log('index out of range', idx)
                return;
            }else{
                page = idx;
            }
        }
        
        this.curPage.set(page);
    }
    
    synchronCloud(){
        this.glsetting.ShowMessage("数据同步", '是否将这本书集的内容与云端数据同步？', () => {
            /*LocalRecords.clear()
            console.log('all data is reset')
            return*/
        
            this.cloudData().then(rds => {
                return this.download(rds)
            }).then(ids => {
                console.log("need to upload", ids)
                return this.upload(ids)
            }).then(errs => {
                if(errs.length == 0){
                    this.glsetting.ShowMessage('操作成功', '恭喜！数据已经全部同步！')
                    this.loadContent()
                }else{
                    this.glsetting.ShowMessage('上传数据错误', errs.join('; '))
                }
            }).catch(err => {
                //this.glsetting.ShowMessage('上传数据错误', err)
                console.log('catch err ', err)
            })
        });
    }

    private loadContent(){
        this.subscribe('books', () => {
            let book = Books.findOne({_id: this.bookid})
            this.BookName = book.name;
        })

        let records = LocalRecords
            .find({book: this.bookid, deleted: false}, 
                  {fields: {description: 0, img: 0}, sort: {created: 'desc'}})
            .fetch()
            
        
        this.sumItems = records.length
        this.onPageChanged(1)
        this.buildRecordView(records);
        this.Loaded = true;
    }

    private buildRecordView(records){
        //this.rdviews = []
        let tmp = [];
        for(let rd of records){
            let view  = new RecordHelper(rd);
            tmp.push(view);
        }

        this.ngZone.run(() => {
            this.Records = tmp;    
        })
    }
    
    private cloudData(): any{
        let promise = new Promise((resolve, reject) => {
            this.subscribe('bkrecord', this.bookid, {}, () => {
                let records = BkRecords.find().fetch()
                resolve(records);
            })
        })
        
        return promise;
    }
    
    private download(cloudData: Array<YiRecord>): any{
        let promise = new Promise((resolve, reject) => {
            let ids = LocalRecords.find({book: this.bookid}).map(rd => {return rd._id})
            
            for(let crd of cloudData){
                var lcd = LocalRecords.findOne({_id: crd._id})
                
                if(!lcd){
                    LocalRecords.insert(crd)
                    continue;
                }
                
                if(!!lcd && crd.modified > lcd.modified){
                    LocalRecords.update(lcd._id, {$set: {
                        gua: crd.gua,
                        bazi: crd.bazi,
                        question: crd.question,
                        description: crd.description,
                        feed: crd.feed,
                        img: crd.img,
                        modified: crd.modified,
                        deleted: crd.deleted
                    }})
                    
                    console.log('update local', lcd._id)
                    ids = ids.filter(i => i != lcd._id)
                }else if(lcd.modified == crd.modified){
                    console.log('record ist syn...', lcd._id)
                    ids = ids.filter(i => i != lcd._id)
                }else{
                    console.log('?', lcd, crd)
                }
            }
            
            resolve(ids)
        })
        
        return promise;
    }
    
    private upload(ids: Array<string>): any{
        let promise = new Promise((resolve, reject) => {
            let counter = ids.length
            let errinfo = []
            
            if(counter == 0){
                resolve(errinfo)
            }
            
            console.log('try upload ', ids)
            for(let id of ids){
                let lrd = LocalRecords.findOne({_id: id})
                if(!lrd){
                    console.log('en.... not good', id)
                    continue;
                }
                
                console.log('try upsert ', lrd)
                BkRecords.insert(lrd, (err) => {
                    console.log('upserted', err)
                    if(err) errinfo.push(err.toString())
                    counter = counter - 1;
                    if(counter <= 0){
                        resolve(errinfo)
                    }
                })
            } 
        })
        
        return promise
    }
}

