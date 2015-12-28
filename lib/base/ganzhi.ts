import {FetchWuXing} from './wuxing'
import {WuXing} from "./wuxing";

class tyGan{
    name:string;
    index:number;

    constructor( index: number, name:string){
        this.name = name
        this.index = index;
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
    name:string;
    index:number;

    constructor(index: number, name:string){
        this.index = index;
        this.name = name;
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
}

var zhis = new Array<tyZhi>();
function initZhis(){
    if(zhis.length === 12){
        return;
    }

    zhis.push(new tyZhi(0, '子'));
    zhis.push(new tyZhi(1, '丑'));
    zhis.push(new tyZhi(2, '寅'));
    zhis.push(new tyZhi(3, '卯'));
    zhis.push(new tyZhi(4, '辰'));
    zhis.push(new tyZhi(5, '巳'));
    zhis.push(new tyZhi(6, '午'));
    zhis.push(new tyZhi(7, '未'));
    zhis.push(new tyZhi(8, '申'));
    zhis.push(new tyZhi(9, '酉'));
    zhis.push(new tyZhi(10, '戌'));
    zhis.push(new tyZhi(11, '亥'));
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

    get NaYin(){
        if(this.Gan == null) return '';

        return GanZhi.NaYins[Math.floor(this.Index / 2)];
    }

    private calcIndex(gan:number, zhi:number):number{
        var iTemp = ((zhi - gan + 12) % 12) / 2;
        iTemp = ((6 - iTemp) % 6) * 10;
        return iTemp + gan;
    }
}