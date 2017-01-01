/**
 * Json 序列化
 */
(function (S) {
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
                arrItem;
            if (S.isArray(json)) {
                S.each(json, function (jsonItem) {
                    if (S.isNumber(jsonItem))
                        arr.push(jsonItem);
                    else if (S.isString(jsonItem))
                        arr.push("'" + jsonItem + "'");
                    else if (S.isArray(jsonItem)) {
                        arr.push(S.json(jsonItem));
                    }
                    else {
                        arrItem = [];
                        S.each(S.keys(jsonItem), function (key) {
                            arrItem.push("'" + key + "':" + fmt(jsonItem[key]));
                        });
                        arr.push('{' + arrItem.join(',') + '}');
                    }
                });
                return '[' + arr.join(',') + ']';
            } else {
                S.each(S.keys(json), function (key) {
                    arr.push("'" + key + "':" + fmt(json[key]));
                });
                return '{' + arr.join(',') + '}';
            }
        } else if (S.isString(json)) {
            json = json.replace(/'(new Date\(\d+\))'/gi, "$1");
            return eval("(" + json + ")");
        }
    };
})(SINGER);