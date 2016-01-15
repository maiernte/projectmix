/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/angular2.d.ts" />

import {Component,
        Inject,
        provide,
        AfterViewInit} from 'angular2/core';
import {FORM_DIRECTIVES} from  'angular2/common'
import {bootstrap} from 'angular2-meteor';
import {
        Router,
        Location,
        Route,
        RouteConfig,
        ROUTER_DIRECTIVES,
        ROUTER_PROVIDERS,
        LocationStrategy,
        HashLocationStrategy} from 'angular2/router';
    
import {Desktop} from 'client/allgemein/desktop';
import {PaiLiuyao} from 'client/liuyao/paiLiuyao';
import {PaiBazi} from 'client/bazi/paiBazi';
import {CalendarPage} from 'client/calendar/calendarPage'
import {CompassPage} from 'client/compass/compassPage'
import {BookMarket} from 'client/books/bookmarket'
import {BookComponent} from 'client/books/bookcomponent'

import {TranslatePipe} from './allgemein/translatePipe'
import {GlobalSetting} from  './globalsetting'
import {AppSetting} from './allgemein/setting'

declare var jQuery;

@Component({
    selector: 'app',
    templateUrl: 'client/app.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [TranslatePipe],
})
@RouteConfig([
    {path: '/', as: 'Desktop', component: Desktop},
    {path: '/paibazi', as: 'PaiBazi', component: PaiBazi},
    {path: '/pailiuyao', as: 'PaiLiuyao', component: PaiLiuyao},
    {path: '/calendar', as: 'Calendar', component: CalendarPage},
    {path: '/compass', as: 'Compass', component: CompassPage},
    {path: '/setting', as: 'Setting', component: AppSetting},
    {path: '/books/...', as: 'Books', component: BookComponent},
    {path: '/user', as: 'User', component: AppSetting},
])
class HuaheApp {
    router: Router;
    location: Location;
    glsetting: GlobalSetting;
    
    constructor(@Inject(Router) router: Router,
                @Inject(Location) location: Location,
                @Inject(GlobalSetting) glsetting: GlobalSetting){
        console.log('App constructor')

        this.router = router;
        this.location = location;
        this.glsetting = glsetting;
    }

    Exit(){
        this.glsetting.Exit();
    }
}

//bootstrap(HuaheApp)
bootstrap(HuaheApp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy }), GlobalSetting]);
