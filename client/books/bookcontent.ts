/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgFor, ElementRef} from 'angular2/angular2'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books} from 'collections/books'

declare var jQuery;

@Component({
    selector: "book-market",
    pipes:[TranslatePipe],
    templateUrl: "client/books/bookcontent.html",
    directives: [NgFor]
})
export class BookContent{
    private bookid: string;
    private bookname: string;
    records: Array<YiRecord>;

    private rdviews: Array<RecordView>;
    
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
    
    onInit(){
        this.bookid = this.routeParams.params['id']
        if(this.bookid && this.bookid != ''){
            let book = Books.findOne({_id: this.bookid})
            this.bookname = book.name;
        }else{
            this.bookname = '本地记录'
            this.records = LocalRecords.find({}).fetch().reverse();

            this.rdviews = new Array<RecordView>();
            for(let rd of this.records){
                let view  = new RecordView(rd);
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
}

class RecordView{
    Checked: boolean
    constructor(private rd: YiRecord){
        this.Checked = false;
    }

    get Id(){
        return this.rd._id;
    }

    get IsGua(){
        if(this.rd.gua){
            return true;
        }else{
            return false;
        }
    }

    get Created(){
        let date = new Date(this.rd.created)
        return this.toChina(date)
    }

    get Question(){
        return this.rd.question;
    }

    get Detail(){
        if(this.rd.gua){
            let g = this.rd.gua;
            let name = g.ben == g.bian ? g.ben : g.ben + '之' + g.bian
            return g.yueri[0] + '月' + g.yueri[1] + '日 / ' + name
        }else if(this.rd.bazi){
            let items = this.rd.bazi.bazi.split(' ')
            return items.join(' / ')
        }
    }

    private toChina(d: Date): string{
        let res = d.getFullYear() + "年"
                + (d.getMonth() + 1) + "月"
                + d.getDate() + "日"
                + d.getHours() + "时"
                + d.getMinutes() + "分";
        return res;
    }
}