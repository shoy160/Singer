var lazy={
    images:[],
    default:{
        execute: 50,
        source: "lazy-src",
        prePixel: 60,
        auto: false,
        holderImg:"http://www.img.100hg.com/blank.gif",
        loadingImg:"http://www.img.100hg.com/H-loading.gif",
        errImg:"http://www.img.100hg.com/100hg.gif"
    },
    config:function(a){
        return $.extend(lazy.default,a||{});
    },
    add:function(a){
        var b= $.extend({selector:["img"],exclude:[]},a||{});
        (function(){
            var c = $(b.selector[0]),
                d = lazy.config(),
                e,q, f,g=[];
            for (e = 1; e < b.selector.length; e++) {
                c = c.add(b.selector[e])
            }
            for (e = 0; e < b.exclude.length; e++) {
                c = c.not(b.exclude[e])
            }
            function m(h) {
                q = $(h);
                f = 0;
                while (f <= 0) {
                    f = parseInt(q.offset().top);
                    q = q.parent()
                }
                h._lazzOffsetTop = f;
                return h
            }
            c.each(function() {
                if ("img" == this.tagName.toLowerCase() && this.getAttribute(d.source)) {
                    d.holderImg && this.setAttribute("src",d.holderImg),
                        d.loadingImg && (this.style.background ='url("'+ d.loadingImg+'") no-repeat scroll 50% 50% transparent');
                    g.push(m(this))
                }
            });
            lazy.images.push(g);
            $(g).bind("error.lazyLoad",function(){
                this.setAttribute("raw-src",this.src);
                this.src = d.holderImg;
                this.style.background ='url("'+ d.errImg+'") no-repeat scroll 50% 50% transparent';
            });
        })();
        lazy.load();
    },
    Load:function() {
        var a = $(window),
            b = lazy.config(),
            c = $(document).height(),
            d = 0,
            e = false;
        (function() {
            a.bind("scroll.lazyLoad resize.lazyLoad",
                function() {
                    b.execute > 0 ? f() : h();
                })
            if (b.auto) {
                i()
            }
        })();
        function f() {
            if (e) {
                return
            }
            e = true;
            setTimeout(function() {
                    g()
                },
                b.execute);
            i()
        }
        function g() {
            e = false
        }
        function h() {
            i()
        }
        function i() {
            if (!lazy.images.length) {
                a.unbind("scroll.lazyLoad resize.lazyLoad");
                return
            }
            var j = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var c = j + a.scrollTop() + b.prePixel;
            if (c < d) {
                return
            }
            d = c;
            var h,
                t;
            if (c - 50 <= c) {
                for (h = 0; h < lazy.images.length; h++) {
                    t = lazy.images[h];
                    t.setAttribute("src", t.getAttribute(s.source));
                    t.removeAttribute(s.source);
                }
                lazy.images.splice(0);
                a.unbind("scroll.lazyLoad resize.lazyLoad");
                return
            }
            for (h = 0; h < lazy.images.length; h++) {
                t = lazy.images[h];
                if (t._lazzOffsetTop < c) {
                    t.src = t.getAttribute(s.source);
                    t.removeAttribute(s.source);
                    lazy.images.splice(h--, 1);
                }
            }
        }
    }
};