/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, ElementRef} from 'angular2/angular2'

declare var jQuery:any;

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html'
})

export class TyWindow{
	elementRef: ElementRef;
	
	constructor(elementRef: ElementRef){
		this.elementRef = elementRef;
	}

	onInit(){
		//$('.ui.accordion').accordion();
		let v = jQuery(this.elementRef.nativeElement)
		v.find('.ui.accordion').accordion();
	}
}