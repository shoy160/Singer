/**
 * 简易柱状图
 * Created by shay on 2016/7/21.
 */
(function ($, undefined) {
    var nearMax = function (max) {
        var left = max % 100;
        if (left > 50) max += 100 - left;
        else if (left < 20) max += 20 - left;
        else max += 50 - left;
        return max;
    };
    $.fn.extend({
        chart: function (options) {
            var opts,
                $t = $(this),
                $chart = $('<div class="d-chart">'),
                max = 0,
                total = 0,
                per = 0,
                isVertical;
            if (options.type && options.type == 'percent') {
                opts = $.extend(percentDefault, options || {});
            } else {
                opts = $.extend(defaultOptions, options || {});
            }
            isVertical = (opts.direct == 'v');
            if (isVertical) {
                opts.chartWidth = Math.min((opts.width - 93) / opts.data.length, 70);
            } else {
                opts.chartWidth = Math.min((opts.height) / opts.data.length, 70);
            }
            $t.css({width: opts.width});
            $chart.css({
                height: opts.height
            });
            $.each(opts.data, function (i, item) {
                item.value = parseFloat(item.value);
                if (item.value > max)
                    max = item.value;
                total += item.value;
                var $item = $('<div class="d-chart-item">');
                $item.append('<span>' + opts.labelFormat(item) + '</span>');
                $item.append('<div class="d-chart-box">');
                $item.append('<div class="d-chart-label">' + opts.xFormat(item) + '</div>');
                $item.data('value', item.value);
                if (isVertical) {
                    $item.css({
                        width: opts.chartWidth
                    });
                } else {
                    $item.css({
                        height: opts.chartWidth + "px"
                    });
                }
                $chart.append($item);
            });
            max = opts.max > 0 ? opts.max : nearMax(max);
            var step = 6;
            if (max % 50 == 0) step = 5;
            if (isVertical) {
                $chart.addClass('d-chart-v');
                per = opts.height / max;
            } else {
                $chart.addClass('d-chart-h');
                per = (opts.width - 90) / max;
            }
            var $steps = $('<div class="d-chart-steps">');
            for (var i = 0; i < step; i++) {
                var $step = $('<div class="d-chart-step">'),
                    stepValue = (i + 1) * (max / step);
                if (isVertical) {
                    $step.css({
                        bottom: stepValue * per - 3
                    }).append('<span>' + opts.yFormat(stepValue) + '</span>');
                } else {
                    $step.css({
                        left: stepValue * per - 3
                    }).append('<span>' + opts.yFormat(stepValue) + '</span>');
                }
                $steps.append($step);
            }
            if (opts.showAverage) {
                if (typeof opts.average == 'undefined') {
                    opts.average = (total / opts.data.length).toFixed(2);
                }
                var $averageStep = $('<div class="d-chart-step d-average">');
                if (isVertical) {
                    $averageStep.css({
                        bottom: opts.average * per
                    }).append('<span>' + opts.averageFormat(opts.average) + '</span>');
                } else {
                    $averageStep.css({
                        left: opts.average * per
                    }).append('<span>' + opts.averageFormat(opts.average) + '</span>');
                }
            }
            $steps.append($averageStep);
            $chart.append($steps);
            var $wrap = $('<div class="d-chart-wrap">');
            $wrap.append($chart);
            $t.append($wrap);

            $t.find('.d-chart-item')
                .each(function (i, item) {
                    var $item = $(item),
                        value = $item.data('value'),
                        diff,
                        $diff;
                    if (opts.showAverage) {
                        diff = (value - opts.average).toFixed(2);
                        $diff = $('<div class="d-chart-diff">' + opts.tipFormat(diff) + '</div>');
                        if (diff > 0) {
                            $diff.addClass('d-diff-success');
                        }
                        var left = (opts.chartWidth - 60) / 2;
                        $diff.css({
                            left: left
                        });
                    }

                    if (value < opts.average)
                        $item.addClass('d-chart-danger');
                    var h = per * value;
                    if (opts.direct == 'v') {
                        $item.find('span').animate({
                            bottom: h + 5
                        }, opts.speed);
                        $diff && $diff.css({
                            bottom: h + 5
                        });
                        $item.find('.d-chart-box').animate({
                            height: h - 3
                        }, opts.speed);
                    } else {
                        $item.find('span').animate({
                            left: h + 5
                        }, opts.speed);
                        $diff && $diff.css({
                            left: h + 5
                        });
                        $item.find('.d-chart-box').animate({
                            width: h
                        }, opts.speed);
                    }
                    if (opts.showAverage) {
                        $item.append($diff);
                    }
                });
        }
    });
    var defaultOptions = {
        data: [],
        direct: 'v',
        showAverage: true,
        average: undefined,
        chartWidth: 70,
        speed: 1500,
        width: 300,
        height: 200,
        max: 0,
        xFormat: function (data) {
            return data.name;
        },
        yFormat: function (value) {
            return value;
        },
        labelFormat: function (data) {
            return data.value;
        },
        averageFormat: function (average) {
            return '平均分 ' + average;
        },
        tipFormat: function (value) {
            return (value > 0 ? '+' + value : value) + '分'
        }
    };
    var percentDefault = $.extend({}, defaultOptions, {
        showAverage: false,
        yFormat: function (value) {
            return value + '%';
        },
        labelFormat: function (data) {
            return data.value + '%';
        },
        tipFormat: function (value) {
            return (value > 0 ? '+' + value : value) + '%';
        },
        averageFormat: function (average) {
            return '平均 ' + average + '%';
        }
    });
})(jQuery);