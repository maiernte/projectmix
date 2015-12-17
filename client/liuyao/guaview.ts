/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

@Component({
    selector: 'guaview',
    templateUrl: 'client/liuyao/guaview.html',
    pipes: [TranslatePipe],
})

export class GuaView{
    glsetting: GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting: GlobalSetting){
        this.glsetting = glsetting;
    }
    
    showSetting(){
        console.log('guaview: call from parent click')
    }
}