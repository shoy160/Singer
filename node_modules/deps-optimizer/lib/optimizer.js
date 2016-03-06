/**
 * optimize dependency object
 * @author yiminghe@gmail.com
 */
exports.optimize = function (deps) {
    var deepRequiresObj = getDeepRequiresObj(deps);

    var ret = {};
    for (var key in deps) {
        if (deps.hasOwnProperty(key)) {
            var requires = deps[key];
            if (!requires) {
                continue;
            }
            var requiresObj = arrToObj(requires);
            for (var i = 0; i < requires.length; i++) {
                var ir = requires[i];
                if (requiresObj[ir]) {
                    var deepRequires = deepRequiresObj[ir];
                    for (var j = 0; j < requires.length; j++) {
                        var jr = requires[j];
                        if (i !== j && requiresObj[jr]) {
                            if (deepRequires && deepRequires[jr]) {
                                delete requiresObj[jr];
                            }
                        }
                    }
                }
            }
            ret[key] = keys(requiresObj);
        }
    }
    return ret;
};

function arrToObj(arr) {
    var ret = {};
    for (var i = 0; i < arr.length; i++) {
        ret[arr[i]] = 1;
    }
    return ret;
}

function getDeepRequires(deps, modName, ret) {
    ret = ret || {};
    if (!deps[modName]) {
        return ret;
    }
    var requires = deps[modName];
    for (var i = 0; i < requires.length; i++) {
        var r = requires[i];
        if (ret[r]) {
            continue;
        }
        ret[r] = 1;
        getDeepRequires(deps, r, ret);
    }
    return ret;
}

function getDeepRequiresObj(deps) {
    var ret = {};
    for (var key in deps) {
        if (deps.hasOwnProperty(key)) {
            ret[key] = getDeepRequires(deps, key);
        }
    }
    return ret;
}

function keys(obj) {
    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            ret.push(i);
        }
    }
    return ret;
}