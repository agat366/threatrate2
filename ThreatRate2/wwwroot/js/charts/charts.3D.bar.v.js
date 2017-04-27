function chart3DBarVertical(settings) {

    var self = this;
    chartBase(self);

    var manager = self.manager;

    initialize();

    self.name = '3d-bar-v';

    self.frontGradientName = 'frontGradient';

    self.settings = settings;
    var _opts = self.mergeDefaults(settings.options);
    self.container = settings.container;

    self.data = settings.data && settings.data.data ? settings.data.data : settings.data;

    function initialize() {
        self.getDefaults = function () {
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
//                    topIcon: {
//                        name: manager.paths.signs.person,
//                        color: '#000',
//                        scale: 1,
//                        dx: 0,
//                        dy: -30
//                    },
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

        var defs = self._gr.append('defs');

        var grFront = defs.append('linearGradient')
            .attr('id', self.frontGradientName);
        grFront.append('stop').attr({ offset: '0%', 'stop-color': 'rgba(0,0,0,0.1)' });
        grFront.append('stop').attr({ offset: '6%', 'stop-color': 'rgba(255,255,255,0.05)' });
        grFront.append('stop').attr({ offset: '11%', 'stop-color': 'rgba(255,255,255,0.15)' });
        grFront.append('stop').attr({ offset: '23%', 'stop-color': 'rgba(255,255,255,0.25)' });
        grFront.append('stop').attr({ offset: '29%', 'stop-color': 'rgba(255,255,255,0.25)' });
        grFront.append('stop').attr({ offset: '40%', 'stop-color': 'rgba(255,255,255,0.1)' });
//        grFront.append('stop').attr({ offset: '40%', 'stop-color': 'rgba(0,0,0,0)' });
        grFront.append('stop').attr({ offset: '55%', 'stop-color': 'rgba(0,0,0,0.1)' });
        grFront.append('stop').attr({ offset: '60%', 'stop-color': 'rgba(0,0,0,0.15)' });
        grFront.append('stop').attr({ offset: '77%', 'stop-color': 'rgba(0,0,0,0.22)' });
        grFront.append('stop').attr({ offset: '86%', 'stop-color': 'rgba(0,0,0,0.25)' });
        grFront.append('stop').attr({ offset: '100%', 'stop-color': 'rgba(0,0,0,0.3)' })
            ;

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
            .each(function (d, i) {

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
                    w: _opts.bars.width,// barFrame.w - _opts.bars.margin.left - _opts.bars.margin.right,
                    h: barFrame.h - _opts.bars.margin.top - _opts.bars.margin.bottom
                };



                // legend (titles within grey boxes) title
                var legend = item.append('g')
                    .attr('class', 'legend-title')
                    .attr('transform', self.formatTranslate(0, barFrame.h));

                if (d.icon) {
                    var icon = self.translate(legend.append('g'), barFrame.w / 2, (_opts.legend.height - _opts.legend.title.height) / 2);
                    if (typeof d.icon === 'string') {
                        manager.renderPath(icon, d.icon, _opts.legend.icon.color, _opts.legend.icon.scale, _opts.legend.icon.dx, _opts.legend.icon.dy);
                    } else {
                        manager.renderPath(icon, d.icon.name, d.icon.color || _opts.legend.icon.color,
                            d.icon.scale || _opts.legend.icon.scale, d.icon.dx || _opts.legend.icon.dx, d.icon.dy || _opts.legend.icon.dy);
                    }
                }

                var legendTitle = self.translate(self.appendTextMultiline(legend.append('g'), d.title, dx - 4),
                    dx / 2, _opts.legend.height - _opts.legend.title.height);


                // bar
                var bar = item.append('g');
                self.translate(bar, (barFrame.w - barFrame.inner.w) / 2, _opts.bars.margin.top);

                // shadow back side
                var barShadow = bar.append('g');
                barShadow.append('rect')
                    .attr({
                        x: -60,
                        y: barFrame.inner.h - 140,
                        width: barFrame.inner.w + 120,
                        height: 140,
                        fill: String.format('url(#{0})', self.backGradientName) // _opts.bars.backColor
                    });

                // background back side
                var barBackground0 = bar.append('g');

                var path0 = String.format('M0,0');
                path0 += String.format(' l{0},{1}', 0, barFrame.inner.h);
                path0 += String.format(' A{0},20,0,0,0,{2},{3}', barFrame.inner.w / 2, 15, barFrame.inner.w, barFrame.inner.h);
                path0 += String.format(' l{0},{1}', 0, -barFrame.inner.h);
                path0 += String.format(' A{0},20,0,1,1,{2},{3}', barFrame.inner.w / 2, 15, 0, 0);
                path0 += String.format('z');
                barBackground0.append('path')
                    .attr('d', path0)
                    .attr({
                        width: barFrame.inner.w, height: barFrame.inner.h,
                        fill: 'rgba(0,0,0,.1)' // _opts.bars.backColor
                    });


                // bar body
                var barBodyOut = bar.append('g');
                self.translate(barBodyOut, 0, barFrame.inner.h);
                var barBody = barBodyOut.append('g')
                    .attr('chart-bar', '');
//                self.translate(barBody, 0, barFrame.inner.h - h);

                var path = '';
                barBody.append('path')
                    .attr('d', path)
                    .attr({
//                        width: barFrame.inner.w, height: barFrame.inner.h,
                        fill: _opts.bars.backColor
                    });
                barBody.append('ellipse')
                    .attr({
                        cx: barFrame.inner.w / 2,
                        cy: 0,
                        rx: barFrame.inner.w / 2,
                        ry: 20,
                        fill: _opts.bars.backColor
                    });
                barBody.append('ellipse')
                    .attr({
                        cx: barFrame.inner.w / 2,
                        cy: 0,
                        rx: barFrame.inner.w / 2,
                        ry: 20,
                        fill: 'rgba(0,0,0,.1)'
//                        stroke: 'rgba(0,0,0,.1)',
//                        'stroke-width': .5
                    });

//                barBody.append('rect')
//                    .attr({ width: barFrame.inner.w, height: h, fill: _opts.bars.color });
                var barBackground = bar.append('g');

                path = String.format('M0,0');
                path += String.format(' l{0},{1}', 0, barFrame.inner.h);
                path += String.format(' A{0},20,0,0,0,{2},{3}', barFrame.inner.w / 2, 15, barFrame.inner.w, barFrame.inner.h);
                path += String.format(' l{0},{1}', 0, -barFrame.inner.h);
                path += String.format(' A{0},20,0,0,1,{2},{3}', barFrame.inner.w / 2, 15, 0, 0);
                path += String.format('z');
                barBackground.append('path')
                    .attr('d', path)
                    .attr({
                        width: barFrame.inner.w, height: barFrame.inner.h,
                        fill: String.format('url(#{0})', self.frontGradientName) // _opts.bars.backColor
                    });
                barBackground.append('ellipse')
                    .attr({
                        cx: barFrame.inner.w / 2,
                        cy: 0,
                        rx: barFrame.inner.w / 2,
                        ry: 20,
                        fill: 'rgba(0,0,0,.225)',
                        stroke: 'rgba(0,0,0,.1)',
                        'stroke-width': '.5'
                    });

                // value
                var barValue = bar.append('g')
                    .attr('class', 'value-title');
                var barValueIn = barValue.append('g')
                    .attr('chart-value', '');
                barValueIn.append('text')
                    .text(d.valueTitle || d.value);
                self.translate(barValue, barFrame.inner.w / 2, -45);

                if (_opts.bars.topIcon) {
                    var topIcon = manager.renderPath(barValue, _opts.bars.topIcon);
                    //                    topIcon.attr('transform', self.formatTranslate(0, _opts.bars.topIcon.dy));
                }


            });
    }

    function animateChanges(callback) {

        var barsDelay = 35 * 0;
        var barRowsDelay = 8;
        var barDuration = 500;

        self._c.selectAll('g[data-eltype="bars"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes)//.filter('.f-bar-value')
            .each(function (d, i0) {
                if (!d) {
                    return;
                }
                var g0 = d3.select(this);
                var data = d.value;

                var h = self.yScale(d.value);
                var dx = self.w / self.data.length; // - _opts.bars.margin.left - _opts.bars.margin.right;
                var barWidth = _opts.bars.width;

                var valueCore = g0.selectAll('[chart-value]');
                var barOut = g0.selectAll('[chart-bar]');

                valueCore
                    .attr('transform', self.formatTranslate(-25, 0))
                    .style('opacity', 0);

                valueCore.transition()
                    .remove();
                valueCore.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.85)
                    .delay(i0 * barsDelay)
                    .attr('transform', self.formatTranslate(0, 0))
                    .style('opacity', 1);

                /// bar

                var bar = barOut.selectAll('path');
                bar.attr('d', getPath(0, barWidth));

                barOut.transition()
                    .remove();
                barOut.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('transform', self.formatTranslate(0, -h));

                bar.transition()
                    .remove();
                bar.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('fill', d.color)
                    .attr('d', getPath(h, barWidth));

                var ellipse = d3.select(barOut.selectAll('ellipse')[0][0]);
                ellipse.transition()
                    .remove();
                ellipse.transition()
                    .ease('cubic-out')
                    .duration(barDuration * 1.2)
                    .delay(i0 * barsDelay)
                    .attr('fill', d.color);

                function getPath(height, width) {
                    var path = String.format('M0,{0}', 0);
                    path += String.format(' l{0},{1}', 0, height);
                    path += String.format(' A{0},20,0,0,0,{2},{3}', width / 2, 15, width, height);
                    path += String.format(' l{0},{1}', 0, -height);
//                    path += String.format(' L{2},{3}', width / 2, 15, 0, -height);
                    path += String.format('z');

                    return path;
                }
            });
    }

    prepareContainer();
    bindData();
    animateChanges();
}