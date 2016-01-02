/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, Input, NgFor, ElementRef, AfterViewInit} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {TYLunar} from '../../lib/lunar/tylunar'
import {LandMaps} from "../../lib/lunar/landmaps";
import {Bazi} from '../../lib/base/bazi'
import {GanZhi} from "../../lib/base/ganzhi";

declare var jQuery:any;

@Component({
    selector: 'baziview',
    templateUrl: 'client/bazi/baziview.html',
    pipes: [TranslatePipe],
    directives: [NgFor]
})

export class BaziView{
    private translate = new TranslatePipe();
    Bazi: Bazi;
    Main: Array<GanZhi>
    MingJu: Array<Object>

    shenshaColumnCount = 5
    private shenshas: Array<Object>;
    private liunian: Array<Object>;

    @Input() initdata:string
    Info = {
        Name: '',
        Birthday: '',
        Place: '',
        SolarTime: '',
        Title: '',
        Gender: ''
    }

    glsetting: GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting: GlobalSetting,
                private rootElement: ElementRef){
        this.glsetting = glsetting;
    }

    calcTitle(gz: GanZhi): string{
        console.log('calcTitle')
        return gz.NaYin;
    }

    get ShenShas(){
        if(this.shenshas) return this.shenshas

        let column = this.shenshaColumnCount;
        let row = Math.ceil(this.Bazi.ShenSha.length / column)

        let res = [];
        for(let r = 0; r < row; r++){
            let rowCollection = [];
            res.push(rowCollection)

            for(let c = 0; c < column; c++){
                if(r * column + c >= this.Bazi.ShenSha.length){
                    rowCollection.push({Text: '', First: false, Last: true})
                }else{
                    let ss = this.Bazi.ShenSha[r * column + c];
                    let result = ss.Result.length == 1 ? ss.Result[0] : ss.Result.join('')
                    let justName = result == '' || result == '√'
                    let obj = {
                        Text: justName ? `[${ss.Name}]` : `[${ss.Name}—${result}]`,
                        First: r == 0,
                        Last: r + 1 == row,
                        Empty: result == ''
                    }

                    rowCollection.push(obj)
                }
            }
        }

        this.shenshas = res;
        return this.shenshas;
    }

    get DaYun(){
        return this.Bazi.DaYun;
    }

    get LiuNian(){
        if(this.liunian) return this.liunian;

        this.liunian = new Array<Object>();

        let endDate = this.Bazi.DaYun[0].Start;

        let befor = {Title: '起运前 ', Liunian: "AA"}
        this.liunian.push(befor);

        for(let dy of this.Bazi.DaYun){
            let timeInfo = dy.Start.toChinaString();
            let obj = {
                Title: dy.GZ.Name + '运 (' + timeInfo + ')',
                Liunian: "asdadg"
            }

            this.liunian.push(obj)
        }

        return this.liunian;
    }

    onInit(){
        let params = JSON.parse(this.initdata)

        var date = params['birthday']
        if(typeof params['birthday'] == 'string'){
            date = new Date(params['birthday']);
        }

        this.Info.Name = params['name'];
        this.Info.Birthday = date.toChinaString(true);
        this.Info.Place = params['land'] + ' ' + params['city']
        if(params['code']){
            let timeoff = LandMaps.CalcTimeOff(params['code'])
            date = new Date(date.getTime() + timeoff * 60 * 1000)
        }

        this.Info.SolarTime = date.toChinaString(true);
        this.Bazi = new Bazi(date, params['gender'])
        this.Info.Title = this.Bazi.Y.Name + ' ' +
                            this.Bazi.M.Name + ' ' +
                            this.Bazi.D.Name + ' ' +
                            this.Bazi.T.Name

        this.Info.Gender = params['gender'] == 'm' ? '乾造' : '坤造'
        this.Main = new Array<GanZhi>();
        this.Main.push(this.Bazi.Y)
        this.Main.push(this.Bazi.M)
        this.Main.push(this.Bazi.D)
        this.Main.push(this.Bazi.T)

        this.initMingJu();
    }

    afterViewInit(){
        jQuery(this.rootElement.nativeElement).find('.accordion.bazi').accordion()
        jQuery(this.rootElement.nativeElement).find('.bazi.mean').popup({on: 'click'})
    }

    private initMingJu(){
        let gan = this.Bazi.D.Gan;
        this.MingJu = new Array<Object>();
        for(let gz of this.Main){
            let canggan = gz.Zhi.CGan.map(g => {return g.Name}).join('');
            let shen10 = gz.Zhi.CGan.map(g => {return g.Ref(gan)[1]}).join('');
            let changsheng = gz.Zhi.ChangSheng(gan);
            let mj = {
                CGan: canggan,
                Shen10: shen10,
                ChangSheng: changsheng,
                NaYin: gz.NaYin
            }

            this.MingJu.push(mj)
        }
    }

    private tran(txt): string{
        return this.translate.transform(txt, [this.glsetting.lang])
    }
}