/*
 * hTemplate js模板
 */
var hTemplate = window.hTemplate = (function ($, f) {
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (reg, str) {
            var g = new RegExp(reg, "gi");
            return this.replace(g, str);
        };
    }
    String.prototype.bind = function (name, value) {
        if (isNaN(value))
            value = value || "";
        return this.replaceAll('\\{' + name + '\\}', value);
    };
    String.prototype.fill = function (json) {
        if ("object" !== typeof json)
            return "";
        var t = this;
        for (var s in json) {
            var value = json[s];
            t = t.bind(s, value);
        }
        t = t.bind("[^}]+", "");
        return t;
    };
    String.prototype.format = function () {
        if (arguments.length <= 0) return this;
        var result = this,
            type = function (obj) {
                return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
            };
        if (1 === arguments.length && "object" === type(arguments[0])) {
            for (var key in arguments[0]) {
                var reg = new RegExp("\\{\\{" + key + "\\}\\}", "gi");
                result = result.replace(reg, arguments[0][key]);
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gi");
                result = result.replace(reg, arguments[i]);
            }
        }
        //未绑定的默认以空字符填充
        reg = new RegExp("(\\{[0-9]+\\})|(\\{\\{[0-9a-z]+\\}\\})", "gi");
        result = result.replace(reg, "");
        return result;
    };
    var def = {
            tmp: '',
            empty: '',
            container: $(document),
            pager: $(".h-pager"),
            page: 1,
            size: 20,
            total: 0,
            filter: f,       //json数据过滤,返回json数据
            fill: f,          //绑定前处理,返回字符串
            pageClick: f,     //页面点击事件
            complete: f        //完成绑定事件
        },
        pagerTmp = '<li class="{{class}}"><a data-act="{{act}}" href="#">{{page}}</a></li>';
    var H = function (option) {
        option = $.extend({}, def, option);
        this.opt = option;
        this.set = function (option) {
            this.opt = $.extend({}, this.opt, option);
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
                    return pagerTmp.format({"class": (n === current ? "active" : ""), "page": n});
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
                    html += pagerTmp.format({"class": "disabled", "page": "..."});
                for (i = current - 3; i < current + 4; i++) {
                    if (i > 1 && i < total)
                        html += getItem(i);
                }
                if (current + 4 < total)
                    html += pagerTmp.format({"class": "disabled", "page": "..."});
                html += getItem(total);
            }
            html = pagerTmp.format({"class": (prev ? "" : "disabled"), "page": "&laquo;", "act": (prev ? -1 : 0)}) + html;
            html += pagerTmp.format({"class": (next ? "" : "disabled"), "page": "&raquo;", "act": (next ? 1 : 0)});
            opt.pager.html("<ul>" + html + "</ul>");
            opt.pager.find("ul li a").bind("click.hPager", function () {
                var $t = $(this),
                    $p = $t.parent();
                if ($p.hasClass("active") || $p.hasClass("disabled")) return false;
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
            var complete = this.opt.complete;
            if (!json || (json instanceof Array && !json.length)) {
                if (!append) this.empty();
                complete && "function" === typeof complete && complete.apply();
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
            complete && "function" === typeof complete && complete.apply();
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