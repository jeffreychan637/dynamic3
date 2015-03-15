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

    finishSetup: function(node) {
        this.ctx = d3.select(node)
            .append('svg:svg')
            //.attr('class', opts.class)
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
        var r = data > width ? width : data;
        var cx = this.options.width / 2;
        var cy = this.options.height / 2;

        chart.enter().append('svg:circle')
             .attr('r', r)
             .attr('cx', cx)
             .attr('cy', cy)

        chart.transition()
             .duration(this.options.transitionTime)
             .attr('r', r)
             .attr('cx', cx)
             .attr('cy', cy)

        chart.exit().remove()
    }
};

dynamic3.__ctors = {
    'Circle': dynamic3.CircleGraph
};

dynamic3.createGraph = function(str) {
    return new dynamic3.__ctors[str];
};
