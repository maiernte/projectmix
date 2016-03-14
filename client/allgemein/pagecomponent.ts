/**
 * Created by mai on 16/3/14.
 */

declare var jQuery

export class PageComponent{
    private static winheight = window.innerHeight

    constructor(){

    }

    ngOnDestroy(){
        console.log("PageComponent destroy")
    }

    get WinHeight() {
        //console.log("get winheight", PageComponent.winheight)
        return PageComponent.winheight
    }

    public static OnResize(){
        //console.log("window resize")
        PageComponent.winheight = window.innerHeight
    }

    showMenu(hide){
        //console.log("showMenu", hide)
        if(hide === true){
            jQuery(document).find('.ui.labeled.sidebar').sidebar('hide')
        }else{
            jQuery(document).find('.ui.labeled.sidebar').sidebar('toggle');
        }
    }
}