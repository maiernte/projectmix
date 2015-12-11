/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/angular2'

import {Gan} from 'lib/base/ganzhi'

@Component({
    selector: 'desktop',
    templateUrl: 'client/allgemein/desktop.html'
})

export class Desktop{
    constructor(){
        console.log('desktop loaded')
        let s = new Gan(1);
        console.log(s.Name, s.WuXing)
    }
    
    showMenu(){
        $('.ui.labeled.sidebar').sidebar('toggle')
    }
}