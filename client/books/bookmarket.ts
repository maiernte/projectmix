/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgZone} from 'angular2/core'
import {NgFor, NgIf} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {TYSqlite} from 'client/books/tysqlite'

import {LocalRecords, LocalBooks} from 'collections/books'

declare var jQuery;
declare var CouchDB: any;
declare var Mongo;
declare var Camera;
declare var navigator: any;

@Component({
    selector: "book-market",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookmarket.html",
    directives: [NgFor, NgIf]
})
export class BookMarket{
    private books: Array<BookView>;

    Market = 'private'
    Loading = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }
    
    get Books(){
        return this.books;
    }

    get IsCordova(){
        return this.glsetting.IsCordova
    }
    
    showMenu(hide) {
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    } 
    
    ngOnInit() {
        let hideMenu = true;
        this.showMenu(hideMenu);
        
        this.books = []
        let bkmanager = this.glsetting.BookManager
        let bks = bkmanager.MyBooks;
        if(bks.length == 0){
            let msg = "没有发现本地书集。请登录后， 回到本页点击上方“下行”按钮，拉取你的在线书集。或者点击“新建”按钮，创建本地书集。"
            this.glsetting.Alert("书集", msg)
            this.Loading = false;
        }else{
            for(let bk of bks){
                this.books.push(new BookView(bk))
            }
            
            this.ngZone.run(() => {
                this.Loading = false;
            })
        }

        console.log('ngOnInit bookmarket')
    }
    
    pushCloud(book: BookView){
        if(book.IsCloud == true) return;
        
        if(!this.glsetting.Signed){
            this.glsetting.Alert("推送云端", "您还没有登录，无法将书集推送云端。")
            return;
        }
    
        let msg = "一旦转为云书集， 则不可以转为纯本地书集。要将此书集推送到云端吗？"
        this.glsetting.Confirm("推送云端", msg, () => {
            let bkmanager = this.glsetting.BookManager;
            bkmanager.UploadBook(book.Id)
                .then((res) => {
                    console.log('Upload result', res)
                    if(res == true){
                        book.IsCloud = true
                    }else{
                        this.glsetting.Alert('推送失败', res.toString())
                    }
                })
        }, null)
    }
    
    deleteBook(book: BookView){
        let msg = "这本书将被永久性删除，所有内容将不可恢复。您确认要删除此书吗？"
        this.glsetting.Confirm('删除书集', msg, () => {
            let bkmanager = this.glsetting.BookManager
            bkmanager.DeleteBook(book.Id)
                .then(err => {
                    if(!err){
                        this.ngZone.run(() => {
                            this.books = this.books.filter(bk => bk.Id != book.Id)
                            console.log('this.books', this.books)
                        })
                    }else{
                        this.glsetting.Alert("删除书集失败", err.toString())
                    }
                })
            }, null)
    }
    
    editBook(book: BookView){
        console.log(this.glsetting.Signed)
        if(book){
            this.router.parent.navigate(['./EditBook', {id: book.Id}])
        }else{
            this.router.parent.navigate(['./EditBook', {id: null}])
        }
    }
    
    openBook(book: BookView){
        let bookid = book.Id ? book.Id : ''
        LocalBooks.update({_id: bookid}, {$set:{readed: Date.now()}})
        this.router.parent.navigate(['./BookContent', {id: bookid}])
    }

    importBook(){
        if(this.glsetting.IsCordova){
            navigator['camera'].getPicture((data) => {
                let db = new TYSqlite(data)
                this.convertBook(db)

            }, function (err) {
                if (err != "Selection cancelled.") {
                    this.glsetting.Notify('读取文件失败', -1)
                }
            },{
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            });
        }else{
            jQuery("#import-book-btn").trigger('click')
        }
    }

    importBookWeb(event){
        //let f = event.srcElement.files[0];
        let f = event.target.files[0]
        let r = new FileReader();
        r.onload = (evt) => {
            console.log(r)
            let db = new TYSqlite(r.result)
            //let db = new TYSqlite(evt.target.result)
            this.convertBook(db)
        }

        if(!f){
            console.log("!f")
            return
        }else{
            r.readAsDataURL(f);
            //r.readAsArrayBuffer(f)
        }
    }

    private convertBook(db: TYSqlite){
        if(db.BookType == 'mix'){
            let bkid = db.Bookid
            let foundbook = LocalBooks.findOne({_id: bkid})
            if(!!foundbook){
                let msg = '书集已经存在。再次导入会覆盖原有书集的内容。确定要导入吗？'
                this.glsetting.Confirm('导入书集', msg, () => {
                    LocalRecords.remove({book: bkid})
                    LocalBooks.remove({_id: bkid})

                    this.doimport(db)
                }, null)
            }else{
                this.doimport(db)
            }
        }else{
            this.doimport(db)
        }
    }

    private doimport(db: TYSqlite){
        //console.log('convertBook', db)
        db.Import().then(() => {
            this.books = []
            let bkmanager = this.glsetting.BookManager
            let bks = bkmanager.MyBooks;
            for(let bk of bks){
                this.books.push(new BookView(bk))
            }

            this.glsetting.Notify("成功导入书集!", 1)
            db.Close()
        }).catch(err => {
            this.glsetting.Alert('导入书集出错', err.toString())
            db.Close()
        })
    }
    
    private loadBooks(){
        if(this.glsetting.Signed == false){
            this.glsetting.Alert("拉取在线书集", "您还没有登录，无法拉取在线书集。")
            return
        }
    
        this.books = []
        this.Loading = true;
        let bkmanager = this.glsetting.BookManager
        bkmanager.DownloadBooks().then(res => {
            let msg = "对不起，找不到您的在线书集。如果确实创建过的话，请联系管理员。"
            if(res == false){
                this.glsetting.Alert("在线书集", msg)
            }else{
                let bks = bkmanager.MyBooks
                if(bks.length == 0){
                    this.glsetting.Alert("在线书集", msg)
                }
                
                for(let bk of bks){
                    this.books.push(new BookView(bk))
                }
            }
            
            this.ngZone.run(() => {
                this.Loading = false;
                this.glsetting.Alert("拉取在线书集", "现只下载所有书集的基本信息, 打开书集后,还需点击'云同步'才能拉取具体案例.")
            })
        })
    }
}

class BookView{
    constructor(private book: Book){
        
    }
    
    get Id(){
        return this.book._id;
    }
    
    get Name(){
        return this.book.name;
    }
    
    get Desc(){
        return this.book.description;
    }
    
    get Author(){
        let res = this.book.author ? this.book.author : '';
        res = res.trim();
        return res == '' ? '当前用户' : res;
    }
    
    get IsCloud(){
        return this.book.cloud;
    }
    
    set IsCloud(value){
        this.book.cloud = value
    }
    
    get Editable(){
        if(this.book.cloud == false) return true
    
        if(!Session.get('userid')) return false;
        
        return this.book.owner == Session.get('userid');
    }
    
    get Created(){
        let date = this.book.created ? new Date(this.book.created) : new Date(Date.now())
        return this.toChina(date);
    }
    
    get Modified(){
        let date = this.book.modified ? new Date(this.book.modified) : new Date(Date.now())
        return this.toChina(date);
    }
    
    private toChina(d: Date): string{
        let res = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
        return res;
    }
}