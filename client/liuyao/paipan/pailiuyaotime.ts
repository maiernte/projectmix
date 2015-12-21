/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'
import {GanZhi, ZhiNames} from "../../../lib/base/ganzhi";

declare var jQuery:any;
declare function moment();

@Component({
    selector: 'pailiuyao-time',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/pailiuyaotime.html',
    directives: [NgFor]
})

export class PailiuyaoTime{
    private ganzhiModel = false;
    
    glsetting:GlobalSetting;
    InputTime: Object;
    
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }
    
    get Result(){
        if(this.GanZhiModel === true){
            return 'ganzhi model';
        }else{
            return 'time model'
        }
    }
    
    get GanZhiModel(){
        return this.ganzhiModel;
    }
    
    set GanZhiModel(value){
        this.ganzhiModel = value;
        if(value == true){
            this.showAnimate('paigua-time-gl', 'paigua-time-gz');
        }else{
            this.showAnimate('paigua-time-gz', 'paigua-time-gl');
        }
    }
    
    get GanZhiNames() {
        return GanZhi.GanZhiNames;
    }

    get GanZhiNamesFull() {
        return ZhiNames().concat(GanZhi.GanZhiNames)
    }
    
    onInit(){
        let dateText = moment().format('YYYY-MM-DD');
        let timeText = moment().format('HH:mm')

        this.InputTime = {
            Date: dateText,
            Time: timeText,
            Yue: this.GanZhiNamesFull[0],
            Ri: this.GanZhiNamesFull[0]
        }
        
        let domTime = jQuery('#paigua-time-gl')
        this.ganzhiModel = domTime.hasClass('hidden') ? true : false;
    }
    
    private showAnimate(outId: string, inId: string){
        jQuery('#' + outId).transition('fade left', function(){
            jQuery('#' + inId).transition('fade right');
        });
    }
}