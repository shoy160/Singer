var hTemplate = window.hTemplate = (function ($, f) {
    String.prototype.replaceAll = function (reg, str) {
        var g = new RegExp(reg, "gi");
        return this.replace(g, str);
    };
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
        container: $(document),
        pager: $(".h-pager"),
        page: 1,
        size: 20,
        total: 0,
        filter:f,       //json数据过滤
        fill:f          //绑定前处理
    };
    var H = function (opt) {
        opt = $.extend(def, opt || {});
        H.prototype.opt = opt;
    };
    H.prototype.set = function (opt) {
        $.extend(this.opt, opt || {});
    };

    H.prototype.fill = function (json) {
        var opt = this.opt;
        if(opt.filter && "function" === typeof opt.filter)
            json = opt.filter(json);
        var str=opt.tmp.fill(json);
        if(opt.fill && "function" === typeof opt.fill)
            str = opt.fill(str,json);
        opt.container.append(str);
    };
    /*
    *   分页
    * */
    H.prototype.pager = function () {
        var opt = this.opt,
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
        if (total >= 1 && total < 9) {
            for (i = 1; i <= total; i++) {
                html += getItem(i);
            }
        } else {
            html += getItem(1);
            if (current - 3 > 1)
                html += '<li><span>...</span></li>';
            for (i = current - 3; i < current + 4; i++) {
                if (i > 1 && i < total)
                    html += getItem(i);
            }
            if (current + 5 < total)
                html += '<li><span>...</span></li>';
            html += getItem(total);
        }
        if (prev) html = '<li><a href="javascript:void(0)" data-act="-1">&laquo;</a></li>' + html;
        if (next) html += '<li><a href="javascript:void(0)" data-act="1">&raquo;</a></li>';
        opt.pager.html("<ul>" + html + "</ul>");
    };
    /*
    *   数据绑定
    * */
    H.prototype.bind = function (json, total) {
        if (!json) return f;
        if ("object" === typeof json) {
            if (json.length && json.length > 0) {
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
    return H;
})(jQuery, false);