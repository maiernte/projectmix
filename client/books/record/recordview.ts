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
import {TranslatePipe} from "../../allgemein/translatePipe";

declare var jQuery;
declare var MediumEditor;

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
    private editor;
    private translator: TranslatePipe;

    private editmodel = false;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
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

        let domQuestion = jQuery(this.rootElement.nativeElement).find('.editable.question')
        domQuestion.text(this.record.Question)

        this.translator = new TranslatePipe();
    }

    get EditModel(){
        return this.editmodel;
    }

    set EditModel(value){
        this.editmodel = value;

        if(value == true){
            setTimeout(() => {
                let placeholder = '点击编辑按钮, 然后输入内容.'
                this.editor = new MediumEditor('.editable', {
                    placeholder: {
                        text: this.translator.transform(placeholder, this.glsetting.lang)
                    }
                });
            }, 500);
        }else{
            console.log(this.editor)
            this.editor.destroy();
            this.editor = null;

        }
    }

    get Bookname(){
        return this.bookname
    }

    get IsGua(){
        return this.record.IsGua
    }

    get YiData(){
        let data = this.record.RouteParams;
        return data;
    }

    get QuestionT(){
        return this.IsGua ? "问念: " : "命主: "
    }

    get Question(){
        return this.record.Question;
    }

    goBack(){
        this.router.parent.navigate(['./BookContent', {id: this.bookid}]);
    }
}