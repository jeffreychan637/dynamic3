window.onload = function() {
    var graph = dynamic3.createGraph('Circle')
                        .setBackgroundColor('white')
                        .setBorderColor('black')
                        .setBorderWidth('2px')
                        .setWidth(500)
                        .setHeight(500)
                        .setTransitionTime(400); // 200ms transition time from state to state.

    graph.finishSetup(document.getElementById("target")); // This will connect our d3 graph with the dom element.
    // For now, it may be simpler to impose the rule that all styles must be decided before this finishSetup function is called.
    // Like the above setup would maybe throw an error after we've already "finished our setup". I'm not sure if this will
    // actually be helpful or not until we actually start hacking on the library. But this is a simple enough
    // constraint to begin with. After finishSetup, the only function you can call on a graph is 'update()'

    // Note, this data can be anything. This is just something random as an example.
    function loopWithRandomDynamicData() {
        var data = Math.random() * 100; // random number between 0 and 100
        graph.update(data); // This will be the heart of our API, something that just updates from one state to the next.
        var waitTime = Math.random() * 3000; // wait between 0 and 3 seconds for next data point.
        setTimeout(loopWithRandomDynamicData, waitTime)
    }

    loopWithRandomDynamicData();
}
