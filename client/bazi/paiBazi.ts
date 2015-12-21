/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component} from 'angular2/angular2'

declare var jQuery:any;
declare function moment();

@Component({
    selector: 'paibazi',
    template: `<p>PaiBazi</p>`
})

export class PaiBazi{
    constructor(){
        
    }
    
    showMenu(hide){
        //jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }
    
    onInit(){
        let hideMenu = true;
        this.showMenu(hideMenu);
    }
}