/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component,
    Inject,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    ChangeDetectionStrategy} from 'angular2/core'
import {NgFor, NgIf} from 'angular2/common'
import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery

@Component({
    selector: "sm-select",
    pipes:[TranslatePipe],
    directives: [NgFor, NgIf],
    inputs: ['Value', 'Options'],
    outputs:['valueChanged: Value'],
    templateUrl: 'client/allgemein/directives/smselect.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SemanticSelect{
    Options: tyoption;
    Value: any;
    valueChanged = new EventEmitter();
    Selected: tyitem;
    activeItem: tyitem;

    SimpleOptions: string;
    private inited = false
    private tran: TranslatePipe
    private domModal
    private domSelect

    constructor(private rootElement: ElementRef,
                @Inject(GlobalSetting) public glsetting:GlobalSetting){
        //this.tran = new TranslatePipe()
    }
    
    ngOnDestroy() {
        //console.log("SemanticSelect destroy", this.domModal, this.domSelect)
        if(this.domModal){
            this.domModal.remove()
        }
        
        if(this.domSelect){
            this.domSelect.remove()
        }
    }

    get Grouped(){
        //console.log("get Grouped")
        return !!this.Options.Groups;
    }

    get UseOrigin(){
        //console.log("get UseOrigin")
        if(this.glsetting.IsCordova){
            if(this.Grouped){
                //let isandroid = navigator.userAgent.match(/Android/i)
                //return isandroid;
                return true
            }else{
                let longoption = this.Options.Items && this.Options.Items.length > 5
                return longoption == true;
            }
        }else{
            return false;
        }
    }

    ngOnInit(){
        if(!this.Options){
            this.Options = {Items: []}
            this.Selected = {Value: null, Text: ''}
            this.inited = true
            return
        }

        if(typeof this.Options == 'string'){
            this.buildOptions()
        }

        if(this.UseOrigin && this.Grouped){
            this.convertOptions()
        }

        if(!!this.Value){
            this.Selected = this.getItem(this.Value)
        }else{
            this.Selected = this.Grouped ? this.Options.Groups[0].Items[0] : this.Options.Items[0];
        }

        this.inited = true;
    }

    ngAfterViewInit(){
        this.domSelect = jQuery(this.rootElement.nativeElement).find('.ui.dropdown.semantic')
        this.domSelect.dropdown({
            onChange: (value, text, $choice)=>{
                this.Selected = {Value: value, Text: text}

                this.valueChanged.emit(value)
                //console.log('change selected', value, text, $choice)
            }
        })
    }

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if(this.inited == false)return;

        if(changes['Value']){
            //console.log('ngOnChanges = ', changes['Value'].currentValue);
        }

        if(changes['Options']){
            if(this.UseOrigin && this.Grouped){
                this.convertOptions();
            }
            
            let item = this.getItem(this.Value)
            if(!item && typeof this.Value == 'string'){
                item = this.Grouped ? this.Options.Groups[0].Items[0] : this.Options.Items[0];
            }

            this.Selected = item;
        }
    }

    showModal(){
        this.activeItem = this.Selected
        this.domModal = (this.domModal || jQuery(this.rootElement.nativeElement)
            .find('.ui.small.modal'))
        this.domModal.modal({
            closable  : false,
            onDeny    : () => {
                return true;
            },
            onApprove : () => {
                let value = this.activeItem.Value
                let text = this.activeItem.Text

                this.domModal.modal('hide')
                this.Selected = {Value: value, Text: text}
                this.valueChanged.emit(value)
            }
        }).modal('show')
    }

    private getItem(value: any): tyitem{
        if(!value){
            return null
        }

        if(this.Grouped && !this.UseOrigin){
            for(let gp of this.Options.Groups){
                for(let item of gp['Items']){
                    if(item.Value == value){
                        return item;
                    }
                }
            }
        }else{
            for(let item of this.Options.Items){
                if(item.Value == value){
                    return item;
                }
            }
        }

        return null
    }

    private buildOptions(){
        let text = this.Options.toString()
        if(text == 'jiazi' || text == 'jiazi-full'){
            this.buildJiazi(text == 'jiazi-full')
            return
        }

        let items = text.split(' ')
        let options = {Items: []}
        let value = 0;

        for(let i of items){
            options.Items.push({Value: value, Text: i})
            value = value + 1;
        }

        this.Options = options;
    }

    private convertOptions(){
        this.Options['Items'] = []
        
        for(let gp of this.Options.Groups){
            let header = {Value: null, Text: gp.Name}
            this.Options.Items.push(header)
            
            for(let i of gp.Items){
                this.Options.Items.push(i)
            }
        }

        //this.Options.Groups = []
        //console.log('convert options', this.Options)
    }

    private buildJiazi(full){
        let gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        let zhi = [ '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

        let option = {Groups: []}
        if(full == true){
            let gp = {Name: '空', Items: []}
            option.Groups.push(gp)

            for(let z of zhi){
                gp.Items.push({Value: z, Text: z})
            }
            /*gp.Items.concat(gan.map(g => {
                return {Value: g, Text: g}
            }))*/
        }

        for(let g = 0; g < 10; g++){
            let gp = {Name: gan[g], Items: []}
            option.Groups.push(gp)

            for(let z = 0; z < 12; z++){
                if((g % 2) == (z % 2)){
                    gp.Items.push({Value: gan[g] + zhi[z], Text: gan[g] + zhi[z]})
                }
            }
        }

        this.Options = option
    }
}

export interface tyoption {
    Groups?: Array<{Name: string, Items: Array<tyitem>}>;
    Items?: Array<tyitem>
}

export interface tyitem {
    Value: any;
    Text: string;
}