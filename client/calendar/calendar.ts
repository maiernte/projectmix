/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component, Inject, NgFor} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

import {TYLunar, TYDate} from 'lib/lunar/tylunar';
import {LandMaps} from 'lib/lunar/landmaps';

declare function moment();
declare function moment(text: string);

@Component({
    selector: 'calendarview',
    templateUrl: 'client/calendar/calendar.html',
    pipes: [TranslatePipe],
    directives: [NgFor],
    styles: [`
        .column.th.cell{
            text-align:center;
            padding-left:0;
            padding-right:0;
            border: 1px solid darkgrey;
        }
        .th.cell.weekday{
            background-color:#cdc8b1;
        }
        .th.cell.weekend{
            background-color:chocolate
        }
        .month.column.cell.td{
            text-align:center;
            padding:0;
            border: 1px solid darkgrey;
        }
        .column.cell.month{
            background-color:#eee9e9;
            color: black
        }
        .column.cell.xmonth{
            background-color:#fffafa;
            color: gray
        }
        .column.cell.active{
            background-color:#6495ed;
            color: black
        }
    `]
})

export class CalendarView {
    glsetting: GlobalSetting;
    Weeks: Array<TYDate> = [];
    Month: number;
    Date: number;
    Year: number;
    TyDate: TYDate;
    
    private selectedDate: string;
    private inited = false;

    constructor(@Inject(GlobalSetting) glsetting: GlobalSetting){
        this.glsetting = glsetting;
        // let city = LandMaps.FindCity('广东', '湛江')
        // console.log('JW test: ', city)
        // console.log(LandMaps.CalcTimeOff(city.Code))

        // let tydate = new TYDate(new Date(Date.now()));
        // console.log('tydate', tydate)

        let date = new Date(Date.now());
        this.initWeeks(date.getFullYear(), date.getMonth() + 1, date.getDate());
        this.inited = true;
    };
    
    get SelectedDate(){
        return this.selectedDate;
    }
    
    set SelectedDate(value) {
        if(this.inited == false){
            return;
        }
    
        this.selectedDate = value;
        let d = moment(value);
        if(d.year() != this.Year || d.month() + 1 != this.Month || d.date() != this.Date){
            this.initWeeks(d.year(), d.month() + 1, d.date());
        }
    }

    // 更改当前日期
    changeDate(date: TYDate){
        let now = new Date(Date.now());
        let y = date ? date.Year : now.getFullYear();
        let m = date ? date.Month : now.getMonth() + 1;
        let d = date ? date.Date : now.getDate();
    
        if(m == this.Month && date){
            this.Date = d;
            this.TyDate = date;
            
            this.SelectedDate = moment(y + '-' + m + '-' + d).format('YYYY-MM-DD');
        }else{
            this.initWeeks(y, m, d)
        }
    }

    // 显示设置窗口
    showSetting(){
        console.log('calendar view: call from parent click')
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
            let week = { Dates: [] };
            weeks.push(week);

            for (let d = 0; d < 7; d++) {
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
        
        let d = moment(year + '-' + month + '-' + _date)
        this.SelectedDate = d.format('YYYY-MM-DD');
    };
    
    onInit(){
        this.SelectedDate = moment().format('YYYY-MM-DD');
    }
}