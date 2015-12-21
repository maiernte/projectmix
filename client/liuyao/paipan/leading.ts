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
    static activeView: string;
    CurrentStep: Step;

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }

    NextStep(){
        this.CurrentStep = this.CurrentStep.GoNext();
    }

    GoBack(){
        Step.showAnimate(PailiuyaoLeading.activeView, 'pagua-step-1');
        this.onInit();
    }

    onInit(){
        let step1 = new Step('pagua-step-1', 1);
        let step2 = new Step('pagua-step-2', 2);
        let step3 = new Step('pagua-step-3', 3);
        let step4 = new Step('pagua-step-4', 4);

        step1.NextStep = step2;
        step2.NextStep = step3;
        step3.NextStep = step4;

        if(PailiuyaoLeading.activeView && PailiuyaoLeading.activeView != step1.ViewID){
            this.CurrentStep = PailiuyaoLeading.activeView == step2.ViewID ? step2 : null;
            this.CurrentStep = PailiuyaoLeading.activeView == step3.ViewID ? step3 : this.CurrentStep;
            this.CurrentStep = PailiuyaoLeading.activeView == step4.ViewID ? step4 : this.CurrentStep;
        }else{
            this.CurrentStep = step1;
        }

        //PailiuyaoLeading.activeView = this.CurrentStep.ViewID;
    }
}

class Step{
    Completted = false;
    NextStep: Step;

    constructor(public ViewID: string, public ID: number){

    }

    GoNext(): Step{
        this.Completted = true;

        if(this.NextStep != undefined){
            Step.showAnimate(this.ViewID, this.NextStep.ViewID);
            PailiuyaoLeading.activeView = this.NextStep.ViewID;
            return this.NextStep;
        }

        return null;
    }

    static showAnimate(outId: string, inId: string){
        jQuery('#' + outId).transition('fade left', function(){
            jQuery('#' + inId).transition('fade right');
        });
    }
}