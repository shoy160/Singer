var tap = require('tap')
var utils = require("../../lib/utils/seed");

tap.test('isBoolean', function (t) {
    var isBoolean = utils.isBoolean
    t.equal(isBoolean(0), false)
    t.equal(isBoolean('0'), false)
    t.equal(isBoolean(true), true)
    t.equal(isBoolean(false), true)
    t.end()
})

tap.test('config', function (t) {
    var config = utils.config
    t.equal(config('loggerLevel'), 'debug')
    config('loggerLevel', 'info')
    t.equal(config('loggerLevel'), 'info')
    t.end()
})

tap.test('getLogger', function (t) {
    var logger = utils.getLogger('getLogger')
    logger.debug('debug')
    logger.info('info')
    logger.warn('warn')
    logger.error('error')
    t.end()
})

tap.test('guid', function (t) {
    t.equal(utils.guid(), '1')
    t.equal(utils.guid('t_'), 't_2')
    t.equal(utils.guid('g_'), 'g_3')
    t.end()
})

tap.test('singer', function (t) {
    t.notEqual(utils.default, undefined)
    t.end()
})