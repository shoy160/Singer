/*jshint indent:false, quotmark:false*/
modulex.use(['ua', 'feature'], function(UA, Feature){
var mx = modulex;
mx.config("requires",{
    "dom/base": [
        "modulex-util",
        "modulex-ua",
        "modulex-feature",
        "dom/selector"
    ],
    "dom/ie": [
        "dom/base"
    ],
    "anim/base": [
        "dom",
        "promise",
        "util"
    ],
    "anim/timer": [
        "anim/base",
        "feature"
    ],
    "anim/transition": [
        "anim/base",
        "feature"
    ]
});
modulex.config('alias', {
    'modulex-dom': 'dom',
    'dom/selector': Feature.isQuerySelectorSupported() ? '' : 'query-selector',
    dom: [
        'dom/base',
            UA.ieMode < 9 ? 'dom/ie' : ''
    ]
});
modulex.config('alias', {
    'modulex-feature': 'feature'
});
modulex.config('alias', {
    'anim': Feature.getCssVendorInfo('transition') ? 'anim/transition' : 'anim/timer'
});
modulex.config('alias', {
    'modulex-promise': 'event-custom'
});
modulex.config('alias', {
    'modulex-ua': 'ua'
});
modulex.config('alias', {
    'modulex-util': 'util'
});
});