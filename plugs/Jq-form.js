(function ($, f, u) {
    /**
     * 验证规则
     * @type {{}}
     */
    var valid = {
        rules: {
            "require": /[\w\W]+/,
            "mobile": /^1[3458][0-9]{9}$/,
            "email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            "url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
            "number": /^\d+$/
        },
        rulesMsg: {
            "require": "不能为空！",
            "mobile": "请填写手机号码！",
            "email": "请填写邮箱！",
            "url": "请填写网址",
            "number": "请填写数字"
        },
        getValue: function (obj) {
            var val,
                form = this;
            if (obj.is(":radio")) {
                val = form.find(":radio[name='" + obj.attr("name") + "']:checked").val();
            } else if (obj.is(":checkbox")) {
                val = "";
                form.find(":checkbox[name='" + obj.attr("name") + "']:checked").each(function () {
                    val += $(this).val() + ',';
                });
            } else {
                val = obj.val();
            }
            val = (val === u ? "" : val);
            return $.trim(val);
        },
        check: function (form) {
            var $t = $(this),
                ps = $(form).data("valid"),
                opt = $t.data("valid") || $t.attr("data-valid");
            if (!opt) return false;
            if ("string" === typeof opt) {
                opt = eval('(' + opt + ')');
            }
            var rule = ps.rules[opt.type] || new RegExp(opt.type, "gi"),
                value = valid.getValue.call(form, $t),
                $tip = opt.tip ? $(opt.tip) : $t.siblings(".m-form-tip");
            if (!$tip || $tip.length != 1) {
                $t.parent().append("<span class='m-form-tip'></span>");
                $tip = $t.siblings(".m-form-tip");
            }
            if (!rule.test(value)) {
                var msg = opt.msg || ps.rulesMsg[opt.type] || "输入错误！";
                $t.addClass("control-error");
                $tip.removeClass("valid-success").addClass("valid-error").html(msg);
                if (!$(form).data("focus")) {
                    $t.focus();
                    $(top.window || window).scrollTop(0);
                    $(form).data("focus", !f);
                }
                return false;
            }
            $t.removeClass("control-error");
            $tip.removeClass("valid-error").addClass("valid-success").html("");
            return true;
        }
    };

    var validForm = function (forms, options) {
        var opts = $.extend({
            rules: valid.rules,
            rulesMsg: valid.rulesMsg
        }, options || {});
        var $forms = this.forms = $(forms);
        $.each(this.forms, function (i) {
            var $item = $forms.eq(i),
                optionData = $item.data("form") || $item.attr("data-form"),
                ps = $.extend({}, opts);
            if (optionData && "string" === typeof optionData) {
                optionData = eval('(' + optionData + ')');
            }
            if (optionData && "object" === typeof optionData) {
                ps = $.extend(ps, optionData);
            }
            $item.data("valid", ps);
            $item
                .delegate("[data-valid]", "blur", function () {
                    valid.check.call(this, $item);
                })
                .delegate(":text", "press", function (e) {
                    if (13 === e.keyCode && ps.submitFn && "function" === typeof ps.submitFn) {
                        ps.submitFn();
                    }
                });
        });
        return this;
    };
    validForm.prototype = {
        check: function () {
            var r = !f,
                $forms = this.forms;
            $forms.each(function (i) {
                var $form = $forms.eq(i);
                $form.data("focus", f);
                $form.find("[data-valid]").each(function () {
                    if (!valid.check.call(this, $form))
                        r = f;
                });
            });
            return r;
        },
        json: function (i) {
            var $form = this.forms.eq(i || 0),
                formData = {};
            $.each($form.find("[name]"), function () {
                if (!formData.hasOwnProperty(this.name))
                    formData[this.name] = valid.getValue.call($form, $(this));
            });
            return formData;
        },
        serialize: function (i) {
            var json = this.json(i),
                arr = [];
            for (var t in json) {
                arr.push(t + '=' + encodeURI(json[t]));
            }
            return arr.join('&');
        }
    };
    $.fn.extend({
        serializeForm: function (type) {
            var $form = $(this),
                serializeObj = {};
            if ("form" !== $form.get(0).tagName.toLowerCase()) {
                $form = $("<form>").append($form.clone(true));
            }
            if (type && "string" === type) {
                return $form.serialize();
            } else if (type && "array" === type) {
                return $form.serializeArray();
            }
            $($form.serializeArray()).each(function () {
                if (!serializeObj.hasOwnProperty(this.name))
                    serializeObj[this.name] = this.value;
                else
                    serializeObj[this.name] += "," + this.value;
            });
            return serializeObj;
        },
        /**
         * form 表单验证
         */
        valid: function (options) {
            return new validForm(this, options);
        }
    });
})(jQuery, false, undefined);