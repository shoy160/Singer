(function (V, R, S) {
    if (!V) return;
    var _toDate = function (time) {
        if (time && !S.isDate(time)) {
            try {
                time = new Date(time);
            } catch (e) {}
        }
        return time;
    };
    V.prototype.$http = R.ajax;
    V.prototype.$html = R.html;

    V.prototype.$ticks = function (time) {
        return +_toDate(time);
    };
    V.prototype.$uri = function () {
        return S.uri();
    };
    //Vue表单验证
    if (window.hasOwnProperty('VeeValidate')) {
        //http://vee-validate.logaretm.com/index.html#configuration
        var validator = VeeValidate.Validator;
        // 自定义validate 
        var dictionary = {
            zh_CN: {
                messages: {
                    email: function () {
                        return '请输入正确的邮箱格式';
                    },
                    required: function (field) {
                        return "请输入 " + field;
                    }
                }
            }
        };
        validator.updateDictionary(dictionary);
        //扩展验证规则
        /**
         * 手机号码验证
         */
        validator.extend('mobile', {
            messages: {
                zh_CN: function (field) {
                    return field + ' 必须为11位手机号码';
                }
            },
            validate: function (value) {
                return value.length == 11 && /^(1[2-9]\d{9})$/.test(value);
            }
        });
        var config = {
            locale: 'zh_CN'
        };
        V.use(VeeValidate, config);
    }

    //vue全局过滤器,Vue自带部分通用过滤器，如：filterBy,orderBy等
    /**
     * 时间格式化过滤器
     */
    V.filter('time', function (time, format) {
        return S.formatDate(_toDate(time), format);
    });
    /**
     * Vue分页模版
     */
    V.component('d-pages', {
        template: '<div class="page">' +
            '<div class="poDiWe">共<span v-html="total" style="padding:0 3px;color:#e73d4a"></span>条，每页<select v-model="pageSize" @change="loadPage(current)"><option v-for="s in sizes" :value="s">{{s}}条</option></select></div>' +
            '<a v-bind:class="{disabled:!prev}" @click="prev && loadPage(current-1)">&lt;</a>' +
            '<a v-for="page in pages" :class="{on:page==current}" @click="page!=current && loadPage(page)">{{page}}</a>' +
            '<a :class="{disabled:!next}" @click="next && loadPage(current+1)">&gt;</a>' +
            '</div>',
        props: {
            index: {
                type: Number,
                default: 1,
                required: false,
                validator: function (value) {
                    return value >= 1;
                }
            },
            size: {
                type: Number,
                default: 5,
                required: false,
                validator: function (value) {
                    return value >= 1 && value <= 200;
                }
            },
            sizes: {
                type: Array,
                default: [5, 10, 15, 20],
                reqiure: false,
                validator: function (value) {
                    return value && value.length > 0;
                }
            },
            total: {
                type: Number,
                default: 0,
                required: true,
                validator: function (value) {
                    return value >= 0;
                }
            },
            load: {
                type: Function,
                default: function () {},
                reqiure: true,
                validator: function (value) {
                    return S.isFunction(value);
                }
            }
        },
        data: function () {
            return {
                current: this.index,
                pageSize: this.size
            };
        },
        computed: {
            totalPage: function () {
                return Math.ceil(this.total / this.pageSize);
            },
            prev: function () {
                return this.current > 1;
            },
            next: function () {
                return this.current < this.totalPage;
            },
            pages: function () {
                var pages = [];
                if (this.totalPage < 10) {
                    pages = this.totalPage;
                } else {
                    var start = this.current < 5 ? 1 : Math.min(this.current - 4, this.totalPage - 9);
                    for (var i = 0; i < 10; i++) {
                        if (start + i > this.totalPage) break;
                        pages.push(start + i);
                    }
                }
                return pages;
            }
        },
        methods: {
            loadPage: function (page) {
                page = parseFloat(page);
                if (page <= 0 || page > this.totalPage || (page | 0) !== page) {
                    loadInit.showError('请输入正确的页数');
                    return false;
                }
                this.current = parseInt(page);
                this.load && this.load.call(this, page, this.pageSize);
                return false;
            }
        }
    });

    /**
     * 加载进度条
     */
    V.component('d-loading', {
        template: '<div class="spinner-box-1"><div class="spinner spinner-area"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>'
    });
    /**
     * 无数据页
     */
    V.component('d-nothing', {
        template: '<div class="k-nothing"><img :src="icon" :width="iconWidth" /><p v-html="message"></p></div>',
        props: {
            icon: {
                type: String,
                default: '/assets/images/5555.png',
                required: false
            },
            iconWidth: {
                type: Number,
                default: 100,
                required: false,
                validator: function (value) {
                    return value > 50 && value < 200;
                }
            },
            message: {
                type: String,
                default: '暂时没有数据',
                required: false
            }
        }
    });
    /**
     * h5文件上传组件
     * @param {String} name
     * @param {String} cls
     * @param {String} accept
     * @param {Array} exts
     * @param {String} multiple
     * @param {Function} error
     * @param {Function} add
     * @param {Function} change
     */
    V.component('d-file', {
        template: '<div @click="choose" :class="cls"><input type="file" @change="fileChange" :accept="accept" :name="name" :multiple="multiple" style="display:none" /><slot></slot></div>',
        props: {
            name: {
                type: String
            },
            cls: {
                type: String
            },
            accept: {
                type: String,
                default: '*'
            },
            exts: {
                type: Array,
                required: false,
                validator: function (value) {
                    return S.isArray(value);
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            error: {
                type: Function,
                default: toastr.error,
                reqiure: false,
                validator: function (value) {
                    return S.isFunction(value);
                }
            },
            add: {
                type: Function,
                reqiure: false,
                validator: function (value) {
                    return S.isFunction(value);
                }
            },
            change: {
                type: Function,
                reqiure: false,
                validator: function (value) {
                    return S.isFunction(value);
                }
            }
        },
        methods: {
            choose: function (e) {
                this.$el.firstChild.click();
            },
            fileReader: function (files) {
                if (typeof FileReader === 'undefined') {
                    this.error('您的浏览器不支持图片上传，请升级您的浏览器');
                    return false;
                }
                // var image = new Image();
                var vm = this;
                var leng = files.length;
                for (var i = 0; i < leng; i++) {
                    var reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload = function (e) {
                        vm.add && vm.add.call(vm, e.target.result);
                        //vm.images.push(e.target.result);
                    };
                }
            },
            fileChange: function (e) {
                // debugger;
                //this.$destroy();
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) {
                    this.error('没有选择任何文件');
                    return;
                }
                if (this.exts && this.exts.length) {
                    for (var i = 0; i < files.length; i++) {
                        var ext = S.ext(files[i].name).toLowerCase();
                        if (!S.inArray(ext, this.exts)) {
                            this.error('只能上传扩展名' + this.exts.join(',') + '的文件');
                            return;
                        }
                    }
                }
                if (this.change) {
                    var result = this.change(files);
                    if (!result) return;
                }
                if (this.add) {
                    this.fileReader(files);
                }
            }
        }
    });

    /**
     * 金额格式化友好显示
     */
    Vue.filter('fmoney', function (money, roundToDecimalPlace) {
        roundToDecimalPlace = roundToDecimalPlace > 0 && roundToDecimalPlace <= 20 ? roundToDecimalPlace : 2;
        money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(roundToDecimalPlace) + "";
        if (isNaN(money) || ((money + "").replace(/\s/g, "")) == "") {
            return "";
        }
        var lessZero = false;
        if (money < 0) {
            lessZero = true;
        }
        var l = money.split(".")[0].replace(/-/g, "").split("").reverse(), r = money.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return (lessZero ? "-" : "") + t.split("").reverse().join("") + "." + r;
    });

    /**
     * 全局异常处理
     * @param {} err 
     * @param {} vm 
     * @returns {} 
     */
    V.config.errorHandler = function (err, vm) {
        // handle error
        var logger = S.getLogger('vue error');
        logger.info(err);
        logger.info(vm);
    };
})(Vue, serviceRest, SINGER);