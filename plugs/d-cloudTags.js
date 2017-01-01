/**
 * 3D±Í«©‘∆
 * Created by shay on 2016/8/2.
 */
(function ($, undefined) {
    $.fn.extend({
        /**
         * ±Í«©‘∆
         */
        cloudTags: function () {
            var $tags = $(this).find('.cloud-item'),
                $tag;
            $tags.each(function (item) {
                $tag = $(item);
            });
        }
    })
})(jQuery);