/// <reference path="../../typings/global.d.ts" />

declare var Qiniu;
declare var Meteor;
declare var Promise;

export class TYUploader{

    bucket: Object
    settings: any
    uploader: any

    Inited = false

    constructor(setting: any){
        this.settings = this.initSettings(setting)
        this.bucket = setting.bucket;
    }

    Init(): any{
        let promise = new Promise((resolve, reject) => {
            Meteor.call('getQiniuBucketToken', this.bucket, (err, token) => {
                if (!err) {
                    //console.log('init uploader');
                    this.settings.uptoken = token;
                    this.uploader = Qiniu.uploader(this.settings);
                    this.Inited = true;
                    resolve(null)
                }else{
                    reject(err)
                }
            });
        })

        return promise
    }

    Destroy(){
        Log('destroy uploader')
        this.uploader.destroy()
    }

    private initSettings(settings: any): any{
        // 配置 uplaoder 的参数，参考 https://github.com/qiniu/js-sdk
        return {
            runtimes: settings.runtimes || 'html5,flash,html4',
            browse_button: settings.browse_button,            //**必需**
            //uptoken_url: '/uptoken',                        // 本SDK推荐使用 Meteor.method 来获取 token
            downtoken_url: settings.downtoken_url,            // Ajax请求downToken的Url，私有空间时使用,JS-SDK将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
            uptoken : '',                                     // 将在调用 init 方法时获得
            unique_names: settings.unique_names || false,      // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
            domain: settings.domain,                          //bucket 域名，下载资源时用到，**必需**
            container: settings.container,                    //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: settings.max_file_size || '100mb', //最大文件体积限制
            flash_swf_url: 'js/plupload/Moxie.swf',           //引入flash,相对路径
            max_retries: settings.max_retries || 3,           //上传失败最大重试次数
            dragdrop: settings.dragdrop || true,              //开启可拖曳上传
            drop_element: settings.drop_element || settings.browse_button,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: settings.chunk_size || '4mb',                             //分块上传时，每片的体积
            auto_start: true,                                                     //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
            x_vars : settings.x_vars,                      //自定义变量，用于回调函数
            save_key: false,
            init: settings.bindListeners
        };
    }
}
