var tap = require('tap')
var lang = require('../../lib/lang/object.js')

tap.test('keys', function (t) {
    var keys = lang.keys({
        a: 1,
        b: 2
    })
    t.equal(keys[0], 'a')
    t.equal(keys.length, 2)
    t.end()
})
var m1 = {
    a: 2,
    c: {
        d: 1
    }
}
var m2 = {
    a: 3,
    b: 2,
    c: {
        d: 2,
        e: 1
    }
}
tap.test('mix', function (t) {
    var m = lang.mix(m1, m2)
    t.equal(m.a, 3)
    t.equal(m.b, 2)
    t.equal(m.c.d, 2)
    t.equal(m.c.e, 1)
    t.end()
})

tap.test('clone', function (t) {
    var m = lang.clone(m2)
    m.a = 2
    m.c.d = 5
    t.equal(m2.a, 3)
    t.equal(m2.c.d, 2)
    t.end()
})