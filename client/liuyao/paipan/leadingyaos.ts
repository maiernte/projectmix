/// <reference path="../../../typings/angular2-meteor.d.ts" />
import {Component, Inject, EventEmitter, Output, ContentChild} from 'angular2/core'

import {TranslatePipe} from '../../allgemein/translatePipe'
import {GlobalSetting} from  '../../globalsetting'

import {PailiuyaoCoins} from  './coins'
import {Gua64} from "../../../lib/base/gua"

declare  var jQuery: any;
declare var Promise: any;

@Component({
    selector: 'pailiuyao-leadingyao',
    pipes: [TranslatePipe],
    templateUrl: 'client/liuyao/paipan/leadingyaos.html',
    directives: []
})

export class LeadingYao{
    @Output() onfinished = new EventEmitter();
    @Output() oncancel = new EventEmitter();

    @ContentChild(PailiuyaoCoins) coins: PailiuyaoCoins;

    yao:number = 0;
    yao6: Array<string>;
    yaoIndex: number = 0;

    private buttonText = ['', '第二次', '第三次', '第四次', '第五次', '第六次', '下一步']

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting) {
        this.glsetting = glsetting;
    }
    
    get Result(){
        let yaos = [];
        for(let img of this.yao6){
            switch (img){
                case 'shaoyin.svg':
                    yaos.push(0) ;
                    break;
                case 'shaoyan.svg':
                    yaos.push(1) ;
                    break;
                case 'laoyin.svg':
                    yaos.push(2) ;
                    break;
                case 'laoyan.svg':
                    yaos.push(3) ;
                    break;
                default:
                    yaos.push(0) ;
                    break;
            }
        }

        return this.convertYaoToName(yaos);
    }

    get ButtonText(){
        return this.buttonText[this.yaoIndex];
    }

    ngOnInit(){
        this.yao6 = [];
        this.yao6.push('empty.svg')
        this.yao6.push('empty.svg')
        this.yao6.push('empty.svg')
        this.yao6.push('empty.svg')
        this.yao6.push('empty.svg')
        this.yao6.push('empty.svg')
    }

    NextStep(){
        console.log("step 4 finished")
        this.onfinished.next('step 4');
    }

    GoBack(){
        this.oncancel.next('step 4')
    }

    Reinit(cointype:number, yao:number){
        this.coins.cointype = cointype;
        this.coins.yao = yao;
        this.yao = yao;

        this.yaoIndex = 1;

        this.yao6[0] = this.getYaoImg(yao);
        this.yao6[1] = this.getYaoImg(4);
        this.yao6[2] = this.getYaoImg(4);
        this.yao6[3] = this.getYaoImg(4);
        this.yao6[4] = this.getYaoImg(4);
        this.yao6[5] = this.getYaoImg(4);
    }

    changYao(num: number){
        this.yao = num;
        this.coins.yao = num;
    }

    NextYao(){
        if(this.yaoIndex === 6){
            this.onfinished.next('step 4');
            return;
        }

        let viewID = 'step4-yao-' + this.yaoIndex;
        this.showAnimate(viewID, 0)
        this.yao6[this.yaoIndex] = this.getYaoImg(this.yao);
        this.yaoIndex = this.yaoIndex + 1;
        this.showAnimate(viewID, 1000)
    }

    private showAnimate(id: string, duration: number): any{
        jQuery('#' + id).transition('fly down', duration);
    }

    private getYaoImg(num: number){
        switch (num){
            case 0:
                return 'shaoyin.svg';
            case 1:
                return 'shaoyan.svg';
            case 2:
                return 'laoyin.svg';
            case 3:
                return 'laoyan.svg';
            default:
                return 'empty.svg';
        }
    }

    private convertYaoToName(yaos: Array<number>){
        let benText = ''
        let bianText = ''
        for(let idx = 5; idx >= 0; idx--){
            benText += (yaos[idx] % 2);
            bianText += yaos[idx] > 1 ? ((yaos[idx] + 1) % 2) : (yaos[idx] % 2)
        }

        let beni = parseInt(benText, 2)
        let biani = parseInt(bianText, 2)

        let bengua = Gua64(beni);
        let biangua = Gua64(biani);

        return [bengua.Name, biangua.Name]
    }
}