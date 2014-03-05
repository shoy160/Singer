/**
 * Uri
 */
(function(S,undefined){
    S.uri = function (uri) {
        var q = [], qs;
        qs = (uri ? uri + "" : location.search);
        if (qs.indexOf('?') >= 0) {
            qs = qs.substring(1);
        }
        if (qs) {
            qs = qs.split('&');
        }
        if (qs.length > 0) {
            for (var i = 0; i < qs.length; i++) {
                var qt = qs[i].split('=');
                q[qt[0]] = decodeURIComponent(qt[1]);
            }
        }
        return q;
    };
    return S;
})(SINGER);