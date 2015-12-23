/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor, ElementRef} from 'angular2/angular2'
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
    private rootElement: ElementRef;
    private ganzhiModel = false;
    
    glsetting:GlobalSetting;
    InputTime: Object;
    
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting, elementRef: ElementRef) {
        this.glsetting = glsetting;
        this.rootElement = elementRef;
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
        
        //let domTime = jQuery('#paigua-time-gl')
        let domTime = jQuery(this.rootElement.nativeElement).find('#paigua-time-gl')
        this.ganzhiModel = domTime.hasClass('hidden') ? true : false;
    }
    
    private showAnimate(outId: string, inId: string){
        jQuery(this.rootElement.nativeElement).find('#' + outId).transition('fade left', function(){
            jQuery('#' + inId).transition('fade right');
        });
    }
}