/**
 * Created by luoyong on 2015/4/7.
 */
(function (S) {
    S._mix(S, {
        test: function () {
            alert('test');
            console.log(S.currentScript());
        }
    });
})(SINGER);