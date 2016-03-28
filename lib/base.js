String.format = function () {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    var paras = [];
    for (var idx = 1; idx < arguments.length; idx++) {
        if (Array.isArray(arguments[idx])) {
            for (var j = 0; j < arguments[idx].length; j++) {
                paras[paras.length] = arguments[idx][j];
            }
        } else {
            paras[paras.length] = arguments[idx];
        }
    }

    for (var i = 0; i < paras.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + i + "\\}", "gm");
        theString = theString.replace(regEx, paras[i]);
    }

    return theString;
};

String.int2str = function (num, length, base) {
    var radix = base == null || base == undefined ? 2 : base;
    var res = num.toString(radix);
    if (res.length >= length) {
        return res;
    } else {
        while (res.length < length) res = "0" + res;
        return res;
    }
};

String.IsNullOrEmpty = function (str) {
    return str == undefined || str == null || str == '';
};

Array.prototype.select = function (closure) {
    for (var n = 0; n < this.length; n++) {
        if (closure(this[n])) {
            return this[n];
        }
    }

    return null;
};

Array.prototype.where = function (closure) {
    var res = [];
    for (var n = 0; n < this.length; n++) {
        if (closure(this[n])) {
            res[res.length] = this[n];
        }
    }

    return res;
};

Array.prototype.distinct = function () {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

Date.prototype.toChinaString = function (full) {
    var res = this.getFullYear() + '年' + (this.getMonth() + 1) + '月' + this.getDate() + '日';
    if (full == true) {
        res += ' ' + String.int2str(this.getHours(), 2, 10) + '时' + String.int2str(this.getMinutes(), 2, 10) + '分';
    }

    return res;
};

Date.prototype.formate = function(flag){
    var res = ''
    var y = this.getFullYear();
    var M = this.getMonth() + 1;
    var d = this.getDate();

    var h = this.getHours();
    var m = this.getMinutes();

    var date = y + '-' + String.int2str(M, 2, 10) + '-' + String.int2str(d, 2, 10);
    var time = String.int2str(h, 2, 10) + ':' + String.int2str(m, 2, 10)

    if(flag == 'datetime'){
        return date + ' ' + time;
    }else if(flag == 'time'){
        return time;
    }else{
        return date;
    }
}

Date.fromText = function(value){
    var items = value.split('-')
    var y = parseInt(items[0])
    var m = parseInt(items[1]) - 1
    var d = parseInt(items[2])

    return new Date(y, m, d)
}

Log = function(){
    if(!Meteor.settings){
        return
    }

    if(!Meteor.settings.public){
        return
    }

    if(Meteor.settings.public.Debug == true){
        console.log(arguments)
    }
}



