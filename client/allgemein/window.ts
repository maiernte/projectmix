/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, ElementRef, EventEmitter} from 'angular2/angular2'

declare var jQuery:any;

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html',
	events: ['onclosing']
})

export class TyWindow{
	elementRef: ElementRef;
	onclosing = new EventEmitter();
	
	constructor(elementRef: ElementRef){
		this.elementRef = elementRef;
	}

	close(){
		this.onclosing.next('id')
	}

	onInit(){
		
		let v = jQuery(this.elementRef.nativeElement)
		v.find('.ui.accordion').accordion();
		//v.find('.ui.element').popup({on:'click'})
	}
}