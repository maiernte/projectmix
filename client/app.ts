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
import {CalendarView} from 'client/calendar/calendar'
import {CompassView} from 'client/compass/compass'

@Component({
    selector: 'app',
    templateUrl: 'client/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', as: 'Desktop', component: Desktop},
    {path: '/paibazi', as: 'PaiBazi', component: PaiBazi},
    {path: '/pailiuyao', as: 'PaiLiuyao', component: PaiLiuyao},
    {path: '/calendar', as: 'Calendar', component: CalendarView},
    {path: '/compass', as: 'Compass', component: CompassView}
])
class HuaheApp {
    router: Router;
    location: Location;
    
    constructor(@Inject(Router) router: Router, @Inject(Location) location: Location){
        this.router = router;
        this.location = location;

        $(document).ready(function(){
            console.log('document ready....after angular 2')
            $('.ui.accordion').accordion();
        });
    }
}

//bootstrap(HuaheApp)
bootstrap(HuaheApp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);