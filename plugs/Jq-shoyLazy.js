/*
 shoyLazy v1.0.0
 需引用jQuery
 */
(function (S) {
    var def = {
        lazySrc: 'h-src',
        prePix: 100,
        auto: false,
        loadClass: 'img-loading'
    };
    S.prototype.shoyLazy = function (opt) {
        opt = S.extend(def, opt);
        var t = S(this), w = S(window), d = S(document), getTop, lazyScroll, lazyShow, preTop = 0, domHeight, unLazy;
        /**
         * 取消延迟加载事件绑定
         */
        unLazy = function () {
            w.unbind("scroll.shoyLazy resize.shoyLazy");
        };
        /**
         * 获取元素加载高度
         * @param obj
         * @returns {*}
         */
        getTop = function (obj) {
            var b = S(obj);
            if (opt.loadClass)
                b.addClass(opt.loadClass);
            var top = 0;
            while (top <= 0) {
                top = parseInt(b.offset().top);
                b = b.parent();
            }
            obj.lazySrc = opt.lazySrc;
            obj.lazyTop = top;
            return obj
        };
        /**
         * 加载图片
         * @param obj
         */
        lazyShow = function (obj) {
            obj.setAttribute("src", obj.getAttribute(obj.lazySrc));
            obj.removeAttribute(obj.lazySrc);
            S(obj).bind("load.shoyLazy", function () {
                S(this).removeClass(opt.loadClass);
            });
        };
        /**
         * 滚动事件
         */
        lazyScroll = function () {
            var height =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight, i;
            height += w.scrollTop() + opt.prePix;
            if (height < preTop) return;
            preTop = height;
            if (!lazyDoms.length) {
                unLazy();
                return;
            }
            if (domHeight - opt.prePix < height) {
                for (i = 0; i < lazyDoms.length; i++) {
                    lazyShow(lazyDoms[i]);
                }
                lazyDoms.splice(0);
                unLazy();
                return;
            }
            for (i = 0; i < lazyDoms.length; i++) {
                if (lazyDoms[i].lazyTop < height) {
                    lazyShow(lazyDoms[i]);
                    lazyDoms.splice(i--, 1);
                }
            }
        };
        d.ready(function () {
            unLazy();
            if (!window.lazyDoms || !window.lazyDoms.length)
                window.lazyDoms = [];
            t.each(function () {
                if ("img" === this.tagName.toLowerCase() && this.getAttribute(opt.lazySrc)) {
                    lazyDoms.push(getTop(this));
                }
            });
            domHeight = d.height();
            w.bind("scroll.shoyLazy resize.shoyLazy", function () {
                lazyScroll();
            });
            if (opt.auto)
                lazyScroll();
        });
    };
})(jQuery);