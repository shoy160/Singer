describe('deps-optimize', function () {
    var optimizer = require('../../lib/optimizer');
    it('works', function () {
        var deps = {
            a: ['b', 'c'],
            b: ['e'],
            e: ['c']
        };
        var optimized = optimizer.optimize(deps);
        expect(optimized).toEqual({
            a: ['b'],
            b: ['e'],
            e: ['c']
        });
    });
});