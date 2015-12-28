/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/angular2/router.d.ts" />

import {Component, View, FORM_PROVIDERS, provide, Inject} from 'angular2/angular2';
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

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

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
    {path: '/compass', as: 'Compass', component: CompassPage}
])
class HuaheApp {
    router: Router;
    location: Location;
    glsetting: GlobalSetting;
    
    constructor(@Inject(Router) router: Router,
                @Inject(Location) location: Location,
                @Inject(GlobalSetting) glsetting: GlobalSetting){
        this.router = router;
        this.location = location;
        this.glsetting = glsetting;
        
        // var s = moment().format();
    }

    Exit(){
        this.glsetting.Exit();
    }
}

//bootstrap(HuaheApp)
bootstrap(HuaheApp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy }), GlobalSetting]);

/*
Meteor.startup(function(){
    console.log('meteor startup')
})*/
