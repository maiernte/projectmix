/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, } from 'angular2/angular2'

@Component({
	selector: 'ty-window',
	templateUrl: 'client/allgemein/window.html'
})

export class TyWindow{
	constructor(){
		
	}

	onInit(){
		console.log('init tyWindow')
		$('.ui.accordion').accordion();
	}
}