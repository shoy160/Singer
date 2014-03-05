(function ($) {
    var def = {
        max: 5,
        init: 3
    };
    $.fn.stars = function (opt) {
        var o = $.extend(def, opt || {}),
            $t = $(this);
        var cf, df = $t.data("config");
        if (df) cf = eval("(" + df + ")");
        if ("object" === typeof cf)
            o = $.extend(o, cf || {});

    };
})(jQuery);