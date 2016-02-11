/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {LocalRecords, LocalBooks} from 'collections/books'

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
    private bookpagerd: number;
    private guaArrow: boolean;
    
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

    get BookPageRD()
    {
        return this.bookpagerd;
    }

    set BookPageRD(value){
        this.bookpagerd = value
        this.glsetting.SetValue('book-pagerd', value)
    }

    get GuaArrow(){
        return this.guaArrow
    }

    set GuaArrow(value){
        this.guaArrow = value;
        this.glsetting.SetValue('gua-arrow', value)
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
        this.bookpagerd = this.glsetting.PageSize;
        this.guaArrow = this.glsetting.GetSetting('gua-arrow')

        let hideMenu = true;
        this.showMenu(hideMenu);
    }
    
    ClearLocalDB(){
        this.glsetting.ShowMessage("清空本地数据", "所有本地数据将被清空。没有保存到云端的数据将永久丢失。确定进行此操作吗？", () => {
            console.log("local records are cleared")
            LocalRecords.clear();
            LocalBooks.clear();
        })
    }
}