/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, NgFor, Inject} from 'angular2/angular2'
import {Router, RouteParams} from 'angular2/router'

import {Gan} from 'lib/base/ganzhi'
import {TyWindow} from 'client/allgemein/window'
import {CalendarView} from "../calendar/calendar";
import {GuaView} from '../liuyao/guaview'
import {BaziView} from '../bazi/baziview'
import {CompassView} from '../compass/compass'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'desktop',
    templateUrl: 'client/allgemein/desktop.html',
    directives: [TyWindow, NgFor, CalendarView, GuaView, CompassView, BaziView],
    pipes: [TranslatePipe],
})

export class Desktop{
    frameList: Array<Object>;
    glsetting: GlobalSetting;
    
    private static showTips: boolean;
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) glsetting: GlobalSetting){

        this.glsetting = glsetting;
    }
    
    get ShowTips(){
        if(Desktop.showTips == undefined){
            Desktop.showTips = this.glsetting.GetSetting('desktop-tip');
        }
        
        return !Desktop.showTips
    }
    
    set ShowTips(value){
        Desktop.showTips = !value;
        this.glsetting.SetValue('desktop-tip', !value)
    }
    
    showMenu(hide){
        //jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
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
        let hideMenu = true;
        this.showMenu(hideMenu);
        
        jQuery('.message .close')
          .on('click', function() {
            jQuery(this)
              .closest('.message')
              .transition('fade')
            ;
          });
          
        if(Desktop.showTips == undefined){
            Desktop.showTips = this.glsetting.GetSetting('desktop-tip');
            if(Desktop.showTips == false){
                console.log("message should not showed")
                jQuery('.message .close')
                    .closest('.message')
                    .transition('fade')
            }
        }

        if(this.routeParams.params['flag'] == 'gua'){
            var frame = {
                type: 'gua',
                id: 'U' + this.glsetting.GUID,
                data: JSON.stringify(this.routeParams.params)
            }

            this.frameList.push(frame);
        }else if(this.routeParams.params['flag'] == 'bazi'){
            var frame = {
                type: 'bazi',
                id: 'U' + this.glsetting.GUID,
                data: JSON.stringify(this.routeParams.params)
            }

            this.frameList.push(frame);
        }
    }
}