var tap = require('tap')
var utils = require('../../lib/utils/ua')
tap.test('ua', function (t) {
    var ua = utils.UA('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')    
    t.equal(ua.chrome, 67.0339699)
    t.end()
})