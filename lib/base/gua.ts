
import {TYDate, TYLunar} from "../lunar/tylunar";
import {GanZhi} from "./ganzhi";
import {ShenSha} from "./shensha";
import {FetchWuXing} from './wuxing'
import {WuXing} from "./wuxing";

function int2str (num: number, length: number, base?: number): string {
    var radix = base == null || base == undefined ? 2 : base;
    var res = num.toString(radix);
    if (res.length >= length) {
        return res;
    } else {
        while (res.length < length) res = "0" + res;
        return res;
    }
};

class tyGua8{
    index:number;
    name:string;
    namev:string;
    value:string;
    wuxing:number;
    zhis:Array<number>;
    nagan:Array<number>;

    constructor(index:number,
                name:string,
                namev:string,
                wuxing:number,
                zhis:Array<number>,
                nagan:Array<number>){
        this.index = index;
        this.name = name;
        this.namev = namev;
        this.wuxing = wuxing;
        this.zhis = zhis;
        this.nagan = nagan;

        this.value = int2str(index, 3, 2);
    }

    get Index(){
        return this.index;
    }
    get Name(){
        return this.name;
    }
    get NameV(){
        return this.namev;
    }
    get Value(){
        return this.value;
    }
    get WuXing(){
        return this.wuxing;
    }
    get Zhis(){
        return this.zhis;
    }
    get NaGan(){
        return this.nagan;
    }
}

let gua8Collection = new Array<tyGua8>();
function initGua8Collection(){
    if(gua8Collection.length === 8)return;
    gua8Collection.push(new tyGua8(0, "坤", "地", 4, [7, 5, 3, 1, 11, 9], [1, 9]));
    gua8Collection.push(new tyGua8(1, "震", "雷", 2, [0, 2, 4, 6, 8, 10], [6, 6]));
    gua8Collection.push(new tyGua8(2, "坎", "水", 1, [2, 4, 6, 8, 10, 0], [4, 4]));
    gua8Collection.push(new tyGua8(3, "兑", "泽", 0, [5, 3, 1, 11, 9, 7], [3, 3]));
    gua8Collection.push(new tyGua8(4, "艮", "山", 4, [4, 6, 8, 10, 0, 2], [2, 2]));
    gua8Collection.push(new tyGua8(5, "离", "火", 3, [3, 1, 11, 9, 7, 5], [5, 5]));
    gua8Collection.push(new tyGua8(6, "巽", "风", 2, [1, 11, 9, 7, 5, 3], [7, 7]));
    gua8Collection.push(new tyGua8(7, "乾", "天", 0, [0, 2, 4, 6, 8, 10], [0, 8]));
}

class tyGua64{
    static GuaChiJie = ["乾为天：强健、启始", "天风姤：疏漏、相遇", "天山遁：逃遁、隐退", "山地剥：剥落、显露", "火地晋：晋升、前进", "火天大有：收获、丰富", "风地观：考察、观望", "坎为水：坎凹、陷入", "巽为风：跟风、上行下效", "水泽节：节度、制约", "水雷屯：屯积、初始", "水火既济：顺其自然、顺畅", "泽火革：改变、革新", "雷火丰：丰富、张扬", "地水师：单一、率众", "艮为山：堆积、受阻", "山火贲：粉饰、礼仪", "地火明夷：前有险、动则伤", "山泽损：损失、受损", "火泽睽：反目、背驰", "雷山小过：过火，可补救过失", "天泽履：履行、持礼", "风山渐：渐近、缓近", "风泽中孚：坚持、诚信", "震为雷：突发、走动", "雷水解：解决、释放", "火风鼎：独当一面、极致", "地风升：进展、提升", "水风井：规划、局束", "雷泽归妹：如愿、回报", "泽雷随：跟随、归顺", "天地否：受阻、闭塞", "泽风大过：太过分、已遭损失", "风雷益：有益、受益", "山雷颐：颐表、培养", "风天小畜：浅积累，欠充分", "山风蛊：发动、谋事", "离为火：外露、绚丽", "山水蒙：启蒙、不清晰", "火山旅：旅行、客居", "风水涣：涣散、发散", "风火家人：亲人、归家、回收", "天水讼：谈判、诉讼", "坤为地：包含、承载", "天雷无妄：无妄为、无过失", "地雷复：反复、重复", "雷风恒：恒久、不变", "火雷噬嗑：沟通，有目的交流", "地泽临：临近、降临", "地天泰：通泰、通畅", "泽天夬：缺陷、不完整", "水天需：等待、筹备", "水地比：亲密、平等", "火水未济：阻碍、未达目的", "兑为泽：谈话、愉悦", "泽水困：受困、被围", "天火同人：随大流、与众同等", "泽地萃：突出、聚集 ", "泽山咸：参与、遍布", "雷天大壮：众所周知、正当其用", "水山蹇：行险、难关", "雷地豫：欢愉、犹豫", "地山谦：谦逊、深藏不露", "山天大畜：积畜已久、准备充分"];
    static GuaNames = ["地",  "复",  "师",  "临",   "谦",   "明夷", "升",  "泰",
                        "豫",  "雷",  "解",  "归妹", "小过", "丰",   "恒",  "大壮",
                        "比",  "屯",  "水",  "节",   "蹇",   "既济", "井",  "需",
                        "萃",  "随",  "困",  "泽",   "咸",   "革",   "大过","夬",
                        "剥",  "颐",  "蒙",  "损",   "山",   "贲",   "蛊",  "大畜",
                        "晋",  "噬嗑","未济","睽",   "旅",   "火",   "鼎",  "大有",
                        "观",  "益",  "涣",  "中孚", "渐",   "家人", "风",  "小畜",
                        "否", "无妄", "讼", "履", "遁", "同人", "姤", "天"];

    shang:tyGua8;
    xia:tyGua8;

    static CalcGuaGong(shang:number, xia:number){
        var iShiWei = -1;
        var iGuaGong = -1;
        //var tmp = parseInt(shang.toString(), 2) ^ parseInt(xia.toString(), 2);
        var tmp = shang ^ xia;
        switch (tmp) {
            case 7:
                iShiWei = 2;
                iGuaGong = shang;
                break;
            case 6:
                iShiWei = 3;
                iGuaGong = xia ^ 7;
                break;
            case 5:
                iShiWei = 3;
                iGuaGong = xia ^ 7;
                break;
            case 4:
                iShiWei = 4;
                iGuaGong = xia ^ 7;
                break;
            case 3:
                iShiWei = 1;
                iGuaGong = shang;
                break;
            case 2:
                iShiWei = 2;
                iGuaGong = xia;
                break;
            case 1:
                iShiWei = 0;
                iGuaGong = shang;
                break;
            case 0:
                iShiWei = 5;
                iGuaGong = shang;
                break;
        };

        iGuaGong = iGuaGong % 8;
        return { GuaGong: iGuaGong, ShiWei: iShiWei };
    }

    constructor(shang: number, xia:number){
        this.shang = gua8Collection[shang];
        this.xia = gua8Collection[xia];
    }

    get Shang(){
        return this.shang;
    }
    get Xia(){
        return this.xia;
    }
    get Index(){
        return this.Shang.Index * 8 + this.Xia.Index;
    }
    get NameS(){
        return tyGua64.GuaNames[this.Index];
    }
    get Name(){
        if(this.Shang === this.Xia){
            return this.Shang.Name + '为'  + this.Shang.NameV;
        }else{
            return this.Shang.NameV + this.Xia.NameV + this.NameS;
        }
    }
    get Mean(){
        let res = tyGua64.GuaChiJie.filter(jie => jie.indexOf(this.Name) >= 0);
        return res[0];
    }
    get GuaGong(): string{
        return gua8Collection[this.GuaGongI].Name + '宫';
    }

    get GuaGongI():number{
        let res = tyGua64.CalcGuaGong(this.Shang.Index, this.Xia.Index)
        return res.GuaGong;
    }

    get Shiyao(){
        let res = tyGua64.CalcGuaGong(this.Shang.Index, this.Xia.Index);
        return res.ShiWei;
    }

    get Property(){
        // 下卦的起支
        var xiaQi = this.Xia.Zhis[0];
        // 上卦的起支
        var shangQi = this.Shang.Zhis[3];

        var baseInfo = '';
        if (xiaQi + shangQi == 13 || xiaQi + shangQi == 1) {
            baseInfo += "六合";
        } else if (Math.abs(xiaQi - shangQi) == 6) {
            baseInfo += "六冲";
        }

        var tmp = parseInt(this.Shang.Value, 2) ^ parseInt(this.Xia.Value, 2);
        if (tmp == 5) {
            baseInfo += "游魂";
        } else if (tmp == 2) {
            baseInfo += "归魂";
        }

        return baseInfo;
    }

    get GanZhis(){
        let res = new Array<GanZhi>();
        let gan = this.Xia.NaGan[0];
        for(let zhi of this.Xia.Zhis.slice(0, 3)){
            let gz = new GanZhi([gan, zhi]);
            res.push(gz)
        }

        gan = this.Shang.NaGan[1];
        for(let zhi of this.Shang.Zhis.slice(3, 6)){
            let gz = new GanZhi([gan, zhi]);
            res.push(gz)
        }

        return res;
    }

    get WuXing(): WuXing{
        let gua8 = gua8Collection[this.GuaGongI];
        return FetchWuXing(gua8.wuxing);
    }

    ZhiIndex(idx:number){
        if(idx >= 0 && idx < 3){
            return this.Xia.Zhis[idx];
        }else if(idx >= 3 && idx < 6){
            return this.Shang.Zhis[idx];
        }

        return -1;
    }
}

let gua64Collection = new Array<tyGua64>();
function initGua64Collection(){
    if(gua64Collection.length === 64)return;

    initGua8Collection();
    for (var shang = 0; shang < 8; shang++) {
        for (var xia = 0; xia < 8; xia++) {
            gua64Collection.push(new tyGua64(shang, xia));
        };
    };
}

let tyShen6 = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']

export function Gua64(index: number){
    initGua64Collection();
    return gua64Collection[index];
}

export class Gua{
    private guatime: Array<GanZhi>
    private shenshas: Array<ShenSha>
    private bengua: tyGua64;
    private biangua: tyGua64;
    private fugua: tyGua64;
    private shen6: Array<string>;

    constructor(time: Date, yue: string, ri: string, ben: string, bian: string){
        initGua64Collection();

        if(time){
            let date = new TYDate(time);
            this.guatime = [new GanZhi(date.GZmonth), new GanZhi(date.GZdate)]
        }else{
            let gzYue = new GanZhi(yue)
            let gzRi = new GanZhi(ri)
            this.guatime = [gzYue, gzRi]
        }

        this.bengua = gua64Collection.filter(g => g.Name == ben)[0];
        this.biangua = gua64Collection.filter(g => g.Name == bian)[0];

        let tmp = this.bengua.GuaGongI;
        this.fugua = Gua64(tmp * 8 + tmp)

        this.initShenSha();
        this.initShen6();
    }

    get Yue(): GanZhi{
        return this.guatime[0];
    }

    get Ri(): GanZhi{
        return this.guatime[1];
    }

    get ShenShas(): Array<ShenSha>{
        return this.shenshas;
    }

    get Ben(){
        return this.bengua;
    }

    get Bian(){
        return this.biangua;
    }

    get FuGua(){
        return this.fugua;
    }

    get Shen6(){
        return this.shen6;
    }

    get Benyaos(){
        let v = this.Ben.Shang.Value + this.Ben.Xia.Value
        let temp = v.split('');
        let benyaos = [];
        for(let i = 5; i >= 0; i--){
            benyaos.push(parseInt(temp[i]));
        }

        let bianyaos = this.Bianyaos
        for(let i = 5; i >= 0; i--){
            if(benyaos[i] != bianyaos[i]){
                benyaos[i] += 2;
            }
        }

        return benyaos;
    }

    get Bianyaos(){
        let v = this.Bian.Shang.Value + this.Bian.Xia.Value;
        let items = v.split('');
        let res = [];
        for(let i = 5; i >= 0; i--){
            res.push(parseInt(items[i]));
        }

        return res;
    }

    private initShenSha(){
        this.shenshas = [];
        this.shenshas.push(new ShenSha('将星', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('华盖', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('驿马', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('谋星', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('桃花', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('灾煞', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('劫煞', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('禄神', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('羊刃', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('文昌', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('天喜', [this.guatime[0].Index]))
        this.shenshas.push(new ShenSha('天医', [this.guatime[0].Index]))
        this.shenshas.push(new ShenSha('贵人', [this.guatime[1].Index]))
        this.shenshas.push(new ShenSha('旬空', [this.guatime[1].Index]))
    }

    private initShen6(){
        this.shen6 = [];

        var start = this.guatime[1].Gan.Index;
        start = start >= 5 ? Math.floor((start + 2) / 2) : Math.floor(start / 2);
        for (var idx = 0; idx < 6; idx++) {
            var index = (start + idx) % 6;
            this.shen6.push(tyShen6[index].substring(0, 2));
        }
    }
}
