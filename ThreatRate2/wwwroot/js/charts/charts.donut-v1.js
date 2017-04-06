function chartBoxDonutV1(settings) {

    var self = this;
    var _opts = settings.options;
    var _charts = null;

    self.settings = settings;
    self.container = settings.container;

    self.data = settings.data;

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function prepareContainer() {

        $(self.container).html('');

        var cont = d3.select(self.container);
        self.w = self.container.offsetWidth;
        self.h = self.container.offsetHeight || 250;

        self.x = self.w / 2;
        self.y = self.h / 2;

        self._svg = cont.append('svg')
            .attr('width', self.w)
            .attr('height', self.h);

        self._gr = self._svg.append('g');
        self._c = self._svg.append('g').attr('transform', String.format('translate({0},{1})', self.x, self.y));
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

        self._gr.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', _opts.bars.radius + _opts.bars.radiusOuter)
            .attr('stroke-dasharray', '4,2');
    }

    function getPathRaw(percentageFrom, percentage, radius) {

        var size = radius * 2;
        var k = radius;

        var unit = (Math.PI * 2);
        var startangle = percentageFrom * unit + 0.0001;
        var endangle = percentage * unit - 0.0001;
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
        var endangle = (percentageFrom + (percentage - percentageFrom) / 2)  * unit - 0.001;

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
            var colors = isArray(_opts.bars.color) ? _opts.bars.color : [_opts.bars.color || null];
            return colors[itemIndex];
        }
    }

    function prepareData() {

        var data = _.map(self.data, function(el) { return el.value; });
        var sum = _.reduce(data, function (memo, num) { return memo + num; }, 0);

        var sumLeft = sum;
        var prev = 0;
        _.each(self.data, function(el) {
            var _data = { from: prev, to: prev, percent: 0 };
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
            .each(function(d, i) {

                var g0 = d3.select(this);
                g0.attr('data-eltype', 'block');


                var g = g0.append('g');
                g.attr('data-eltype', 'bar');

                var col1 = d.color;

                var path1 = g.append('path');
                path1.attr('d', getPathByPercentage(d._data.from, d._data.from + .001, _opts.bars.radius, _opts.bars.radiusInner))
                    .attr('fill-rule', 'evenodd')
                    .attr('isvalue', '1')
                    .style({ fill: col1, cursor: 'pointer' });

//                path1.append('title')
//                    .html(d.title + ': ' + d.value);

                var textPoint = {
                    center: getCenterPoint(d._data.from, d._data.to, _opts.bars.radius, _opts.bars.radiusInner),
                    width: 0,
                    height: 0
                };

                var lbl = null
                if (d._data.percent >= .1) {
                    lbl = g.append('text')
                        .attr('text-anchor', 'center')
                        .attr('fill', '#fff')
                        .attr('stroke', null)
                        .text(Math.round(d._data.percent * 100) + '%');

                    var box = lbl.node().getBBox();
                    textPoint.width = box.width;
                    textPoint.height = box.height;

                    lbl.attr('x', textPoint.center.x - box.width / 2);
                    lbl.attr('y', textPoint.center.y + box.height / 2);
                }

                var pathOuter = g.append('path');
                pathOuter.attr('d', getPathByPercentage(d._data.from, d._data.to, _opts.bars.radiusOuter + _opts.bars.radius, _opts.bars.radius))
                    .attr('fill-rule', 'evenodd')
                    .attr('isouter', '1')
                    .style({ fill: function(d) { return d3.rgb(col1).darker(.7); }, cursor: 'pointer', opacity: 0 });
                d._data.pathOuter = pathOuter;
                return;
                var tooltipOptions = {
                    x: -76.4 - 1 + (textPoint.center.x) - self.x,
                    y: -40 + (textPoint.center.y) - self.y,
                    dx: -1,
                    dy: -1,
                    id: i,
                    parent: self.container,
                    className: (_opts.tooltip || {}).className
                };
                var tooltipText = [d.title, String.format('{0} ({1}%)', d.value, Math.round(d._data.percent * 10 * 100) / 10)];

                var tooltip = null;
                var showTooltip = function() {
                    tooltipOptions.x = -76.4 - 1 + (textPoint.center.x) + self.x;
                    tooltipOptions.y = -40 + (textPoint.center.y) + self.y;

                    if (tooltip) {
                        tooltip.hide();
                        tooltip = null;
                    }

                    if (!_opts.tooltip || (_opts.tooltip.enabled !== false)) {
                        tooltip = new chartsTooltip(tooltipOptions, tooltipText);

//                        tooltip.style({ display: '' })
//                            .transition().duration(150).ease('linear').style({ opacity: 1 });
                    }
                    pathOuter.transition().duration(200).ease('linear').style({ opacity: 1 });
                };

                var hideTooltip = function() {
                    if (tooltip) {
                        tooltip.hide();
                        tooltip = null;
                    }
//                    tooltip.style({ display: 'none', opacity: 0 });

                    pathOuter.transition().duration(200).ease('linear').style({ opacity: 0 });
                };

                var isStillOn = false;
                var isStillActive = false;

                var onPosition = function () {
                    if (!tooltip) {
                        return;
                    }
                    var coordinates = d3.mouse(self._svg[0][0]);
                    tooltip.position({ x: coordinates[0], y: coordinates[1] });
                };

                var onMouseOver = function () {
//                    console.log('on');
                    if (!isStillOn) {
                        showTooltip();
                        onPosition();
                    }
                    isStillOn = true;
                    isStillActive = true;
                };
                var onMouseOut = function () {
//                    console.log('out');
                    window.setTimeout(function() {
                        if (!isStillActive) {
                            hideTooltip();
                            isStillOn = false;
                        }
                    }, 0);
    //                    isStillOn = false;
                    isStillActive = false;
                };

                g0.on('mouseover', onMouseOver);            
                g0.on('mouseout', onMouseOut);
                path1.on('mousemove', onPosition);
                pathOuter.on('mousemove', onPosition);

            if (lbl) {
//                                lbl.on('mouseover', onMouseOver);            
//                lbl.on('mouseout', onMouseOut);
                lbl.on('mousemove', onPosition);

            }
        });

        var leftSection = [], rightSection = [];
        _.each(self.data, function(d) {
            var percentCenter = d._data.from + (d._data.to - d._data.from) / 2;
            if (percentCenter < .5) {
                rightSection.push({ data: d, percentCenter: percentCenter });
            } else {
                leftSection.push({ data: d, percentCenter: percentCenter });
//                leftSection.splice(0, 0, { data: d, percentCenter: percentCenter });
            }
        });

        _.each([{ isLeft: true, s: leftSection }, { isLeft: false, s: rightSection }], function(s) {
            var top = 10 + 10, bottom = self.h - 10 - 20, marginLeft = 10, marginRight = 10;

            var dy = (bottom - top) / (s.s.length <= 1 ? 1 : s.s.length - 1);
//            var dyGap = ;
            _.each(s.s, function(el, elIndex) {
                var indexCorrected = (s.s.length == 1 && (s.isLeft && el.percentCenter >= .75 || !s.isLeft && el.percentCenter > .25) ? 1 : elIndex);
                el.y = s.isLeft ? bottom - indexCorrected * dy : top + indexCorrected * dy;

                var g0 = self._t0.append('g');

                var correction = { dx: -self.x, dy: -self.y };
                var firstPoint = { x: correction.dx + (s.isLeft ? marginLeft : self.w - marginRight), y: correction.dy + el.y + 7};
                var lbl = g0.append('text')
                    .text(el.data.title)
                    .attr('x', firstPoint.x)
                    .attr('y', firstPoint.y - 7)
                    .attr('text-anchor', s.isLeft ? 'start' : 'end')
                    .attr('alignment-baseline', 'middle')
                    .attr('class', 'title ' + (s.isLeft ? 'start' : 'end'))
                    .style({cursor: 'pointer'});
                var box = lbl.node().getBBox();


                var points = [];
                points.push(firstPoint);
                points.push({ x: correction.dx + (s.isLeft ? marginLeft + box.width : self.w - marginRight - box.width), y: correction.dy + el.y + 7});
                var center = getCenterPoint(el.data._data.from, el.data._data.to, _opts.bars.radius, _opts.bars.radiusInner);
                var lastY = center.y + (el.data._data.percent < .1 ? 0 : (s.isLeft ? (el.percentCenter < .75 ? 12 : -10) : (el.percentCenter < .25 ? -10 : 12)));
                var lastPoint = { x: center.x, y: lastY };
                points.push(lastPoint);

                var pathD = '';
                _.each(points, function(p, pIndex) {
                    pathD += String.format('{0}{1},{2}', (pIndex == 0 ? 'M' : 'L'), p.x, p.y);
                });
                var path = g0.append('path')
                    .attr('d', pathD)
                    .attr('fill', 'none')
                    .attr('stroke', '#D8D8D8')
                    .attr('stroke-width', 1)
                    .style('pointer-events', 'none');


                var circle = g0.append('circle')
                    .attr('cx', lastPoint.x)
                    .attr('cy', lastPoint.y)
                    .attr('r', 3)
                    .attr('fill', '#D8D8D8')
                    .attr('stroke', 'none')
                    .style('pointer-events', 'none');

                var pathOuter = el.data._data.pathOuter;
                g0.on('mouseover', function () {
                    pathOuter.transition().duration(200).ease('linear').style({ opacity: 1 });
                });

                g0.on('mouseout', function () {
                    pathOuter.transition().duration(200).ease('linear').style({ opacity: 0 });
                });
            });


        });



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
                var duration = 500;
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
                    return getPathByPercentage(obj._data.from, obj._data.from + dP, r, rIn)
                }
            }
        }
    }

    function checkAndIndicateIfDataEmpty() {
        var total = 0;
        _.each(self.data, function (d) {
            if(!!d._data)
                total += d._data.percent;
        });

        if (total < 0.01) {
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
            animateChanges(function() {
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

    try{
        bindData();
    } catch (e) { }
    try {
        animateChanges();
    } catch (e) {

    }

    checkAndIndicateIfDataEmpty();
}