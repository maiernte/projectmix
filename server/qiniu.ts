declare var QiniuSDK

function onUploaded(res){
    console.log("image uploaded", res)
}

var bucket = {
    'name': 'huaheapp',
    'onUploaded': onUploaded,
    'callbackBody': 'key=$(key)&bucket=$(bucket)&userId=$(x:userId)'
}

var config = {
    'ak': 'kgKHm-NUFC3oXhlCvKq7HZbZdFGVwGwMCQLeiEwr',  // 必填 <ACCESS_KEY>
    'sk': 'IUyzYMCPA3MMoTkQvfhzxi4hy07UEfGiVdFFWLSJ',  // 必填 <SECRET_KEY>
    'callbackRoute': 'qiniu_callback',
    'buckets' : []
}

export function initQiniu(){
    try{
        // 生成实例
        var qiniu1 = new QiniuSDK(config);
        
        let bucket = {
            'bucket': 'huaheapp',
            'onUploaded': onUploaded,
            'callbackBody': 'key=$(key)&bucket=$(bucket)&userId=$(x:userId)',
            'insertOnly': 0
        }

        // 添加单个 bucket
        qiniu1.addBucket(bucket);  // 可以获取token了，背后设置了 callbackUrl

        // 应用配置
        qiniu1.init();
        console.log('qiniu inited !')
    }catch(err){
        console.log('init qiniu error: ', err)
    }
}