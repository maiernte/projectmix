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
    private showgua = true
    private showbazi = true
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

    get ShowGua(){
        return this.showgua
    }

    set ShowGua(value){
        this.showgua = value
        this.loadContent()
    }

    get ShowBazi(){
        return this.showbazi;
    }

    set ShowBazi(value){
        this.showbazi = value
        this.loadContent()
    }
    
    ngOnInit(){
        this.bookid = this.routeParams.params['id']
        this.glsetting.LoadBooks(false).then(bks => {
            let book = bks.filter(bk => bk._id == this.bookid)
            if(book.length > 0){
                this.ngZone.run(() => {
                    this.BookName = book[0].name
                })
            }
        })

        //this.loadRecordes();
        this.loadContent()
    }
    
    goBack(){
        this.router.parent.navigate(['./List']);
    }

    deleteRecords(){
        let rds = this.Records.filter(r => r.Checked)
        if(rds.length == 0){
            this.glsetting.ShowMessage("删除记录", '您还没有选取任何记录， 请在要删除的记录前打勾。')
            return;
        }
        
        let msg = '打勾的记录将被永久性删除，所有内容不可恢复。您确认要删除这些记录吗？'
        this.glsetting.ShowMessage('删除记录', msg, () => {
            let promises = []
            
            for(let rd of rds){
                promises.push(rd.Remove())
            }
            
            Promise.all(promises).then(() => {
                this.ngZone.run(() => {
                    console.log('alle record sind gelöscht!')
                    this.loadContent();
                })
            })
        })
    }

    openRecord(rd: RecordHelper){
        this.router.parent.navigate(['./BookRecord', {bid: this.bookid, rid: rd.Id}])
    }
    
    syncRecord(rd: RecordHelper){
        rd.CloudSync().then((res) => {
            let msg = res < 0 ? "更新到本地。" : "更新到云端。"
            msg = res == 0 ? "数据已经更新过了。" :msg
            this.glsetting.ShowMessage("同步数据", msg)
            
            this.ngZone.run(() => {
                console.log('rd.IsCloud ? ', rd.IsCloud)
            })
        }).catch(err => {
            this.glsetting.ShowMessage("同步数据失败", err)
        })
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
            this.cloudData().then(rds => {
                return this.download(rds)
            }).then(ids => {
                console.log("need to upload", ids)
                return this.upload(ids)
            }).then(up => {
                if(up == true){
                    Books.update(this.bookid, {$set: {modified: Date.now()}}, (err, res) => {
                        console.log('book updated', err, res)
                    })
                }

                LocalRecords.update({book: this.bookid}, {$set: {cloud: true}})
                this.ngZone.run(() => {
                    this.loadContent();
                })
                this.glsetting.ShowMessage('操作成功', '恭喜！数据已经全部同步！')
            }).catch(err => {
                //this.glsetting.ShowMessage('上传数据错误', err)
                console.log('catch err ', err)
                this.glsetting.ShowMessage('上传数据错误', err)
            })
        });
    }

    private loadContent(){
        let selector: Object
        if(this.ShowGua && this.ShowBazi){
            selector = {
                book: this.bookid,
                deleted: false
            }
        }
        else if(!this.ShowGua && this.ShowBazi){
            selector = {
                book: this.bookid,
                deleted: false,
                bazi: {$exists: true}
            }
        }else if(this.ShowGua && !this.ShowBazi){
            selector = {
                book: this.bookid,
                deleted: false,
                gua: {$exists: true}
            }
        }else if(!this.ShowBazi && !this.ShowGua){
            this.sumItems = 0;
            this.Records = [];
            this.Loaded = true;
            return;
        }

        let records = LocalRecords
            .find(selector,
                  {fields: {description: 0, img: 0, link: 0}, sort: {created: 'desc'}})
            .fetch()
            
        this.sumItems = records.length
        this.onPageChanged(1)
        this.buildRecordView(records);
        this.Loaded = true;
        console.log('recordes', records)
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
                        link: crd.link,
                        modified: crd.modified,
                        deleted: crd.deleted
                    }})

                    ids = ids.filter(i => i != lcd._id)
                }else if(lcd.modified == crd.modified){
                    ids = ids.filter(i => i != lcd._id)
                }else{
                    console.log('?', lcd, crd)
                }
            }

            resolve(ids)
        })
        
        return promise;
    }

    // 返回 false 代表没有更新在线记录. true 表示在线记录也更新了.
    private upload(ids: Array<string>): any{
        let promise = new Promise((resolve, reject) => {
            let counter = ids.length
            if(counter == 0){
                resolve(false)
            }

            for(let id of ids){
                let lrd = LocalRecords.findOne({_id: id})
                if(!lrd){
                    console.log('en.... not good', id)
                    continue;
                }

                lrd.cloud = true
                console.log('upsert record', lrd)

                Meteor.call('upsertRecord', lrd, (err) => {
                    counter = counter - 1;
                    if(counter <= 0){
                        resolve(true)
                    }
                })
            } 
        })
        
        return promise
    }
}

