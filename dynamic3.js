window.dynamic3 = {};

dynamic3.Graph = function() {
    this.options = {};
    this.data = null;
    this.ctx = null;
};

dynamic3.Graph.prototype = {
    constructor: dynamic3.Graph,

    setBackgroundColor: function(color) {
        this.options.backgroundColor = color;
        return this;
    },

    setBorderColor: function(color) {
        this.options.borderColor = color;
        return this;
    },

    setBorderWidth: function(width) {
        this.options.borderWidth = width;
        return this;
    },

    setMaxRadius: function(radius) {
        this.options.maxRadius = radius;
        return this;
    },
    
    setTransitionTime: function(time) {
        this.options.transitionTime = time;
        return this;
    },

    setHeight: function(height) {
        this.options.height = height;
        return this;
    },

    setWidth: function(width) {
        this.options.width = width;
        return this;
    },
    
    setDomain: function(domain) {
        this.options.domain = domain;
        return this;
    },

    setText: function(f) {
        this.options.text = f;
        return this;   
    },
    
    setTextColor: function(color) {
        this.options.textColor = color;
        return this;
    },
    
    __updateStyles: function(chart) {
        chart.style('fill', this.options.backgroundColor);
        chart.style('stroke', this.options.borderColor);
        chart.style('stroke-width', this.options.borderWidth);
    },

    insertIntoHTMLElement: function(node) {
        this.ctx = d3.select(node)
            .append('svg:svg')
            .attr('width', parseFloat(this.options.width))
            .attr('height', parseFloat(this.options.height))
    }
};

//dynamic3.applyStylesToD3Graph = function(styles, fromOpts, ctx) {
//  var aStyle
//    , i
//  for (i = 0; i < styles.length; i++) {
//    aStyle = styles[i]
//    ctx.style(aStyle, fromOpts[aStyle])
//  }
//}

dynamic3.CircleGraph = function() { 
    dynamic3.Graph.call(this);
}

dynamic3.CircleGraph.prototype = {
    __proto__: dynamic3.Graph.prototype,
    constructor: dynamic3.CircleGraph,

    update: function(data) {
        var oldData = this.data;

        var chart = this.ctx.selectAll('circle')
                        .data([data]);

        var width = parseFloat(this.options.width);
        var height = parseFloat(this.options.height);
        var border = this.options.borderWidth ? parseFloat(this.options.borderWidth) : 0;
        var r = d3.scale.linear().domain(this.options.domain || [0, 1]).range([5, width / 2 - border]);
        var cx = width / 2;
        var cy = height / 2;

        chart.enter().append('svg:circle')
             .attr('r', r)
             .attr('cx', cx)
             .attr('cy', cy)
        
        this.__updateStyles(chart)

        chart.transition()
             .duration(this.options.transitionTime)
             .attr('r', r)
             .attr('cx', cx)
             .attr('cy', cy)

        if (this.options.text) {
            var textChart = this.ctx.selectAll('text')
                            .data([data]);
            textChart.enter().insert('svg:text')
                             .attr('x', 25)
                             .attr('y', 25)
                             .attr('fill', this.options.textColor || 'black')
                             .text(this.options.text);

            textChart.transition()
                     .duration(this.options.transitionTime)
                     .text(this.options.text);
        }
    }
};

dynamic3.BarGraph = function() {
    dynamic3.Graph.call(this);
    this.options.vertical = true;
}

dynamic3.BarGraph.prototype = {
    __proto__: dynamic3.Graph.prototype,
    constructor: dynamic3.BarGraph,
    
    setPadding: function(padding) {
        this.options.padding = padding;
        return this;
    },
    
    setOrientation: function(orientation) {
        if (orientation === "horizontal") {
            this.options.vertical = false;
        } else if (orientation === "vertical") {
            this.options.vertical = true;
        } else {
            console.error("Orientation must be the string 'horzontal' or 'vertical'");
        }
        return this;
    },

    getOrientation: function() {
        if (this.options.vertical)
            return "vertical";
        return "horizontal";
    },

    update: function(data) {
        console.assert(Array.isArray(data), "Data elements to Bar Graph should be an array.");
        var oldData = this.data;
        if (oldData) {
            console.assert(oldData.length === data.length, "Data lengths shouldn't change");
        }
        this.data = data;

        var padding = this.options.padding || 2;

        var x, y, width, height;
        if (this.options.vertical) {
            width = parseFloat(this.options.width) / data.length - padding - padding / data.length;
            var canvasHeight = parseFloat(this.options.height);
            height = d3.scale.linear().domain(this.options.domain || [0, 1]).range([0, canvasHeight]);
            y = function(d) {
                return canvasHeight - height(d);
            };
            x = function(d, i) {
                return i * width + (i + 1) * padding;
            };
        } else {
            var canvasWidth = parseFloat(this.options.width);
            width = d3.scale.linear().domain(this.options.domain || [0, 1]).range([0, canvasWidth]);
            height = parseFloat(this.options.height) / data.length - padding - padding / data.length;
            x = 0;
            y = function(d, i) {
                return i * height + (i + 1) * padding;
            };
        }   

        var chart = this.ctx.selectAll('rect')
                        .data(data);

        chart.enter().append('svg:rect')
                     .attr('x', x)
                     .attr('y', y)
                     .attr("width", width)
                     .attr("height", height)
        
        this.__updateStyles(chart)

        if (this.options.text) {
            var textChart = this.ctx.selectAll('text')
                            .data(data);

            var textX, textY, transform;
            if (this.options.vertical) {
                textX = function(d, i) {
                    return i * width + (i + 1) * padding;
                }
                textY = padding;
                transform = function(d, i) {
                    var command = "translate(" + textX(d, i) + "," + textY + ")";
                    command += "rotate(-90)";
                    // Note that translations have x,y exchaged because we're rotated 90 degrees.
                    command += "translate(" + (-textX(d, i) - canvasHeight + textY*2) + "," + (width/2) + ")";
                    return command;
                }
            } else {
                textX = padding;
                textY = function(d, i) {
                    return i * height + height/2 + (i + 1) * padding;
                    /* Use (i + 1) to account for initial padding. Add height/2 to put label in middle of bar. */
                }
                transform = function() {
                    return "rotate(0)";
                }
            }

            textChart.enter().insert('svg:text')
                             .attr('x', textX)
                             .attr('y', textY)
                             .attr('fill', this.options.textColor || 'black')
                             .attr("transform", transform)
                             .text(this.options.text);

            textChart.transition()
                     .duration(this.options.transitionTime)
                     .attr('x', textX)
                     .attr('y', textY)
                     .attr('fill', this.options.textColor || 'black')
                     .attr("transform", transform)
                     .text(this.options.text);
        }


        chart.transition()
             .duration(this.options.transitionTime)
             .attr('width', width)
             .attr('height', height)
             .attr('y', y)
             .attr('x', x);
    }
};

dynamic3.SlidingBarGraph = function() { 
    dynamic3.Graph.call(this);
};

dynamic3.SlidingBarGraph.prototype = {
    __proto__: dynamic3.Graph.prototype,

    setNumberOfBars: function(num) {
        this.options.numberOfBars = num;
        return this;
    },

    update: function(data) {

        data = data.slice( -this.options.numberOfBars ) //grab the last (this.numberOfBars) number of points in our array
        data = data.reverse();

        var separator = 4;
        
        var height = parseFloat(this.options.height);
        var width = parseFloat(this.options.width);
        var barWidth;
        //ensure separator isn't too big compared to barWidth. i.e barWidth must be at least 1 px
        ;(function fixBarWidth() {
            barWidth = (width - (separator * data.length)) / data.length;
            barWidth = Math.floor(barWidth)
            if (barWidth < 1) {
                separator = Math.floor(separator/1.25);
                fixBarWidth();
            }
        })();
        
        var yScale = d3.scale.linear()
                   .domain(this.options.domain)
                   .range([height * 0.05, height]); //5 percent of height is minimum size

        var toAll = {
            'x' : function(d, i) { return i*barWidth + i*separator;}
            , 'y' : function (d) { return height - yScale(d.val); }
            , 'width' : function () { return barWidth; }
            , 'height' : function(d) { return yScale(d.val) }
        };

        var chart = this.ctx.selectAll('rect')
                   .data(data, function(d) { return d.uid })

        //d.val === UID for data. this is crucual. check out => http://mbostock.github.com/d3/tutorial/bar-2.html
        chart.enter().append('svg:rect')
             .attr('x', function(d, i) { return toAll.x(d, i - 1); }) //slide in from left
             .attr('y', toAll.y)
             .attr('width', toAll.width)
             .attr('height', toAll.height);

        this.__updateStyles(chart);

        chart.transition()
             .duration(this.options.transitionTime)
             .ease("linear")
             .attr('x', toAll.x)
             .attr('y', toAll.y)
             .attr('height', toAll.height)
              //'width' is necessary b/c when the graph is first started, we increase the number of data points.
             .attr('width', toAll.width);

        chart.exit()
             .transition()
             .duration(this.options.transitionTime)
             .ease("linear")
             .attr('x', function(d, i) { return toAll.x(d, data.length); }) //slide out to right
             .remove();
       }
};

dynamic3.__constructors = {
    'Circle': dynamic3.CircleGraph,
    'BarGraph': dynamic3.BarGraph,
    'SlidingBarGraph': dynamic3.SlidingBarGraph
};

dynamic3.createGraph = function(str) {
    return new dynamic3.__constructors[str];
};
