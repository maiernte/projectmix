import {FetchWuXing} from './wuxing'

class tyGan{
    name:string;
    index:number;

    constructor( index: number, name:string){
        this.name = name
        this.index = index;
    }
    
    get Name(){
        return this.name;
    }

    get Index(){
        return this.index;
    }
    
    get WuXing(){
        return FetchWuXing(0).name;
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

    get Name(){
        return this.name;
    }

    get Index(){
        return this.index;
    }

    get WuXing(){
        return FetchWuXing(0).name;
    }
}

var zhis = new Array<tyZhi>();
function initZhis(){
    if(zhis.length === 12){
        return;
    }

    zhis.push(new tyGan(0, '子'));
    zhis.push(new tyGan(1, '丑'));
    zhis.push(new tyGan(2, '寅'));
    zhis.push(new tyGan(3, '卯'));
    zhis.push(new tyGan(4, '辰'));
    zhis.push(new tyGan(5, '巳'));
    zhis.push(new tyGan(6, '午'));
    zhis.push(new tyGan(7, '未'));
    zhis.push(new tyGan(8, '申'));
    zhis.push(new tyGan(9, '酉'));
    zhis.push(new tyGan(10, '戌'));
    zhis.push(new tyGan(11, '亥'));
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

export class GanZhi{
    Gan:tyGan;
    Zhi:tyZhi;

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

    get Name(){
        return this.Gan ? this.Gan.Name + this.Zhi.Name : this.Zhi.Name;
    }

    get Index(){
        return this.Gan ? this.calcIndex(this.Gan.Index, this.Zhi.Index) : this.Zhi.Index;
    }

    private calcIndex(gan:number, zhi:number):number{
        var iTemp = ((zhi - gan + 12) % 12) / 2;
        iTemp = ((6 - iTemp) % 6) * 10;
        return iTemp + gan;
    }
}