"use strict";

window.onload = function() {


    var bar = dynamic3.createGraph('BarGraph')
    
    bar.setWidth('400px')
       .setHeight('200px')
       .setDomain([0, 100])
       .setPadding(10)
       .setTransitionTime(400)
       .setBackgroundColor('#496dff')
       .setBorderColor('#2b2c2b')
       .setBorderWidth(1)
       .setOrientation('horizontal')
       .setText(getDataText);

    bar.insertIntoHTMLElement(document.getElementById("tutorial-bar-graph"));
    
    function loopWithRandomDynamicData() {
        var bardata = [];
        for (var i = 0; i < 5; i += 1) {
            bardata[i] = Math.floor(Math.random() * 100) | 0;
        }
        bar.update(bardata);
        var waitTime = Math.random() * 3000; // wait between 0 and 3 seconds for next data point.
        setTimeout(loopWithRandomDynamicData, waitTime)
        //In order to simulate the data coming in, we call this function over and over again after a random amount of seconds each time.

    }

    loopWithRandomDynamicData(); //initial call to function
}

function getDataText(data) {
        return data;
}