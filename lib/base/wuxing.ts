

export class WuXing{
    constructor(private name: string, private index: number){
    }

    get Name(): string{
        return this.name
    }

    get Index(): number{
        return this.index;
    }

    get Ke(): number{
        return (this.index + 2) % 5;
    }

    get Sheng(): number{
        return (this.index + 1) % 5;
    }

    Ref(wx: WuXing){
        if(this.Ke == wx.Index){
            return ['官鬼', '官']
        }else if(this.Sheng == wx.Index){
            return ['父母', '父']
        }else if(wx.Ke == this.index){
            return ['妻财', '财']
        }else if(wx.Sheng == this.index){
            return ['子孙', '孙']
        }else{
            return ['兄弟', '兄']
        }
    }
}

let wuxings: Array<WuXing> = [];
wuxings.push(new WuXing('金', 0));
wuxings.push(new WuXing('水', 1));
wuxings.push(new WuXing('木', 2));
wuxings.push(new WuXing('火', 3));
wuxings.push(new WuXing('土', 4));

export function FetchWuXing(para: any){
    if(typeof para === 'number'){
        if(para >= 0 && para <= 4){
            return wuxings[para];
        }else{
            throw new RangeError('WuXing index out of range: ' + para)
        }
    }else{
        let res = wuxings.filter(w => w.Name == para);
        if(res && res.length == 1){
            return res[0];
        }else{
            throw new RangeError('WuXing name out of range: ' + para)
        }
    }
}



