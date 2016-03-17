/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {LocalRecords, LocalBooks} from 'collections/books'
import {SemanticSelect} from './directives/smselect'

import {TYSqlite} from 'client/books/tysqlite'
import {PageComponent} from 'client/allgemein/pagecomponent'

declare var jQuery:any;

@Component({
    selector: 'global-setting',
    templateUrl: 'client/allgemein/setting.html',
    pipes: [TranslatePipe],
    directives: [SemanticSelect]
})

export class AppSetting extends PageComponent{
    private twlang: number
    private guaShenSha: number
    private guaSimple: number
    private baziShenSha: number
    private bookpagerd: number;
    private guaArrow: number;

    constructor(@Inject(GlobalSetting) glsetting: GlobalSetting){
        super(glsetting)
    }

    get IsCordova(){
        return this.glsetting.IsCordova
    }

    get TwLang(): number{
        return this.twlang;
    }

    set TwLang(value){
        this.twlang = value;
        this.glsetting.SetValue('lang', value == 1)
    }

    get GuaShenSha(): number{
        return this.guaShenSha;
    }

    set GuaShenSha(value){
        this.guaShenSha = value;
        let tosave = parseInt(value.toString()) + 4
        this.glsetting.SetValue('gua-shensha', tosave)
    }

    get BaziShenSha(): number{
        return this.baziShenSha;
    }

    set BaziShenSha(value){
        this.baziShenSha = value;
        let tosave = parseInt(value.toString()) + 4
        this.glsetting.SetValue('bazi-shensha', tosave)
    }

    get GuaSimple(): number{
        return this.guaSimple;
    }

    set GuaSimple(value){
        this.guaSimple = parseInt(value.toString());
        this.glsetting.SetValue('gua-simple', this.guaSimple == 1)
    }

    get BookPageRD()
    {
        return this.bookpagerd;
    }

    set BookPageRD(value){
        this.bookpagerd = value
        this.glsetting.SetValue('book-pagerd', value)
    }

    get GuaArrow(): number{
        return this.guaArrow
    }

    set GuaArrow(value){
        this.guaArrow = parseInt(value.toString());
        this.glsetting.SetValue('gua-arrow', this.guaArrow == 0)
    }

    get FontSize(): number{
        let fz = this.glsetting.FontSize
        return fz
    }

    set FontSize(value: number){
        this.glsetting.FontSize = value
    }

    ngOnInit(){
        this.twlang = this.glsetting.lang ? 1 : 0;
        this.guaShenSha = parseInt(this.glsetting.GetSetting('gua-shensha').toString()) - 4;
        this.guaSimple = this.glsetting.GetSetting('gua-simple') == true ? 1 : 0;
        this.baziShenSha = parseInt(this.glsetting.GetSetting('bazi-shensha').toString()) - 4;
        this.bookpagerd = this.glsetting.PageSize;
        this.guaArrow = this.glsetting.GetSetting('gua-arrow') == true ? 0 : 1

        let hideMenu = true;
        this.showMenu(hideMenu);
    }
    
    ClearLocalDB(){
        let title = "清空本地数据"
        let msg = "所有本地数据将被清空。没有保存到云端的数据将永久丢失。确定进行此操作吗？"
        
        this.glsetting.Confirm(title, msg, () => {
            LocalRecords.clear();
            LocalBooks.clear();
        }, () => {
            console.log("cancel")
        })
    }

    ImportBook(event){
        if(Meteor.isClient){
            let f = event.target.files[0]
            let r = new FileReader();
            r.onload = (evt) => {
                let db = new TYSqlite(r.result)
                this.convertBook(db)
            }

            if(!f){
                console.log("!f")
                return
            }else{
                console.log("read file")
                r.readAsDataURL(f)
            }
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
            this.glsetting.Notify("成功导入书集!", 1)
            db.Close()
        }).catch(err => {
            this.glsetting.Alert('导入书集出错', err.toString())
            db.Close()
        })
    }
}