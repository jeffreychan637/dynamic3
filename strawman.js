var domElement = document.createElement("div"); // not sure if this is correct DOM API off the top of my head, but it's irrelevant.
someOtherElement.appendChild(domElement); // someOtherElement isn't defined here, but it'll be specific to a given example.
// This first function call is the wrapper of dynamic3. It has the main function called createGraph
// which I'm thinking just takes a string representing a particular graph
// and our wrapper function just returns that.
var graph = dynamic3.createGraph('Circle')
                    .setBackgroundColor('white')
                    .setBorderColor('black')
                    .setBorderWidth('2px')
                    .setMaxRadius('100px')
                    .setTransitionTime(200); // 200ms transition time from state to state.

graph.finishSetup(domElement); // This will connect our d3 graph with the dom element.
// For now, it may be simpler to impose the rule that all styles must be decided before this finishSetup function is called.
// Like the above setup would maybe throw an error after we've already "finished our setup". I'm not sure if this will
// actually be helpful or not until we actually start hacking on the library. But this is a simple enough
// constraint to begin with. After finishSetup, the only function you can call on a graph is 'update()'

// Note, this data can be anything. This is just something random as an example.
function loopWithRandomDynamicData()
{
    var data = Math.random() * 100; // random number between 0 and 100
    graph.update(data); // This will be the heart of our API, something that just updates from one state to the next.
    var waitTime = Math.random() * 3000; // wait between 0 and 3 seconds for next data point.
    setTimeout(loopWithRandomDynamicData, waitTime)
}
loopWithRandomDynamicData();
