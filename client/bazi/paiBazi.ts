/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/moment-node.d.ts" />
/// <reference path="../../typings/global.d.ts" />

import {Component, Inject} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {Router} from 'angular2/router'

import {PaipanEmitter} from 'client/allgemein/paipanermitter'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {LandMaps} from "../../lib/lunar/landmaps";
import {GanZhi} from '../../lib/base/ganzhi'
import {TYLunar} from '../../lib/lunar/tylunar'

declare var jQuery:any;
declare var moment;

@Component({
    selector: 'paibazi',
    templateUrl: 'client/bazi/paiBazi.html',
    pipes:[TranslatePipe],
    directives: [NgFor]
})

export class PaiBazi{
    emitter = PaipanEmitter.get(PaipanEmitter.Paipan);
    
    private ganzhinames: Array<string>;
    Panel = 'paipan';

    solarinfo = '';
    maps: Array<Object>;
    cities: Array<Object>;
    Input = {
        Name: '',
        Gender: 'm',
        Land: '',
        City: '',
        Date: '',
        Time: '',
        HH: 0,
        MM: 0,
        Solar: true,
        Code: ''
    }
    CalcSet = {
        Y: '',
        M: '丙寅',
        D: '',
        T: '甲子',
        y: '',
        d: '',
        currentYear: 2015,
        Result: null,
        ResultTx: ''
     }
    monthCollection: Array<string>;
    timeCollection: Array<string>;

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting,
                private router: Router) {
        this.glsetting = glsetting;
    }
    
    showMenu(hide){
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }

    get Land(){
        return this.Input.Land;
    }

    set Land(value){
        if(value != this.Input.Land){
            this.Input.Land = value;
            this.initCityOptions();
        }
    }

    get City(){
        return this.Input.City;
    }

    set City(value){
        this.Input.City = value;
        let city = this.cities.filter(c => c['Name'] == value);
        if(city.length == 1){
            this.Input.Code = city[0]['Code']
            this.initSolarInfo();
        }
    }

    get Solar(){
        return this.Input.Solar;
    }

    set Solar(value){
        this.Input.Solar = value;
        this.initSolarInfo();
    }

    get GanZhiNames() {
        if(!this.ganzhinames){
            this.ganzhinames = [].concat(GanZhi.GanZhiNames);
        }

        return this.ganzhinames
    }

    get GanZhiNamesM(){
        if(this.CalcSet.y != this.CalcSet.Y || !this.monthCollection){
            this.monthCollection = this.qiganzhi(this.CalcSet.Y, true);
            this.CalcSet.y = this.CalcSet.Y;
            setTimeout(() => {
                this.CalcSet.M = this.monthCollection[0]
            }, 500)
        }

        return this.monthCollection;
    }

    get GanZhiNamesT(){
        if(this.CalcSet.d != this.CalcSet.D || !this.timeCollection){
            this.timeCollection = this.qiganzhi(this.CalcSet.D, false);
            this.CalcSet.d = this.CalcSet.D;
            setTimeout(() => {
                this.CalcSet.T = this.timeCollection[0]
            }, 500)
        }

        return this.timeCollection;
    }

    monthcollectionchanged(){
        console.log("monthcollectionchanged")
    }
    
    ngOnInit(){
        let hideMenu = true;
        this.showMenu(hideMenu);

        this.maps = LandMaps.Maps;
        this.Land = this.maps[0]['Name']

        let time = new Date(Date.now())
        this.Input.Date = moment().format('YYYY-MM-DD');
        //this.Input.Time = moment().format('HH:mm');
        this.Input.HH = time.getHours();
        this.Input.MM = time.getMinutes();

        this.Solar = true;
        this.CalcSet.Y = this.GanZhiNames[0];
        this.CalcSet.D = this.GanZhiNames[0];
        this.CalcSet.currentYear = (new Date(Date.now())).getFullYear();
    }

    ngAfterViewInit(){

        /*this.CalcSet.M = '丙寅'
        this.CalcSet.T = '甲子'*/
    }

    calcNextTime(direction: number){
        let date = this.calcTimeFromGanzhi(direction)
        this.CalcSet.Result = date;
        this.CalcSet.ResultTx = date ? date.toChinaString(true) : '找不到相应的日子'
    }

    setBaziTime(){
        let mm = moment(this.CalcSet.Result);
        this.Input.Date = mm.format('YYYY-MM-DD');
        //this.Input.Time = mm.format('HH:mm');
        let date = this.CalcSet.Result
        this.Input.HH = date.getHours();
        this.Input.MM = date.getMinutes();
        this.Panel = 'paipan'
    }

    paiBazi(){
        let date = new Date(this.Input.Date)
        //let time = this.Input.Time.split(':')
        //let houres = parseInt(time[0])
        //let minutes = parseInt(time[1])
        let houres = this.Input.HH;
        let minutes = this.Input.MM;

        let birthday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), houres, minutes)
        let params = {
            flag: 'bazi',
            name: this.Input.Name == '' ? '未知' : this.Input.Name,
            birthday: birthday.toISOString(),
            gender: this.Input.Gender,
            solar: this.Input.Solar,
            land: this.Input.Land,
            city: this.Input.City == '未知' ? '' : this.Input.City,
            code: this.Input.Code
        }

        //this.router.parent.navigate(['/Desktop', params])
        this.emitter.emit(params)
    }

    private initCityOptions(){
        let res = this.maps.filter(l => l['Name'] == this.Input.Land);
        this.cities = res[0]['Cities']
        this.City = this.cities[0]['Name']
    }

    private initSolarInfo(){
        if(this.Input.Solar == false || this.Input.City == '' || this.Input.Land == '未知'){
            this.solarinfo = '';
        }else{
            let timeoff = LandMaps.CalcTimeOff(this.Input.Code)
            let dire = timeoff > 0 ? '提前' : '推迟'
            timeoff = Math.abs(timeoff)
            this.solarinfo = ` (比北京时间${dire} ${timeoff} 分钟)`
        }
    }

    // 根据年或者日干支起月和时干支
    private qiganzhi(gztext: string, yue: boolean){
        let off = yue ? 2 : 0;
        var gz = new GanZhi(gztext);
        var start = (gz.Gan.Index % 5) * 2;
        start = (start + off) % 10;
        var res = [];
        for (var idx = 0; idx < 12; idx++) {
            var gan = (start + idx) % 10;
            var zhi = (idx + off) % 12;

            let tmp = new GanZhi([gan, zhi])
            res.push(tmp.Name);
        }

        return res;
    }

    // 根据年干支计算公历年
    private calcYearFromGanzhi(startYear: number, ganzhi: GanZhi, direktion: number): number{
        var year = startYear - 1984;
        while (year < 0) {
            year += 60;
        }

        var gan = ((year % 60) % 10);
        var zhi = ((year % 60) % 12);

        var gz = new GanZhi([gan, zhi]);
        var jiaziIndex = gz.Index;
        var zielIndex = ganzhi.Index;

        var yearDiff = zielIndex - jiaziIndex;
        yearDiff = direktion > 0 ? (yearDiff + 60) % 60 : ((60 - yearDiff) % 60) * -1;
        var result = startYear + yearDiff;
        return result;

        var result = -1;
        for (var idx = 0; idx < 60; idx++) {
            if (jiaziIndex == zielIndex) {
                result = year - idx + 1984;
                break;
            }

            jiaziIndex = (jiaziIndex - 1 + 60) % 60;
        }

        if (direktion < 0) {
            while (result > startYear) {
                result -= 60;
            };
        } else {
            while (result < startYear) {
                result += 60;
            };
        };


        return result;
    }

    private calcTimeFromGanzhi(direction: number): Date{
         var bazi = {
             Y: new GanZhi(this.CalcSet.Y),
             M: new GanZhi(this.CalcSet.M),
             D: new GanZhi(this.CalcSet.D),
             T: new GanZhi(this.CalcSet.T),
         }

         // 确定年和月份。寅月从2月开始，寅的地支下标正好是2
         var month = bazi.M.Zhi.Index == 0 ? 12 : bazi.M.Zhi.Index;
         var year = this.calcYearFromGanzhi(this.CalcSet.currentYear + direction, bazi.Y, direction);

         //丑月跨年
         year += (bazi.M.Zhi.Name == "丑") ? 1 : 0;

         var baziIndex = [bazi.Y.Index, bazi.M.Index, bazi.D.Index, bazi.T.Index];
         var found: Date = null;
         while (year > 0 || year < 3000) {
             var beginDate = TYLunar.getSolarTerms(year, month)[0];
             var date = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 0, 0, 0);

             var baziTmp = TYLunar.calcBazi(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
             var dateDiff = bazi.D.Index - baziTmp['D'].Index;
             dateDiff = (dateDiff + 60) % 60;
             date = TYLunar.addDays(dateDiff, date);

             baziTmp = TYLunar.calcBazi(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
             if (baziTmp['Y'].Index == bazi.Y.Index &&
                 baziTmp['M'].Index == bazi.M.Index &&
                 baziTmp['D'].Index == bazi.D.Index) {
                 found = date;
                 break;
             } else {
                 year += direction * 60;
             };
         };

         if(found != null){
             this.CalcSet.currentYear = found.getFullYear();
             let hours = (bazi.T.Index % 12) * 2;
             let res = new Date(found.getTime() + hours * 60 * 60 * 1000)
             return res;
         }else{
             return null;
         }
     }
}