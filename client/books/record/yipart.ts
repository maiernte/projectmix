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
    private static qiniuUploader;
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
    Inputlink = ''

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
        let link = (YixuePart.copyLink || 'wasser.png')

        let found = this.links.filter(l => l == link)
        if(found.length > 0)return

        //this.links.push(link)
        this.record.InsertLink(link)
            .then(() => {
                this.ngZone.run(() => {
                    this.images = this.record.Images
                    YixuePart.copyLink = null
                    console.log('links', this.Images)
                })
        }).catch(err => {
            this.glsetting.ShowMessage("添加外链失败", err)
        })
    }

    editLink(link: string){
        this.Inputlink = link == 'wasser.png' ? '' : link

        jQuery('.ui.modal.piclink')
            .modal({
                closable  : false,
                onDeny    : function(){
                    return true;
                },
                onApprove : () => {
                    if(link.trim() == this.Inputlink.trim())return

                    this.record.ChangeLink(link, this.Inputlink.trim())
                        .then(() => {
                            this.ngZone.run(() => {
                                this.links = this.record.Links
                                this.Inputlink = null
                                console.log('links', this.Links)
                            })
                        }).catch(err => {
                        this.glsetting.ShowMessage("添加外链失败", err)
                    })

                    /*this.links = [this.Inputlink]
                    this.ngZone.run(() => {
                        console.log('inputlink:', this.ImageLink)
                    })*/
                }
            })
            .modal('show')
    }

    removeLink(link){
        if(link.extr == false){
            // 内链图片
        }else{
            this.links = this.links.filter(l => l != link.url)
        }

        this.ngZone.run(() => {
            console.log('update links')
        })
    }

    showSetting(){
        if(this.guaview) this.guaview.showSetting();
        if(this.baziview) this.baziview.showSetting();
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
        let domQuestion = jQuery(this.rootElement.nativeElement).find('.editable.question')
        domQuestion.text(this.record.Question)

        let domFeed = jQuery(this.rootElement.nativeElement).find('.editable.feed')
        domFeed.text(this.record.FeedText)

        let domDesc = jQuery(this.rootElement.nativeElement).find('.editable.description')
        domDesc.html(this.record.Description)
    }

    ngAfterViewInit(){
        this.initQiNiuBook();
        console.log('YiPart', this.ImageLink)
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

    addImage(){
        if(this.Images.length === 3){
            this.glsetting.ShowMessage("添加图片", "非常抱歉, 由于运营成本的缘故, 每个记录最多允许三张图片. ")
            return;
        }
    }

    removeImag(){

    }

    private setprogress(value){
        this.progressValue = value > 0 ? this.progressValue + value : 0

        jQuery('#progressUploadPic').progress({
            value: this.progressValue,
            total: 100
        });
    }

    private initQiNiuBook(){
        if(!!YixuePart.qiniuUploader)return

        var settings = {
            bucket: 'huaheapp',
            browse_button: 'uploadBookPic',
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
                    this.Images.push(pic.key)
                    console.log('file uploaded', this.Images)
                },
                'Error': function(up, err, errTip) {
                    console.log('upload error', err, errTip)
                },
                'UploadComplete': () => {
                    this.ngZone.run(() => {
                        this.UpLoading = false;
                        console.log('upload completed', this.Images, this.record.Id)
                        LocalRecords.update(this.record.Id, {$set: {img: this.Images}}, (err) => {
                            console.log('insert image to record')
                        })
                    })
                },
                'Key': (up, file) => {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    let item = file.name.split('.')
                    //var key = Meteor.userId() + '/icon.' + item[item.length - 1];
                    var key = 'bk/' + this.record.BookId + '/rd/' + this.record.Id + '/' + this.Images.length + '.' + item[item.length - 1]
                    return key;
                }
            }
        }

        try{
            YixuePart.qiniuUploader = new QiniuUploader(settings);
            YixuePart.qiniuUploader.settings.save_key = false
            YixuePart.qiniuUploader.settings.unique_names = false
            YixuePart.qiniuUploader.init();
            console.log('Qiniu Book Pic inited')
        }catch(err){
            console.log('init qiniu err:', err)
            YixuePart.qiniuUploader = null
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