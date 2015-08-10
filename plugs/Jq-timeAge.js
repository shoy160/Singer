/**
 * Created by shoy on 2015/8/10.
 */
var timeData = [{
    time: '2015-07-26 18:05:00',
    icon: 'fa fa-pencil',
    bgColor: 'ta-primary',
    content: {
        type: 'words',
        title: '文章',
        words: '文章内容'
    }
}, {
    time: '2015-06-26 18:05:00',
    icon: 'fa fa-quote-right',
    bgColor: 'ta-warning',
    content: {
        type: 'quote',
        quote: '人固有一死，或轻于鸿毛，或重于泰山！',
        author: '弗罗多'
    }
}, {
    time: '2015-08-26 18:05:00',
    type: 'picture',
    icon: 'fa fa-camera',
    bgColor: 'ta-success',
    content: {
        type: 'picture',
        title: '美丽景色',
        pictures: ['http://www.zi-han.net/theme/se7en/images/img-coast.jpg'],
        words: '描述'
    }
}, {
    time: '2015-08-26 15:05:00',
    icon: 'fa fa-video-camera',
    bgColor: 'ta-danger',
    content: {
        type: 'video',
        title: '热门视频',
        video: 'http://player.youku.com/embed/XNjMxNzk4Mjk2',
        words: '描述'
    }
}, {
    time: '2013-06-13 14:00',
    icon: 'fa fa-clock-o',
    bgColor: 'ta-primary',
    content: {
        type: 'moment',
        title: '我们领证啦！',
        words: '2013年6月13日，爱你一生又一生！'
    }
}, {
    time: '2011-08-08 19:00',
    icon: 'fa fa-clock-o',
    bgColor: 'ta-success',
    content: {
        type: 'moment',
        title: '我们相恋啦！',
        words: '2011年8月8日，属于我们的纪念日！'
    }
}];
(function ($, S) {
    S._mix(S, {
        date: function (str) {
            return new Date(str.replace(/-/gi, '/'));
        },
        padLeft: function (str, len) {
            var i = (str + '').length;
            while (i < len) {
                str = '0' + str;
                i++;
            }
            return str;
        },
        /**
         * 延迟加载
         * @param options
         */
        lazyLoad: function (options) {
            var opts = $.extend({
                items: $('.shoy-lazy'),
                preHeight: 50,
                loaded: undefined
            }, options || {});
            var $w = $(window),
                preTop = 0,
                height,
                top, getTop, i,
                lazyList = [];
            getTop = function (obj) {
                var b = $(obj);
                var top = 0;
                while (top <= 0) {
                    top = parseInt(b.offset().top);
                    b = b.parent();
                }
                obj.lazyTop = top;
                return obj
            };
            opts.items.each(function () {
                lazyList.push(getTop(this));
            });
            var unLazy = function () {
                $w.unbind("scroll.shoyLazy resize.shoyLazy");
            };
            var lazy = function () {
                height = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;
                top = height + $w.scrollTop() + opts.preHeight;
                if (top < preTop) return;
                if (!lazyList.length) {
                    unLazy();
                    return;
                }
                if ($(document).height() - opts.preHeight < top) {
                    for (i = 0; i < lazyList.length; i++) {
                        opts.loaded && opts.loaded.call(this, lazyList[i]);
                    }
                    lazyList.splice(0);
                    unLazy();
                    return;
                }
                for (i = 0; i < lazyList.length; i++) {
                    if (lazyList[i].lazyTop < top) {
                        opts.loaded && opts.loaded.call(this, lazyList[i]);
                        lazyList.splice(i--, 1);
                    }
                }
                preTop = top;
            };
            $w.bind("scroll.lazy resize.lazy", function () {
                lazy();
            });
            lazy();
        },
        /**
         * 时间轴
         * @param options
         */
        timeAge: function (options) {
            var opts = $.extend({
                container: $('.ta-time-age'),
                activeClass: 'ta-active',
                template: 'timeAge'
            }, options || {});
            /**
             * 时间显示
             */
            template.helper('dateFormat', function (date) {
                date = S.date(date);
                var now = new Date(), format, dateObj;
                dateObj = {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    date: S.padLeft(date.getDate(), 2),
                    hour: date.getHours(),
                    minute: S.padLeft(date.getMinutes(), 2)
                };
                if (dateObj.year == now.getFullYear()) {
                    format = '<span>{month}月{date}日</span><strong>{hour}:{minute}</strong>';
                } else {
                    format = '<span><em>{year}</em>年{month}月{date}日</span><strong>{hour}:{minute}</strong>';
                }
                return singer.format(format, dateObj);
            });
            var html = template(opts.template, {
                list: timeData.sort(function (a, b) {
                    return S.date(a.time) < S.date(b.time);
                })
            });
            opts.container.append(html);
            S.lazyLoad({
                items: opts.container.find('li'),
                preHeight: -500,
                loaded: function (obj) {
                    $(obj).addClass(opts.activeClass);
                }
            });
        }
    });
    S.timeAge();
})(jQuery, SINGER);