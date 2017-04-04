function chartBoxDonut(settings) {

    var self = this;
    self.name = 'bagel';

    chartBase(self);
    initialize();

    self.settings = settings;
    self.container = settings.container;
    self.data = settings.data;

    var _opts = self.mergeDefaults(settings.options);
    var _charts = null;


    function initialize() {
        self.getDefaults = function () {
            var d = {
                layout: {
                    /*
                                        bars: {
                                            title: {
                                                width: 50
                                            },
                                            separator: {
                                                width: 20
                                            },
                                            bar: {
                                                width: 200,
                                                height: 20,
                                                margin: {
                                                    top: 3,
                                                    bottom: 3
                                                },
                                                background: '#ccc'
                                            },
                                            value: {
                                                width: 40
                                            },
                                            value2: {
                                                width: 40
                                            }
                                        }
                    */
                },
                axis: {},
                bars: {
                    radius: 50,
                    radiusInner: 40,
                    legend: {
                        position: 'none'
                    },
                    fullFillMode: true, // treats max value as '1' not having to fill the whole circle
                    oneItemMode: false, // the sides of the bar are convex for oneItemMode = true
                    background: null // color, width
                }
            };

            d.layout.padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }

            //            d.bars.maxValue = 100;
            //            d.bars.maxValueRangeMultiplier = 1.05;

            return d;
        }
    }


    function prepareContainer() {

        self.initializeLayout(_opts);

        self.x = self.w / 2;
        self.y = self.h / 2;

        self._c.attr('transform', String.format('translate({0},{1})', self.x, self.y));

        self._gr = self._svg.append('g');
        self._t0 = self._svg.append('g').attr('transform', String.format('translate({0},{1})', self.x, self.y));
        self._t = self._svg.append('g').attr('transform', String.format('translate({0},{1})', self.x, self.y));

        self._empty = self._svg.append('g').attr('transform', String.format('translate({0},{1})', self.x, self.y))
            .style('display', 'none');

        self.xScale = d3.scale.ordinal()
            .domain(d3.range(0, 1))
            .rangeBands([0, 360]);


        // grid
        self._gr
            .attr('stroke-width', '1')
            .attr({ fill: 'none' })
            .attr({ stroke: '#e5e5e5' })
            .attr('transform', String.format('translate({0},{1})', self.x, self.y));

        /*
                self._gr.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', _opts.bars.radius + _opts.bars.radiusOuter)
                    .attr('stroke-dasharray', '4,2');
        */
    }

    function getPathRaw(percentageFrom, percentage, radius) {

        var size = radius * 2;
        var k = radius;

        var unit = (Math.PI * 2);
        var startangle = percentageFrom * unit + 0;
        var endangle = percentage * unit - 0;
        var x1 = (size / 2) * Math.sin(startangle);
        var y1 = -(size / 2) * Math.cos(startangle);
        var x2 = (size / 2) * Math.sin(endangle);
        var y2 = -(size / 2) * Math.cos(endangle);
        var big = 0;
        if (endangle - startangle > Math.PI) {
            big = 1;
        }
        var d = "M 0,0" +  // Start at circle center
            " L " + (x1) + "," + (y1) +     // Draw line to (x1,y1)
            " A " + (size / 2) + "," + (size / 2) +       // Draw an arc of radius r
            " 0 " + big + " 1 " +       // Arc details...
            (x2) + "," + (y2) +             // Arc goes to to (x2,y2)
            " Z";                       // Close path back to (cx,cy)

        return d;
    }


    function getCenterPoint(percentageFrom, percentage, radius, radiusInner) {

        var size = (radius - (radius - radiusInner) / 2);

        var unit = (Math.PI * 2);
        var endangle = (percentageFrom + (percentage - percentageFrom) / 2) * unit - 0.001;

        var x2 = (size) * Math.sin(endangle);
        var y2 = -(size) * Math.cos(endangle);

        return { x: x2, y: y2 };
    }

    function getPathByPercentage(percentageFrom, percentage, radius, radiusInner) {

        var pathOuter = getPathRaw(percentageFrom, percentage, radius);
        var pathInner = getPathRaw(percentageFrom, percentage, radiusInner);

        return pathOuter + ' ' + pathInner;
    }

    function getColorByPercentage(percentage, itemIndex) {
        if (percentage === 0) {
            return '#ECECEC';
        } else {
            var colors = self.isArray(_opts.bars.color) ? _opts.bars.color : [_opts.bars.color || null];
            return colors[itemIndex];
        }
    }

    function prepareData() {

        var data = _.map(self.data, function (el) { return el.value; });
        var sum = !_opts.bars.fullFillMode ? 1.000001 : _.reduce(data, function (memo, num) { return memo + num; }, 0);

        var prev = 0;
        var prevElement = null;
        _.each(self.data, function (el) {
            var _data = { from: 0, to: prev, percent: 0 };
            _data._prev = prevElement;
            prevElement = _data;

            //            var _data = { from: prev, to: prev, percent: 0 };
            if (sum === 0) {
                return;
            }
            var percent = el.value / sum;
            prev += percent;
            _data.to = prev;
            _data.percent = percent;

            el._data = _data;
        })
    }

    function bindData() {

        var charts = self._c.selectAll('g').data(self.data)
            .enter().append('g')
            .each(function (d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'block');


                var g = g0.append('g');
                g.attr('data-eltype', 'bar');

                var col1 = d.color;

                var path1 = g.append('path');
                path1.attr('d', getPathByPercentage(d._data.from, d._data.from + 0, _opts.bars.radius, _opts.bars.radiusInner))
                    .attr('fill-rule', 'evenodd')
                    .attr('isvalue', '1')
                    .style({
                        fill: col1,
//                        cursor: 'pointer',
                        stroke: self.isWhite(col1) ? '#ccc' : null
                    });

                /// background on top
                if (_opts.bars.background) {
                    var gBackground = g0.append('g');
                    gBackground.attr('data-eltype', 'back');

                    gBackground.append('circle')
                        .attr({
                            cx: 0,
                            cy: 0,
                            r: _opts.bars.radiusInner + 6,
//                            r: _opts.bars.radiusInner + (_opts.bars.radius - _opts.bars.radiusInner) / 2,
                            stroke: _opts.bars.background.color,
                            'stroke-width': 1,
                            'stroke-dasharray': '6,6',
//                            'stroke-width': _opts.bars.background.width,
                            'fill': 'rgba(255,255,255,.25)' ||  _opts.bars.background.fill || 'none'
                        });
                }

            });

        if (_opts.bars.legend.position !== 'none') {
            var leftSection = [], rightSection = [];
            _.each(self.data, function (d) {
                if (_opts.bars.legend.position === 'left') {
                    leftSection.splice(0, 0, { data: d });
                } else if (_opts.bars.legend.position === 'right') {
                    rightSection.push({ data: d });
                }
            });

            _.each([{ isLeft: true, s: leftSection }, { isLeft: false, s: rightSection }], function (s) {
                var top = 30 + 10, bottom = self.h - 15 - 20, marginLeft = 10, marginRight = 10;

                var dy = (bottom - top) / (s.s.length <= 1 ? 1 : s.s.length - 1);
                //            var dyGap = ;
                var firstCirclePoint = null;
                var lastCirclePoint = null;
                _.each(s.s, function (el, elIndex) {
                    var indexCorrected = (s.s.length == 1 && (s.isLeft && el.percentCenter >= .75 || !s.isLeft && el.percentCenter > .25) ? 1 : elIndex);
                    el.y = s.isLeft ? bottom - indexCorrected * dy : top + indexCorrected * dy;

                    var g0 = self._t0.append('g');

                    var correction = { /*dx: -self.x + (s.isLeft ? 0 : -30),*/ dy: -self.y };
                    //                var firstPoint = { x: correction.dx + (s.isLeft ? marginLeft/* + box.width*/ : self.w - marginRight /*- box.width*/), y: correction.dy + el.y + 7 };
                    var firstPoint = { x: s.isLeft ? -self.w / 2 + 10 : self.w / 2 - 83, y: correction.dy + el.y + 7 };
                    //                var secondPoint = { x: correction.dx + (s.isLeft ? marginLeft : self.w - marginRight), y: correction.dy + el.y + 7};

                    lastCirclePoint = {
                        x: firstPoint.x,
                        y: firstPoint.y - 10
                    };

                    if (firstCirclePoint === null) {
                        firstCirclePoint = lastCirclePoint;
                    }

                    var circle = g0.append('circle')
                        .attr('cx', lastCirclePoint.x)
                        .attr('cy', lastCirclePoint.y)
                        .attr('r', 4)
                        .style({ fill: el.data.color, stroke: self.isWhite(el.data.color) ? '#ccc' : null });

                    var lbl = g0.append('text')
                        //                    .text(el.data.title)
                        .text(Math.round(el.data.value * 100) + '%')
                        .attr('x', firstPoint.x + 12)
                        .attr('y', firstPoint.y - 7)
                        .attr('text-anchor', 'start') // s.isLeft ? 'start' : 'end')
                        .attr('alignment-baseline', 'middle')
                        .attr('class', 'title')
                        //                    .style({ fill: el.data.color });
                        ;

                });
                if (firstCirclePoint && lastCirclePoint) {
                    self._t0.insert('line', ':first-child')
                        .attr({
                            x1: firstCirclePoint.x,
                            y1: firstCirclePoint.y,
                            x2: lastCirclePoint.x,
                            y2: lastCirclePoint.y
                        })
                        .style({
                            'stroke-dasharray': '3,2',
                            stroke: '#ccc',
                            'stroke-width': 2
                        });

                }

            });

        }
        if (_opts.bars.legend.title) {
            var lblGroup = self._t0.append('g');
            var lbl = lblGroup
                .append('text')
                .text(_opts.bars.legend.title)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('class', 'legend-title');

            var box = lbl.node().getBBox();
            var boxMaxWidth = (_opts.bars.radiusInner - 5) * 2;
            if (box.width > boxMaxWidth) {

                var sentense = _opts.bars.legend.title;
                var firstWord = sentense, secondWord;
                var ind = sentense.lastIndexOf(' ');
                if (ind === -1) {
                    ind = sentense.lastIndexOf('-');
                }
                if (ind > -1) {
                    firstWord = sentense.substr(0, ind);
                    secondWord = sentense.substr(ind);
                }
                lbl.text(firstWord);

                if (secondWord) {
                    var lbl2 = lblGroup
                        .append('text')
                        .text(secondWord)
                        .attr('text-anchor', 'middle')
                        .attr('alignment-baseline', 'middle')
                        .attr('class', 'legend-title')
                        .attr('transform', self.formatTranslate(0, box.height * 1.00));

                    lblGroup
                        .attr('transform', self.formatTranslate(0, -box.height * (1 + .00) / 2));
                }
            }
        }

        _charts = charts;
    }

    function animateChanges(callback) {

        var delay = 0;
        self._c.selectAll('g[data-eltype="block"]').data(self.data);
        d3.selectAll(self._c[0][0].childNodes).filter('[data-eltype="block"]')
            .each(function (d, i) {
                if (!d) {
                    return;
                }

                var g0 = d3.select(this);

                var g = g0.selectAll('[data-eltype="bar"]');

                var b = g.selectAll('[isvalue="1"]');
                var duration = 1000;
                //                var duration = d._data.percent * 1500;
                b.transition()
                    .ease('cubic-out')
                    .duration(duration)
                    .delay(delay)
                    .attrTween("d", translateDonut(_opts.bars.radius, _opts.bars.radiusInner))
                    //                    .attr('d', getPathByPercentage(d._data.from, d._data.to, _opts.bars.radius, _opts.bars.radiusInner));
                    ;
                //                delay += duration;
            });

        function translateDonut(r, rIn) {
            return function (obj) {
                return function (t) {
                    var dP = obj._data.percent * t;
                    var fromPrev = obj._data._prev ? obj._data._prev.to * t : 0;
                    return getPathByPercentage(obj._data.from + fromPrev, obj._data.from + fromPrev + dP, r, rIn);
                }
            }
        }
    }

    function checkAndIndicateIfDataEmpty() {
        var total = 0;
        _.each(self.data, function (d) {
            if (!!d._data)
                total += d._data.percent;
        });

        if (false && total < 0.01) {
            self._empty.selectAll('*').remove();
            self._empty.append('text')
                .attr('class', 'data-empty')
                .text('No relevant analytics')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle');
        }
        self._empty.style('display', total < 1 ? '' : 'none');
    }

    self.applyValues = function (data) {
        if (data.length === self.data.length) { // animating changes
            self.dataPrev = self.data;
            self.data = data;
            prepareData();
            animateChanges(function () {
                self.dataPrev = null;
            });
        } else {
            self.data = data;
            prepareContainer();
            bindData();
        }
    }

    prepareData();
    prepareContainer();

    try {
        bindData();
    } catch (e) { }
    try {
        animateChanges();
    } catch (e) {

    }

    checkAndIndicateIfDataEmpty();
}