/**
 * Json 序列化
 */
(function(S,undefined){
    S.json = function (json) {
        if (S.isEmpty(json)) return json;
        if (S.isObject(json)) {
            if (Date === json.constructor) {
                return "'new Date(" + json.valueOf() + ")'";
            }
            var fmt = function (s) {
                if (S.isObject(s) && s != null) return S.json(s);
                return (S.isString(s) || S.isNumber(s)) ? "'" + s + "'" : s;
            };
            var arr = [],
                arrItem,
                jsonItem;
            if (S.isArray(json)) {
                for (var i = 0; i < json.length; i++) {
                    jsonItem = json[i];
                    if (S.isNumber(jsonItem))
                        arr.push(jsonItem);
                    else if(S.isString(jsonItem))
                        arr.push("'"+jsonItem+"'");
                    else {
                        arrItem = [];
                        for (var j in jsonItem) {
                            arrItem.push("'" + j + "':" + fmt(jsonItem[j]));
                        }
                        arr.push('{' + arrItem.join(',') + '}');
                    }
                }
                return '[' + arr.join(',') + ']';
            } else {
                for (var i in json) arr.push("'" + i + "':" + fmt(json[i]));
                return '{' + arr.join(',') + '}';
            }
        } else if (S.isString(json)) {
            json = json.replace(/'(new Date\(\d+\))'/gi, "$1");
            return eval("(" + json + ")");
        }
    };
    return S;
})(SINGER);