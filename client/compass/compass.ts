/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

@Component({
    selector: 'compass-view',
    templateUrl: 'client/compass/compass.html',
    pipes: [TranslatePipe]
})

export class CompassView{
    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }
}
