/// <reference path="../../../typings/book.d.ts" />
import {LocalRecords, Books} from 'collections/books'

export class RecordHelper{
    Checked: boolean
    constructor(private rd: YiRecord){
        this.Checked = false;
    }

    get Id(){
        return this.rd._id;
    }

    get IsGua(){
        if(this.rd.gua){
            return true;
        }else{
            return false;
        }
    }

    get Created(){
        let date = new Date(this.rd.created)
        return this.toChina(date)
    }

    get Question(){
        return this.rd.question;
    }

    get Feed(){
        let txt = this.rd.feed ? this.rd.feed.trim() : '';
        return txt != '';
    }

    get Detail(){
        try{
            if(this.rd.gua){
                let g = this.rd.gua;
                let name = g.ben == g.bian ? g.ben : g.ben + '之' + g.bian
                return g.yueri[0] + '月' + g.yueri[1] + '日 / ' + name
            }else if(this.rd.bazi){
                let items = this.rd.bazi.bazi.split(' ')
                return items.join(' / ')
            }
        }catch(err){
            return ''
        }
    }

    get RouteParams(){
        return this.IsGua ? this.guaParams() : this.baziParams();
    }

    private toChina(d: Date): string{
        let res = d.getFullYear() + "年"
            + (d.getMonth() + 1) + "月"
            + d.getDate() + "日"
            + d.getHours() + "时"
            + d.getMinutes() + "分";
        return res;
    }

    private guaParams(): Object{
        let gua = this.rd.gua;

        let params = {
            flag: 'gua',
            question: this.Question,
            type: gua.type ? gua.type : 0,
            time: gua.time ? gua.time : gua.yueri,
            gua: [gua.ben, gua.bian]
        }

        return params;
    }

    private baziParams(): Object{
        let bz = this.rd.bazi;
        let pl = bz.place ? bz.place.split(' ') : []

        let params = {
            flag: 'bazi',
            name: this.Question,
            birthday: bz.time,
            gender: bz.gender,
            solar: bz.solartime ? true : false,
            land: pl.length > 0 ? pl[0] : '未知',
            city: pl.length > 1 ? pl[1] : '',
            code: bz.solartime
        }

        return params;
    }
}