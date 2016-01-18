/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any;

@Component({
    selector: 'global-setting',
    templateUrl: 'client/allgemein/setting.html',
    pipes: [TranslatePipe]
})

export class AppSetting{
    private twlang: string
    private guaShenSha: string
    private guaSimple: string
    private baziShenSha: string
    
    constructor(@Inject(GlobalSetting) public glsetting: GlobalSetting){

    }

    get TwLang(): string{
        return this.twlang;
    }

    set TwLang(value){
        this.twlang = value;
        this.glsetting.SetValue('lang', value == 'tw')
    }

    get GuaShenSha(): string{
        return this.guaShenSha;
    }

    set GuaShenSha(value){
        this.guaShenSha = value;
        this.glsetting.SetValue('gua-shensha', value)
    }

    get BaziShenSha(): string{
        return this.baziShenSha;
    }

    set BaziShenSha(value){
        this.baziShenSha = value;
        this.glsetting.SetValue('bazi-shensha', value)
    }


    get GuaSimple(): string{
        return this.guaSimple;
    }

    set GuaSimple(value){
        console.log('set simgple', value, typeof  value)
        this.guaSimple = value;
        this.glsetting.SetValue('gua-simple', value == '1')
    }

    showMenu(hide){
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }

    ngOnInit(){
        this.twlang = this.glsetting.lang ? 'tw' : 'zh';
        this.guaShenSha = this.glsetting.GetSetting('gua-shensha').toString();
        this.guaSimple = this.glsetting.GetSetting('gua-simple') == true ? '1' : '0';
        this.baziShenSha = this.glsetting.GetSetting('bazi-shensha').toString();

        let hideMenu = true;
        this.showMenu(hideMenu);
    }
}