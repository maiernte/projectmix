/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor, ContentChild, AfterContentInit} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

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

    NextStep(event){
        if(event){
            console.log('NextStep : ' , event)
        }

        let stepOut = "pagua-step-" + this.CurrentStep;
        let stepIn = "pagua-step-" + (this.CurrentStep + 1);
        this.CurrentStep = this.CurrentStep + 1;
        this.showAnimate(stepOut, stepIn)
    }

    GoBack(event){
        if(event){
            console.log('GoBack : ' , event)
        }

        let stepOut = "pagua-step-" + this.CurrentStep;
        this.CurrentStep = 1;
        this.DeskChecked = false;
        this.Question = '';
        this.showAnimate(stepOut, 'pagua-step-1')
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
    
    LogMe(even){
        console.log(even)
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
        
    }
}
