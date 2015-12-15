/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component,
		ElementRef,
		EventEmitter,
		Inject,
		Input,
		FORM_DIRECTIVES} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {CalendarView} from "../calendar/calendar";

declare var jQuery:any;

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html',
	events: ['onclosing'],
	pipes: [TranslatePipe],
	directives: [CalendarView]
})

export class TyWindow{
	elementRef: ElementRef;
	onclosing = new EventEmitter();
	glsetting: GlobalSetting;
	@Input() data: Object;
	wide: boolean;
	
	constructor(elementRef: ElementRef, @Inject(GlobalSetting) glsetting: GlobalSetting){
		this.elementRef = elementRef;
		this.glsetting = glsetting;
		this.wide = false;
	}

	close(){
		this.onclosing.next(this.data['id'])
	}

	onInit(){
		
		let v = jQuery(this.elementRef.nativeElement)
		v.find('.ui.accordion').accordion();
		//v.find('.ui.element').popup({on:'click'})
	}
}