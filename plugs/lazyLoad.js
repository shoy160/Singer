jQuery.lazyLoad = function(s) {
    var r = {
        execute: 50,
        source: "lazy-src",
        prePixel: 60,
        selector: ["img[lazy-src]"],
        exclude: [],
        auto: false,
        holderImg:"http://www.img.100hg.com/blank.gif",
        loadingImg:"http://www.img.100hg.com/H-loading.gif",
        errImg:"http://www.img.100hg.com/100hg.gif"
    };
    s = $.extend(r, s);
    var n = [],
        e,
        j,
        c,
        p = $(window);
    (function() {
        var h = $(s.selector[0]);
        for (e = 1; e < s.selector.length; e++) {
            h = h.add(s.selector[e])
        }
        for (e = 0; e < s.exclude.length; e++) {
            h = h.not(s.exclude[e])
        }
        h.each(function() {
            if ("img" == this.tagName.toLowerCase() && this.getAttribute(s.source)) {
                s.holderImg && this.setAttribute("src",s.holderImg),
                    s.loadingImg && $(this).addClass("lazy-loading");
                n.push(m(this))
            }
            $(n).bind("error.lazyLoad",function(){
                if(s.holderImg){
                    this.setAttribute("raw-src",this.src);
                    this.src = s.holderImg;
                }
                if(s.errImg){
                    $(this).removeClass("lazy-loading").addClass("image-error");
                }
            });
        });
        $(window).bind("scroll.lazyLoad resize.lazyLoad",
            function() {
                s.execute > 0 ? g() : b();
            })
        if (r.auto) {
            l()
        }
    })();
    var d = false;
    function g() {
        if (d) {
            return
        }
        d = true;
        setTimeout(function() {
                k()
            },
            s.execute);
        l()
    }
    function k() {
        d = false
    }
    function b() {
        l()
    }
    var o = $(document).height(),
        a = 0,
        q,
        f;
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
    function l() {
        if (!n.length) {
            p.unbind("scroll.lazyLoad resize.lazyLoad");
            return
        }
        j = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        c = j + p.scrollTop() + s.prePixel;
        if (c < a) {
            return
        }
        a = c;
        var h,
            t;
        if (o - 50 <= c) {
            for (h = 0; h < n.length; h++) {
                t = n[h];
                t.setAttribute("src", t.getAttribute(s.source));
                t.removeAttribute(s.source);
            }
            n.splice(0);
            p.unbind("scroll.lazyLoad resize.lazyLoad");
            return
        }
        for (h = 0; h < n.length; h++) {
            t = n[h];
            if (t._lazzOffsetTop < c) {
                t.src = t.getAttribute(s.source);
                t.removeAttribute(s.source);
                n.splice(h--, 1);
            }
        }
    }
    (function(){
        var style="";
        if(s.loadingImg)
            style+='.lazy-loading{background:url('+ s.loadingImg +') no-repeat scroll 50% 50% transparent}';
        if(s.errImg)
            style+='.image-error{background:url('+ s.errImg +') no-repeat scroll 50% 50% transparent}';
        if(style){
            style = '<style type="text/css">' + style +'</style>';
            $("head").append(style);
        }
    })();
};