/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, 
        Inject, 
        ContentChild, 
        ViewChild,
        AfterContentInit, 
        Output, 
        EventEmitter,
        ElementRef} from 'angular2/core'

import {Router} from 'angular2/router'

import {NgFor} from 'angular2/common'
import {TranslatePipe} from '../../allgemein/translatePipe'
import {GlobalSetting} from  '../../globalsetting'

import {PaipanEmitter} from 'client/allgemein/paipanermitter'
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
    emitter = PaipanEmitter.get(PaipanEmitter.Paipan);
    emitterBack = PaipanEmitter.get(PaipanEmitter.BackButton);
    
    CurrentStep: number;
    ImgUrl: string;
    DeskChecked: boolean;
    Question: string;

    private cointype: number;

    //@ContentChild(LeadingYao) step4: LeadingYao;
    @ViewChild(LeadingYao) step4: LeadingYao;
    
    @Output() onfinished = new EventEmitter();

    constructor(@Inject(GlobalSetting) public glsetting:GlobalSetting,
                private router: Router,
                private rootElement: ElementRef) {

        //document.addEventListener("backbutton", this.onBackButton, false);
    }

    ngOnDestroy(){
        //document.removeEventListener("backbutton", this.onBackButton, false);
    }

    /*private onBackButton = (evt:Event) => {
        this.goBack()
    }*/
    
    goBack(){
        this.router.parent.navigate(['./Paigua'])
    }

    get Result(){
        return ''
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
        this.step4.Reinit(this.cointype, yao)
        this.NextStep();
    }

    paiGua(){
        let params = {
            flag: 'gua',
        }
        
        let date = new Date(Date.now());
        params['time'] = date.toISOString();
        params['gua'] = this.step4.Result;
        params['type'] = 0;
        params['question'] = this.Question
        
        //console.log("我要排卦", params)
        this.emitter.emit(params)
    }

    ngOnInit(){
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

    ngAfterViewInit() {
       console.log('step4', this.step4)
    }
}
