function chartBase(itemToInherit) {
    var self = itemToInherit || this;

    self.manager = window.ChartsManager;

    self.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    self.mergeDefaults = function (data) {
        var defaults = self.getDefaults ? self.getDefaults() : {};

        defaults = self.clone(defaults);

        _.merge(defaults, data);

        return defaults;
    };

    self.formatTranslate = function (x, y) {
        return String.format('translate({0}, {1})', x ? x + '' : 0, y ? y + '' : 0);
    };

    self.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    self.isWhite = function(color) {
        return (color || '').toLowerCase() === '#ffffff';
    };

    self.initializeLayout = function (opts) {
        var container = self.container[0] || self.container;
        $(container).html('');

        var isContNative = !($(container).is('svg') || $(container).is('g'));

        var pad = ((opts.layout || {}).padding || {});
        pad.left = pad.left || 0;
        pad.right = pad.right || 0;
        pad.top = pad.top || 0;
        pad.bottom = pad.bottom || 0;

        self.w = (isContNative ? self.container.offsetWidth : opts.layout.width || 400) - pad.left - pad.right;
        self.h = (isContNative ? (self.container.offsetHeight || 250) : opts.layout.height || 250) - pad.top - pad.bottom;
        self.w = self.w < 0 ? 0 : self.w;
        self.h = self.h < 0 ? 0 : self.h;

//        self.frame = {
//            w: self.w - pad.left - pad.right,
//            h: self.h - pad.top - pad.width
//        };

        var cont = isContNative ? d3.select(self.container) : self.container;

        self._svg = isContNative ? cont.append('svg')
            .attr('width', self.w + pad.left + pad.right)
            .attr('height', self.h + pad.top + pad.bottom)
            : cont;

        var tmp = self._svg.append('g');
        self._layout = tmp.attr('transform', String.format('translate({0},{1})', pad.left, pad.top));
        self._c = self._layout.append('g');
    };

    self.translate = function (element, dx, dy) {
        return element.attr('transform', self.formatTranslate(dx || 0, dy || 0));
    };

    self.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    
    self.appendTextMultiline = function (container, text, paramsOrWidth) {

        var params;
        if (self.isNumeric(paramsOrWidth)) {
            params = { width: paramsOrWidth };
        } else {
            params = paramsOrWidth || {};
        }
        var anchor = params.anchor || 'middle';
//        var baseline = params.baselineShift || 'central';
        var separator = params.separator || '\n';
        var addGroupWrapper = params.group !== false;
        var width = params.width || 50;
        var vertical = params.VERTICAL || 'top';

        var group = addGroupWrapper ? container.append('g') : container;

        text = text || '';
        var textGroups;
        if (params.separator) {
            textGroups = (text + '').split(separator);
        } else {
            textGroups = [];
            console.log(text);
            var wordsBlocks = (text + '').match(/\S+\s*/g);
            var currentOk = '';
            _.each(wordsBlocks, function(block, i) {
                var testText = currentOk + block;
                var text = group.append('text').text(testText)
                    .attr('fill', 'transparent').style('fill', 'transparent');
                var box = text.node().getBBox();
                text.remove();
                if (box.width <= width) {
                    currentOk = testText;
                } else {
                    if (currentOk) {
                        textGroups.push(currentOk);
                        currentOk = block;
                    } else {
                        textGroups.push(testText);
                    }
                }
                if (i === wordsBlocks.length - 1) {
                    if (currentOk) {
                        textGroups.push(currentOk);
                    }
                }
            });
        }
        var total = textGroups.length;

        if (total === 0) {

        } else if (total === 1) {
            group.append('text')
                .text(text)
                .attr('text-anchor', anchor)
//                .attr('dominant-baseline', baseline);
        } else {
            var dy = null;
            for (var i = 0; i < total; i++) {
                var txt = group.append('text')
                    .text(textGroups[i] + (i < total - 1 ? separator : ''));
                if (dy === null) {
                    var box = txt.node().getBBox();
                    dy = box.height;
                }

                var y = dy * (vertical === 'top' ? i :
                    (Math.round(i + 1 - total / 2 - .5) - (1 - (total % 2)) * .5));
                txt.attr('transform', self.formatTranslate(0, y))
                    .attr('text-anchor', anchor)
//                    .attr('dominant-baseline', baseline);
            }
        }

        return group;
    };
}