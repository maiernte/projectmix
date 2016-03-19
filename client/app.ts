/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/global.d.ts" />

import {enableProdMode} from 'angular2/core';
enableProdMode();

import {Component,
        Inject,
        provide,
        AfterViewInit, 
        EventEmitter,
        ElementRef, ChangeDetectionStrategy} from 'angular2/core';
        
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
import {LiuyaoComponent} from 'client/liuyao/liuyaocomponent';
import {PaiBazi} from 'client/bazi/paiBazi';
import {BookMarket} from 'client/books/bookmarket'
import {BookComponent} from 'client/books/bookcomponent'
import {Demo} from 'client/allgemein/directives/demo'

import {TranslatePipe} from './allgemein/translatePipe'
import {GlobalSetting} from  './globalsetting'
import {AppSetting} from './allgemein/setting'
import {UserComponent} from './user/usercomponent'
import {MailVerified} from 'client/user/mailverify'
import {ResetPassword} from 'client/user/resetpassword'

import {PaipanEmitter} from 'client/allgemein/paipanermitter'

import {WindowResized} from 'client/allgemein/pagecomponent'

declare var jQuery;
declare var alertify;
declare var Promise;

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
    {path: '/setting', as: 'Setting', component: AppSetting},
    {path: '/books/...', as: 'Books', component: BookComponent},
    {path: '/user/...', as: 'User', component: UserComponent},
    {path: '/verify/:ad', as: 'Verified', component: MailVerified},
    {path: '/resetpw/:tk', as: 'ResetPw', component: ResetPassword},

    {path: '/demo', as: 'Demo', component: Demo}
])
class HuaheApp {
    router: Router;
    location: Location;
    glsetting: GlobalSetting;

    emitterPaipan: EventEmitter<any>;
    private testtime;
    
    constructor(@Inject(Router) router: Router,
                @Inject(Location) location: Location,
                @Inject(GlobalSetting) glsetting: GlobalSetting,
                private rootElement: ElementRef){
        this.router = router;
        this.location = location;
        this.glsetting = glsetting;
        
        window.onresize = WindowResized
        
        
        this.emitterPaipan = PaipanEmitter.get(PaipanEmitter.Paipan);
        this.emitterPaipan.subscribe(data => {
            Desktop.AddFrame(data, this.glsetting.GUID)
            this.router.navigate(['/Desktop'])
        })

        /*let debug = (Meteor.settings.public || {Debug: false}).Debug
        if(debug == true){
            this.testtime = this.glsetting.ParseDate("2016-06-30")
            if(Date.now() >= this.testtime.getTime() && this.glsetting.IsCordova){
                alertify.alert('版本过期', '此测试版本已经到期!请更换新的版本',
                    () => {this.Exit()})
                    .set('labels', {ok:'好的'});
            }
        }*/

        /*var size = jQuery(this.rootElement.nativeElement).css('font-size');
        console.log('font size', size)

        let md = new MobileDetect(window.navigator.userAgent);
        Log("app start", md, md.is('tablet'),
            md.phone(), md.os(), md.mobile(), md.is("android"))*/
    }

    ngAfterViewInit(){
    }

    get iOS(){
        return this.glsetting.Ios;
    }
    
    get CanExit(){
        return this.glsetting.Android && this.glsetting.IsCordova
    }

    get FontSize(){
        let idx = this.glsetting.FontSize;
        return GlobalSetting.fontsizes[idx];
    }

    Exit(){
        this.glsetting.Exit();
    }
}

bootstrap(HuaheApp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy }), GlobalSetting]);

Meteor.startup(function() {
    if(Meteor.isCordova){
        //Log("disconnet")
        //Meteor.disconnect();

        Meteor._reload.onMigrate(function() {
            console.log("call _reload")
            let debug = (Meteor.settings.public || {Debug: false}).Debug
            return [debug ? true : false];
        });
    }
})


