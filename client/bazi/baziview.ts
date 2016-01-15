/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/global.d.ts" />
/// <reference path="../../typings/book.d.ts" />

import {Component, Inject, Input, NgFor, ElementRef, AfterViewInit} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {TYLunar} from '../../lib/lunar/tylunar'
import {LandMaps} from "../../lib/lunar/landmaps";
import {Bazi, BaziYun} from '../../lib/base/bazi'
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
    SelectedDaYun: BaziYun = null
    

    shenshaColumnCount = 4
    private shenshas: Array<Object>;
    private liunian: Array<Object>;
    private initParams: Object;

    @Input() initdata:string
    Info = {
        Name: '',
        Birthday: '',
        Place: '',
        SolarTime: '',
        Title: '',
        Gender: ''
    }

    ShowItem = {
        MingJu: true,
        ShenSha: true,
        DaYun: true,
        LiuNian: true
    }

    DaYunDetail = {
        Time: '',
        NaYin: '',
        ShenSha: ''
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
        if(this.shenshas &&
            this.shenshas[0]['length'] == this.shenshaColumnCount) {
            return this.shenshas
        }

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

        let befor = {Title: '起运前 ', Liunian: null}
        befor.Liunian = this.Bazi.CalcLiuNian(this.Bazi.Birthday.getFullYear(), endDate.getFullYear())
        this.liunian.push(befor);

        for(let dy of this.Bazi.DaYun){
            let timeInfo = dy.Start.toChinaString(false);

            let obj = {
                Title: dy.GZ.Name + '运 (' + timeInfo + ')',
                Liunian: this.Bazi.CalcLiuNian(dy.Start.getFullYear(), dy.End.getFullYear())
            }

            this.liunian.push(obj)
        }

        return this.liunian;
    }

    ChangeDaYun(dy: BaziYun){
        this.SelectedDaYun = dy;
        let d1 = dy.Start
        let d2 = dy.End
        let time1 = `${d1.getFullYear()}年${d1.getMonth() + 1}月`
        let time2 = `${d2.getFullYear()}年${d2.getMonth() + 1}月`
        this.DaYunDetail.Time = time1 + ' ~ ' + time2;
        this.DaYunDetail.NaYin = dy.GZ.NaYin

        if(!dy.ShenSha){
            let ss = this.Bazi.CalcShenSha(dy.GZ)
            dy.ShenSha = ss == '' ? '无' : ss;
        }

        this.DaYunDetail.ShenSha = dy.ShenSha;
    }

    CalcShenSha(gz: GanZhi){
        if(!gz.ShenSha){
            gz.ShenSha = this.Bazi.CalcShenSha(gz)
        }

        return gz.ShenSha;
    }

    showSetting() {
        jQuery(this.rootElement.nativeElement)
            .find('.bazi.setting')
            .transition('fade up', 1000)
    }

    onInit(){
        this.initParams = JSON.parse(this.initdata)
        this.paiBazi(this.initParams);
    }
    
    afterViewInit(){
        jQuery(this.rootElement.nativeElement).find('.accordion.bazi').accordion()
        jQuery(this.rootElement.nativeElement).find('.accordion.liunian').accordion()
        jQuery(this.rootElement.nativeElement).find('.bazi.mean').popup({on: 'click'})
    }
    
    Recalc(hours: number){
        if(typeof this.initParams['birthday'] == 'string'){
            let text = this.initParams['birthday']
            this.initParams['birthday'] = new Date(text);
        }
        
        let milisecondes = hours * 60 * 60 * 1000;
        let datetime = this.initParams['birthday'].getTime() + milisecondes
        this.initParams['birthday'] = new Date(datetime)
        
        this.paiBazi(this.initParams);
    }
    
    exportAsRecord(): YiRecord{
        let ques = this.Info.Name;
        if(!ques || ques == ''){
            ques = '姓名'
        }

        let bazi = this.Bazi.Y.Name + ' '
            + this.Bazi.M.Name + ' '
            + this.Bazi.D.Name + ' '
            + this.Bazi.T.Name

        return {
            bazi: {
                time: this.initParams['birthday'],
                gender: this.initParams['gender'],
                place: this.Info.Place,
                solartime: this.initParams['code'],
                bazi: bazi
            },
            question: ques,
            description: '',
            owner: null,
            feed: false,
            created: Date.now(),
            modified: Date.now(),
        }
    }

    private paiBazi(params){
        //let params = JSON.parse(this.initdata)

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
        this.Info.Title = this.Bazi.Y.Name + ' / ' +
                            this.Bazi.M.Name + ' / ' +
                            this.Bazi.D.Name + ' / ' +
                            this.Bazi.T.Name

        this.Info.Gender = params['gender'] == 'm' ? '乾造' : '坤造'
        this.Main = new Array<GanZhi>();
        this.Main.push(this.Bazi.Y)
        this.Main.push(this.Bazi.M)
        this.Main.push(this.Bazi.D)
        this.Main.push(this.Bazi.T)

        this.initMingJu();
        this.ChangeDaYun(this.Bazi.DaYun[0])
        this.shenshaColumnCount = this.glsetting.GetSetting('bazi-shensha')
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