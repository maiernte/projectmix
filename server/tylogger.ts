import {LoggerIBM, LoggerMongo} from  'collections/admin'

export function LogDB(message:string, data: Object, uid:string){
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