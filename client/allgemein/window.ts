/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

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
	events: ['onclosing'],
	pipes: [TranslatePipe],
	directives: [CalendarView, NgFor]
})

export class TyWindow {
	elementRef: ElementRef;
	onclosing = new EventEmitter();
	glsetting: GlobalSetting;
	wide: boolean;
	
	books: Array<Book>;
	
	@Input() data: Object;
	@ContentChild(CalendarView) calendarview: CalendarView;
	@ContentChild(GuaView) guaview: GuaView;
	@ContentChild(BaziView) baziview: BaziView;
	@ContentChild(CompassView) compassview: CompassView;

	IsReady: boolean;
	
	constructor(elementRef: ElementRef, @Inject(GlobalSetting) glsetting: GlobalSetting){
		this.elementRef = elementRef;
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
			console.log('showSetting Error', err)
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
		console.log("show modal" , ele)
		
		ele.find('.modal.save.pan').modal({
	            closable  : true,
	            onDeny    : function(){
	            },
	            onApprove : (ele) => {
	            	
	            }
	        }).modal('show')
		return;
	
		if(!this.modalEle){
			this.modalEle = jQuery(this.elementRef.nativeElement).find('.modal.save.pan')
		}
		
		this.modalEle
			.modal({
	            closable  : true,
	            onDeny    : function(){
	            },
	            onApprove : (ele) => {
	            	
	            }
	        }).modal('show')
	}
	
	saveTo(book){
		jQuery('.modal.save.pan').modal('hide')
		
		if(!this.glsetting.Signed || !this.books || this.books.length == 0){
			this.glsetting.ShowMessage('无法保存', '您还没有登录， 或者还没有创建书集。无法保存卦例/命例。')
			return
		}
		
		let record: YiRecord;
		if(this.guaview) record = this.guaview.exportAsRecord()
		if(this.baziview) record = this.baziview.exportAsRecord()
		
		record.book = book._id
		record.owner = Meteor.userId();
		
		console.log(this.guaview, this.baziview)
		return
		LocalRecords.insert(record, (err, id) => {
			console.log("insert record", err, id, record)
		})
	}

	ngOnInit(){
		this.IsReady = false;
		this.glsetting.LoadBooks(false).then(bks => {
			this.books = bks;
		})
	}

	ngAfterViewInit(){
		this.IsReady = true;
	}
}