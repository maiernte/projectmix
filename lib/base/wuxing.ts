class WuXing{
    constructor(public name: String){
    }
}

let wuxings: Array<WuXing> = [];
wuxings.push(new WuXing('金'));
wuxings.push(new WuXing('水'));
wuxings.push(new WuXing('木'));
wuxings.push(new WuXing('火'));
wuxings.push(new WuXing('土'));


export function FetchWuXing(para: any){
    if(typeof para === 'number'){
        if(para >= 0 && para <= 4){
            return wuxings[para];
        }else{
            throw new RangeError('WuXing index out of range: ' + para)
        }
    }else{
        let res = wuxings.filter(w => w.name == para);
        if(res && res.length == 1){
            return res[0];
        }else{
            throw new RangeError('WuXing name out of range: ' + para)
        }
    }
}



