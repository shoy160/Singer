var hTemplate = window.hTemplate = (function ($, f) {
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (reg, str) {
            var g = new RegExp(reg, "gi");
            return this.replace(g, str);
        };
    }
    String.prototype.bind = function (name, value) {
        value = value || "";
        return this.replaceAll('\\{' + name + '\\}', value);
    };
    String.prototype.fill = function (json) {
        if ("object" !== typeof json)
            return "";
        var t = this;
        for (var s in json) {
            var value = json[s] || "";
            t = t.bind(s, value);
        }
        t = t.bind("[^}]+", "");
        return t;
    };
    var def = {
        tmp: '',
        empty: '',
        container: $(document),
        pager: $(".h-pager"),
        page: 1,
        size: 20,
        total: 0,
        filter: f,       //json数据过滤
        fill: f,          //绑定前处理
        pageClick: f     //页面点击事件
    };
    var H = function (option) {
        option = $.extend(def, option || {});
        this.opt = option;
        this.set = function (option) {
            $.extend(this.opt, option || {});
        };
        this.fill = function (json) {
            var opt = this.opt;
            if (opt.filter && "function" === typeof opt.filter)
                json = opt.filter(json);
            var str = opt.tmp.fill(json);
            if (opt.fill && "function" === typeof opt.fill)
                str = opt.fill(str, json);
            opt.container.append(str);
        };
        this.pager = function () {
            var opt = this.opt,
                h = this,
                current = opt.page,
                size = opt.size,
                total = Math.ceil(opt.total / size) || 1;
            if (current <= 0) current = 1;
            if (current > total) current = total;
            if (total <= 0) total = 1;
            var html = "",
                prev = !f,
                next = !f,
                getItem = function (n) {
                    return '<li' + (n == current ? ' class="active"' : "") + '><a href="javascript:void(0)">' + n + '</a></li>';
                };
            if (1 == current) prev = f;
            if (current == total) next = f;
            var i;
            if (1 === total) {
                opt.pager.html("");
                return f;
            } else if (total > 1 && total < 9) {
                for (i = 1; i <= total; i++) {
                    html += getItem(i);
                }
            } else {
                html += getItem(1);
                if (current - 4 > 1)
                    html += '<li><span>...</span></li>';
                for (i = current - 3; i < current + 4; i++) {
                    if (i > 1 && i < total)
                        html += getItem(i);
                }
                if (current + 4 < total)
                    html += '<li><span>...</span></li>';
                html += getItem(total);
            }
            if (prev) html = '<li><a href="javascript:void(0)" data-act="-1">&laquo;</a></li>' + html;
            if (next) html += '<li><a href="javascript:void(0)" data-act="1">&raquo;</a></li>';
            opt.pager.html("<ul>" + html + "</ul>");
            opt.pager.find("ul li a").bind("click.hPager", function () {
                var $t = $(this);
                if ($t.parent().hasClass("active")) return false;
                var page = ~~opt.pager.find(".active a").html();
                var act = ~~$t.data("act");
                if (act)
                    page = page + act;
                else {
                    page = ~~$t.html();
                }
                h.set({page: page});
                opt.pageClick && "function" === typeof opt.pageClick && opt.pageClick(page);
                h.pager();
                return false;
            });
        };
        this.bind = function (json, total, append) {
            if (!json || (json instanceof Array && !json.length)) {
                if (!append) this.empty();
                return f;
            }
            if (!append) this.clear();
            if ("object" === typeof json) {
                if (json instanceof Array) {
                    for (var i = 0; i < json.length; i++) {
                        this.fill(json[i]);
                    }
                } else {
                    this.fill(json);
                }
            }
            this.set({total: total});
            this.pager();
            return f;
        };
        this.clear = function () {
            this.opt.container.html("");
        };
        this.empty = function (json) {
            var str = this.opt.empty.fill(json || {msg: "没有找到相关记录！"});
            this.opt.container.html(str);
        };
    };
    return H;
})(jQuery, false);