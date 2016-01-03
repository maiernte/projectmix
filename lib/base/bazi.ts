import {GanZhi} from './ganzhi'
import {TYLunar} from 'lib/lunar/tylunar'
import {ShenSha} from "./shensha";

enum YunType {DaYun, LiuNian, XiaoYun}

declare var Promise: any;

export class BaziYun{
    private static oneday = 1000 * 60 * 60 * 24;
    private static oneyear = BaziYun.oneday * 365.25;
    private static tenyear = 10 * BaziYun.oneyear;

    ShenSha: string;
    GZ2: GanZhi;

    constructor(public Start: Date,
                public GZ: GanZhi,
                private birthYear: number,
                private type: YunType){
    }

    get Old(){
        return this.Start.getFullYear() - this.birthYear;
    }

    get End(){
        if(this.type == YunType.DaYun){
            return new Date(this.Start.getTime() + BaziYun.tenyear);
        }else if(this.type == YunType.LiuNian){
            return null;
        }else{
            return null
        }
    }

    get Year(){
        return this.Start.getFullYear();
    }
}

export class Bazi{
    private bazi: Object;
    private minggong: GanZhi;
    private wuxings: Array<Object>
    private shenshas: Array<ShenSha>
    private dayun: Array<BaziYun>

    constructor(public Birthday: Date, public Gender: string){

        this.bazi = TYLunar.calcBazi(this.Birthday.getFullYear(),
                                    this.Birthday.getMonth() + 1,
                                    this.Birthday.getDate(),
                                    this.Birthday.getHours(),
                                    this.Birthday.getMinutes())

        this.bazi['Y'].Base = this.bazi['D'];
        this.bazi['M'].Base = this.bazi['D'];
        this.bazi['D'].Base = this.bazi['D'];
        this.bazi['T'].Base = this.bazi['D'];

        this.initShenSha();
        this.initDaYun();
    }

    get Y(): GanZhi{
        return this.bazi['Y']
    }
    get M(): GanZhi{
        return this.bazi['M']
    }
    get D(): GanZhi{
        return this.bazi['D']
    }
    get T(): GanZhi{
        return this.bazi['T']
    }

    get Direction(): number{
        return (this.Gender == 'm' ? 1 : -1) * (this.Y.Zhi.Index % 2 == 0 ? 1 : -1);
    }

    get MingGong(): GanZhi{
        if(this.minggong) return this.minggong;

        var sum = this.M.Zhi.Index + 1 + this.T.Zhi.Index + 1;
        var zhi = sum < 14 ? 14 - sum : 26 - sum;
        zhi = zhi - 1;
        var startGan = this.Y.Gan.QiYueGan;

        var diff = ((zhi - 2) + 12) % 12;
        var gan = (startGan + diff) % 10;

        var ganzhi = new GanZhi([gan, zhi]);
        return ganzhi;
    }

    get TaiYuan(): GanZhi{
        var gan = (this.M.Gan.Index + 1) % 10;
        var zhi = (this.M.Zhi.Index + 3) % 12;
        var gz = new GanZhi([gan, zhi]);
        return gz;
    }

    get WuXings(): Array<Object>{
        if(this.wuxings) return this.wuxings;

        let res = [0, 0, 0, 0, 0];
        res[this.Y.Gan.WuXing.Index] += 1;
        res[this.M.Gan.WuXing.Index] += 1;
        res[this.D.Gan.WuXing.Index] += 1;
        res[this.T.Gan.WuXing.Index] += 1;

        res[this.Y.Zhi.WuXing.Index] += 1;
        res[this.M.Zhi.WuXing.Index] += 1;
        res[this.D.Zhi.WuXing.Index] += 1;
        res[this.T.Zhi.WuXing.Index] += 1;

        this.wuxings = [{ Name: '金', Num: res[0] },
                        { Name: '水', Num: res[1] },
                        { Name: '木', Num: res[2] },
                        { Name: '火', Num: res[3] },
                        { Name: '土', Num: res[4] }];

        return this.wuxings;
    }

    get ShenSha(): Array<ShenSha>{
        return this.shenshas;
    }

    get DaYun(): Array<BaziYun>{
        return this.dayun;
    }

    CalcShenSha(gz: GanZhi): string{
        let res = new Array<string>();
        for(let ss of this.ShenSha){
            if(ss.Is(gz) == true){
                res.push(ss.Name)
            }
        }

        return res.join(', ')
    }

    CalcLiuNian(start: number, end: number): Array<BaziYun>{
        let res = new Array<BaziYun>();

        var gzIndex = start - 1984;
        while (gzIndex < 0) {
            gzIndex += 60;
        }

        gzIndex = (gzIndex % 60);
        let xiaoyun = this.T.Index + (start - this.Birthday.getFullYear() + 1) * this.Direction
        xiaoyun = (xiaoyun + 600) % 60

        for(let idx = start; idx <= end; idx++){
            let gz = new GanZhi(gzIndex)
            gz.Base = this.D;

            let gz2 = new GanZhi(xiaoyun)
            gz2.Base = this.D;

            let lichun = TYLunar.getSolarTerms(idx, 2)[0]
            let obj = new BaziYun(lichun, gz, this.Birthday.getFullYear(), YunType.LiuNian)
            obj.GZ2 = gz2

            res.push(obj);
            gzIndex += 1;
            gzIndex = gzIndex % 60;
            xiaoyun += 1 * this.Direction;
            xiaoyun = (xiaoyun + 60) % 60;
        }

        return res;
    }

    // 初始化神煞
    private initShenSha(){
        this.shenshas = new Array<ShenSha>();

        let y = this.Y.Index;
        let m = this.M.Index;
        let d = this.D.Index;
        let t = this.T.Index;

        this.shenshas.push(new ShenSha('将星', [y]))
        this.shenshas.push(new ShenSha('羊刃', [d]))
        this.shenshas.push(new ShenSha('禄神', [d]))
        this.shenshas.push(new ShenSha('华盖', [d]))
        this.shenshas.push(new ShenSha('文昌', [d]))
        this.shenshas.push(new ShenSha('学堂', [d]))
        this.shenshas.push(new ShenSha('天喜', [m]))
        this.shenshas.push(new ShenSha('天医', [m]))

        this.shenshas.push(new ShenSha('贵人', [d]))
        this.shenshas.push(new ShenSha('驿马', [y, d]))
        this.shenshas.push(new ShenSha('桃花', [y, d]))
        this.shenshas.push(new ShenSha('灾煞', [y, d]))
        this.shenshas.push(new ShenSha('劫煞', [y, d]))
        this.shenshas.push(new ShenSha('旬空', [d]))

        this.shenshas.push(new ShenSha('魁罡', [y, m, d, t]));
        this.shenshas.push(new ShenSha('四废', [y, m, d, t]));
        this.shenshas.push(new ShenSha('孤辰寡宿', [y, m, d, t]));
        this.shenshas.push(new ShenSha('阴差阳错', [d]));
        let tianluodiwang = new ShenSha('天罗地网', [y, m, d, t])
        tianluodiwang.Gender = this.Gender;
        this.shenshas.push(tianluodiwang)
    }

    // 初始化大运
    private initDaYun(){
        this.dayun = new Array<BaziYun>();

        let dayunTime = this.qiDaYun();
        let direction = this.Direction
        let old = dayunTime.getFullYear() - this.Birthday.getFullYear();

        let oneday = 1000 * 60 * 60 * 24;
        let oneyear = oneday * 365.25;
        let tenyear = 10 * oneyear;

        for(let idx = 0; idx < 10; idx++){
            let gzIndex = this.M.Index + (idx + 1) * direction;
            let gz = new GanZhi((gzIndex + 60) % 60)
            gz.Base = this.bazi['D'];

            let date = new Date(dayunTime.getTime() + tenyear * idx)
            let dayun = new BaziYun(date, gz, this.Birthday.getFullYear(), YunType.DaYun)

            this.dayun.push(dayun)
        }
    }

    // 起大运
    private qiDaYun(): Date{
        var direction = (this.Gender == 'm' ? 1 : -1) * (this.Y.Zhi.Index % 2 == 0 ? 1 : -1);
        var jieqi = TYLunar.findNextJieQi(this.Birthday, direction);

        var timespan = Math.abs(jieqi.getTime() - this.Birthday.getTime());
        var hoursOff = (timespan / (1000 * 60)) * 2;
        var dayunTime = new Date(this.Birthday.getTime() + hoursOff * (1000 * 60 * 60));

        return dayunTime;
    }
}

