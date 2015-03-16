window.onload = function() {
    var graph = dynamic3.createGraph('Circle')
                        .setBackgroundColor('blue')
                        .setBorderColor('yellow')
                        .setBorderWidth(1)
                        .setWidth(500)
                        .setHeight(500)
                        .setDomain([0,100])
                        .setTransitionTime(400); // 200ms transition time from state to state.
    
    var bar = dynamic3.createGraph('Bar')
                        .setWidth(500)
                        .setHeight(600)
                        .setDomain([0,100])
                        .setPadding(10)
                        .setTransitionTime(400)
                        .setBackgroundColor('red')
                        .setText(function(data) { return data })
                        .setTextColor('white')

    bar.finishSetup(document.getElementById("target2"));
    graph.finishSetup(document.getElementById("target")); // This will connect our d3 graph with the dom element.
    // For now, it may be simpler to impose the rule that all styles must be decided before this finishSetup function is called.
    // Like the above setup would maybe throw an error after we've already "finished our setup". I'm not sure if this will
    // actually be helpful or not until we actually start hacking on the library. But this is a simple enough
    // constraint to begin with. After finishSetup, the only function you can call on a graph is 'update()'

    // Note, this data can be anything. This is just something random as an example.
    function loopWithRandomDynamicData() {
        var data = Math.random() * 100; // random number between 0 and 100
        graph.update(data); // This will be the heart of our API, something that just updates from one state to the next.
        bardata = [];
        for (var i = 0; i < 10; i += 1) {
            bardata[i] = Math.random() * 100 | 0;
        }
        bar.update(bardata);
        var waitTime = Math.random() * 3000; // wait between 0 and 3 seconds for next data point.
        setTimeout(loopWithRandomDynamicData, waitTime)
    }
    
    loopWithRandomDynamicData();
}
