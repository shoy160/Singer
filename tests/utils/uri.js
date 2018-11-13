var tap = require('tap')
var utils = require('../../lib/utils/uri')

tap.test('uri', function (t) {
    var uri = utils.uri('?a=1&b=2')
    t.equal(uri.a, '1')
    t.equal(uri.b, '2')
    t.end()
})