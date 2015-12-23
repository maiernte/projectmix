/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor, ElementRef} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'
import {Gua64} from "../../../lib/base/gua"
import ElementRef = ng.ElementRef;

declare var jQuery:any;

@Component({
    selector: 'pailiuyao-gua',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/pailiuyaogua.html',
    directives: [NgFor]
})

export class PaiLiuyaoGua{
    private rootElement: ElementRef;
    private guagongOrder:boolean = false;
    private guayaoModel = false;

    GuaNameOptions: Array<Object>;
    GuaOrderText: string;
    ActiveYao = 0;

    Symbols = ['shaoyin.svg', 'shaoyan.svg', 'laoyin.svg', 'laoyan.svg', 'empty.svg']
    SetedYaos = [4, 4, 4, 4, 4, 4]

    private static guaNamesShang:Array<Object>;
    private static guaNamesGong:Array<Object>;
    
    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting, elementRef: ElementRef) {
        this.glsetting = glsetting;
        this.rootElement = elementRef;
    }
    
    get Result(){
        if(this.GuayaoModel == true){
            return 'guayao model';
        }else{
            return 'guachi model'
        }
    }
    
    get GuaGongOrder() {
        return this.guagongOrder;
    }

    set GuaGongOrder(value:boolean) {
        this.guagongOrder = value;
        this.initGuaNames(value);
        this.GuaOrderText = value ? '按卦宫排序' : '按上卦排序';
        this.showAnimate('paigua-guachi', 'paigua-guachi');
    }
    
    get GuayaoModel(){
        return this.guayaoModel;
    }
    
    set GuayaoModel(value){
        this.guayaoModel = value;
        if(value == true){
            this.showAnimate('paigua-yao-name', 'paigua-yao-symb');
        }else{
            this.showAnimate('paigua-yao-symb', 'paigua-yao-name');
        }
    }
    
    onInit(){
        let domGuaName = jQuery('#paigua-yao-name')
        this.GuaGongOrder = domGuaName.hasClass('guagong') ? true : false;
        this.guayaoModel = domGuaName.hasClass('hidden') ? true : false;

        jQuery(this.rootElement.nativeElement)
            .find('.paigua.help')
            .popup({
                on:'click',
                position : 'bottom left'
            });
    }
    
    initGuaNames(guagong:boolean) {
        if (guagong === false) {
            if (!PaiLiuyaoGua.guaNamesShang) {
                PaiLiuyaoGua.guaNamesShang = new Array<Object>();
                this.initGuaNamesShang();
            }

            this.GuaNameOptions = PaiLiuyaoGua.guaNamesShang;
        } else {
            if (!PaiLiuyaoGua.guaNamesGong) {
                PaiLiuyaoGua.guaNamesGong = new Array<Object>();
                this.initGuaNamesGong();
            }

            this.GuaNameOptions = PaiLiuyaoGua.guaNamesGong;
        }
    }
    
    private initGuaNamesShang(){
        for (let s = 0; s < 8; s++) {
            let gua = Gua64(s * 8 + s);
            PaiLiuyaoGua.guaNamesShang.push({Name: '上卦 - ' + gua.Shang.Name, IsGua: false});

            for (let x = 0; x < 8; x++) {
                let gua = Gua64(s * 8 + x);
                PaiLiuyaoGua.guaNamesShang.push({Name: gua.Name, IsGua: true});
            }
        }
    }

    private initGuaNamesGong(){
        var pattern = [1, 2, 4, 8, 16, 8, 7];

        for (var idx = 0; idx < 8; idx++) {
            var guaIndex = idx + idx * 8;
            var mainGua = Gua64(guaIndex);

            PaiLiuyaoGua.guaNamesGong.push ({ Name: '卦宫 - ' + mainGua.Shang.Name, IsGua: false });
            PaiLiuyaoGua.guaNamesGong.push({Name: mainGua.Name, IsGua: true});

            for (var p = 0; p < pattern.length; p++) {
                guaIndex = guaIndex ^ pattern[p];
                var gua = Gua64(guaIndex);
                PaiLiuyaoGua.guaNamesGong.push({Name: gua.Name, IsGua: true});
            };
        };
    }
    
    private showAnimate(outId: string, inId: string){
        //jQuery('.paigua.time').transition('fade down flip');
        jQuery('#' + outId).transition('fade left', function(){
            jQuery('#' + inId).transition('fade right');
        });
    }
}