window.onload = function() {
    var maxCirculeGraphDomain = 1;
    var maxBarGraphDomain = 250;
    var graph = dynamic3.createGraph('Circle')
                        .setBackgroundColor('#ca454e')
                        .setBorderColor('#8e3036')
                        .setBorderWidth(4)
                        .setWidth(500)
                        .setHeight(500)
                        .setDomain([0, maxCirculeGraphDomain])
                        .setTransitionTime(400) // 200ms transition time from state to state.
                        .setText(function(d) { return d + " BTC"; })
                        .setTextColor('black');
    
    var bar = dynamic3.createGraph('Bar')
                        .setWidth(500)
                        .setHeight(600)
                        .setDomain([0, maxBarGraphDomain])
                        .setPadding(10)
                        .setTransitionTime(400)
                        .setBackgroundColor('#496dff')
                        .setText(extractTextForCurrencies)
                        .setTextColor('black');

    bar.finishSetup(document.getElementById("target2"));
    graph.finishSetup(document.getElementById("target")); // This will connect our d3 graph with the dom element.

    // For now, it may be simpler to impose the rule that all styles must be decided before this finishSetup function is called.
    // Like the above setup would maybe throw an error after we've already "finished our setup". I'm not sure if this will
    // actually be helpful or not until we actually start hacking on the library. But this is a simple enough
    // constraint to begin with. After finishSetup, the only function you can call on a graph is 'update()'

    // Get exhange rates from various currencies to 1 bitcoin.
    function getExchangeRates(callback) {
        var exchangeRateURL = "https://blockchain.info/ticker";
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', exchangeRateURL, false); // synchronous.
        httpRequest.send();
        if (httpRequest.status === 200) {
           return JSON.parse(httpRequest.responseText);
        }

        return null;
    }

    var exchangeRates = getExchangeRates();
    var currencies = ["AUD", "CAD", "CHF", "GBP", "NZD", "SGD", "USD"];
    var lastBarGraphValues = null;

    function updateGraphsWithLatestData(data) {
        var bitcoinValue = data.x.value * (1e-8);
        graph.update(Math.min(bitcoinValue, maxCirculeGraphDomain));
        
        var barData = [];
        lastBarGraphValues = [];
        for (var currency of currencies) {
            var priceForOneBitcoin = exchangeRates[currency].last;
            var priceOfLastExchange = priceForOneBitcoin * bitcoinValue;
            lastBarGraphValues.push(priceOfLastExchange);
            barData.push(Math.min(priceOfLastExchange, maxBarGraphDomain));
        }
        bar.update(barData);
    }

    function extractTextForCurrencies(data, idx) {
        var label = currencies[idx] + " " + lastBarGraphValues[idx];
        if (label.length > 12)
            label = label.substring(0, 12);
        return label;
    }

    try {
        var websocketURL = "wss://ws.blockchain.info/inv";
        var webSocket = new WebSocket(websocketURL);
        webSocket.onmessage = function(event) {
            updateGraphsWithLatestData(JSON.parse(event.data));
        };
        webSocket.onopen = function() {
            webSocket.send('{"op":"set_tx_mini"}{"op":"unconfirmed_sub"}{"op":"blocks_sub"}')
        };
    } catch(e) {
        console.error(e);
    }
}
