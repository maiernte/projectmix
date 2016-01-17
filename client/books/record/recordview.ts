/// <reference path="../../../typings/angular2-meteor.d.ts" />
/// <reference path="../../../typings/book.d.ts" />

import {Component, Inject, ElementRef} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, Books} from 'collections/books'
import {RecordHelper} from './recordhelper'
import {YixuePart} from './yipart'

import {GuaView} from 'client/liuyao/guaview'
import {BaziView} from 'client/bazi/baziview'

declare var jQuery;

@Component({
    selector: "recordview",
    pipes:[TranslatePipe],
    templateUrl: "client/books/record/recordview.html",
    directives: [YixuePart, GuaView, BaziView]
})

export class RecordView{
    private bookid = ''
    private recordid = ''
    private bookname = '本地记录'
    private record: RecordHelper;

    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }

    ngOnInit(){
        this.bookid = this.routeParams.params['bid']
        this.recordid = this.routeParams.params['rid']

        if(this.bookid && this.bookid != ''){
            let book = Books.findOne({_id: this.bookid})
            this.bookname = book.name;
        }else{
            let rd = LocalRecords.findOne({_id: this.recordid})
            this.record = new RecordHelper(rd);
        }
    }

    get Bookname(){
        return this.bookname
    }

    get IsGua(){
        return this.record.IsGua
    }

    get Record(){
        return this.record;
    }

    get YiData(){
        let data = this.record.RouteParams;
        return data;
    }

    goBack(){
        this.router.parent.navigate(['./BookContent', {id: this.bookid}]);
    }
}