/// <reference path="../../../typings/angular2-meteor.d.ts" />
/// <reference path="../../../typings/book.d.ts" />

import {Component, Inject, ContentChild} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {GuaView} from 'client/liuyao/guaview'
import {BaziView} from 'client/bazi/baziview'

import {LocalRecords, Books} from 'collections/books'

declare var jQuery;

@Component({
    selector: "yixue-part",
    pipes:[TranslatePipe],
    templateUrl: "client/books/record/yipart.html",
    directives: []
})
export class YixuePart{
    @ContentChild(GuaView) guaview: GuaView;
    @ContentChild(BaziView) baziview: BaziView;

    constructor(private router: Router,
                private routeParams: RouteParams,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
    }

    ngOnInit(){
    }

    ngAfterViewInit(){
        //console.log('guaview ', this.guaview)
        //console.log('baziview ', this.baziview)
    }
}