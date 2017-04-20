function chartHourglass(settings) {

    var self = this;

    chartBase(self);

    initialize();

    self.name = 'hourglass';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                meta: {
                    maskId: 'charts-hourglass-mask'
                },
                layout: {
                    rows: {
                        count: 4,
                        border: {
                            width: 2,
                            color: ChartsManager.defaults.backColor
                        }
                    }
                },
                bars: {
                    title: {
                        dy: 0
                    },
                    title2: {
                        dy: 0
                    },
                    legend: {
                        isVisible: true,
                        icon: {
                            height: 0
                        },

                        height: 20
                    },
                    margin: {
                        left: 0,
                        top: 0,
                        bottom: 0,
                        right: 0
                    }
                }
            };

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }

            d.bars.maxValue = 100;
            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        
        self.initializeLayout(_opts);

        self._svg.attr('class', 'chart-' + self.name);

        self._gr = self._layout.append('g');

        self._c = self._layout.append('g');//.attr('transform', 'translate(' + _opts.axis.y.text.width + ', ' + 0 + ')');
        self._x = self._layout.append('g');

        self._f = self._layout.append('g');

        self.xScale = d3.scale.ordinal()
            .domain(d3.range(0, self.data.length * 1))
            .rangeBands([0, self.w]);
//            .rangeBands([0, !_opts.isVertical ? self.w - _opts.axis.y.text.width : self.h - _opts.axis.x.text.height]);

        var d = [];
        _.each(self.data, function (el) {
            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }

        var yMax = self.maxValue || .001;
        yMax *= _opts.bars.maxValueRangeMultiplier;
        self.maxRangeValue = yMax;
        var barsHeight = self.h - _opts.bars.legend.height;
//        self.yScale = d3.scale.linear()
//            .domain([0, yMax])
//            .range([0, barsHeight]);
            //.range([0, self.h - _opts.axis.x.text.height]);


        // bars mask definition
        var clipPath = self._svg.append('defs')
            .append('clipPath')
            .attr('id', _opts.meta.maskId);


//        w = 40.735;
//        h = 91.184;

        clipPath.append('path')
            .attr('d', 'M37.794,73.908c-0.477-2.67-0.68-4.75-2.023-8.313c-1.074-2.848-2.221-4.652-3.969-7.656c-0.487-0.837-1.856-2.716-2.521-3.51c-1.511-1.806-0.996-1.182-2.167-2.333c-1.38-1.357,0,0-2.417-2.333c-0.301-0.291-3.93-3.038-4.331-2.917c-3.126,0.946-9.434,9.037-9.434,9.037c-0.691,0.866-1.248,1.832-1.852,2.762c-3.419,5.27-5.413,11.254-5.84,19.23c-0.318,5.898,1.234,7.744,2.065,8.308c1.167,1.054,2.87,1.513,5.182,1.519c3.529,0.01,7.013,0.004,10.542,0c3.899-0.002,7.363-0.002,11.262-0.115c2.411-0.068,4.304-1.688,5.095-3.81c0.012-0.021,0.033-0.039,0.044-0.06C38.344,82.013,38.124,75.744,37.794,73.908z');
//            .attr('fill', color || '#af1f23');
    }

    function drawHourglass(g, color, dynamicColor) {
//        w = 40.735;
//        h = 91.184;
        g.append('path')
            .attr('d', 'M20.393,0.021C16.582,0.02,12.771-0.032,8.962,0.032c-5.218,0.09-8.361,3.243-8.596,8.641c-0.62,14.21,4.291,25.94,14.694,35c2.005,1.748,1.663,2.31-0.099,3.862C4.513,56.734-0.352,68.566,0.388,82.882c0.245,4.744,3.285,8.082,7.857,8.174c8.175,0.169,16.356,0.17,24.531,0.004c4.674-0.096,7.681-3.496,7.903-8.446c0.645-14.319-4.278-26.132-14.795-35.24c-1.925-1.667-1.499-2.251,0.109-3.663C36.358,34.597,41.286,22.9,40.686,8.691c-0.226-5.379-3.382-8.567-8.585-8.658C28.2-0.033,24.296,0.021,20.393,0.021zM20.638,89.539c-3.715,0-7.431,0.015-11.146-0.002c-5.218-0.023-7.731-2.48-7.817-7.98C1.46,67.562,6.557,56.14,17.159,47.607c2.029-1.633,2.289-2.264,0.071-4.035C6.423,34.93,1.321,23.307,1.7,9.083c0.132-4.969,2.716-7.452,7.433-7.47c7.43-0.028,14.862-0.019,22.292-0.005c5.403,0.01,7.889,2.439,7.956,8.13c0.16,13.871-4.933,25.171-15.357,33.755c-2.573,2.119-2.571,2.046-0.066,4.103c10.609,8.718,15.725,20.197,15.4,34.303c-0.116,5.055-2.652,7.588-7.294,7.633C28.256,89.57,24.448,89.539,20.638,89.539z')
            .attr('fill', ChartsManager.defaults.secondaryBackColor || '#808080');
        g.append('path')
            .attr('d', 'M20.846,71.796c0.065-8.871,0.07-17.742-0.006-26.613c-0.012-1.596,0.639-2.446,1.761-3.324c4.146-3.249,7.431-7.301,10.003-12.023c1.057-1.945,1.187-2.929-1.446-2.895c-7.335,0.095-14.673,0.08-22.008,0.006c-2.388-0.024-2.435,0.823-1.412,2.732c2.542,4.744,5.804,8.824,9.96,12.057c1.319,1.026,1.908,2.08,1.891,3.848c-0.086,8.579-0.12,17.159,0.017,25.737c0.035,2.156,0.101,9.96,0.092,11.815c-0.021,4.546-0.021,4.546-0.021,4.546s0,0,1.042,0.018')
            .attr('fill', color || ChartsManager.defaults.frontColor || '#af1f23')
            .attr('dynamic-color', dynamicColor);
    }

    function bindData() {

        var chartFrame = {
            w: self.w,
            h: self.h,
            top: _opts.layout.padding.top,
            left: _opts.layout.padding.left
        }
        var horizonatlGrid = self._gr.append('g');
        self.translate(horizonatlGrid, chartFrame.left, chartFrame.top);

        var stuff = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g = d3.select(this)
                    .attr('data-eltype', 'bars')
                    .attr('transform', String.format('translate({0}, {1})', 0, _opts.layout.padding.top));

//                var h = self.yScale(d.value); // not defined here yet

                var dx = self.w / self.data.length;

                var item = g.append('g')
                    .attr('transform', String.format('translate({0}, {1})', i * dx, 0));

                var frame = {
                    w: dx,
                    h: self.h - _opts.bars.legend.height - (_opts.bars.legend.icon ? _opts.bars.legend.icon.height || 0 : 0)
                };
                frame.inner = {
                    w: frame.w - _opts.bars.margin.left - _opts.bars.margin.right,
                    h: frame.h - _opts.bars.margin.top - _opts.bars.margin.bottom
                };


                // bar
                var bar = item.append('g');
//                    .attr('transform', self.formatTranslate(dx / 2, frame.h));
                var barIn = bar.append('g')
//                    .attr('bar-body', '')
                    .style('opacity', 1)
                    .attr('transform', self.formatTranslate(dx / 2, 0));


                var hourglass = barIn.append('g')
                    .attr('transform', self.formatTranslate(0, frame.h / 2));
                var hourglassIn = hourglass.append('g');
                var hourglassIn1 = hourglassIn.append('g');
                drawHourglass(hourglassIn1.append('g'), ChartsManager.defaults.frontColor, d.color);

                var mask = hourglassIn1.append('g')
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId));

                var box = hourglassIn1.node().getBBox();
                box = {
                    width: box.width,
                    height: box.height
                };
                var initialHourglasHeight = box.height;

                var xScale = frame.inner.w / box.width;
                var yScale = frame.inner.h / box.height;
                var scale = xScale > yScale ? yScale : xScale;

                hourglassIn1.attr('transform', String.format('scale({0},{0})', scale));
                box.width *= scale;
                box.height *= scale;

                self.translate(hourglassIn, -box.width / 2, -box.height / 2);

                // value bar
                var valueBar = mask.append('g')
//                    .attr('transform', self.formatTranslate(0, initialHourglasHeight - 2 * scale));
                    .attr('transform', self.formatTranslate(0, initialHourglasHeight / 1.039));
                var valueBarIn = valueBar.append('g')
                    .attr('bar-body', '');
                var valueRect = valueBarIn.append('rect')
                    .attr({
                        width: frame.w, height: initialHourglasHeight,
                        fill: ChartsManager.defaults.frontColor, 'dynamic-color': d.color
                    });

                // the first time
                if (i === 0) {
                    self.yScale = d3.scale.linear()
                        .domain([0, self.maxRangeValue])
                        .range([0, initialHourglasHeight / 2 / (1 + .022 + .039)]);
                }
                // titles
                var title = barIn.append('g')
                    .attr('transform', self.formatTranslate(0, 60 + _opts.bars.title.dy))
                    .attr('class', 'value-title');
                title.append('text')
                    .text(d.value).attr({
                        'text-anchor': 'middle',
                        'dominant-baseline': 'central',
                        fill: ChartsManager.defaults.frontColor, 'dynamic-color': d.color
                    });

                var title2 = barIn.append('g')
                    .attr('transform', self.formatTranslate(0, 95 + _opts.bars.title2.dy))
                    .attr('class', 'value-title2');
                title2.append('text')
                    .text(d.valueTitle).attr({
                        'text-anchor': 'middle',
                        'dominant-baseline': 'central'
                    });

                // legend (titles within grey boxes) title
                if (_opts.bars.legend.isVisible !== false) {
                    var legend = item.append('g')
                        .attr('class', 'legend-title')
                        .attr('transform', self.formatTranslate(0, frame.h));

                    if (d.icon) {
                        var iconLegend = legend.append('g')
                            .attr('transform', self.formatTranslate(0, 0));
                        ChartsManager.renderImage(iconLegend,
                            d.icon.name,
                            d.icon.color || ChartsManager.defaults.secondaryBackColor,
                            { height: _opts.bars.legend.icon.height, width: dx, dy: _opts.bars.legend.icon.dy || 0 },
                            true);
                    }
                    var legendValue = legend.append('g')
                        .attr('transform', self.formatTranslate(dx / 2,
                            (_opts.bars.legend.icon ? _opts.bars.legend.icon.height : 0)
                            + (_opts.bars.legend.height / 2)
                            + _opts.bars.legend.dy));
                    legendValue.append('text')
                        .text(d.title).attr({
                            'text-anchor': 'middle',
                            'dominant-baseline': 'central'
                        });
                }

                /// grid
                if (i === 0) {
                    var yUp = _opts.bars.margin.top + frame.inner.h / 2 + (initialHourglasHeight * .022 * scale);
                    var yBottom = yUp + (initialHourglasHeight / 2 * scale - initialHourglasHeight * (.022 + .039) * scale);
                    var dy = (yBottom - yUp) / _opts.layout.rows.count;
                    for (var j = 0; j <= _opts.layout.rows.count; j++) {
                        var y = yUp + j * dy;
                        var line = horizonatlGrid.append('line')
                            .attr({
                                x1: 0, x2: chartFrame.w,
                                y1: y, y2: y,
                                stroke: _opts.layout.rows.border.color,
                                'stroke-width': _opts.layout.rows.border.width,
                                'stroke-dasharray': _opts.layout.rows.border.dashArray || '5,5'
                            });
                    }
                }
            });
    }

    function animateChanges(callback) {

        var barsDelay = 25 * 1;
        var barRowsDelay = 8;
        var barDuration = 900;

        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i0) {
                if (!d) {
                    return;
                }
                var g0 = d3.select(this);
                var data = d.value;
                var h = self.yScale(d.value);

                var barIn = g0.selectAll('[bar-body]');
                self.translate(barIn, 0, 0);

//                var dy = d3.transform(barIn.attr('transform')).translate[1];
                barIn.transition()
                    .remove();
                barIn.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('transform', self.formatTranslate(0, -h))
                    .style('opacity', 1);


                var legend = g0.selectAll('.legend-title');
                legend.style('opacity', '0');
                
                legend.transition()
                    .remove();
                legend.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .style('opacity', 1);


                var dynamicColor = g0.selectAll('[dynamic-color]');
                
                dynamicColor.transition()
                    .remove();
                dynamicColor.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('fill', dynamicColor.attr('dynamic-color'));
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}