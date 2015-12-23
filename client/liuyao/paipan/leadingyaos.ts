/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, EventEmitter, Output, ContentChild, AfterContentInit} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {PailiuyaoCoins} from  './coins'

declare  var jQuery: any;

@Component({
    selector: 'pailiuyao-leadingyao',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/leadingyaos.html',
    directives: []
})

export class LeadingYao{
    @Output() onfinished = new EventEmitter();
    @Output() oncancel = new EventEmitter();

    @ContentChild(PailiuyaoCoins) coins: PailiuyaoCoins;

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }

    get Result(){
        return '6 yao are.....'
    }

    NextStep(){
        this.onfinished.next('step 4');
    }

    GoBack(){
        this.oncancel.next('step 4')
    }

    afterContentInit() {

    }
}