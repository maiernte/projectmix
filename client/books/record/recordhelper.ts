/// <reference path="../../../typings/book.d.ts" />
import {LocalRecords, BkRecords} from 'collections/books'
import {DelImages} from 'collections/admin'

declare var Promise;
declare var Meteor;

export class RecordHelper{
    Loading = false
    Checked: boolean
    constructor(private rd: YiRecord){
        this.Checked = false;
    }

    get BookId(){
        return this.rd.book;
    }

    get Id(){
        return this.rd._id;
    }

    get Data(){
        return this.rd;
    }

    get IsGua(){
        if(this.rd.gua){
            return true;
        }else{
            return false;
        }
    }
    
    get IsCloud(){
        return this.rd.cloud == true
    }

    get Created(){
        let date = new Date(this.rd.created)
        return this.toChina(date)
    }

    get Question(){
        return this.rd.question;
    }

    get Feed(){
        let txt = this.rd.feed ? this.rd.feed.trim() : '';
        return txt != '';
    }

    get FeedText(){
        let txt = this.rd.feed ? this.rd.feed.trim() : '';
        return txt;
    }

    get Description(){
        return this.rd.description;
    }

    get Images(){
        return (this.rd.img || [])
    }

    get Links(){
        return (this.rd.link || [])
    }

    get Detail(){
        try{
            if(this.rd.gua){
                let g = this.rd.gua;
                let name = g.ben == g.bian ? g.ben : g.ben + '之' + g.bian
                return g.yueri[0] + '月' + g.yueri[1] + '日 / ' + name
            }else if(this.rd.bazi){
                let items = this.rd.bazi.bazi.split(' ')
                return items.join(' / ')
            }
        }catch(err){
            return ''
        }
    }

    get RouteParams(){
        return this.IsGua ? this.guaParams() : this.baziParams();
    }

    InsertLink(link): any{
        let promise = new Promise((resolve, reject) => {
            if(!this.rd.link){
                this.rd.link = [link]
            }else{
                this.rd.link.push(link)
            }

            LocalRecords.update(this.rd._id,
                {$set: {link: this.rd.link}},
                (err) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(null)
                    }
            })
        })

        return promise
    }

    InsertImage(key){
        let promise = new Promise((resolve, reject) => {
            if(!this.rd.img){
                this.rd.img = [key]
            }else{
                this.rd.img.push(key)
            }

            LocalRecords.update(this.rd._id,
                {$set: {img: this.rd.img}},
                (err) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(null)
                    }
                })
        })

        return promise
    }

    RemoveLink(link):any{
        let promise = new Promise((resolve, reject) => {
            link = link.trim()
            this.rd.link = this.rd.link.filter(l => l != link)

            LocalRecords.update(this.rd._id,
                {$set: {link: this.rd.link}},
                (err) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(null)
                    }
                })
        })

        return promise
    }

    RemoveImage(key: string): any{
        let del = {
            user: Meteor.userId(),
            bk: this.BookId,
            rd: this.Id,
            key: key
        }

        let promise = new Promise((resolve, reject) => {
            DelImages.insert(del, (errqiniu) => {
                console.log('insert to DelImge')
                if(!errqiniu){
                    this.rd.img = this.rd.img.filter(k => k != key)
                    LocalRecords.update(this.rd._id,
                        {$set: {img: this.rd.img}},
                        (err) => {
                            if(err){
                                reject(err)
                            }else{
                                resolve(null)
                            }
                        })
                }else{
                    reject(errqiniu)
                }
            })
        })

        return promise
    }

    Save(ques: string, feed: string, desc: string){
        let promise = new Promise((resolve, reject) => {
            //this.rd.description = desc;
            this.rd.question = ques;
            this.rd.feed = feed;
            this.rd.description = desc;
            this.rd.modified = Date.now()

            LocalRecords.update(this.rd._id, {$set: {
                question: ques,
                description: desc,
                feed: feed,
                modified: this.rd.modified
            }}, (err, res) => {
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            })
        });
        
        return promise
    }
    
    Remove(): any{
        let promise = new Promise((resolve, reject) => {
            if(this.rd.cloud != true){
                LocalRecords.remove(this.Id, (err) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(true)
                    }
                })
            }else{
                LocalRecords.update(this.Id, {$set: {
                        question: '',
                        description: '',
                        feed: '',
                        gua: null,
                        bazi: null,
                        deleted: true,
                        modified: Date.now(),
                        link: null,
                    }
                }, (err) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(true)
                    }
                })
            }
        })
        
        return promise
    }
    
    CloudSync(): any{
        let promise = new Promise((resolve, reject) => {
            Meteor.subscribe('bkrecord', this.BookId, {}, (subscribeerr) => {
                if(subscribeerr){
                    reject(subscribeerr)
                    return
                }
                
                let crd = BkRecords.findOne({_id: this.Id})
                if(!crd){
                    this.rd.cloud = true
                    BkRecords.insert(this.rd, (err, res) => {
                        if(err){
                            this.rd.cloud = false
                            reject(err)
                        }else{
                            LocalRecords.update(this.Id, {$set: {cloud: true}})
                            resolve(1)
                        }
                    })
                }else{
                    if(this.rd.modified > crd.modified){
                        if(!this.rd.description){
                            let lrd = LocalRecords.findOne({_id: this.Id})
                            this.rd.description = lrd.description
                        }
                        
                        BkRecords.update(this.rd, () => {
                            resolve(1)
                        })
                    }else if(this.rd.modified < crd.modified){
                        LocalRecords.update(crd._id, {$set: {
                            gua: crd.gua,
                            bazi: crd.bazi,
                            question: crd.question,
                            description: crd.description,
                            feed: crd.feed,
                            img: crd.img,
                            modified: crd.modified,
                            deleted: crd.deleted,
                            cloud: true
                        }})
                        
                        this.rd = LocalRecords.findOne({_id: crd._id})
                        resolve(-1)
                    }else{
                        resolve(0)
                    }
                }
            })
        })
        
        return promise;
    }

    private toChina(d: Date): string{
        let res = d.getFullYear() + "年"
            + (d.getMonth() + 1) + "月"
            + d.getDate() + "日"
            + d.getHours() + "时"
            + d.getMinutes() + "分";
        return res;
    }

    private guaParams(): Object{
        let gua = this.rd.gua;

        let params = {
            flag: 'gua',
            question: this.Question,
            type: gua.type ? gua.type : 0,
            time: gua.time ? gua.time : gua.yueri,
            gua: [gua.ben, gua.bian]
        }

        return params;
    }

    private baziParams(): Object{
        let bz = this.rd.bazi;
        let pl = bz.place ? bz.place.split(' ') : []

        let params = {
            flag: 'bazi',
            name: this.Question,
            birthday: bz.time,
            gender: bz.gender,
            solar: bz.solartime ? true : false,
            land: pl.length > 0 ? pl[0] : '未知',
            city: pl.length > 1 ? pl[1] : '',
            code: bz.solartime
        }

        return params;
    }
}