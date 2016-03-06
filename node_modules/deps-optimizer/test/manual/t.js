var optimizer = require('../../lib/optimizer');
var deps = {
    a: ['b', 'c'],
    b: ['e'],
    e: ['c']
};
var optimized = optimizer.optimize(deps);

console.log(optimized);
