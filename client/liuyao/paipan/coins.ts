/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Input} from 'angular2/core'
import {FORM_DIRECTIVES} from 'angular2/common'

@Component({
    selector: 'pailiuyao-coins',
    templateUrl: 'client/liuyao/paipan/coins.html'
})

export class PailiuyaoCoins{
    @Input() cointype: number; // 0 铜钱 1 硬币
    @Input() yao: number; // 0 少阴 1 少阳 2 老阴 3 老阳

    private static Imgs = [['QianYin.png', 'QianYan.png'], ['WumaoYin.png', 'WumaoYan.png']]

    constructor(){

    }

    get Coin1(){
        //console.log('get coin1', this.Yao, this.cointype)

        switch(this.yao){
            case 0:
                return PailiuyaoCoins.Imgs[this.cointype][0];
            case 1:
                return PailiuyaoCoins.Imgs[this.cointype][1];
            case 2:
                return PailiuyaoCoins.Imgs[this.cointype][0];
            case 3:
                return PailiuyaoCoins.Imgs[this.cointype][1];
        }

        return '';
    }
    get Coin2(){
        switch(this.yao){
            case 0:
                return PailiuyaoCoins.Imgs[this.cointype][1];;
            case 1:
                return PailiuyaoCoins.Imgs[this.cointype][0];;
            case 2:
                return PailiuyaoCoins.Imgs[this.cointype][0];;
            case 3:
                return PailiuyaoCoins.Imgs[this.cointype][1];;
        }

        return '';
    }
    get Coin3(){
        return this.Coin2;
    }

    ngOnInit(){
    }
}