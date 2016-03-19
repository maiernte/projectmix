/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {Component,
		ElementRef,
		EventEmitter,
		Inject,
		Input,
		ContentChild,
		AfterViewInit} from 'angular2/core'
		
import {FORM_DIRECTIVES, NgFor} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {CalendarView} from "../calendar/calendar";
import {GuaView} from '../liuyao/guaview'
import {BaziView} from '../bazi/baziview'
import {CompassView} from '../compass/compass'

import {LocalRecords} from 'collections/books'

declare var jQuery:any;

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html',
	events: ['onclosing', 'afterSave'],
	pipes: [TranslatePipe],
	directives: [CalendarView, NgFor]
})

export class TyWindow {
	onclosing = new EventEmitter();
	afterSave = new EventEmitter();
	
	glsetting: GlobalSetting;
	wide: boolean;
	
	books: Array<Book>;
	selectedbook = null;
	
	@Input() data: Object;
	@ContentChild(CalendarView) calendarview: CalendarView;
	@ContentChild(GuaView) guaview: GuaView;
	@ContentChild(BaziView) baziview: BaziView;
	@ContentChild(CompassView) compassview: CompassView;

	IsReady: boolean;
	
	constructor(private rootElement: ElementRef,
				@Inject(GlobalSetting) glsetting: GlobalSetting){
		this.glsetting = glsetting;
		this.wide = false;
	}
	
	get CanSave(){
		return this.data['type'] != 'calendar' && this.data['type'] != 'compass'
	}

	close(){
		if(this.compassview){
			this.compassview.CloseCompass();
		}

		this.onclosing.next(this.data['id'])
	}
	
	showSetting(){
		try{
			if(this.calendarview) this.calendarview.showSetting();
			if(this.guaview) this.guaview.showSetting();
			if(this.baziview) this.baziview.showSetting();
		}catch(err){
			Log('showSetting Error', err)
		} 
	}

	saveAsPng(dom){
		let filename = '图片'
		if(this.baziview) filename = this.baziview.Info.Title
		if(this.guaview) filename = this.guaview.title
		if(this.calendarview) filename = '万年历'

		this.glsetting.Html2Canva(dom, -1, -1)
			.then(canva => {
				//console.log('canva', canva)
				this.glsetting.SaveCanva2Disk(canva, filename)
			})
	}
	
	private modalEle;
	
	showSaveModal(ele){
		let userid = Session.get('userid');

		if(!userid || !this.books || this.books.length == 0){
			this.glsetting.Alert('保存记录', '您还没有登录， 或者还没有创建书集。无法保存卦例/命例。')
			return
		}


		jQuery('#' + this.data['id'])
			.modal({
				closable  : false,
				onApprove : () => {
			      	//this.saveTo(this.selectedbook)
					Log('onApprove')
			    }
			}).modal('show')
	}
	
	saveTo(navaftersave){
		let book = this.selectedbook
		if(!book)return;
	
		let record: YiRecord;
		if(this.guaview) record = this.guaview.exportAsRecord()
		if(this.baziview) record = this.baziview.exportAsRecord()
		
		record.book = book._id;
		record.owner = Session.get('userid');

		LocalRecords.insert(record, (err, id) => {
			if(err){
				this.glsetting.Notify(err.toString(), -1)
			}else{
				if(navaftersave){
					this.afterSave.next({bid: book._id, rid: id})
				}else{
					let name = !!this.guaview ? '卦例' : '命例'
					this.glsetting.Notify(`${name}已经保存到书集!`, 1)
				}
			}
		})
	}

	ngOnInit(){
		this.IsReady = false;
		let bkmanager = this.glsetting.BookManager;
		this.books = bkmanager.MyBooks
	}

	ngAfterViewInit(){
		this.IsReady = true;
	}
	
	ngOnDestroy() {
		/*let domRoot = jQuery(this.rootElement.nativeElement).find(".box")
		console.log('window destroy', domRoot)
		domRoot.remove()*/
    }
}