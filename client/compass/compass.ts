/// <reference path="../../typings/angular2-meteor.d.ts" />
import {Component,
        Inject,
        ElementRef,
        AfterViewInit} from 'angular2/core'
import {NgFor,
    NgSwitch,
    NgSwitchWhen,
    NgSwitchDefault,} from 'angular2/common'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from  'client/globalsetting'

declare var jQuery:any
declare var Camera;
declare var navigator: any;

@Component({
    selector: 'compass-view',
    templateUrl: 'client/compass/compass.html',
    pipes: [TranslatePipe],
    directives: [NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})

export class CompassView{
    Degreed = [];
    DegreedX = []

    private selectedYear: number;
    private feixingDirection: boolean; // true = 顺推 false = 逆推
    private imageData;
    private years: Array<number>;
    private rotation: number;
    private opacity = 0.2
    private rotateType = 'r'
    OpacityDisplay = 20
    PanType = 'z'
    FeiXing = {
        Years: [],
        //Startes: ['一白水', '二黑土', '三碧木', '四绿木', '五黄土', '六白金', '七赤金', '八白土', '九紫火']
        Startes: [],
    };

    ImgUrl = ''
    Needle = {
        Angle: 0,
        Id: '',
        Value: 0
    }

    constructor(@Inject(GlobalSetting) public glsetting:GlobalSetting,
                private rootElement: ElementRef) {
    }

    get SelectedYear(){
        return this.selectedYear;
    }

    set SelectedYear(value){
        this.selectedYear = value
        this.FeiXing.Startes = this.calcFeiXing(value);
    }

    get FeiXingDirection(){
        return this.feixingDirection ;
    }

    set FeiXingDirection(value){
        // s = 顺推 n = 逆推
        this.feixingDirection = value
        this.FeiXing.Startes = this.calcFeiXing(this.SelectedYear);
    }

    get RotateType(){
        return this.rotateType;
    }

    set RotateType(value){
        if(value == 'n' && !navigator['compass']){
            // 没有指南针
            this.glsetting.Alert('指南针', '当前平台没有方位感应设备, 无法启用指南针.')
            return
        }

        this.rotateType = value;

        if(value == 'n'){
            this.UnloadImage();
            this.Rotation = 0;
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

    ngOnInit(){
        for (var i = 0; i < 360; i++) {
            this.Degreed.push(i);
            if (i % 10 === 0) {
                this.DegreedX.push(i);
            };
        };

        // 只有前后三十年
        this.years = [];
        var year = (new Date(Date.now())).getFullYear();
        for (var i = -30; i <= 30; i++) {
            this.years.push(year + i);
        };

        this.FeiXing = {
            Years: this.years,
            //Startes: ['一白水', '二黑土', '三碧木', '四绿木', '五黄土', '六白金', '七赤金', '八白土', '九紫火']
            Startes: [],
        };

        this.SelectedYear = year;
        this.FeiXing.Startes = this.calcFeiXing(year);
        this.FeiXingDirection = true;
        
        this.Rotation = 0
        this.changeRotation(0)

        this.Opacity = 0.0;
        this.changeOpacity(0.0)
    }

    ngAfterViewInit(){
        jQuery(this.rootElement.nativeElement).find('.accordion.compass').accordion()
    }

    CloseCompass(){
        if(navigator['compass'] && this.Needle.Id != ''){
            navigator['compass'].clearWatch(this.Needle.Id);
            this.Needle.Id = ''
            this.Needle.Value = 0
        }
    }

    
    LoadImage(event){
        if(this.IsCordova && navigator['camera']){
            navigator['camera'].getPicture((data) => {
                this.ImgUrl = 'url(' + data + ')'
                
                this.Opacity = 0.5;
                this.changeOpacity(0.0)
            }, function (err) {
                if (err != "Selection cancelled.") {
                    this.glsetting.Notify('加载图片失败', -1)
                }
            },{
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            });
        }else{
            var f = event.srcElement.files[0];
            var r = new FileReader();
            r.onload = () => {
                this.ImgUrl = 'url(' + r.result + ')'

                this.Opacity = 0.5;
                this.changeOpacity(0.0)
            }

            console.log(f)
            r.readAsDataURL(f);
        }
    }

    UnloadImage(){
        var img = jQuery('#compass-image');
        img.attr('xlink:href', '');

        this.Opacity = 0.0;
        this.changeOpacity(0.0)
    }

    private startCompass(){
        if(!navigator['compass'])return;

        var options = { frequency: 200 };
        this.Needle.Angle = 0;

        navigator.compass.getCurrentHeading(heading => {
            this.Needle.Angle = (0 - heading.magneticHeading + 360) % 360
            this.Needle.Value = Math.floor(heading.magneticHeading * 100) / 100
        }, (err) => {
            console.log('getCurrentHeading Error',err);
        });

        this.Needle.Id = navigator['compass']
            .watchHeading((heading) => {
                let ziel = (0 - heading.magneticHeading + 360) % 360
                //let current = (this.Needle.Angle + 360) % 360;
                let current = (this.Rotation + 360) % 360;
                this.Needle.Value = Math.floor(heading.magneticHeading * 100) / 100

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

                //this.Needle.Angle = ziel
                this.Rotation = ziel
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
            var index = this.FeiXingDirection == true ? (4 + idx) % 9 : (4 - idx + 9) % 9;
            res[index] = tmp[idx];
        };

        return res;
    }
}
