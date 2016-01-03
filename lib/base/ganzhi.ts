import {FetchWuXing} from './wuxing'
import {WuXing} from "./wuxing";

class tyGan{
    private static changshengIndexes = [11, 2, 8, 5, 8];

    constructor(private index: number,
                private name:string){
    }
    
    get Name(): string{
        return this.name;
    }

    get Index(): number{
        return this.index;
    }
    
    get WuXing(): WuXing{
        let idx = Math.floor(this.Index / 2)
        idx = (idx + 2) % 5
        return FetchWuXing(idx);
    }

    get ChangSheng(): number{
        if(this.Index % 2 === 0){
            let idx = Math.floor(this.Index / 2)
            return tyGan.changshengIndexes[idx];
        }else {
            let idx = Math.floor((this.Index - 1) / 2)
            return (tyGan.changshengIndexes[idx] + 7) % 12
        }
    }

    get QiYueGan(): number {
        var start = (this.Index % 5) * 2;
        start = (start + 2) % 10;
        return start;
    };

    get QiShiGan(): number {
        var start = (this.Index % 5) * 2;
        return start;
    };

    Ref(gan: tyGan): Array<string>{
        let real = (this.Index % 2) == (gan.Index % 2)
        let wx = this.WuXing
        let base = gan.WuXing
        if(wx.Ke == base.Index){
            return real ? ['七杀', '杀'] : ['正官', '官']
        }else if(wx.Sheng == base.Index){
            return real ? ['枭印', '枭'] : ['正印', '印']
        }else if(base.Ke == wx.Index){
            return real ? ['正财', '财'] : ['偏财', '才']
        }else if(base.Sheng == wx.Index){
            return real ? ['食神', '食'] : ['伤官', '伤']
        }else{
            return real ? ['比肩', '比'] : ['劫财', '劫']
        }
    }



}

var gans = new Array<tyGan>();
function initGans(){
    if(gans.length === 10){
        return;
    }

    gans.push(new tyGan(0, '甲'));
    gans.push(new tyGan(1, '乙'));
    gans.push(new tyGan(2, '丙'));
    gans.push(new tyGan(3, '丁'));
    gans.push(new tyGan(4, '戊'));
    gans.push(new tyGan(5, '己'));
    gans.push(new tyGan(6, '庚'));
    gans.push(new tyGan(7, '辛'));
    gans.push(new tyGan(8, '壬'));
    gans.push(new tyGan(9, '癸'));
}

class tyZhi{
    private  static changShengDefs = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];

    constructor(private index: number,
                private name:string,
                private gans: Array<number>){
    }

    get Name(): string{
        return this.name;
    }

    get Index(): number{
        return this.index;
    }

    get WuXing(): WuXing{
        switch(this.Index){
            case 2:
            case 3:
                return FetchWuXing('木');
            case 5:
            case 6:
                return FetchWuXing('火');
            case 8:
            case 9:
                return FetchWuXing('金');
            case 0:
            case 11:
                return FetchWuXing('水');
            default:
                return FetchWuXing('土');
        }
    }

    get CGan(){
        let res = new Array<tyGan>();
        for(let i of this.gans){
            res.push(Gan(i))
        }

        return res;
    }

    ChangSheng(gan: tyGan): string{
        var index = gan.ChangSheng;
        var direction = (gan.Index % 2 === 0) ? 1 : -1;
        for (var i = 0; i < 12; i++) {
            var izhi = (index + i * direction + 12) % 12;
            if (izhi === this.Index) {
                return tyZhi.changShengDefs[i];
            }
        }

        return 'Error';
    }

    Ref(gan: tyGan): Array<string>{
        let real = (this.Index % 2) == (gan.Index % 2)
        let wx = this.WuXing
        let base = gan.WuXing
        if(wx.Ke == base.Index){
            return real ? ['七杀', '杀'] : ['正官', '官']
        }else if(wx.Sheng == base.Index){
            return real ? ['正印', '印'] : ['枭印', '枭']
        }else if(base.Ke == wx.Index){
            return real ? ['正财', '财'] : ['偏财', '才']
        }else if(base.Sheng == wx.Index){
            return real ? ['伤官', '伤'] : ['食神', '食']
        }else{
            return real ? ['比肩', '比'] : ['劫财', '劫']
        }
    }
}

var zhis = new Array<tyZhi>();
function initZhis(){
    if(zhis.length === 12){
        return;
    }

    zhis.push(new tyZhi(0, '子', [9]));
    zhis.push(new tyZhi(1, '丑', [9, 7, 5]));
    zhis.push(new tyZhi(2, '寅', [0, 2, 4]));
    zhis.push(new tyZhi(3, '卯', [1]));
    zhis.push(new tyZhi(4, '辰', [1, 4, 9]));
    zhis.push(new tyZhi(5, '巳', [2, 4, 6]));
    zhis.push(new tyZhi(6, '午', [3, 5]));
    zhis.push(new tyZhi(7, '未', [1, 3, 5]));
    zhis.push(new tyZhi(8, '申', [4, 6, 8]));
    zhis.push(new tyZhi(9, '酉', [7]));
    zhis.push(new tyZhi(10, '戌',[3, 4, 7]));
    zhis.push(new tyZhi(11, '亥',[0, 8]));
}

export function Gan(para): tyGan{
    initGans();
    if(typeof  para == 'string'){
        let res = gans.filter(g => g.Name == para);
        if(res.length === 1){
            return res[0];
        }
    }else if(typeof para == 'number'){
        if(para >= 0 && para <= 9){
            return gans[para]
        }
    }

    throw new Error('Parameter Error of Gan: ' + para  + ' is not valiad');
}

export function GanNames():Array<string>{
    initGans();
    return gans.map(g => g.Name);
}

export function Zhi(para): tyZhi{
    initZhis();
    if(typeof  para == 'string'){
        if(para == '戍') para = '戌'

        let res = zhis.filter(z => z.Name == para);
        if(res.length === 1){
            return res[0];
        }
    }else if(typeof para == 'number'){
        if(para >= 0 && para <= 11){
            return zhis[para]
        }
    }

    throw new Error('Parameter Error of Gan: ' + para  + ' is not valiad');
}

export function ZhiNames(){
    initZhis();
    return zhis.map(z => z.Name);
}

export class GanZhi{
    Gan:tyGan;
    Zhi:tyZhi;
    Base: GanZhi;
    ShenSha: string;

    public static NaYins = ["海中金", "炉中火", "大林木", "路旁土", "剑峰金",
        "山头火", "涧下水", "城墙土", "白蜡金", "杨柳木",
        "泉中水", "屋上土", "霹雳火", "松柏木", "长流水",
        "沙中金", "山下火", "平地木", "壁上土", "金箔金",
        "佛灯火", "天河水", "大驿土", "钗钏金", "桑松木",
        "大溪水", "沙中土", "天上火", "石榴木", "大海水"];

    constructor(input:any){
        if(Array.isArray(input) && input.length == 2){
            this.Gan = Gan(input[0]);
            this.Zhi = Zhi(input[1]);
        }else if(typeof input == 'string'){
            this.Gan = input.length == 2 ? Gan(input.substring(0,1)) : null;
            this.Zhi = input.length == 2 ? Zhi(input.substring(1, 2)) : Zhi(input.substring(0, 1))
        }else if(typeof input == 'number' && input >= 0 && input <= 59){
            let gan = input % 10;
            let zhi = input % 12;
            this.Gan = Gan(gan);
            this.Zhi = Zhi(zhi);
        }

        if(this.Zhi == null || this.Zhi === undefined){
            throw new Error('GanZhi Error: parameter ' + input + ' is not valid.')
        }
    }

    static get GanZhiNames(){
        let gans = GanNames();
        let zhis = ZhiNames();

        var res = new Array<string>();
        for(let g = 0; g < gans.length; g++){
            for(let z = 0; z < zhis.length; z++){
                if((g % 2) == (z % 2)){
                    res.push(gans[g] + zhis[z])
                }
            }
        }

        return res;
    }

    get Name(): string{
        return this.Gan ? this.Gan.Name + this.Zhi.Name : this.Zhi.Name;
    }

    get Index(): number{
        return this.Gan ? this.calcIndex(this.Gan.Index, this.Zhi.Index) : this.Zhi.Index;
    }

    get NaYin(): string{
        if(this.Gan == null) return '';

        return GanZhi.NaYins[Math.floor(this.Index / 2)];
    }

    get Shen10Gan(): Array<string>{
        if(!this.Base) throw new Error('BaseGan is not defined.')

        if(this === this.Base){
            return ['日主', '日']
        }

        return this.Gan.Ref(this.Base.Gan);
    }

    get Shen10Zhi(): Array<string>{
        if(!this.Base) throw new Error('BaseGan is not defined.')

        return this.Zhi.Ref(this.Base.Gan)
    }

    get ChangSheng(){
        if(this.Base){
            return this.Zhi.ChangSheng(this.Base.Gan);
        }else{
            return '';
        }
    }

    private calcIndex(gan:number, zhi:number):number{
        var iTemp = ((zhi - gan + 12) % 12) / 2;
        iTemp = ((6 - iTemp) % 6) * 10;
        return iTemp + gan;
    }
}