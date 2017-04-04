function chartSlicedBarVertical(settings) {

    var self = this;
    chartBase(self);

    var manager = self.manager;

    initialize();

    self.name = 'sliced-bar-v';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;

    function initialize() {
        self.getDefaults = function() {
            var d = {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                bars: {
                    title: {
                        height: 75,
                        dx: 10,
                        dy: 0
                    },
                    backColor: manager.defaults.backColor,
                    color: manager.defaults.frontColor,
                    backLinesGap: 1,
                    topIcon: {
                        name: manager.paths.signs.person,
                        color: '#000',
                        scale: 1,
                        dx: 0,
                        dy: -30
                    },
                    margin: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                legend: {
                    icon: {
                        color: manager.defaults.frontColor
                    },
                    height: 75,
                    title: {
                        height: 60
                    }
                }
            };

            d.bars.maxValue = null;
//            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }

    function prepareContainer() {
        
        self.initializeLayout(_opts);

        self._gr = self._layout.append('g');

        self._c = self._layout.append('g');//.attr('transform', 'translate(' + _opts.axis.y.text.width + ', ' + 0 + ')');

        self._c.append('pattern')
            .attr({ id: 'diagonalHatch', patternUnits: 'userSpaceOnUse', width: '4', height: '4' })
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .style({ 'stroke': _opts.bars.backColor, 'stroke-width': 1.15 });


//        self._f = self._layout.append('g'); // lines

//        self.xScale = d3.scale.ordinal()
//            .domain(d3.range(0, self.data.length * 1))
//            .rangeBands([0, self.w]);
//            .rangeBands([0, !_opts.isVertical ? self.w - _opts.axis.y.text.width : self.h - _opts.axis.x.text.height]);

        var d = [];
        _.each(self.data, function (el) {
            self.isArray(el.value) ? d.push.apply(d, el.value) : d.push(el.value);
        });
        self.maxValue = d3.max(d);
        if (_opts.bars.maxValue && _opts.bars.maxValue > self.maxValue) {
            self.maxValue = _opts.bars.maxValue;
        }

        var yMax = _opts.bars.maxValue || self.maxValue || .001;
//        yMax *= _opts.bars.maxValueRangeMultiplier;
        self.maxRangeValue = yMax;
        self.yScale = d3.scale.linear()
            .domain([0, yMax])
            .range([0, self.h - _opts.legend.height]);
            //.range([0, self.h - _opts.axis.x.text.height]);
    }

    function bindData() {

        var prevGroup = null;

        var stuff = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function(d, i) {

                var g = d3.select(this)
                    .attr('data-eltype', 'bars');

                var h = self.yScale(d.value);

                var dx = self.w / self.data.length;

                var item = g.append('g')
                    .attr('transform', String.format('translate({0}, {1})', i * dx, _opts.bars.margin.top));
//                            .attr('y', 0)
//                            .attr('width', dx)// self.w - (_opts.axis.x.wholeLength ? 0 : _opts.axis.y.text.width))
//                            .attr('transform', String.format('translate({0}, {1})', (!_opts.axis.x.wholeLength ? _opts.axis.y.text.width : 0)
//                                , self.h - _opts.axis.x.text.height))
//                            .attr('height', self.h - _opts.axis.x.height)
//                            .style({ fill: '#e9e9e9' });


                var barFrame = {
                    w: dx,
                    h: self.h - _opts.legend.height
                };
                barFrame.inner = {
                    w: barFrame.w - _opts.bars.margin.left - _opts.bars.margin.right,
                    h: barFrame.h - _opts.bars.margin.top - _opts.bars.margin.bottom
                };



                // legend (titles within grey boxes) title
                var legend = item.append('g')
                    .attr('class', 'legend-title')
                    .attr('transform', self.formatTranslate(0, barFrame.h));

                if (d.icon) {
                    var icon = self.translate(legend.append('g'), barFrame.w / 2, (_opts.legend.height - _opts.legend.title.height) / 2);
                    if (typeof d.icon === 'string') {
                        manager.renderPath(icon, d.icon, _opts.legend.icon.color);
                    } else {
                        manager.renderPath(icon, d.icon.name, d.icon.color || _opts.legend.icon.color, _opts.legend.icon.scale, _opts.legend.icon.dx, _opts.legend.icon.dy);
                    }
                }

                var legendTitle = self.translate(self.appendTextMultiline(legend.append('g'), d.title, null),
                    dx/2, _opts.legend.height - _opts.legend.title.height);


               // bar
                var bar = item.append('g');
                self.translate(bar, _opts.bars.margin.left, _opts.bars.margin.top);
                var barBackground = bar.append('g');
                barBackground.append('rect')
                    .attr({
                        width: barFrame.inner.w, height: barFrame.inner.h,
                        fill: 'url(#diagonalHatch)'// _opts.bars.backColor
                    });

                // bar body
                var barBody = bar.append('g');
                barBody.append('rect')
                    .attr({ width: barFrame.inner.w, height: h, fill: _opts.bars.color });
                self.translate(barBody, 0, barFrame.inner.h - h);

                var barValue = bar.append('g')
                    .attr('class', 'value-title');
                barValue.append('text')
                    .text(d.valueTitle);
                self.translate(barValue, barFrame.inner.w/2, barFrame.inner.h - h + _opts.bars.title.dy);

                if (_opts.bars.topIcon) {
                    var topIcon = manager.renderPath(barValue, _opts.bars.topIcon);
//                    topIcon.attr('transform', self.formatTranslate(0, _opts.bars.topIcon.dy));
                }


            });
    }

    function animateChanges(callback) {
        return;
        var barsDelay = 25;
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

                var dotsLine = g0.selectAll('.dots-container>g');
                _.each(dotsLine[0], function(ln, i) {
                    var g = d3.select(ln).selectAll('circle');

                    g.transition()
                        .remove();
                    g.transition()
                        .ease('exp-out')
                        .duration(barDuration)
                        .delay(i * barRowsDelay + i0 * barsDelay)
                        .attr('r', _opts.bars.dotRadius);
                });

                var valueCore = g0.selectAll('.value-core');
                var dx = d3.transform(valueCore.attr('transform')).translate[0];
                valueCore.transition()
                    .remove();
                valueCore.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('transform', self.formatTranslate(dx, 0))
                    .style('opacity', 1);
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}