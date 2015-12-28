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
        // 求算支下标
        let numbers = new Array<number>()
        for(let gz of this.ganzhi){
            if(this.fetchName){
                numbers = numbers.concat(this.normalFetch(gz));
            }else{

            }
        }

        // 将支下标换算成支文字
        let result = new Array<string>();
        for(let num of numbers){
            let zhi = Zhi(num);
            result.push(zhi.Name);
        }

        return result;
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
}