/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {RouterOutlet, RouteConfig} from 'angular2/router'

import {BookMarket} from './bookmarket'
import {BookEditor} from './editbook'
import {BookContent} from './bookcontent'
import {RecordView} from  './record/recordview'

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet],
})
@RouteConfig([
    {path: '/', as: 'List', component: BookMarket},
    {path: '/editbook:id', as: 'EditBook', component: BookEditor},
    {path: '/book:id', as: 'BookContent', component: BookContent},
    {path: '/bkrecord:bid:rid', as: 'BookRecord', component: RecordView},
])
export class BookComponent{
    
}

//{path: '/edit:id', as: 'EditBook', component: Desktop},