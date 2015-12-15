/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, NgFor, Inject} from 'angular2/angular2'
import {Router} from 'angular2/router'

import {Gan} from 'lib/base/ganzhi'
import {TyWindow} from 'client/allgemein/window'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'desktop',
    templateUrl: 'client/allgemein/desktop.html',
    directives: [TyWindow, NgFor],
    pipes: [TranslatePipe],
})

export class Desktop{
    frameList: Array<Object>;
    private router: Router;
    glsetting: GlobalSetting;
    
    constructor(_router: Router, @Inject(GlobalSetting) glsetting: GlobalSetting){
        //let s = new Gan(1);
        //console.log(s.Name, s.WuXing);
        this.router = _router;
        this.glsetting = glsetting;
    }
    
    showMenu(){
        jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        //$('.ui.labeled.sidebar').sidebar('toggle');
        //console.log('showMenu', document.find('.ui.labeled.sidebar')) 
    }
    
    addWindow(type){
        //this.router.parent.navigate(['/PaiBazi'])
        for(let f of this.frameList){
            if(f['type'] == type){
                return;
            }
        }
        
        var frame = {
            type: type,
            id: type,
        }
        
        this.frameList.push(frame);
        
    }

    oncloseWind(windowID){
        for(let idx = 0; idx < this.frameList.length; idx++){
            let frame = this.frameList[idx];
            if(frame['id'] == windowID){
                this.frameList.splice(idx, 1);
                return;
            }
        }
    }

    onInit(){
        this.frameList = [];
        // var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    }
}