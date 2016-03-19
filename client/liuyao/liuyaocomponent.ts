/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {Component, Inject} from 'angular2/core'
import {RouterOutlet, RouteConfig} from 'angular2/router'

import {PaiLiuyao} from './paiLiuyao'
import {PailiuyaoLeading} from './paipan/leading'


@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet],
})

@RouteConfig([
    {path: '/', as: 'Paigua', component: PaiLiuyao},
    {path: '/leading', as: 'Leading', component: PailiuyaoLeading},
])
export class LiuyaoComponent{
    
}