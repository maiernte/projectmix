/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, Inject, NgFor} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'
import {GanZhi, ZhiNames} from "../../lib/base/ganzhi";
import {Gua64} from "../../lib/base/gua"


import {PailiuyaoTime} from 'client/liuyao/paipan/pailiuyaotime';
import {PaiLiuyaoGua} from 'client/liuyao/paipan/pailiuyaogua';


declare var jQuery:any;
declare function moment();

@Component({
    selector: 'pailiuyao',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paiLiuyao.html',
    directives: [NgFor, PailiuyaoTime, PaiLiuyaoGua]
})

export class PaiLiuyao {
    inputModel:string = 'manuel';

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }
    
    get InputModel(){
        return this.inputModel;
    }
    
    set InputModel(value){
        this.inputModel  = value
    }

    showMenu(hide) {
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    } 
    
    get isCordova(){
        return 'cordova = ' + this.glsetting.IsCordova
    }

    onInit() {
        let hideMenu = true;
        this.showMenu(hideMenu);
    }
    
    LogMe(event, gua){
        console.log(event, gua)
    }
}