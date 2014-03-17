(function ($, f) {
    $.fn.getData = function (name) {
        var data = $(this).data(name);
        if (data && "string" === typeof data)
            return eval("(" + data + ")");
        return data || {};
    };
    $.fn.form = function () {
        var $inputs = $(this).find("input[name]"),
            verify = function (input) {
                var $t = $(input),
                    rules = $t.getData("rules"),
                    messages = $t.getData("messages");

                var inputValue = $t.val();
                if (rules.require && inputValue == "") {
                    var error = $t.data("error");
                    if (!error) {
                        error = '<span class="form-error">' + (messages.require || '不可为空！') + '</span>';
                        $t.data("error", error).after(error);
                    }
                    return f;
                }
                return !f;
            };
        $inputs.bind("blur.form", function () {
            verify(this);
        });
        this.verify = function () {
            var result = !f;
            $inputs.each(function () {
                if (!verify(this) && result)
                    result = f;
            });
            return result;
        };
        return this;
    };
})(jQuery, false);