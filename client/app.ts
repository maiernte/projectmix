/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/angular2.d.ts" />

import {enableProdMode} from 'angular2/core';
enableProdMode();

import {Component,
        Inject,
        provide,
        AfterViewInit, 
        EventEmitter} from 'angular2/core';
        
import {FORM_DIRECTIVES, NgIf} from  'angular2/common'

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
//import {PaiLiuyao} from 'client/liuyao/paiLiuyao';
import {LiuyaoComponent} from 'client/liuyao/liuyaocomponent';
import {PaiBazi} from 'client/bazi/paiBazi';
import {CalendarPage} from 'client/calendar/calendarPage'
import {CompassPage} from 'client/compass/compassPage'
import {BookMarket} from 'client/books/bookmarket'
import {BookComponent} from 'client/books/bookcomponent'

import {TranslatePipe} from './allgemein/translatePipe'
import {GlobalSetting} from  './globalsetting'
import {AppSetting} from './allgemein/setting'
import {UserComponent} from './user/usercomponent'
import {MailVerified} from 'client/user/mailverify'
import {ResetPassword} from 'client/user/resetpassword'

import {PaipanEmitter} from 'client/allgemein/paipanermitter'

declare var jQuery;
declare var alertify;

@Component({
    selector: 'app',
    templateUrl: 'client/app.html',
    directives: [ROUTER_DIRECTIVES, NgIf],
    pipes: [TranslatePipe],
})
@RouteConfig([
    {path: '/', as: 'Desktop', component: Desktop},
    {path: '/paibazi', as: 'PaiBazi', component: PaiBazi},
    {path: '/pailiuyao/...', as: 'PaiLiuyao', component: LiuyaoComponent},
    {path: '/calendar', as: 'Calendar', component: CalendarPage},
    {path: '/compass', as: 'Compass', component: CompassPage},
    {path: '/setting', as: 'Setting', component: AppSetting},
    {path: '/books/...', as: 'Books', component: BookComponent},
    {path: '/user/...', as: 'User', component: UserComponent},
    {path: '/verify/:ad', as: 'Verified', component: MailVerified},
    {path: 'resetpw/:tk', as: 'ResetPw', component: ResetPassword}
])
class HuaheApp {
    router: Router;
    location: Location;
    glsetting: GlobalSetting;

    emitterPaipan: EventEmitter<any>;
    private testtime = new Date('2016-06-30')
    
    constructor(@Inject(Router) router: Router,
                @Inject(Location) location: Location,
                @Inject(GlobalSetting) glsetting: GlobalSetting){
        this.router = router;
        this.location = location;
        this.glsetting = glsetting;
        
        
        this.emitterPaipan = PaipanEmitter.get(PaipanEmitter.Paipan);
        this.emitterPaipan.subscribe(data => {
            Desktop.AddFrame(data, this.glsetting.GUID)
            this.router.navigate(['/Desktop'])
        })

        /*document.addEventListener("deviceready", () => {
            console.log('deviceready....')
            this.glsetting.Notify('deviceready....', 1)
        }, false);*/

        document.addEventListener("backbutton", () => {
            this.glsetting.Notify("本软件暂时不支持硬件返回按钮", -1)
        }, false);

        document.addEventListener("menubutton", () => {
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }, false);

        if(Date.now() >= this.testtime && this.glsetting.IsCordova){
            alertify.alert('版本过期', '此测试版本已经到期!请更换新的版本',
                () => {this.Exit()})
                .set('labels', {ok:'好的'});
        }
    }

    get iOS(){
        return this.glsetting.Ios;
    }
    
    get CanExit(){
        return this.glsetting.Android && this.glsetting.IsCordova
    }

    Exit(){
        this.glsetting.Exit();
    }
}

bootstrap(HuaheApp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy }), GlobalSetting]);