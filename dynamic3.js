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

    finishSetup: function(node) {
        this.ctx = d3.select(node)
            .append('svg:svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
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
    update: function(data) {
        var oldData = this.data;

        var chart = this.ctx.selectAll('circle')
                        .data([data]);

        var width = this.options.width ;
        var r = d3.scale.linear().domain(this.options.domain || [0, 1]).range([5, this.options.width / 2]);
        var cx = this.options.width / 2;
        var cy = this.options.height / 2;

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
}

dynamic3.BarGraph.prototype = {
    __proto__: dynamic3.Graph.prototype,
    
    setPadding: function(padding) {
        this.options.padding = padding;
        return this;
    },
    
    update: function(data) {
        console.assert(Array.isArray(data), "Data elements to Bar Graph should be an array.");
        var oldData = this.data;
        if (oldData) {
            console.assert(oldData.length === data.length, "Data lengths shouldn't change");
        }
        this.data = data;
        
        var width = d3.scale.linear().domain(this.options.domain || [0, 1]).range([0, this.options.width]);
        var padding = this.options.padding || 2;
        var height = this.options.height / data.length - padding - padding / data.length;

        var chart = this.ctx.selectAll('rect')
                        .data(data);
    
        chart.enter().append('svg:rect')
                     .attr('x', 0)
                     .attr('y', function(d, i) {return i * height + (i + 1) * padding})
                     .attr("width", width)
                     .attr("height", height)
        
        this.__updateStyles(chart)
        
        if (this.options.text) {
            var textChart = this.ctx.selectAll('text')
                            .data(data);
            textChart.enter().insert('svg:text')
                             .attr('x', padding)
                             .attr('y', function(d, i) {return i * height + height/2 + (i + 1) * padding})
                             .attr('fill', this.options.textColor || 'black')
                             .text(this.options.text);
            textChart.transition()
                     .duration(this.options.transitionTime)
                     .text(this.options.text);
        }
        
                    
        chart.transition()
             .duration(this.options.transitionTime)
             .attr('width', width)
    }
};


dynamic3.__ctors = {
    'Circle': dynamic3.CircleGraph,
    'Bar': dynamic3.BarGraph
};

dynamic3.createGraph = function(str) {
    return new dynamic3.__ctors[str];
};
