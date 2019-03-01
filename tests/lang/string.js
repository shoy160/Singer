var tap = require('tap')
var lang = require('../../lib/lang/string.js')

tap.test('trim', function (t) {
    var str = lang.trim(' ddsfd ddfs ')
    t.equal(str, 'ddsfd ddfs')
    t.end()
})
var word = '12345中国'
tap.test('lenCn', function (t) {
    var len = lang.lenCn(word)
    t.equal(len, 9)
    t.end()
})

tap.test('subCn', function (t) {
    var str = lang.subCn(word, 7, '.')
    t.equal(str, '12345中.')
    t.end()
})

tap.test('clearTags', function (t) {
    var str = '<a href="javascript:void(0)">aaa</a>'
    str = lang.clearTags(str)
    t.equal(str, 'aaa')
    t.end()
})

tap.test('isMobile', function (t) {
    t.equal(lang.isMobile('13545654784'), true)
    t.equal(lang.isMobile('11545654784'), false)
    t.end()
})

tap.test('substitute', function (t) {
    var str = lang.substitute('key:{key},value:{value}', {
        key: 'shay',
        value: 'handsome'
    })
    t.equal(str, 'key:shay,value:handsome')
    t.end()
})

tap.test('ucFirst', function (t) {
    t.equal(lang.ucFirst('mobile'), 'Mobile')
    t.end()
})

tap.test('startsWith', function (t) {
    t.equal(lang.startsWith(word, '123'), true)
    t.end()
})

tap.test('endsWith', function (t) {
    t.equal(lang.endsWith(word, '中国'), true)
    t.end()
})

tap.test('format', function (t) {
    var str = lang.format('key:{0},value:{1}', 'shay', 'handsome')
    var str1 = lang.format('key:{key},value:{value}', {
        key: 'shay',
        value: 'handsome'
    })
    t.equal(str, str1)
    t.end()
})

tap.test('padLeft', function (t) {
    var str = lang.padLeft('12', 5, '0')
    t.equal(str, '00012')
    t.end()
})

tap.test('padRight', function (t) {
    var str = lang.padRight('12', 5, '0')
    t.equal(str, '12000')
    t.end()
})

tap.test('compare', function (t) {
    var str = lang.compare('Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定dev Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。', 'Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。')
    console.log(str)
    t.end()
})