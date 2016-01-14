/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, NgFor} from 'angular2/angular2'
import {RouterOutlet, RouteConfig} from 'angular2/router'

import {BookMarket} from './bookmarket'
import {BookEditor} from './editbook'
import {BookContent} from './bookcontent'

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet],
})
@RouteConfig([
    {path: '/', as: 'List', component: BookMarket},
    {path: '/editbook:id', as: 'EditBook', component: BookEditor},
    {path: '/book:id', as: 'BookContent', component: BookContent},
])
export class BookComponent{
    
}

//{path: '/edit:id', as: 'EditBook', component: Desktop},