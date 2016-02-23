/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'
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
declare var alertify;

@Component({
    selector: 'desktop',
    templateUrl: 'client/allgemein/desktop.html',
    directives: [TyWindow, NgFor, CalendarView, GuaView, CompassView, BaziView],
    pipes: [TranslatePipe],
})

export class Desktop{
    private static frameList: Array<Object>;
    private static showTips: boolean;
    
    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting: GlobalSetting){
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
    
    get FrameList(){
        return Desktop.frameList;
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
        for(let f of Desktop.frameList){
            let singletone = f['type'] == 'compass' || f['type'] == 'calendar'
            if(f['type'] == type && singletone){
                return;
            }
        }
        
        var frame = {
            type: type,
            id: type,
        }
        
        Desktop.frameList.push(frame);
    }

    oncloseWind(windowID){
        for(let idx = 0; idx < Desktop.frameList.length; idx++){
            let frame = Desktop.frameList[idx];
            if(frame['id'] == windowID){
                Desktop.frameList.splice(idx, 1);
                return;
            }
        }
    }

    ngOnInit(){
        if(!Desktop.frameList){
            Desktop.frameList = [];
        }
        
        let hideMenu = true;
        this.showMenu(hideMenu);
        
        //Desktop.AddFrame(this.routeParams.params, this.glsetting.GUID)
        
        if(this.ShowTips){
            let title = '欢迎使用华鹤易学移动平台'
            let message = '按顶上左边第一个按钮打开系统菜单。第二和第三个按钮分别为万年历和风水罗盘。不再显示此消息请按"确定"。'
            this.glsetting.Confirm(title, message, () => {
                this.ShowTips = false;
            }, () => {
                Desktop.showTips = true;
            });
        }
    }
    
    static AddFrame(params, guid){
        if(!Desktop.frameList){
            Desktop.frameList = [];
        }
        
        if(params['flag'] == 'gua' || params['flag'] == 'bazi'){
            var frame = {
                type: params['flag'],
                id: 'U' + guid,
                data: JSON.stringify(params)
            }

            Desktop.frameList.push(frame);
        }
    }
}