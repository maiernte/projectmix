/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {NgZone} from 'angular2/core'
import {Router} from 'angular2/router'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery

export function WindowResized(){
    PageComponent.winheight = window.innerHeight
    NavComponent.winheight = window.innerHeight
}

export abstract class PageComponent{
    public static winheight = window.innerHeight

    private existApp = false
    private timeoutid = null

    constructor(public glsetting: GlobalSetting){
        document.addEventListener("backbutton", this.onBackButton, false);
    }

    ngOnDestroy(){
        console.log("PageComponent destroy")
        document.removeEventListener("backbutton", this.onBackButton, false);
        if(this.timeoutid != null){
            Meteor.clearTimeout(this.timeoutid)
            this.timeoutid = null
        }
    }

    onBackButton = (evt: Event) => {
        if(this.existApp == true){
            this.glsetting.Exit()
        }else{
            this.existApp = true
            this.timeoutid = Meteor.setTimeout(() => {
                this.existApp = false
                this.timeoutid = null
            }, 5 * 1000)

            this.glsetting.Notify("再按一次退出软件", -1)
        }
    }

    get WinHeight() {
        //console.log("get winheight", PageComponent.winheight)
        return PageComponent.winheight
    }

    showMenu(hide){
        //console.log("showMenu", hide)
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }
}

export abstract class NavComponent{
    public static winheight = window.innerHeight
    public parentUrl = []
    
    constructor(public router: Router, public ngZone: NgZone){
        document.addEventListener("backbutton", this.onBackButton, false);
    }
    
    ngOnDestroy(){
        Log("NavComponent destroy")
        document.removeEventListener("backbutton", this.onBackButton, false);
    }
    
    onBackButton = (evt: Event) => {
        this.ngZone.run(() => {
            this.goBack()
        })
    }
    
    get WinHeight() {
        return NavComponent.winheight
    }
    
    goBack(){
        Log('navBack', this.parentUrl)
        this.router.parent.navigate(this.parentUrl)
    }
}