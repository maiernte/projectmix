/// <reference path="../../../typings/angular2-meteor.d.ts" />
/// <reference path="../../../typings/book.d.ts" />

import {Component, Inject, ContentChild, Input, ElementRef, NgZone} from 'angular2/core'
import {Router, RouteParams} from 'angular2/router'

import {TranslatePipe} from 'client/allgemein/translatePipe'
import {GlobalSetting} from 'client/globalsetting'

import {GuaView} from 'client/liuyao/guaview'
import {BaziView} from 'client/bazi/baziview'

import {LocalRecords, Books} from 'collections/books'
import {RecordHelper} from './recordhelper'

import {TYUploader} from 'lib/qiniu/tyuploader'

declare var jQuery;
declare var MediumEditor;
declare var QiniuUploader;

@Component({
    selector: "yixue-part",
    pipes:[TranslatePipe],
    templateUrl: "client/books/record/yipart.html",
    directives: []
})
export class YixuePart{
    //private static qiniuUploader;
    private static baseUrl = 'http://7xqidf.com1.z0.glb.clouddn.com/'
    private static copyLink = ''

    private translator: TranslatePipe;
    private editmodel = false;
    private editor;
    private images: Array<string>;
    private links: Array<string>;
    private progressValue = 0

    @ContentChild(GuaView) guaview: GuaView;
    @ContentChild(BaziView) baziview: BaziView;

    @Input() record: RecordHelper;

    UpLoading = false
    ButtonId = ''

    constructor(private router: Router,
                private routeParams: RouteParams,
                private rootElement: ElementRef,
                private ngZone: NgZone,
                @Inject(GlobalSetting) public glsetting:GlobalSetting) {
        this.translator = new TranslatePipe();
    }

    get EditModel(){
        return this.editmodel;
    }

    set EditModel(value){
        this.editmodel = value;

        if(value == true){
            setTimeout(() => {
                let placeholder = '点击编辑按钮, 然后输入内容.'
                this.editor = new MediumEditor('.editable', {
                    placeholder: {
                        text: this.translator.transform(placeholder, [this.glsetting.lang])
                    }
                });
            }, 500);
        }else{
            this.saveChanging();
            this.editor.destroy();
            this.editor = null;
        }
    }

    get IsGua(){
        return this.record ? this.record.IsGua : true;
    }

    get IsCloud(){
        return this.record.IsCloud
    }

    get IsCordova(){
        return this.glsetting.IsCordova
    }

    get Feed(){
        return this.record.Feed
    }

    get Images(){
        if(!this.images){
            this.images = this.record.Images
        }

        return this.images
    }

    get Links(){
        if(!this.links){
            this.links = this.record.Links
        }

        return this.links
    }

    get ImageLink(){
        let link = []
        for(let img of this.Images){
            let url = YixuePart.baseUrl + img
            link.push({extr: false, url: url, key: img})
        }

        for(let l of this.Links){
            link.push({extr: true, url: l})
        }

        return link
    }

    get QuestionT(){
        return this.IsGua ? "问念: " : "命主: "
    }

    get Question(){
        return this.record.Question;
    }

    copyLink(link: string){
        YixuePart.copyLink = link
        this.glsetting.ShowMessage('提示', '点击最上面的图片按钮, 即可将此链接复制到新的外链图片里.')
    }

    insertLink(){
        let urlinit = (YixuePart.copyLink || '')

        let content = `<div class="ui fluid input">
            <input type="text"
                    value = '${urlinit}'
                   placeholder="http://xxx.somesite.com/pic.jpeg"
                   id='record-pic-url-input'>
        </div>`

        this.glsetting.ShowMessage("请输入图片地址:", content, () =>{
            let dom = jQuery('#record-pic-url-input')
            let url = dom[0].value.trim()

            if(url == '')return
            let found = this.links.filter(l => l == url)
            if(found.length > 0)return

            this.record.InsertLink(url)
                .then(() => {
                    this.ngZone.run(() => {
                        this.links = this.record.Links
                        console.log('insert links to record', this.Links)
                    })
                }).catch(err => {
                    this.glsetting.ShowMessage("添加外链失败", err)
            })
        })
    }

    removeLink(link){
        if(link.extr == false){
            // 内链图片
            console.log('remove image ', link.key)
            this.record.RemoveImage(link.key)
                .then(() => {
                    this.ngZone.run(() => {
                        this.images = this.record.Images
                    })
            }).catch(err => {
                this.glsetting.ShowMessage("删除内链失败", err)
            })
        }else{
            console.log('remove link ', link)
            this.record.RemoveLink(link.url)
                .then(() => {
                    this.ngZone.run(() => {
                        this.links = this.record.Links
                    })
            }).catch(err => {
                this.glsetting.ShowMessage("删除外链失败", err)
            })
        }
    }

    showSetting(){
        if(this.guaview) this.guaview.showSetting();
        if(this.baziview) this.baziview.showSetting();
    }

    showOrigPic(url){
        console.log(url)
        let content = `<img class="image" src='${url}'>`
        this.glsetting.ShowMessage('原图', content)
    }

    goNextRecord(flag){
        let rd: YiRecord;

        let bookid = this.record.BookId
        let created = this.record.Data.created;
        if(flag < 0){
            rd = LocalRecords.findOne({book: bookid, created: {$lt: created}, deleted: false}, 
                    {sort: {created: -1}, fields: {question: 1}})
        }else{
            rd = LocalRecords.findOne({book: bookid, created: {$gt: created}, deleted: false},
                    {sort: {created: 1}, fields: {question: 1}})
        }

        if(rd){
            this.router.parent.navigate(['./BookRecord', {bid: bookid, rid: rd._id}])
        }else{
            let msg = "现在已经是" + (flag < 0 ? '第一个' : '最后一个') + '记录'
            this.glsetting.ShowMessage("搜索记录", msg)
        }
    }

    ngOnInit(){
        this.ButtonId = 'upbtn-' + this.glsetting.RandomStr(5)

        let domQuestion = jQuery(this.rootElement.nativeElement).find('.editable.question')
        domQuestion.text(this.record.Question)

        let domFeed = jQuery(this.rootElement.nativeElement).find('.editable.feed')
        domFeed.text(this.record.FeedText)

        let domDesc = jQuery(this.rootElement.nativeElement).find('.editable.description')
        domDesc.html(this.record.Description)
    }

    ngAfterViewInit(){
        this.initQiNiuBook();
    }

    syncRecord(){
        this.record.CloudSync().then((res) => {
            let msg = res < 0 ? "更新到本地。" : "更新到云端。"
            msg = res == 0 ? "数据已经更新过了。" :msg
            this.glsetting.ShowMessage("同步数据", msg)
        }).catch(err => {
            this.glsetting.ShowMessage("同步数据失败", err)
        })
    }

    ngOnDestroy(){
        console.log('yixuepart destroy....')
        this.qiniuUploader.Destroy()
    }

    UploadReady() {
        this.ngZone.run(() => {
            this.UpLoading = true
        })

        if(this.qiniuUploader.Inited == false){
            this.qiniuUploader.Init().then(() => {
                console.log('init qiniu uploader', this.qiniuUploader)
            })
        }
    }

    private setprogress(value){
        this.progressValue = value > 0 ? this.progressValue + value : 0

        jQuery('#progressUploadPic').progress({
            value: this.progressValue,
            total: 100
        });
    }

    private uploadErr = null
    private qiniuUploader;
    private testqiniu

    private initQiNiuBook(){
        var settings = {
            bucket: 'huaheapp',
            browse_button: this.ButtonId,
            domain: 'http://7xqidf.com1.z0.glb.clouddn.com',
            max_file_size: '500kb',
            unique_names: false ,
            save_key: false,
            bindListeners: {
                'FilesAdded': (up, files) => {
                    if(this.Images.length === 3){
                        this.glsetting.ShowMessage("添加图片", "非常抱歉, 由于运营成本的缘故, 每个记录最多允许三张图片. ")
                        throw Error('cancel')
                    }

                    var maxfiles = 1;
                    if(up.files.length > maxfiles )
                    {
                        up.splice(maxfiles);
                        alert('每次只允许上传一个文件');
                        throw Error('cancel')
                    }

                    console.log('add image file to ', this.record.Question, this.record.Id)
                    this.setprogress(0)
                },

                'BeforeUpload': (up, file) => {
                    this.ngZone.run(() => {
                        this.UpLoading = true;
                    })
                },

                'UploadProgress': (up, file) => {
                    console.log('progress...')
                    this.setprogress(10)
                },

                'FileUploaded': (up, file, info) => {
                    let pic = JSON.parse(info)
                    this.record.InsertImage(pic.key)
                    console.log('update images of', this.record.Question, this.record.Id)
                },
                'Error': (up, err, errTip) => {
                    this.uploadErr = err
                },
                'UploadComplete': () => {
                    this.ngZone.run(() => {
                        this.UpLoading = false;
                        if(this.uploadErr){
                            this.glsetting.ShowMessage('上传失败', this.uploadErr)
                        }else {
                            console.log('upload completed', this.record.Id)
                            this.ngZone.run(() => {
                                this.UpLoading = false;
                                this.images = this.record.Images
                            })
                        }
                    })
                },
                'Key': (up, file) => {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    let item = file.name.split('.')
                    let endung = item[item.length - 1]
                    let bk =this.record.BookId
                    let rd = this.record.Id
                    let name = this.glsetting.RandomStr(5)
                    let uid = Meteor.userId()

                    var key = `uid-${uid}/bk-${bk}/rd-${rd}/${name}.${endung}`
                    return key;
                }
            }
        }

        try{
            this.qiniuUploader = new TYUploader(settings)
            this.qiniuUploader.Init()
        }catch(err){
            console.log('init qiniu err:', err)
            this.qiniuUploader = null
        }
    }

    private saveChanging(){
        let dom = jQuery(this.rootElement.nativeElement).find('.editable.question')
        let question = dom[0].innerText;

        dom = jQuery(this.rootElement.nativeElement).find('.editable.feed')
        let feed = dom[0].innerText;

        dom = jQuery(this.rootElement.nativeElement).find('.editable.description')
        let desc = dom[0].innerHTML;

        this.record.Save(question, feed, desc).then(res => {
            if(this.guaview) this.guaview.changeQuestion(question);
            if(this.baziview) this.baziview.changeQuestion(question);
            this.glsetting.ShowMessage('更新成功', '成功更新到数据库！')
        }).catch(err => {
            this.glsetting.ShowMessage('更新数据失败', err)
        });
    }
}