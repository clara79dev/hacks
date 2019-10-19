LOOPING = 0;
UNKNOWN = 1;
CANDIDATE_FOR_WINNING = 2;
AUCTION_FINISHED = 3;
COMING_SOON = 4;

function bidSetupAndStart(userName, auctionId, maxPurchasePricePercentage=50, decimalSign=",") {
	if(typeof attemptTask !== 'undefined')
        clearTimeout(attemptTask);

    bidSetup(decimalSign, auctionId, maxPurchasePricePercentage, userName);

    var currentTimeText = timeElement.text();
    var waitingDelay = calculateDelay(currentTimeText);

    attemptTask = setTimeout(bid, waitingDelay);
}

function bidSetup(decimalSign, auctionId, maxPurchasePricePercentage, userName) {
    startDate = new Date();
    clickCounter = 0;
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
    bidHackData = {
        who: loggedUserName,
        what: auctionId,
        threshold: priceThreshold
    };
    console.log(bidHackData);
}

var bid = function () {
    updateInputs();

    var curentState = calculateState();

    switch (curentState) {
        case CANDIDATE_FOR_WINNING:
            tryToClick();
            break;
        case AUCTION_FINISHED:
            onFinish();
            break;
        case COMING_SOON:
        default:
            goToSleep();
    }

    // if(currentTimeText === "00:00"
    //     && currentWinnerName != loggedUserName
    //     && currentPrice <= priceThreshold) {
    //         tryToClick();
    // } else if(linkElementText === "VENDUTO"
    //     || currentTimeText === "Controllo..."
    //     || currentTimeText === "Ha Vinto!"
    //     || currentTimeText === "Hai Vinto!"
    //     || currentPrice > priceThreshold) {
    //     onFinish();
    // } else {
    //     goToSleep();
    // }
};

function onFinish() {
    stopDate = new Date();
    console.log("Time consumed: " + stopDate - startDate);
    console.log("Bid consumed: " + clickCounter);
}

function tryToClick() {
    if (justChecked) {
        // linkElement.click();
        console.log("CLICK");
        ++clickCounter;
        attemptTask = setTimeout(bid, 2000);
    }
    else {
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
    if(currentTimeText === "00:00"
        && currentWinnerName != loggedUserName
        && currentPrice <= priceThreshold)
        return CANDIDATE_FOR_WINNING;

    if(linkElementText === "VENDUTO"
    || currentTimeText === "Ha Vinto!"
    || currentTimeText === "Hai Vinto!"
    || currentPrice > priceThreshold)
        return AUCTION_FINISHED;

    if(currentTimeText === "Controllo...")
        return UNKNOWN;

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

