/* ----------  SINGER Base Store --------------
     version    :1.0.0;
     date       :2013-08-12
     creator    :Shoy
*/
/*
    SINGER Base:log/error/guid
 */
var singer=window.SINGER=(function (undefined){
    var L,G= 0,T=this;
    L={
        __BUILD_TIME:'20130531',
        version:'1.0.1',
        Level:{normal:0,info:1,warn:2,error:3,ignore:4},
        Config:{
            lv:0,
            fns:{}
        },
        /*
         @PARAM CAT 'INFO', 'WARN', 'ERROR', 'TIME'
         */
        log:function(msg,cat,src){
            if(L.Level[cat ? cat:"normal"] < L.Config.lv) return;
            if(src){
                msg = src+":"+msg;
            }
            if(T["console"] !== undefined && console.log){
                console[cat && console[cat] ? cat : 'log'](msg);
            }
        },
        error:function(msg){
            throw msg instanceof Error ? msg : new Error(msg);
        },
        guid:function (pre) {
            return (pre || '') + G++;
        }
    };
    return L;
})();

/*
 SINGER.Uri/Json
 version:1.0.1
 */
(function(L,undefined){
    L.Uri=function (uri){
        var q=[],qs;
        qs=(uri?uri+"":location.search);
        if(qs.indexOf('?')>=0){
            qs=qs.substring(1);
        }
        if(qs){
            qs=qs.split('&');
        }
        if(qs.length>0){
            for(var i=0;i<qs.length;i++){
                var qt=qs[i].split('=');
                q[qt[0]]=decodeURIComponent(qt[1]);
            }
        }
        return q;
    };
    L.Json=function(json){
        if(null === json || "" === json) return json;
        if("object" === typeof json){
            if(Date === json.constructor){
                return "'new Date(" + json.valueOf() + ")'";
            }
            var arr=[];
            var fmt = function(s) {
                if ('object' === typeof s && s != null) return L.Json(s);
                return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
            }
            var str="";
            if(Array === json.constructor){
                for(var i=0;i<json.length;i++){
                    if(/^(string|number)$/.test(typeof json[i]))
                        arr.push(json[i]);
                    else{
                        var tarr=[];
                        for (var j in json[i]){
                            tarr.push("'" + j + "':" + fmt(json[i][j]));
                        }
                        arr.push('{' + tarr.join(',') + '}');
                    }
                }
                return '[' + arr.join(',') + ']';
            }else{
                for (var i in json) arr.push("'" + i + "':" + fmt(json[i]));
                return '{' + arr.join(',') + '}';
            }
        }else if("string" === typeof json){
            json = json.replace(/'(new Date\(\d+\))'/gi,"$1");
            return eval("("+json+")");
        }
    };
})(singer);
/*
    SINGER Utils
*/
(function(L,undefined){
    L.trim=function(a){
        try{
            return a.replace(/^\s+|\s+$/g,'');
        }catch(e){
            return a;
        }
    };
    L.len=function(a){
        return a.replace(/[\u4e00-\u9fa5]/g,"**").length;
    };
    L.sub=function(a,n,v){
        if(L.len(a)<=n) return a.toString()
        for(var i=0;i<a.length;i++){
            if(L.len(this.substr(0,i))>=n){
                return a.substr(0,i)+(v||"...");
            }
        }
        return a;
    };
    L.stripTags=function(h){
        return h.replace(/<\/?[^>]+>/gi,'')
    };
    L.stripScript=function(h){
        return h.replace(/<script[^>]*>([\\S\\s]*?)<\/script>/g,'')
    };
    L.isMobile=function(m){
        return /^((0[1-9]{2,3}[\s-]?)?\d{7,8})|(1[3,5,8]\d{9})$/.test(L.trim(m))
    };
    L.cookie={
        set: function(name, value, minutes, domain){
            if("string" !== typeof name || "" === L.trim(name)) return;
            var c = name + '=' + encodeURI(value);
            if("number" === typeof minutes && minutes > 0){
                var time= (new Date()).getTime() + 1000 *60 * minutes;
                c +=';expires='+ (new Date(time)).toGMTString();
            }
            if("string" == typeof domain)
                c += ';domain='+domain;
            document.cookie = c + '; path=/';
        },
        get: function(name){
            var b = document.cookie;
            var d = name + '=';
            var c = b.indexOf('; ' + d);
            if (c == -1) {
                c = b.indexOf(d);
                if (c != 0) {
                    return null;
                }
            }
            else {
                c += 2;
            }
            var a = b.indexOf(';', c);
            if (a == -1) {
                a = b.length;
            }
            return decodeURI(b.substring(c + d.length, a));
        },
        clear: function(name, domain){
            if (this.get(name)) {
                document.cookie = name + '=' + (domain ? '; domain=' + domain : '') + '; expires=Thu, 01-Jan-70 00:00:01 GMT';
            }
        }
    };
    L.event=function(){
        return window.event || arguments.callee.caller.arguments[0];
    }
    return L;
})(singer);
/*
    SINGER add/use
 */
(function(L,undefined){
    L.add=function(name,src){

    };
})(singer);