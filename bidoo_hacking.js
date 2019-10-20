LOOPING = 0;
CONTROLLING = 1;
CANDIDATE_FOR_WINNING = 2;
SUCCESSFUL_AUCTION_FINISHED = 3;
COMING_SOON = 4;
ABANDONED_FOR_BID_EXCEEDING = 5;
ABANDONED_FOR_PRICE_EXCEEDING = 6;
FAILED_AUCTION_FINISHED = 7;
UNMANAGED = 8;

function bidSetupAndStart(userName, auctionId, maxPurchasePricePercentage=50, bidThreshold=0, decimalSign=",") {
	if(typeof attemptTask !== 'undefined')
        clearTimeout(attemptTask);

    bidSetup(decimalSign, auctionId, maxPurchasePricePercentage, userName, bidThreshold);

    var currentTimeText = timeElement.text();
    var waitingDelay = calculateDelay(currentTimeText);

    attemptTask = setTimeout(bid, waitingDelay);
}

function bidSetup(decimalSign, auctionId, maxPurchasePricePercentage, userName, bidThreshold) {
    startDate = new Date();
    bidCounter = 0;
    currentRegExp = decimalSign === "," ? /[^0-9\,-]+/g : /[^0-9\.-]+/g;
    auctionElement = $("#divAsta" + auctionId);
    timeElement = $("#TempoMancante" + auctionId);
    linkElement = $("#mehodkbdkbd" + auctionId)[0];
    linkElementForText = $("#mehodkbdkbd" + auctionId);
    linkElementText = linkElementForText.text();
    currentPriceElement = $("#PrezzoAsta" + auctionId);
    normalPriceElement = $("#divAsta" + auctionId + " .buy-rapid-now");
    normalPrice = currency2Number(normalPriceElement.text().trim());
    priceThreshold = normalPrice * maxPurchasePricePercentage / 100;
    winnerElement = $("#Vincitore" + auctionId);
    loggedUserName = userName;
    justChecked = false;
    currentTimeText = null;
    currentWinnerName = null;
    currentPrice = Number.MAX_VALUE;
    bidCounterThreshold = bidThreshold;
    bidHackData = {
        who: loggedUserName,
        what: auctionId,
        threshold: priceThreshold
    };
    console.log(bidHackData);
}

var bid = function () {
    updateInputs();

    var currentState = calculateState();

    switch (currentState) {
        case CANDIDATE_FOR_WINNING:
            tryToClick();
            break;
        case SUCCESSFUL_AUCTION_FINISHED:
        case FAILED_AUCTION_FINISHED:
        case ABANDONED_FOR_BID_EXCEEDING:
        case ABANDONED_FOR_PRICE_EXCEEDING:
            onFinish(currentState);
            break;
        default:
            goToSleep();
    }
};

function onFinish(finalState) {
    stopDate = new Date();
    console.log("DATA FINE: ", stopDate);
    var resultDescription = getResultDescription(finalState);
    console.log(resultDescription);
    console.log("Time consumed: " + stopDate - startDate);
    console.log("Bid consumed: " + bidCounter);
}

function getResultDescription(state) {
    if (state === SUCCESSFUL_AUCTION_FINISHED) {
        return "VITTORIA";
    }
    if (state === FAILED_AUCTION_FINISHED) {
        return "SCONFITTA";
    }
    if (state === ABANDONED_FOR_BID_EXCEEDING) {
        return "TROPPO SPRECO";
    }
    if (state === ABANDONED_FOR_PRICE_EXCEEDING) {
        return "TROPPO COSTOSO";
    }
    
    return "BOOH!"
}

function tryToClick() {
    if (justChecked) {
        // linkElement.click();
        console.log("CLICK");
        ++bidCounter;
        attemptTask = setTimeout(bid, 2000);
    } else {
        justChecked = true;
        attemptTask = setTimeout(bid, 1000);
    }
}

function goToSleep() {
    justChecked = false;
    var waitingDelay = calculateDelay(currentTimeText);
    if (waitingDelay > 0)
        attemptTask = setTimeout(bid, waitingDelay);
    else
        attemptTask = setTimeout(bid, 250);
}

function updateInputs() {
    currentTimeText = timeElement.text();
    currentWinnerName = winnerElement.text();
    var currentPriceText = currentPriceElement.text().trim();
    currentPrice = currency2Number(currentPriceText);
    linkElementText = linkElementForText.text();
    console.log(currentTimeText, currentWinnerName, currentPrice, priceThreshold, new Date());
}

function calculateState() {

    if(bidCounterThreshold > 0 && bidCounter > bidCounterThreshold)
        return ABANDONED_FOR_BID_EXCEEDING;

    if(currentPrice > priceThreshold)
        return ABANDONED_FOR_PRICE_EXCEEDING;

    if(currentTimeText === "00:00"
        && currentWinnerName != loggedUserName
        && currentPrice <= priceThreshold)
        return CANDIDATE_FOR_WINNING;

    if(linkElementText === "VENDUTO") {
        if (currentTimeText === "Ha Vinto!") {
            return FAILED_AUCTION_FINISHED;
        } else if (currentTimeText === "Hai Vinto!") {
            return SUCCESSFUL_AUCTION_FINISHED;
        } else {
            return UNMANAGED;
        }
    }

    if(currentTimeText === "Controllo...")
        return CONTROLLING;

    if(linkElementText === "RIAPRE PRESTO")
        return COMING_SOON;

    return LOOPING;
}

function currency2Number(currencyText) {
    var cleanCurrencyText = currencyText.replace(currentRegExp, "");
    cleanCurrencyText = cleanCurrencyText.replace(",", ".");
    return Number(cleanCurrencyText);
}

function calculateDelay(timeText) {
    var [minutesText, secondsText] = timeText.split(":");
    var minutes = Number(minutesText);
    var seconds = Number(secondsText);
    var delay = (minutes * 60 + seconds) * 1000;
    delay = isNaN(delay) ? 60000 : delay;
    console.log("Delay: " + delay);
    return delay;
}

