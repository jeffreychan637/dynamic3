"use strict";

window.onload = function() {
    var maxCircleGraphDomain = 1;
    var maxBarGraphDomain = 250;
    var graph = dynamic3.createGraph('Circle')
                        .setBackgroundColor('#ca454e')
                        .setBorderColor('#8e3036')
                        .setBorderWidth(4)
                        .setWidth(500)
                        .setHeight(500)
                        .setDomain([0, maxCircleGraphDomain])
                        .setTransitionTime(400) // 200ms transition time from state to state.
                        .setText(function(d) { return d + " BTC"; })
                        .setTextColor('black');
    
    var bar = dynamic3.createGraph('BarGraph')
                        .setWidth('496px')
                        .setHeight('496px')
                        .setDomain([0, maxBarGraphDomain])
                        .setPadding(10)
                        .setTransitionTime(400)
                        .setBackgroundColor('#496dff')
                        .setText(extractTextForCurrencies)
                        .setBorderColor('#2b2c2b')
                        .setBorderWidth(1)
                        .setTextColor('black');

    var slidingBar = dynamic3.createGraph('SlidingBarGraph')
                        .setWidth('496px')
                        .setHeight('496px')
                        .setDomain([0, 1])
                        .setTransitionTime(400)
                        .setBackgroundColor('#496dff')
                        .setNumberOfBars(8)
                        .setBorderColor('#2b2c2b')
                        .setText(function(d) { return /*d.val +*/ " BTC"; })
                        .setBorderWidth(1);

    bar.insertIntoHTMLElement(document.getElementById("bar-graph"));
    graph.insertIntoHTMLElement(document.getElementById("circle-graph")); // This will connect our d3 graph with the dom element.
    slidingBar.insertIntoHTMLElement(document.getElementById("animating-bar-graph")); // This will connect our d3 graph with the dom element.
    var orientationButton = $("#graph-orientation-dropdown");
    function updateOrientationButton() {
        orientationButton.html(bar.getOrientation() === "vertical" ? "Vertical" : "Horizontal");
    }
    updateOrientationButton();

    $("#switch-to-vertical").click(function() {
        bar.setOrientation("vertical");
        updateOrientationButton();
    });

    $("#switch-to-horizontal").click(function() {
        bar.setOrientation("horizontal");
        updateOrientationButton();
    });
    
    $("#circleBG").change(function() {
        graph.setBackgroundColor($(this).val());
    });
    
    $("#circleBC").change(function() {
        graph.setBorderColor($(this).val());
    });
    
    $("#circleBW").change(function() {
        graph.setBorderWidth($(this).val());
    });

    $("#circleDS").change(function() {
        graph.setDomain([$(this).val(), maxCircleGraphDomain]);
    });
    
    $("#circleDE").change(function() {
        maxCircleGraphDomain = $(this).val();
        graph.setDomain([$("#circleDS").val(), maxCircleGraphDomain]);
    });
    
    $("#circleTT").change(function() {
        graph.setTransitionTime($(this).val());
    });
    
    $("#circleTC").change(function() {
        graph.setTextColor($(this).val());
    });

    $("#slidingDS").change(function() {
        slidingBar.setDomain([$(this).val(), maxBarGraphDomain]);
    });
    
    $("#slidingDE").change(function() {
        maxBarGraphDomain = $(this).val();
        slidingBar.setDomain([$("#slidingDS").val(), maxBarGraphDomain]);
    });
    
    $("#slidingTT").change(function() {
        slidingBar.setTransitionTime($(this).val());
    });
    
    $("#slidingBG").change(function() {
        slidingBar.setBackgroundColor($(this).val());
    });
    
    $("#slidingBN").change(function() {
        slidingBar.setNumberOfBars($(this).val());
    });


    // Get exhange rates from various currencies to 1 bitcoin.
    function getExchangeRates(callback) {
        /* Content security policy mess I don't feel like dealing with
        var exchangeRateURL = "https://blockchain.info/ticker";
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', exchangeRateURL, false); // synchronous.
        httpRequest.setRequestHeader('Accept', 'application/json');
        httpRequest.send();
        if (httpRequest.status === 200) {
           return JSON.parse(httpRequest.responseText);
        }
        return null;
        */
        return {
            "AUD": {
              "15m": 293.39,
              "last": 293.39,
              "buy": 293.38,
              "sell": 293.74,
              "symbol": "$"
            },
            "CAD": {
              "15m": 279.56,
              "last": 279.56,
              "buy": 279.55,
              "sell": 279.89,
              "symbol": "$"
            },
            "CHF": {
              "15m": 217.11,
              "last": 217.11,
              "buy": 217.1,
              "sell": 217.36,
              "symbol": "CHF"
            },
            "GBP": {
              "15m": 151.71,
              "last": 151.71,
              "buy": 151.7,
              "sell": 151.89,
              "symbol": "£"
            },
            "NZD": {
              "15m": 298.15,
              "last": 298.15,
              "buy": 298.13,
              "sell": 298.49,
              "symbol": "$"
            },
            "SGD": {
              "15m": 302.89,
              "last": 302.89,
              "buy": 302.87,
              "sell": 303.24,
              "symbol": "$"
            },
            "USD": {
              "15m": 221.95,
              "last": 221.95,
              "buy": 221.94,
              "sell": 222.21,
              "symbol": "$"
            }
        };
    }

    var exchangeRates = getExchangeRates();
    var currencies = ["AUD", "CAD", "CHF", "GBP", "NZD", "SGD", "USD"];
    var lastBarGraphValues = null;
    var allBitcoinValues = [];

    function updateGraphsWithLatestData(data) {
        var bitcoinValue = data.x.value * (1e-8);
        graph.update(Math.min(bitcoinValue, maxCircleGraphDomain));

        
        var barData = [];
        lastBarGraphValues = [];
        for (var currency of currencies) {
            var priceForOneBitcoin = exchangeRates[currency].last;
            var priceOfLastExchange = priceForOneBitcoin * bitcoinValue;
            lastBarGraphValues.push(priceOfLastExchange);
            barData.push(Math.min(priceOfLastExchange, maxBarGraphDomain));
        }
        bar.update(barData);

        allBitcoinValues.push({val: bitcoinValue, uid: Date.now()});
        slidingBar.update(allBitcoinValues);
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
