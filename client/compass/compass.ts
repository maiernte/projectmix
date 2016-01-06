/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component,
        Inject,
        NgFor,
        NgSwitch,
        NgSwitchWhen,
        NgSwitchDefault,
        ElementRef,
        AfterViewInit} from 'angular2/angular2'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'
import content = BrowserPolicy.content;

declare var jQuery:any
declare var Camera;

@Component({
    selector: 'compass-view',
    templateUrl: 'client/compass/compass.html',
    pipes: [TranslatePipe],
    directives: [NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})

export class CompassView{
    Degreed = [];
    DegreedX = []

    private years: Array<number>;
    private rotation: number;
    private opacity = 0.2
    private rotateType = 'r'
    OpacityDisplay = 20
    PanType = 'z'
    FeiXing = {
        Years: [],
        SelectedYear: 0,
        Direction: 's', // s = 顺推 n = 逆推
        //Startes: ['一白水', '二黑土', '三碧木', '四绿木', '五黄土', '六白金', '七赤金', '八白土', '九紫火']
        Startes: [],
    };

    Needle = {
        Angle: 0,
        Id: ''
    }

    glsetting:GlobalSetting;
    constructor(@Inject(GlobalSetting) glsetting:GlobalSetting,
                private rootElement: ElementRef) {
        this.glsetting = glsetting;
    }

    get RotateType(){
        return this.rotateType;
    }

    set RotateType(value){
        if(value == 'n' && !navigator['compass']){
            // 没有指南针
            alert('当前平台没有方位感应设备, 无法启用指南针.')
            return
        }

        this.rotateType = value;

        if(value == 'n'){
            // 启动指南针
            this.startCompass();
        }else{
            // 消除指南针
            this.CloseCompass();
        }
    }

    get Rotation(): number{
        return this.rotation;
    }

    set Rotation(value){
        this.rotation = value;
    }

    get Opacity(){
        return this.opacity;
    }

    set Opacity(value){
        this.opacity = value;
        this.OpacityDisplay = Math.floor(100 * value)
    }

    get IsCordova(){
        return this.glsetting.IsCordova
    }

    changeRotation(step: number){
        let angle = this.Rotation + step;
        if(angle > 180 || angle <= -180){
            return;
        }

        jQuery('#compassRotation').progress({
            value: angle + 180,
            total: 360
        });

        this.Rotation = angle
    }

    changeOpacity(step){
        let opa = this.Opacity + step;
        if(opa > 0.81 || opa <= 0){
            return;
        }

        jQuery('#compassOpacity').progress({
            value: Math.floor(opa * 100),
            total: 100
        });

        this.Opacity = opa;
    }

    onInit(){
        for (var i = 0; i < 360; i++) {
            this.Degreed.push(i);
            if (i % 10 === 0) {
                this.DegreedX.push(i);
            };
        };

        // 只有前后三十年
        this.years = new Array<number>();
        var year = (new Date(Date.now())).getFullYear();
        for (var i = -30; i <= 30; i++) {
            this.years.push(year + i);
        };

        this.FeiXing = {
            Years: this.years,
            SelectedYear: year,
            Direction: 's', // s = 顺推 n = 逆推
            //Startes: ['一白水', '二黑土', '三碧木', '四绿木', '五黄土', '六白金', '七赤金', '八白土', '九紫火']
            Startes: [],
        };

        this.FeiXing.Startes = this.calcFeiXing(year);
    }

    afterViewInit(){
        jQuery(this.rootElement.nativeElement).find('.accordion.compass').accordion()

        this.Rotation = 0
        this.changeRotation(0)

        this.Opacity = 0.0;
        this.changeOpacity(0.0)
    }

    CloseCompass(){
        if(navigator['compass'] && this.Needle.Id != ''){
            navigator['compass'].clearWatch(this.Needle.Id);
            this.Needle.Id = ''
        }
    }

    LoadImage(event){
        if(this.IsCordova && navigator['camera']){
            navigator['camera'].getPicture(function (imageURI) {
                console.log('callback getPicture')
                    console.log(imageURI)
                var img = jQuery('#compass-image');
                img.attr('xlink:href', imageURI);
            }, function (err) {
                if (err != "Selection cancelled.") {
                    alert('加载图片错: ' + err);
                }
            },
            {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
            });

            return;
        }

        var f = event.srcElement.files[0];
        var r = new FileReader();
        r.onload = () => {
            //compass - image
            console.log('file loaded' , r.result)
            var img = jQuery('#compass-image');
            img.attr('xlink:href', r.result);

            this.Opacity = 0.5;
            this.changeOpacity(0.0)
        }

        r.readAsDataURL(f);
    }

    UnloadImage(){
        var img = jQuery('#compass-image');
        img.attr('xlink:href', '');

        this.Opacity = 0.0;
        this.changeOpacity(0.0)
    }

    private startCompass(){
        if(!navigator['compass'])return;

        var options = { frequency: 100 };
        this.Needle.Angle = 0;

        this.Needle.Id = navigator['compass']
            .watchHeading((heading) => {
                let ziel = (0 - heading.magneticHeading + 360) % 360
                let current = (this.Needle.Angle + 360) % 360;
                if(Math.abs(ziel - current) < 1){
                    return;
                }

                if(ziel > current){
                    let gegen = ziel - current >= 180 ? true : false
                    ziel = gegen ? current - 1 : current + 1;
                }else{
                    let gegen = current - ziel >= 180 ? true : false
                    ziel = gegen ? current + 1 : current - 1;
                }

                this.Needle.Angle = ziel
            }, (err) => {
                console.log(err);
            }, options);
    }

    private calcFeiXing(year: number){
        var collection = ['一白水', '二黑土', '三碧木', '四绿木', '五黄土', '六白金', '七赤金', '八白土', '九紫火'];
        var idx1000 = Math.floor(year / 1000);
        var idx100 = Math.floor((year % 1000) / 1000);
        var idx10 = Math.floor((year % 100) / 10);
        var idx1 = Math.floor(year % 10);

        var sum = idx1 + idx10 + idx100 + idx1000;
        if (sum > 9) {
            idx10 = Math.floor((sum % 100) / 10);
            idx1 = Math.floor(sum % 10);
            sum = idx1 + idx10;
        };

        sum = 11 - sum;

        var tmp = []; // 从 中宫开始
        for (var idx = 0; idx < 9; idx++) {
            var index = ((sum - 1) + idx) % 9;
            tmp.push(collection[index]);
        };

        var res = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ];
        for (var idx = 0; idx < 9; idx++) {
            var index = this.FeiXing.Direction == 's' ? (4 + idx) % 9 : (4 - idx + 9) % 9;
            res[index] = tmp[idx];
        };

        return res;
    }
}
