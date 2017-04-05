function chartGridVertical(settings) {

    var self = this;

    chartBase(self);

    initialize();

    self.name = 'grid-v';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                layout: {
                    rows: {
                        count: 7,
                        border: {
                            width: 1,
                            color: ChartsManager.defaults.backColor
                        }
                    },
                    columns: {
                        border: {
                            width: 1,
                            color: ChartsManager.defaults.secondaryBackColor,
                            bottomPiece: {
                                dy: 16,
                                height: 12
                            }
                        }
                    }
                },
                bars: {
                    dotRadius: 5.5,
                    dotColor: ChartsManager.defaults.frontColor,
                    dotOuterColor: ChartsManager.defaults.secondaryBackColor,

                    icon: null/*{
                        height: 100  
                    }*/,
                    title: {
                        dy: 0
                    },
                    legend: {
                        icon: null,/*{
                            height: 0
                        }  */

                        height: 20
                    }
                },
                animation: {
                    barDelay: 100
                }
            };

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 20,
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
        self.yScale = d3.scale.linear()
            .domain([0, yMax])
            .range([0, barsHeight]);
            //.range([0, self.h - _opts.axis.x.text.height]);
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
        for (var j = 0; j <= _opts.layout.rows.count; j++) {
            var y = j * (chartFrame.h - _opts.bars.legend.height) / _opts.layout.rows.count;
            var line = horizonatlGrid.append('line')
                .attr({ x1: 0, x2: chartFrame.w,
                    y1: y, y2: y,
                    stroke: _opts.layout.rows.border.color,
                    'stroke-width': _opts.layout.rows.border.width
                });
        }

        var stuff = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g = d3.select(this)
                    .attr('data-eltype', 'bars')
                    .attr('transform', String.format('translate({0}, {1})', 0, _opts.layout.padding.top));

                var h = self.yScale(d.value);

                var dx = self.w / self.data.length;

                var item = g.append('g')
                    .attr('transform', String.format('translate({0}, {1})', i * dx, 0));

                var frame = {
                    w: dx,
                    h: self.h - _opts.bars.legend.height
                };
//                barFrame.inner = {
//                    w: barFrame.w - _opts.bars.margin.left - _opts.bars.margin.right,
//                    h: barFrame.h - _opts.bars.margin.top - _opts.bars.margin.bottom
//                };


//                var barHeight = self.h - _opts.bars.title.height - (self.groupsExist() ? _opts.groups.height : 0)
//                    - _opts.bars.margin.top - _opts.bars.margin.bottom;


                // bar
                var bar = item.append('g')
                    .attr('transform', self.formatTranslate(dx / 2, frame.h));
                var barIn = bar.append('g')
                    .attr('bar-body', '')
                    .style('opacity', 0);

                var point = barIn.append('g');
                point.append('circle').attr({
                    cx: 0, cy: 0,
                    r: _opts.bars.dotRadius + 2,
                    fill: '#fff',
                    stroke: _opts.bars.dotOuterColor,
                    'stroke-width': 4
                });
                point.append('circle').attr({
                    cx: 0, cy: 0,
                    r: _opts.bars.dotRadius + 2,
                    fill: d.pointColor || _opts.bars.dotColor,
                    stroke: '#fff',
                    'stroke-width': 2
                });


                var title = barIn.append('g')
                    .attr('transform', self.formatTranslate(0, 20))
                    .attr('class', 'value-title');
                title.append('text')
                    .text(d.value).attr({
                        'text-anchor': 'middle',
                        'dominant-baseline': 'central'
                    })
                    .style('fill', d.titleColor || null);

                if (d.value2) {
                    var title2 = barIn.append('g')
                        .attr('transform', self.formatTranslate(0, 40))
                        .attr('class', 'value2-title');
                    title2.append('text')
                        .text(d.value2).attr({
                            'text-anchor': 'middle',
                            'dominant-baseline': 'central'
                        })
                        .style('fill', d.title2Color || ChartsManager.defaults.darkColor);
                }

                if(_opts.bars.icon) {
                    var iconValue = barIn.append('g')
                        .attr('transform', self.formatTranslate(0, -_opts.bars.icon.height));
                    ChartsManager.renderPath(iconValue,
                        _opts.bars.icon.name,
                        d.color,
                        _opts.bars.icon.scale || 1, null, _opts.bars.icon.dy || -20);

                }


                // legend (titles within grey boxes) title
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
                        + (_opts.bars.legend.height - (_opts.bars.legend.icon ? _opts.bars.legend.icon.height : 0)) / 2));
                legendValue.append('text')
                    .text(d.title).attr({
                        'text-anchor': 'middle',
                        'dominant-baseline': 'central'
                    });

                // vertical separators
                var verticalGrid = self._gr.append('g');
                self.translate(verticalGrid, chartFrame.left, chartFrame.top);
                var drawLine = function(j) {
                    var x = dx * j;
                    var line = verticalGrid.append('line')
                        .attr({
                            x1: x,
                            x2: x,
                            y1: 0,
                            y2: frame.h,
                            stroke: _opts.layout.columns.border.color,
                            'stroke-width': _opts.layout.rows.border.width
                        });

                    if (i > 0 && i < self.data.length && _opts.layout.columns.border.bottomPiece) {
                        verticalGrid.append('line')
                            .attr({
                                x1: x,
                                x2: x,
                                y1: frame.h + _opts.layout.columns.border.bottomPiece.dy || 0,
                                y2: frame.h + (_opts.layout.columns.border.bottomPiece.dy || 0)
                                    + _opts.layout.columns.border.bottomPiece.height,
                                stroke: _opts.layout.columns.border.color,
                                'stroke-width': _opts.layout.rows.border.width
                            });
                    }
                };
//                if (i === 0) {
//                    drawLine(-1);
//                }
                if (i < self.data.length && i > 0) {
                    drawLine(i);
                }
            });
    }

    function animateChanges(callback) {

        var barsDelay = _opts.animation.barDelay;
        var barRowsDelay = 8;
        var barDuration = 400;

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
                self.translate(barIn, -30, -h);

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
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}