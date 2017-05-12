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
                        isVertical: false,
                        height: 75,
                        dx: 10,
                        dy: 0
                    },
                    color: manager.defaults.frontColor,
                    colors: [
                        manager.defaults.backColor, manager.defaults.frontColor
                    ],
                    backColor: manager.defaults.backColor,
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
            d.bars.maxValueRangeMultiplier = 1;

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
        d = _.map(d, function(d0) {
                return d0 && d0.value !== undefined ? d0.value : d0;
        });
        self.maxValue = d3.max(d) * _opts.bars.maxValueRangeMultiplier;
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

                var dx = self.w / self.data.length;

                var values = self.isArray(d.value) ? d.value : [d];


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
                    w: (barFrame.w - _opts.bars.margin.left - _opts.bars.margin.right)
                    / values.length,
                    h: barFrame.h - _opts.bars.margin.top - _opts.bars.margin.bottom
                };



                // legend (titles within grey boxes) title
                var legend = item.append('g')
                    .attr('transform', self.formatTranslate(0, barFrame.h));
                var legend2 = item.append('g')
                    .attr('transform', self.formatTranslate(0, barFrame.h));

                if (d.icon) {
                    var icon = self.translate(legend.append('g'),
                        barFrame.w / 2 + (d.icon.dx || 0),
                        (_opts.legend.height - _opts.legend.title.height) / 2 +
                        (_opts.legend.icon.dy || 0) +
                        (d.icon.dy || 0));
                    if (typeof d.icon === 'string') {
                        manager.renderImage(icon, d.icon, _opts.legend.icon.color);
                    } else {
                        manager.renderImage(icon,
                            d.icon,
                            _opts.legend.icon.color,
                            _opts.legend.icon.scale,
                            d.icon.toCenter);
                    }
                } 
                var legendTitle = legend.append('g')
                    .attr('class', 'legend-title');
                var legendTitleText = self.translate(self.appendTextMultiline(legendTitle, d.title, dx - 4 /*barFrame.inner.w*/),
                    dx/2, _opts.legend.height - _opts.legend.title.height + (_opts.legend.title.dy || 0));

                var legendTitle2 = legend2.append('g')
                    .attr('class', 'legend2-title');
                var legendTitle2Text = self.translate(self.appendTextMultiline(legendTitle2, d.title2, dx - 4/*barFrame.inner.w*/),
                    dx/2, _opts.legend.height - 10);// _opts.legend.title.height);

                // background
                var bar = item.append('g');
                    var barBackground = bar.append('g');
                    barBackground.append('rect')
                        .attr({
                            width: barFrame.inner.w * values.length,
                            height: barFrame.inner.h,
                            fill: 'url(#diagonalHatch)'// _opts.bars.backColor
                        });
                    self.translate(bar, _opts.bars.margin.left, _opts.bars.margin.top);

                _.each(values, function(v, k){

                    var h = self.yScale(v.value);

                    // bar
                    // bar body
                    var barBodyOut = bar.append('g');
                    self.translate(barBodyOut, barFrame.inner.w * k, barFrame.inner.h);
                    var barBody = barBodyOut.append('g')
                        .attr('chart-bar', '');
                    barBody.append('rect')
                        .attr({
                            width: barFrame.inner.w,
                            height: /*h*/ 0,
                            fill: v.color || (values.length > 1 ?  _opts.bars.colors[k] : _opts.bars.color)
                        });
                    self.translate(barBody, 0, 0);

                    var noTopIcon = !_opts.bars.topIcon;

                    var barValueOut = bar.append('g');
                    self.translate(barValueOut, barFrame.inner.w * (k + .5),
                        barFrame.inner.h - (noTopIcon ? 24 : 0)); 

                    var barValue = barValueOut.append('g')
                        .attr('class', 'value-title');

                    var barValueText = barValue.append('text')
                        .text(v.valueTitle);

                    if (_opts.bars.title.isVertical) {
//                        self.translate(barValue, 0, -h);         
                        barValueText.style('text-anchor', 'start');
                        barValueText.attr('transform', 'rotate(-90, 0, 0) '
                            + self.formatTranslate(-(_opts.bars.title.dy || 0), _opts.bars.title.dx || 0));
                    } else {
                        barValueText.attr('transform', self.formatTranslate(_opts.bars.title.dx || 0, _opts.bars.title.dy || 0));
                    }


                    if (_opts.bars.topIcon) {
                        var topIcon = manager.renderPath(barValue, _opts.bars.topIcon);
//                        topIcon.attr('transform', self.formatTranslate(0, _opts.bars.topIcon.dy));
                    } else {
                        var pointer = barValue
                            .append('g')
//                            .attr('transform', self.formatTranslate(barFrame.inner.w * (k + .5),
//                            barFrame.inner.h - h + _opts.bars.title.dy))           
                            .append('g')
                            .attr('legend-pointer', '')
                            .attr('transform', self.formatTranslate(0, -2));
                        pointer.append('line').attr({
                            x1: -10,
                            x2: 10,
                            y1: 0,
                            y2: 0,
                            stroke: ChartsManager.defaults.darkColor,
                            'stroke-width': 2
                        });
                        pointer.append('line').attr({
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 26,
                            stroke: ChartsManager.defaults.darkColor,
                            'stroke-width': 2
                        });
                    }

                    
                });
            });
    }

    function animateChanges(callback) {

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
                var values = self.isArray(d.value) ? d.value : [d];

                var bars = g0.selectAll('[chart-bar]');
                var titles = g0.selectAll('.value-title');

                _.each(values, function(v, i) {
                    var h = self.yScale(v.value);

                    var bar = d3.select(bars[0][i]);
                    bar.transition()
                        .remove();
                    bar.transition()
                        .ease('cubic-out')
                        .duration(barDuration)
                        .delay(i0 * barsDelay)
                        .attr('transform', self.formatTranslate(0, -h));

                    var rect = bar.selectAll('rect');
                    rect.transition()
                        .remove();
                    rect.transition()
                        .ease('cubic-out')
                        .duration(barDuration)
                        .delay(i0 * barsDelay)
                        .attr('height', h);

                    var title = d3.select(titles[0][i]);
                    self.translate(title, 0, -h - 15);
                    title.style('opacity', 0);

                    title.transition()
                        .remove();
                    title.transition()
                        .ease('cubic-out')
                        .duration(barDuration * 1.75)
                        .delay((i0 + 2) * barsDelay)
                        .style('opacity', 1)
                        .attr('transform', self.formatTranslate(0, -h));
                });
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}