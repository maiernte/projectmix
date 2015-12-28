/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor, ContentChild, AfterContentInit} from 'angular2/angular2'
import {TranslatePipe} from '../../allgemein/translatePipe'
import {GlobalSetting} from  '../../globalsetting'

import {LeadingYao} from "./leadingyaos";
import {PailiuyaoCoins} from './coins'

declare var jQuery:any;
declare var Promise:any;

@Component({
    selector: 'pailiuyao-leading',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/leading.html',
    directives: [LeadingYao, PailiuyaoCoins]
})

export class PailiuyaoLeading{
    CurrentStep: number;
    ImgUrl: string;
    DeskChecked: boolean;
    Question: string;

    private cointype: number;

    @ContentChild(LeadingYao) step4: LeadingYao;

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }

    get CoinType(){
        return this.cointype;
    }

    set CoinType(value){
        this.cointype = value;
        this.ImgUrl = value === 0 ? 'QianYin.png' : 'WumaoYan.png';
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

    goStep4(yao){
        console.log('goStep4', yao)
        this.step4.Reinit(this.cointype, yao)
        this.NextStep();
    }

    onInit(){
        this.CoinType = 0;
        this.DeskChecked = false;
        this.Question = '';
        this.CurrentStep = 1
        for(let idx = 1; idx < 6; idx++){
            let dom = jQuery('#pagua-step-' + idx);
            if(dom.hasClass('visible')){
                this.CurrentStep = idx;
                break;
            }
        }
    }
    
    showAnimate(outId: string, inId: string): any{
        
        let promise = new Promise((resolve, reject) => {
            jQuery('#' + outId).transition('fade left', function(){
                jQuery('#' + inId).transition('fade right', function(){
                    resolve(true);
                });
            });
        });
        
        return promise;
    }

    afterContentInit() {
       /* <rect x='0' y='7' width="35" height="2" style="fill: black"></rect>
        <line x1="30" y1="4" x2="35" y2="7" style="stroke:black;stroke-width:2" />
        <line x1="30" y1="12" x2="35" y2="8" style="stroke:black;stroke-width:2" />*/
    }
}
