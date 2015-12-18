/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component,
		ElementRef,
		EventEmitter,
		Inject,
		Input,
		AfterContentInit,
		ContentChild,
		FORM_DIRECTIVES} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {CalendarView} from "../calendar/calendar";
import {GuaView} from '../liuyao/guaview'
	

declare var jQuery:any;

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html',
	events: ['onclosing'],
	pipes: [TranslatePipe],
	directives: [CalendarView]
})

export class TyWindow implements AfterContentInit{
	elementRef: ElementRef;
	onclosing = new EventEmitter();
	glsetting: GlobalSetting;
	wide: boolean;
	
	@Input() data: Object;
	@ContentChild(CalendarView) calendarview: CalendarView;
	@ContentChild(GuaView) guaview: GuaView;
	
	
	constructor(elementRef: ElementRef, @Inject(GlobalSetting) glsetting: GlobalSetting){
		this.elementRef = elementRef;
		this.glsetting = glsetting;
		this.wide = false; 
	}
	
	get CanSave(){
		return this.data['type'] != 'calendar' && this.data['type'] != 'compass'
	}

	close(){
		this.onclosing.next(this.data['id'])
	}
	
	showSetting(){
		try{
			if(this.calendarview) this.calendarview.showSetting();
			if(this.guaview) this.guaview.showSetting();
		}catch(err){
			console.log('showSetting Error', err)
		} 
	}
	
	

	onInit(){
		//let v = jQuery(this.elementRef.nativeElement)
		//v.find('.ui.accordion').accordion();
		//v.find('.ui.element').popup({on:'click'})
	}
	
	 afterContentInit() {
	    //console.log(this.contentChild);
	 }
}