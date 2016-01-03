import {GanZhi, Zhi} from './ganzhi'

// 申子辰804 寅午戌2610 巳酉丑591 亥卯未1137
// Fetch: 取干支方式 -> 地支三合
function fetchSanhe(gz: number): number{
    return (gz % 12) % 4;
}

// 直接取干
function fetchGan(gz: number): number{
    return gz % 10;
}

// 三会 亥子丑0 寅卯辰1....
function fetchSanhui(gz: number): number{
    return Math.floor(((gz + 1) % 12) / 3);
}

// 天医 取上个月地支
function fetchTianyi(gz: number): number{
    let zhi = gz % 12;
    return (zhi - 1 + 12) % 12;
}

// 旬空
function fetchXunkong(gz: number){
    // gz 按甲子 乙卯 的原始干支
    let index = 10 - Math.floor(gz / 10) * 2;
    return [index, index + 1];
}

var baseShenShas = new Array<Object>();
function initBaseShenShas(){
    if(baseShenShas.length > 0){
        return;
    }

    baseShenShas.push({Name: '将星', Pattern: [0, 9, 6, 3], Fetch: '三合'})
    baseShenShas.push({Name: '华盖', Pattern: [4, 1, 10, 7], Fetch: '三合'})
    baseShenShas.push({Name: '驿马', Pattern: [2, 11, 8, 5], Fetch: '三合'})
    baseShenShas.push({Name: '谋星', Pattern: [10, 7, 4, 1], Fetch: '三合'})
    baseShenShas.push({Name: '桃花', Pattern: [9, 6, 3, 0], Fetch: '三合'})
    baseShenShas.push({Name: '灾煞', Pattern: [6, 3, 0, 9], Fetch: '三合'})
    baseShenShas.push({Name: '劫煞', Pattern: [5, 2, 11, 8], Fetch: '三合'})

    baseShenShas.push({Name: '禄神', Pattern: [2, 3, 5, 6, 5, 6, 8, 9, 11, 0], Fetch: '干'})
    baseShenShas.push({Name: '羊刃', Pattern: [3, 2, 6, 5, 6, 5, 9, 8, 0, 11], Fetch: '干'})
    baseShenShas.push({Name: '文昌', Pattern: [5, 6, 8, 9, 8, 9, 11, 0, 2, 3], Fetch: '干'})
    baseShenShas.push({Name: '学堂', Pattern: [11, 11, 2, 2, 8, 8, 5, 5, 8, 8], Fetch: '干'})

    baseShenShas.push({Name: '贵人', Pattern: [[1, 7], [8, 0], [11, 9], [11, 9], [1, 7], [8, 0], [2, 6], [2, 6], [3, 5], [3, 5]], Fetch: '贵人'})

    baseShenShas.push({Name: '天喜', Pattern: [7, 10, 1, 4], Fetch: '三会'})
    baseShenShas.push({Name: '天医', Pattern: null, Fetch: '天医'})
    baseShenShas.push({Name: '旬空', Pattern: null, Fetch: '旬空'})
    baseShenShas.push({Name: '魁罡', Pattern: null, Fetch: null})
    baseShenShas.push({Name: '四废', Pattern: null, Fetch: null})
    baseShenShas.push({Name: '孤辰寡宿', Pattern: null, Fetch: null})
    baseShenShas.push({Name: '天罗地网', Pattern: null, Fetch: null})
    baseShenShas.push({Name: '阴差阳错', Pattern: null, Fetch: null})
}

export class ShenSha{
    private pattern: Array<number>;
    private fetchName: string;
    private result: Array<string>;

    Gender: string;

    constructor(private name: string, private ganzhi: Array<number>){
        initBaseShenShas();

        let shenshas = baseShenShas.filter(ss => ss['Name'] == name)
        this.pattern = shenshas[0]['Pattern']
        this.fetchName = shenshas[0]['Fetch']
    }

    get Name(){
        return this.name;
    }

    get Result(): Array<string>{
        if(this.result) return this.result;

        if(this.Name == '魁罡'){
            this.result = this.getKuiGang();
        }else if(this.Name == '四废'){
            let yue = this.ganzhi[1]
            this.result = this.getSiFei(yue);
        }else if(this.Name == '孤辰寡宿'){
            this.result = this.getGuChengGuaShu(this.ganzhi[0])
        }else if(this.Name == '阴差阳错'){
            this.result = this.getYinChaYangCuo();
        }else if(this.Name == '天罗地网'){
            this.result = this.getTianLuoDiWang(this.Gender == 'm')
        }else{
            this.result = this.getNormalResult();
        }

        return this.result;
    }

    Is(gz: GanZhi): boolean{
        if(this.Result.length > 0){
            for(let item of this.result){
                if(item == gz.Zhi.Name){
                    return true;
                }
            }
        }else{
            if(this.Name == '天罗地网'){
                return this.IsTianLuoDiWang(gz.Index);
            }else{
                let index = this.Name == '孤辰寡宿' ? gz.Index % 12 : gz.Index
                for(let p of this.pattern){
                    if(p == index){
                        return true
                    }
                }
            }
        }

        return false;
    }

    private normalFetch(gz: number): Array<number>{
        if(this.fetchName == '三合'){
            return [this.pattern[fetchSanhe(gz)]];
        }else if(this.fetchName == '干'){
            return [this.pattern[fetchGan(gz)]];
        }else if(this.fetchName == '三会'){
            return [this.pattern[fetchSanhui(gz)]];
        }else if(this.fetchName == '天医'){
            return [fetchTianyi(gz)];
        }else if(this.fetchName == '旬空'){
            return fetchXunkong(gz);
        }else if(this.fetchName == '贵人'){
            let res = this.pattern[fetchGan(gz)];
            return [res[0], res[1]];
        }
    }

    private getNormalResult(){
        // 求算支下标
        let numbers = new Array<number>()
        for(let gz of this.ganzhi){
            if(this.fetchName){
                numbers = numbers.concat(this.normalFetch(gz));
            }
        }

        // 将支下标换算成支文字
        let result = new Array<string>();
        for(let num of numbers){
            let zhi = Zhi(num);
            result.push(zhi.Name);
        }

        if(result.length == 2 && result[0] == result[1]){
            return [result[0]]
        }

        return result;
    }

    // 计算魁罡
    private getKuiGang(){
        let tmp = [new GanZhi('庚戌'),
                        new GanZhi('庚辰'),
                        new GanZhi('戊戌'),
                        new GanZhi('壬辰')];

        this.pattern = tmp.map(gz => {return gz.Index})
        for(let gz of this.ganzhi){
            for(let p of this.pattern){
                if(gz == p){
                    return ['√']
                }
            }
        }

        return []
    }

    //  计算四废
    private getSiFei(yue: number){
        let tmp = [];
        switch (yue % 12) {
            case 2:
            case 3:
                tmp = [new GanZhi('庚申'), new GanZhi('辛酉')];
                break;
            case 5:
            case 6:
                tmp = [new GanZhi('壬子'), new GanZhi('癸亥')];
                break;
            case 8:
            case 9:
                tmp = [new GanZhi('甲寅'), new GanZhi('乙卯')];
                break;
            case 0:
            case 11:
                tmp = [new GanZhi('丙午'), new GanZhi('丁巳')];
                break;
        }

        this.pattern = tmp.map(p => {return p.Index})
        // 寅卯月见庚申、辛酉
        // 春庚申，辛酉，夏壬子，癸亥，秋甲寅，乙卯，冬丙午，丁巳
        for(let gz of this.ganzhi){
            for(let p of this.pattern){
                if(gz == p){
                    return ['√']
                }
            }
        }

        return []
    }

    // 计算孤辰寡宿
    private getGuChengGuaShu(year: number){
        // 亥子丑年生人，柱中见寅为孤见戌为寡
        // 寅卯辰年生人，柱中见巳为孤见丑为寡
        // 巳午未年生人，柱中见申为孤见辰为寡
        // 申酉戌年生人，柱中见亥为孤见未为寡
        let flag = Math.floor(((year + 1) % 12) / 3)
        switch (flag) {
            case 0:
                this.pattern = [2, 10];
                break;
            case 1:
                this.pattern = [5, 1];
                break;
            case 2:
                this.pattern = [8, 4];
                break;
            case 3:
                this.pattern = [11, 7];
                break;
        }

        for(let gz of this.ganzhi){
            for(let p of this.pattern){
                if(gz % 12 == p){
                    return ['√']
                }
            }
        }

        return []
    }

    // 计算阴差阳错
    private  getYinChaYangCuo(){
        let tmp = ["丙子", "丙午", "丁丑", "丁未", "辛卯", "辛酉", "壬辰", "壬戌", "癸巳", "癸亥", "戊寅", "戊申"];
        this.pattern = tmp.map(n => {
            let gz = new GanZhi(n);
            return gz.Index
        })

        for(let gz of this.ganzhi){
            for(let p of this.pattern){
                if(gz == p){
                    return ['√']
                }
            }
        }

        return []
    }

    //  计算天罗地网
    private getTianLuoDiWang(male: boolean){
        // 男命柱中辰、巳并见，谓之天罗；女命柱中戌、亥并见，谓之地网

        let res = 0;
        this.pattern = male ? [4, 5] : [10, 11]

        for(let gz of this.ganzhi){
            let z = gz % 12;
            for(let idx = 0; idx < 2; idx++){
                if(this.pattern[idx] == z){
                    res = res |  (1 << idx)
                }
            }
        }

        return res === 3 ? ['√'] : []
    }

    private IsTianLuoDiWang(para: number): boolean{
        para = para % 12
        let res = 0;
        for(let gz of this.ganzhi){
            let z = gz % 12;
            for(let idx = 0; idx < 2; idx++){
                if(this.pattern[idx] == z){
                    res = res |  (1 << idx)
                }

                if(this.pattern[idx] == para){
                    res = res |  (1 << idx)
                }
            }
        }

        return res === 3;
    }
}