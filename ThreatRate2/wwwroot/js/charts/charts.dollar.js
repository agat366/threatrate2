function chartDollar(settings) {

    var self = this;

    chartBase(self);

    initialize();

    self.name = 'dollar';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                meta: {
                    maskId: 'charts-dollar-mask',
                    startDelay: 0
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
                    fullFill: false,
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
            .attr('d', 'M24.072,54.79c0.418,0.418,0.836,0.627,1.255,0.836l0.418,25.931c-7.737-3.346-9.62-6.065-11.501-18.194c-4.601-1.045-9.411-2.718-14.22-3.764C0.859,75.493,5.46,82.394,18.216,90.132c1.673,1.045,3.346,2.091,7.738,3.346l0.209,5.646l4.601,0.836l-0.209-5.228c3.974,1.045,6.065,1.673,12.757,0.209c13.802-3.137,12.965-25.095,8.992-32.205c-3.555-6.273-6.692-9.411-12.547-13.593c-2.718-2.091-6.483-4.392-10.038-6.692L29.3,20.076c0.457,0.186,0.055,0.008,0.419,0.166c7.11,2.928,9.201,8.408,8.783,14.682l14.011,3.137c0-6.483-1.882-19.867-15.475-27.604c-2.51-1.673-5.229-2.719-7.947-3.346V1.045L24.49,0v6.064c-1.464-0.209-2.928-0.418-4.392-0.627C3.368,2.928-11.061,27.813,13.615,47.889C16.334,50.189,19.889,52.908,24.072,54.79zM29.927,58.763c4.391,3.137,8.365,6.692,9.201,8.783c1.046,2.509,1.255,5.228,1.255,7.319c-0.209,3.137-1.882,6.482-5.437,7.738c-0.837,0.209-2.301,0.418-4.601,0.209L29.927,58.763zM25.117,39.942c-0.836-0.418-1.464-0.837-2.091-1.255c-5.229-2.3-8.156-7.737-8.156-13.384c0-6.483,5.019-7.528,9.829-6.692L25.117,39.942z')
            .attr('transform', 'scale(.8)');
    }

    function drawHourglass(g, color, dynamicColor) {
//        w = 40.735;
//        h = 91.184;
        g.append('path')
            .attr('d', 'M20.393,0.021C16.582,0.02,12.771-0.032,8.962,0.032c-5.218,0.09-8.361,3.243-8.596,8.641c-0.62,14.21,4.291,25.94,14.694,35c2.005,1.748,1.663,2.31-0.099,3.862C4.513,56.734-0.352,68.566,0.388,82.882c0.245,4.744,3.285,8.082,7.857,8.174c8.175,0.169,16.356,0.17,24.531,0.004c4.674-0.096,7.681-3.496,7.903-8.446c0.645-14.319-4.278-26.132-14.795-35.24c-1.925-1.667-1.499-2.251,0.109-3.663C36.358,34.597,41.286,22.9,40.686,8.691c-0.226-5.379-3.382-8.567-8.585-8.658C28.2-0.033,24.296,0.021,20.393,0.021zM20.638,89.539c-3.715,0-7.431,0.015-11.146-0.002c-5.218-0.023-7.731-2.48-7.817-7.98C1.46,67.562,6.557,56.14,17.159,47.607c2.029-1.633,2.289-2.264,0.071-4.035C6.423,34.93,1.321,23.307,1.7,9.083c0.132-4.969,2.716-7.452,7.433-7.47c7.43-0.028,14.862-0.019,22.292-0.005c5.403,0.01,7.889,2.439,7.956,8.13c0.16,13.871-4.933,25.171-15.357,33.755c-2.573,2.119-2.571,2.046-0.066,4.103c10.609,8.718,15.725,20.197,15.4,34.303c-0.116,5.055-2.652,7.588-7.294,7.633C28.256,89.57,24.448,89.539,20.638,89.539z')
            .attr('fill', ChartsManager.defaults.secondaryBackColor || '#808080');
//        g.append('path')
//            .attr('d', 'M20.846,71.796c0.065-8.871,0.07-17.742-0.006-26.613c-0.012-1.596,0.639-2.446,1.761-3.324c4.146-3.249,7.431-7.301,10.003-12.023c1.057-1.945,1.187-2.929-1.446-2.895c-7.335,0.095-14.673,0.08-22.008,0.006c-2.388-0.024-2.435,0.823-1.412,2.732c2.542,4.744,5.804,8.824,9.96,12.057c1.319,1.026,1.908,2.08,1.891,3.848c-0.086,8.579-0.12,17.159,0.017,25.737c0.035,2.156,0.101,9.96,0.092,11.815c-0.021,4.546-0.021,4.546-0.021,4.546s0,0,1.042,0.018')
//            .attr('fill', color || ChartsManager.defaults.frontColor || '#af1f23')
//            .attr('dynamic-color', dynamicColor);
    }

    function bindData() {

        var chartFrame = {
            w: self.w,
            h: self.h,
            top: _opts.layout.padding.top,
            left: _opts.layout.padding.left
        }

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
//                drawHourglass(hourglassIn1.append('g'), ChartsManager.defaults.frontColor, d.color);

                var mask = hourglassIn1.append('g')
                    .attr('clip-path', String.format('url(#{0})', _opts.meta.maskId));

                var box = { width: dx / 4, height: dx / 2.125 }; // hourglassIn1.node().getBBox();
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
                    .attr('transform', self.formatTranslate(0, initialHourglasHeight/* - 2 * scale*/));
                var valueBarIn = valueBar.append('g')
                    .attr('bar-body', '');
                var valueRect = valueBarIn.append('rect')
                    .attr({
                        width: frame.w,
                        height: initialHourglasHeight * (_opts.bars.fullFill ? 2.5 : 1),
                        fill: ChartsManager.defaults.frontColor,
                        'dynamic-color': d.color,
                        transform: 'translate(0, -6.5)' + (_opts.bars.fullFill ? ' skewY(55)' : ' skewY(14)')
                    });

                // the first time
                if (i === 0) {
                    self.yScale = d3.scale.linear()
                        .domain([0, self.maxRangeValue])
                        .range([0, initialHourglasHeight/* / 2 - 2 * scale*/]);
                }
                // titles
                var title = barIn.append('g')
                    .attr('transform', self.formatTranslate(0, 60 + _opts.bars.title.dy))
                    .attr('class', 'value-title');
                title.append('text')
                    .text(d.valueTitle || d.value).attr({
                        'text-anchor': 'middle',
                        'dominant-baseline': 'central'/*,
                        fill: ChartsManager.defaults.frontColor, 'dynamic-color': d.color*/
                    });

                if (d.valueTitle2) {
                    var title2 = barIn.append('g')
                        .attr('transform', self.formatTranslate(0, 95 + _opts.bars.title2.dy))
                        .attr('class', 'value-title2');
                    title2.append('text')
                        .text(d.valueTitle2).attr({
                            'text-anchor': 'middle',
                            'dominant-baseline': 'central'
                        });
                }
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
            });
    }

    function animateChanges(callback) {

        var barsDelay = 25 * 6;
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
                var h = self.yScale((_opts.bars.fullFill ? self.maxRangeValue : d.value));

                var barIn = g0.selectAll('[bar-body]');
                self.translate(barIn, 0, 0);

//                var dy = d3.transform(barIn.attr('transform')).translate[1];
                barIn.transition()
                    .remove();
                barIn.transition()
                    .ease('quad-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay + _opts.meta.startDelay)
                    .attr('transform', self.formatTranslate(0, -h * (_opts.bars.fullFill ? 1.4 : 1) -2))
//                    .attr('fill', d.color)
                    .style('opacity', 1);


                var legend = g0.selectAll('.legend-title');
                legend.style('opacity', '0');
                
                legend.transition()
                    .remove();
                legend.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay + _opts.meta.startDelay)
                    .style('opacity', 1);


                var dynamicColor = g0.selectAll('[dynamic-color]');
                
                dynamicColor.transition()
                    .remove();
                dynamicColor.transition()
                    .ease('linear')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay + _opts.meta.startDelay)
                    .attr('fill', dynamicColor.attr('dynamic-color'));
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}