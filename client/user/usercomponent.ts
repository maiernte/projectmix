/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, Inject, NgZone} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {RouterOutlet, RouteConfig} from 'angular2/router'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {UserLogin} from './userlogin'
import {UerProfile} from  './userprofile'
import {UserRegist} from './userregist'

import {PageComponent} from 'client/allgemein/pagecomponent'

declare var jQuery;

@Component({
    template: `
        <div [style.min-height.px]="WinHeight">
            <div class="ui top attached menu">
                <div class="ui animated fade primary button item" (click)="showMenu()">
                    <div class="visible content">
                        <i class="sidebar icon"></i>
                    </div>
                    <div class="hidden content">
                        {{'菜单' | tran:glsetting.lang}}
                    </div>
                </div>
                {{'用户版面' | tran:glsetting.lang}}
            </div>
            <router-outlet></router-outlet>
        </div>
    `,
    directives: [RouterOutlet],
    pipes: [TranslatePipe],
})
@RouteConfig([
    {path: '/', as: 'Login', component: UserLogin},
    {path: '/profile', as: 'Profile', component: UerProfile},
    {path: '/regist', as: 'Regist', component: UserRegist},
])
export class UserComponent extends PageComponent {
    constructor(private router: Router,
                private routeParams: RouteParams,
                private ngZone: NgZone,
        @Inject(GlobalSetting) glsetting: GlobalSetting){
        super(glsetting)
    }

    ngOnInit(){
        let hideMenu = true;
        this.showMenu(hideMenu);
    }

    ngAfterViewInit(){
        //console.log(this.router)
        if(this.glsetting.Signed){
            /*this.ngZone.run(() => {
                this.router.navigate(['Profile'])
            })*/
            setTimeout(() => {
                this.router.navigate(['Profile'])
            }, 500)
        }
    }
}