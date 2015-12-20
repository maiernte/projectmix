/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'
import {GanZhi, ZhiNames} from "../../lib/base/ganzhi";
import {Gua64} from "../../lib/base/gua"
import ObjectID = Mongo.ObjectID;


declare var jQuery:any;
declare function moment();

@Component({
    selector: 'pailiuyao',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paiLiuyao.html',
    directives: [NgFor]
})

export class PaiLiuyao {
    glsetting:GlobalSetting;
    InputModel:string = 'manuel';
    GanZhiModel:boolean = false;
    GuayaoModel:boolean = false;

    private guagongOrder:boolean = false;

    InputTime: Object;
    GuaNameOptions: Array<Object>;
    GuaOrderText: string;

    Simboles = ['▅\u00A0\u00A0▅', "▅▅▅", "▅\u00A0\u00A0▅ X", "▅▅▅ O", "\u00A0...\u00A0"];

    private static guaNamesShang:Array<Object>;
    private static guaNamesGong:Array<Object>;

    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }

    get GanZhiNames() {
        return GanZhi.GanZhiNames;
    }

    get GanZhiNamesFull() {
        return ZhiNames().concat(GanZhi.GanZhiNames)
    }

    get GuaGongOrder() {
        return this.guagongOrder;
    }

    set GuaGongOrder(value:boolean) {
        this.guagongOrder = value;
        this.initGuaNames(value);
        this.GuaOrderText = value ? '按卦宫排序' : '按上卦排序';
    }

    showMenu() {
        jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
    }

    onInit() {
        let dateText = moment().format('YYYY-MM-DD');
        let timeText = moment().format('HH:mm')

        this.InputTime = {
            Date: dateText,
            Time: timeText,
            Yue: this.GanZhiNamesFull[0],
            Ri: this.GanZhiNamesFull[0]
        }

        this.GuaGongOrder = false;
    }

    initGuaNames(guagong:boolean) {
        if (guagong === false) {
            if (!PaiLiuyao.guaNamesShang) {
                PaiLiuyao.guaNamesShang = new Array<Object>();
                this.initGuaNamesShang();
            }

            this.GuaNameOptions = PaiLiuyao.guaNamesShang;
        } else {
            if (!PaiLiuyao.guaNamesGong) {
                PaiLiuyao.guaNamesGong = new Array<Object>();
                this.initGuaNamesGong();
            }

            this.GuaNameOptions = PaiLiuyao.guaNamesGong;
        }
    }

    private initGuaNamesShang(){
        for (let s = 0; s < 8; s++) {
            let gua = Gua64(s * 8 + s);
            PaiLiuyao.guaNamesShang.push({Name: '上卦 - ' + gua.Shang.Name, IsGua: false});

            for (let x = 0; x < 8; x++) {
                let gua = Gua64(s * 8 + x);
                PaiLiuyao.guaNamesShang.push({Name: gua.Name, IsGua: true});
            }
        }
    }

    private initGuaNamesGong(){
        var pattern = [1, 2, 4, 8, 16, 8, 7];

        for (var idx = 0; idx < 8; idx++) {
            var guaIndex = idx + idx * 8;
            var mainGua = Gua64(guaIndex);

            PaiLiuyao.guaNamesGong.push ({ Name: '卦宫 - ' + mainGua.Shang.Name, IsGua: false });
            PaiLiuyao.guaNamesGong.push({Name: mainGua.Name, IsGua: true});

            for (var p = 0; p < pattern.length; p++) {
                guaIndex = guaIndex ^ pattern[p];
                var gua = Gua64(guaIndex);
                PaiLiuyao.guaNamesGong.push({Name: gua.Name, IsGua: true});
            };
        };
    }

}