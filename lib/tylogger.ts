import {LoggerIBM, LoggerMongo} from  'collections/admin'

declare var Meteor;

export function LogDB(message:string, data: Object, uid:string){
    if(Meteor.isServer){
        let time = new Date(Date.now())
        try{
            LoggerIBM.insert({
                time: time,
                msg: message,
                data: data,
                user: uid
            }, (err) => {
                if(err){
                    LoggerMongo.insert({
                        time: time,
                        msg: err.toString()
                    })
                }
            })
        }catch(errtotal){
            LoggerMongo.insert({
                time: time,
                msg: errtotal.toString()
            })
        }
    }
}

export function LogDebug(title: string, ...rest: any[]){
    var Debug = Meteor.settings.public ? Meteor.settings.public.Debug : false
    if(Debug == true){
        console.log((title || 'debug: '), rest);
    }
}