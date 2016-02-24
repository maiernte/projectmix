/// <reference path="../../../typings/angular2-meteor.d.ts" />
/// <reference path="../../../typings/book.d.ts" />

import {Component, Inject, ElementRef, NgZone} from 'angular2/core'
import {NgIf} from 'angular2/common'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {LocalRecords, LocalBooks, BkRecords} from 'collections/books'
import {RecordHelper} from './recordhelper'
import {YixuePart} from './yipart'

import {GuaView} from 'client/liuyao/guaview'
import {BaziView} from 'client/bazi/baziview'

import {PaipanEmitter} from 'client/allgemein/paipanermitter'

declare var jQuery;
declare var Promise;

@Component({
    selector: "recordview",
    pipes:[TranslatePipe],
    templateUrl: "client/books/record/recordview.html",
    directives: [YixuePart, GuaView, BaziView, NgIf]
})

export class RecordView{
    emitterBack = PaipanEmitter.get(PaipanEmitter.BackButton);

    private bookid = ''
    private recordid = ''
    private bookname = '本地记录'
    private record: RecordHelper = null;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {

        document.addEventListener("backbutton", this.onBackButton, false);
    }
    
    ngOnDestroy(){
        document.removeEventListener("backbutton", this.onBackButton, false);
    }

    private onBackButton = (evt: Event) => {
        this.goBack()
    }

    ngOnInit(){
        this.bookid = this.routeParams.params['bid']
        this.recordid = this.routeParams.params['rid']
        let book = LocalBooks.findOne({_id: this.bookid})
        this.bookname = book.name

        let rd = LocalRecords.findOne({_id: this.recordid, book: this.bookid})
        this.Record = new RecordHelper(rd);
    }

    get Bookname(){
        return this.bookname
    }

    get IsGua(){
        return this.Record.IsGua
    }

    get Record(){
        return this.record;
    }

    set Record(value){
        this.record = value
    }

    get YiData(){
        let data = this.Record.RouteParams;
        return data;
    }

    goBack(){
        this.router.parent.navigate(['./BookContent', {id: this.bookid}]);
    }
}