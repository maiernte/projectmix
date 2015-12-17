/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {TYLunar, TYDate} from 'lib/lunar/tylunar';
import {LandMaps} from 'lib/lunar/landmaps';

@Component({
    selector: 'calendarview',
    templateUrl: 'client/calendar/calendar.html',
    pipes: [TranslatePipe],
    directives: [NgFor],
    styles: [`
        .th.cell{
            text-align:center;
            padding-left:0;
            padding-right:0;
            border: 1px solid darkgrey;
        }
        .th.cell.weekday{
            background-color:#cdc8b1
        }
        .th.cell.weekend{
            background-color:chocolate
        }
        .th.cell.month{
            background-color:#eee9e9;
            color: black
        }
        .th.cell.xmonth{
            background-color:#fffafa;
            color: gray
        }
        .th.cell.active{
            background-color:#6495ed;
            color: black
        }
    `]
})

export class CalendarView{
    glsetting: GlobalSetting;
    Weeks: Array<TYDate> = [];
    Month: number;
    Date: number;
    Year: number;
    TyDate: TYDate;
    
    constructor(@Inject(GlobalSetting) glsetting: GlobalSetting){
        this.glsetting = glsetting;
        // let city = LandMaps.FindCity('广东', '湛江')
        // console.log('JW test: ', city)
        // console.log(LandMaps.CalcTimeOff(city.Code))
        
        // let tydate = new TYDate(new Date(Date.now()));
        // console.log('tydate', tydate)
        
        let date = new Date(Date.now());
        this.initWeeks(date.getFullYear(), date.getMonth() + 1, date.getDate());
    };
    
    // 更改当前日期
    changeDate(date: TYDate){
        if(date.Month == this.Month){
            this.Date = date.Date;
            this.TyDate = date;
        }else{
            this.initWeeks(date.Year, date.Month, date.Date)
        }
    }
    
    callMe(){
        console.log('call from parent click')
    }
    
    // 计算某月开始第一天是周几。月的下标从1开始。
    private calcFirstDayInCalendarTable(year: number, month: number){
        var startDate = new Date(year, month - 1, 1);
        var dayInWeek = startDate.getDay();
        dayInWeek = (dayInWeek == 0) ? 7 : dayInWeek;
        
        var date = TYLunar.addDays(-1 * dayInWeek, startDate);
        return date;
    };
    
    // 初始化整个月份。月的下标从1开始。
    private initWeeks (year: number, month: number, _date: number) {
        var date = this.calcFirstDayInCalendarTable(year, month);
        let weeks = [];
        for (let w = 0; w < 6; w++) {
            var week = { Dates: [] };
            weeks.push(week);
            
            for (var d = 0; d < 7; d++) {
                let tyDate = new TYDate(date);
                week.Dates.push(tyDate);
                date = TYLunar.addDays(1, date);
                
                if(tyDate.Month == month && tyDate.Date == _date){
                    this.TyDate = tyDate;
                }
            }
        }
    
        this.Weeks = weeks;
        this.Month = month;
        this.Date = _date;
        this.Year = year;
    };
}