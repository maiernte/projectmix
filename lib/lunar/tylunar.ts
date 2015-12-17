
//System.import('lib/lunar/lunar.js')

declare var Lunar:any;

export class TYLunar{
    static OneDay = 1000 * 60 * 60 * 24;
    static BaseDay = new Date(1900, 0, 0);
    static M_DayNames = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", 
                         "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", 
                         "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
    static M_MonthNames = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    static M_ChineseMonthNames = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
    
    static getLunarObject(date: Date){
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();

        if (Lunar.lun.length == 0 || Lunar.lun.y != y || Lunar.lun.m != m) {
            Lunar.calc2(date.getFullYear(), date.getMonth() + 1, true);
        }

        for (let i = 0; i < Lunar.lun.length; i++) {
            if (Lunar.lun[i].d == d) {
                return Lunar.lun[i];
            }
        }

        return null;
    }
    
    static addDays (daysOffset: number, baseDate: Date): Date {
        var base = baseDate ? baseDate : TYLunar.BaseDay;
        return new Date(base.getTime() + daysOffset * TYLunar.OneDay);
    };
    
    static calcDayDiff (first: Date, second: Date) : number{
        var d1 = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        var d2 = new Date(second.getFullYear(), second.getMonth(), second.getDate());
        return Math.round((d2.getTime() - d1.getTime()) / TYLunar.OneDay);
    };
    
    static getSolarTerms (year: number, month: number): Array<Date>{
        // [0,'小寒'],[1,'大寒'],[2,'立春'],[3,'雨水'],[4,'惊蛰'],[5,'春分'],[6,'清明'],[7,'谷雨'],[8,'立夏']
        // [9,'小满'],[10,'芒种'],[11,'夏至'],[12,'小暑'],[13,'大暑'],[14,'立秋'],[15,'处暑'],[16,'白露'],
        // [17,'秋分'],[18,'寒露'],[19,'霜降'],[20,'立冬'],[21,'小雪'],[22,'大雪'],[23,'冬至'] 
        // solarTermsIndex == 0 为小寒
        var res = [];

        if (Lunar.lun.length == 0 || Lunar.lun.y != year || Lunar.lun.m != month) {
            Lunar.calc2(year, month, true);
        }

        for (var i = 0; i < Lunar.lun.length; i++) {
            if (Lunar.lun[i].jqsj != null && Lunar.lun[i].jqsj != "") {
                var o = Lunar.lun[i];
                var items = o.jqsj.split(':');
                res.push(new Date(year, month - 1, o.d, parseInt(items[0]), parseInt(items[1]), parseInt(items[2])));
            }
        }

        return res;
    };
};

export class TYDate{
    // 干支年月日
    private gzyear: string;
    private gzmonth: string;
    private gzdate: string;

    // 农历月、日名称
    private nlmonth: string;
    private nldate: string;
    private nlleap: string; // 闰月

    // 农历月、日下标， 从0开始。
    // 距农历月首的编移量, 0对应初一 
    private nldatei: number; 
    
    private jqtime: string; //节气时间串
    private jqname: string; //节气名称
    
    
    constructor(public date: Date){
        
        let lunarObj = TYLunar.getLunarObject(this.date);
        
        this.gzyear = lunarObj.Lyear2;
        this.gzmonth = lunarObj.Lmonth2;
        this.gzdate = lunarObj.Lday2;

        this.nlmonth = lunarObj.Lmc;
        this.nldate = lunarObj.Ldc;
        this.nlleap = lunarObj.Lleap;

        // tydate.Lmi = lunarObj;
        // tydate.jqmc = lunarObj.jqmc;
        this.jqtime = lunarObj.jqsj;
        this.jqname = lunarObj.jqmc;
        this.nldatei = lunarObj.Ldi;
    };
    
    get NLmonthFullName(): string{
        return this.NLleap + this.NLmonth + '月'
    }
    get Display(): string {
        //return tydate.Date.getDate();
        return this.JQname != "" ? this.JQname : this.date.getDate().toString();
    }
    get DisplayChi(): string {
        return this.NLdate == "初一" ? this.NLmonthFullName : this.NLdate;
    }
    get Month(): number{
        return this.date.getMonth() + 1;
    }
    get Date(): number{
        return this.date.getDate();
    }
    get Year(): number{
        return this.date.getFullYear();
    }
    
    get GZyear(){
        return this.gzyear;
    }
    get GZmonth(){
        return this.gzmonth;
    }
    get GZdate(){
        return this.gzdate;
    }
    
    get NLmonth(){
        return this.nlmonth;
    }
    get NLdate(){
        return this.nldate;
    }
    get NLleap(){
        return this.nlleap;
    }
    get NLdateIndex(){
        return this.nldatei;
    }
    
    get JQname(){
        return this.jqname;
    }
    get JQtime(){
        return this.jqtime;
    }
}

