/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'pailiuyao-leading',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/leading.html',
})

export class PailiuyaoLeading{
    CurrentStep: number;
    ImgUrl: string;
    DeskChecked: boolean;
    Question: string;

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }

    NextStep(){
        let stepOut = "pagua-step-" + this.CurrentStep;
        let stepIn = "pagua-step-" + (this.CurrentStep + 1);
        this.CurrentStep = this.CurrentStep + 1;
        this.showAnimate(stepOut, stepIn)
    }

    GoBack(){
        let stepOut = "pagua-step-" + this.CurrentStep;
        this.CurrentStep = 1;
        this.DeskChecked = false;
        this.Question = '';
        this.showAnimate(stepOut, 'pagua-step-1')
    }

    onInit(){
        this.DeskChecked = false;
        this.Question = '';
        this.ImgUrl = 'QianYin.png';
        this.CurrentStep = 1
        for(let idx = 1; idx < 5; idx++){
            let dom = jQuery('#pagua-step-' + idx);
            if(dom.hasClass('visible')){
                this.CurrentStep = idx;
                break;
            }
        }
    }
    
    LogMe(even){
        console.log(even)
    }
    
    showAnimate(outId: string, inId: string): Promise<boolean>{
        
        let promise = new Promise((resolve, reject) => {
            jQuery('#' + outId).transition('fade left', function(){
                jQuery('#' + inId).transition('fade right', function(){
                    resolve(true);
                });
            });
        });
        
        return promise;
    }
}
