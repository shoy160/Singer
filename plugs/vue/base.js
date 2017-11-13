//全局参数
//webapi主机名
// var apiHost = "http://192.168.11.29:8086";
var apiHost = "http://192.168.33.181:8055";
// var apiHost = "http://api.jingyu.shay.com";
/**
 * url参数化
 * @param {*} jsonParam 
 */
var serviceRest = (function () {
   
    var _urlParam = function (jsonParam) {
        var dataArr = [];
        for (var attr in jsonParam) {
            if (!jsonParam.hasOwnProperty(attr))
                continue;
            dataArr.push(attr + "=" + jsonParam[attr]);
        }
        return dataArr.join('&');
    };
    var _extend = function (source, target) {
        if (!source) return target;
        for (var attr in source) {
            if (!source.hasOwnProperty(attr) || target.hasOwnProperty(attr))
                continue;
            target[attr] = source[attr];
        }
        return target;
    };
    if (!Object.hasOwnProperty('keys')) {
        Object.keys = function (obj) {
            var keys = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k))
                    keys.push(k);
            }
            return keys;
        };
    }
    var _cache = (function () {
        var storage = window.localStorage || {
            setItem: function (key, value) {

            },
            getItem: function (key) {

            },
            removeItem: function (key) {

            }
        };
        return {
            set: function (key, value) {
                storage.setItem(key, JSON.stringify(value));
            },
            get: function (key) {
                var str = storage.getItem(key);
                return JSON.parse(str);
            },
            remove: function (key) {
                storage.removeItem(key);
            }
        };
    })();
    /**
     * 异步请求(type, url, data,files, headers, success, error)
     * @param {object} options 
     */
    var _request = function (options) {
        options = _extend({
            //type, url, data,files, headers, success, error
            type: 'GET',
            success: function () {},
            error: function () {}
        }, options || {});
        var requestObj, sendData = '',
            headers;
        headers = _extend({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, options.headers || {});
        var _isJson = 'text/html' !== headers.Accept,
            _hasData = options.data && Object.keys(options.data).length > 0;

        if ('GET' === options.type && _hasData) {
            if (options.url.indexOf('?') > 0)
                options.url += '&' + _urlParam(options.data);
            else
                options.url += '?' + _urlParam(options.data);
        } else {
            if (options.files && options.files.length) {
                delete headers["Content-Type"];
                sendData = new FormData();
                for (var i = 0; i < options.files.length; i++) {
                    var file = options.files[i];
                    sendData.append("file" + i, file, file.name);
                }
                if (_hasData) {
                    for (var attr in options.data) {
                        if (!options.data.hasOwnProperty(attr))
                            continue;
                        sendData.append(attr, options.data[attr]);
                    }
                }
            } else if (_hasData) {
                if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                    sendData = _urlParam(options.data);
                } else {
                    sendData = JSON.stringify(options.data);
                }
            }
        }

        var token = _cache.get('token');
        if (token && token.hasOwnProperty('access_token')) {
            //加入身份验证
            headers.Authorization = token.token_type + ' ' + token.access_token;
        }

        //fetch
        if (window.hasOwnProperty('fetch')) {
            var requestConfig = {
                credentials: 'include', //请求携带cookie
                method: options.type,
                headers: headers,
                mode: "cors",
                cache: "force-cache"
            };

            if ('GET' !== options.type) {
                Object.defineProperty(requestConfig, 'body', {
                    value: sendData
                });
            }
            fetch(options.url, requestConfig)
                .then(function (result) {
                    if (result.status >= 200 && result.status < 300) {
                        return result;
                    }
                    var error = new Error(result.statusText);
                    error.response = result;
                    throw error;
                })
                .then(function (result) {
                    if (_isJson) {
                        result.json().then(function (json) {
                            options.success.call(this, json);
                        });
                    } else {
                        result.text().then(function (html) {
                            options.success.call(this, html);
                        });
                    }
                })
                .catch(function (e) {
                    options.error.call(this, {
                        Status: (e.response && e.response.status) || -1,
                        Message: e.message
                    });
                });
            return;
        }
        //传统Ajax
        if (window.XMLHttpRequest) {
            requestObj = new XMLHttpRequest();
        } else {
            requestObj = new ActiveXObject();
        }
        requestObj.open(options.type, options.url, true);
        Object.keys(headers).forEach(function (key) {
            requestObj.setRequestHeader(key, headers[key]);
        });
        requestObj.send(sendData);
        requestObj.onreadystatechange = function () {
            if (4 === requestObj.readyState) {
                if (200 === requestObj.status) {
                    var obj = requestObj.response;
                    if (_isJson) {
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                    }
                    options.success.call(requestObj, obj);
                } else {
                    options.error.call(this, {
                        Status: requestObj.status,
                        Message: requestObj.statusText
                    });
                }
            }
        };
    };
    /**
     * 异步请求方法
     * @param {*} method 
     * @param {*} api 
     * @param {*} data 
     * @param {*} successFn 
     * @param {*} errorFn 
     * @param {*} headers 
     */
    var ajax = function (method, api, data, successFn, errorFn, headers) {
        var files = [];
        if ('object' === typeof method) {
            api = method.url;
            data = method.data || {};
            files = method.files || [];
            successFn = method.success;
            errorFn = method.error;
            headers = method.headers;
            method = method.type || 'get';
        }
        if (!api) {
            console.error('param "api" is need!');
            return false;
        }
        method = (method || 'get').toUpperCase();
        var url = api;
        if (api.indexOf('.html') < 0) {
            if ('/' !== apiHost.substr(apiHost.length - 1, 1))
                apiHost += '/';
            url = apiHost + api;
        }
        // console.log(method + '  ' + url);
        //请求
        //type, url, data, headers, success, error
        _request({
            type: method,
            url: url,
            data: data,
            files: files,
            headers: headers,
            success: function (json) {
                if ('String' === typeof json) {
                    successFn && successFn.call(this, json);
                } else {
                    if (json.hasOwnProperty('Status') && 1 !== json.Status) {
                        if (20002 === json.Status || 20001 == json.Status) {
                            var message = 20001 == json.Status ? "您的账号已在其它地方登录" : "您还没有登录系统，请先登录";
                            toastr && toastr.error(message, '系统提示', {
                                onHidden: function () {
                                    _cache.remove('user');
                                    _cache.remove('token');
                                    location.href = "/login";
                                }
                            });
                            return;
                        }
                        if (errorFn) {
                            errorFn.call(this, json);
                        } else {
                            toastr && toastr.error(json.Message);
                        }
                        return false;
                    }
                    successFn && successFn.call(this, json.hasOwnProperty('Data') ? json.Data : json);
                }
            },
            error: function (json) {
                if (errorFn) {
                    errorFn.call(this, json);
                } else {
                    toastr && toastr.error(json.Message, '请求异常');
                }
            }
        });
    };
    var html = function (url, params, successFn) {
        ajax('get', url, params, successFn, null, {
            'Accept': 'text/html',
            "Content-Type": 'text/html'
        });
    };
    //获取用户信息
    if ('/login/' === location.pathname) {
        _cache.remove('token');
        _cache.remove('user');
    }

    return {
        cache: _cache,
        _mix: function (target, resource) {
            for (var name in resource) {
                if (resource.hasOwnProperty(name))
                    target[name] = resource[name];
            }
        },
        ajax: ajax,
        html: html,
        get: function (api, param, succFn, errorFn) {
            ajax('get', api, param, succFn, errorFn);
        },
        post: function (api, param, succFn, errorFn, headers) {
            ajax('post', api, param, succFn, errorFn, headers);
        },
        put: function (api, param, succFn, errorFn, headers) {
            ajax('put', api, param, succFn, errorFn, headers);
        },
        del: function (api, param, succFn, errorFn, headers) {
            ajax('delete', api, param, succFn, errorFn, headers);
        },
        /**
         * 退出登录
         */
        logout: function () {
            ajax('post', 'api/v1/account/logout', null, function (json) {
                _cache.remove('user');
                _cache.remove('token');
                location.href = '/login/';
            });
        }
    };
})();