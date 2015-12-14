/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, NgFor} from 'angular2/angular2'
import {Router} from 'angular2/router'

import {Gan} from 'lib/base/ganzhi'
import {TyWindow} from 'client/allgemein/window'

@Component({
    selector: 'desktop',
    templateUrl: 'client/allgemein/desktop.html',
    directives: [TyWindow, NgFor]
})

export class Desktop{
    frameList: Array<Object>;
    private router: Router;
    
    constructor(_router: Router){
        //let s = new Gan(1);
        //console.log(s.Name, s.WuXing);
        this.router = _router;
        console.log('router', this.router);
    }
    
    showMenu(){
        console.log('showMenu...click')
        $('.ui.labeled.sidebar').sidebar('toggle');
    }
    
    addCalendar(){
        //this.router.parent.navigate(['/PaiBazi'])
        
        var frame = {
            type: "calendar",
            width: 4,
        }
        
        this.frameList.push(frame);
    }
    
    Log(){
        console.log('window loaded')
    }

    onInit(){
        this.frameList = [{name: 'mai'}];
        
        // var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    }
}