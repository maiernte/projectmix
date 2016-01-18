/// <reference path="../../../typings/angular2-meteor.d.ts" />
/// <reference path="../../../typings/book.d.ts" />

import {Component, Inject, ContentChild, Input, ElementRef} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {GuaView} from 'client/liuyao/guaview'
import {BaziView} from 'client/bazi/baziview'

import {LocalRecords, Books} from 'collections/books'
import {RecordHelper} from './recordhelper'

declare var jQuery;
declare var MediumEditor;

@Component({
    selector: "yixue-part",
    pipes:[TranslatePipe],
    templateUrl: "client/books/record/yipart.html",
    directives: []
})
export class YixuePart{
    private translator: TranslatePipe;
    private editmodel = false;
    private editor;

    @ContentChild(GuaView) guaview: GuaView;
    @ContentChild(BaziView) baziview: BaziView;

    @Input() record: RecordHelper;

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
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
                        text: this.translator.transform(placeholder, [this.glsetting.lang])
                    }
                });
            }, 500);
        }else{
            this.saveChanging();
            this.editor.destroy();
            this.editor = null;
        }
    }

    get IsGua(){
        return this.record.IsGua
    }

    get QuestionT(){
        return this.IsGua ? "问念: " : "命主: "
    }

    get Question(){
        return this.record.Question;
    }

    showSetting(){
        if(this.guaview) this.guaview.showSetting();
        if(this.baziview) this.baziview.showSetting();
    }

    goNextRecord(flag){
        let rd: YiRecord;

        if(this.record.BookId){

        }else{
            // LocalRecord
            let created = this.record.Data.created;


            if(flag < 0){
                rd = LocalRecords.findOne({created: {$lt: created}})
            }else{
                rd = LocalRecords.findOne({created: {$gt: created}})
            }
        }

        if(rd){
            this.router.parent.navigate(['./BookRecord', {bid: '', rid: rd._id}])
        }else{
            let msg = "现在已经是" + (flag < 0 ? '第一个' : '最后一个') + '记录'
            this.glsetting.ShowMessage("搜索记录", msg)
        }
    }

    ngOnInit(){
        let domQuestion = jQuery(this.rootElement.nativeElement).find('.editable.question')
        domQuestion.text(this.record.Question)

        let domFeed = jQuery(this.rootElement.nativeElement).find('.editable.feed')
        domFeed.text(this.record.FeedText)

        let domDesc = jQuery(this.rootElement.nativeElement).find('.editable.description')
        domDesc.text(this.record.Description)
    }

    ngAfterViewInit(){
        //console.log('guaview ', this.guaview)
        //console.log('baziview ', this.baziview)
    }

    private saveChanging(){
        let dom = jQuery(this.rootElement.nativeElement).find('.editable.question')
        let question = dom[0].innerText;

        dom = jQuery(this.rootElement.nativeElement).find('.editable.feed')
        let feed = dom[0].innerText;

        dom = jQuery(this.rootElement.nativeElement).find('.editable.description')
        let desc = dom[0].innerText;

        this.record.Save(question, feed, desc).then(res => {
            if(this.guaview) this.guaview.changeQuestion(question);
            if(this.baziview) this.baziview.changeQuestion(question);
            this.glsetting.ShowMessage('更新成功', '成功更新到数据库！')
        }).catch(err => {
            this.glsetting.ShowMessage('更新数据失败', err)
        });
    }
}