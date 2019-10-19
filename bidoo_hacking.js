function bidSetup(userName, auctionId, maxPurchasePricePercentage=50, decimalSign=",") {
	if(typeof currentBid !== 'undefined')
        clearInterval(currentBid);

    currentRegExp = decimalSign === "," ? /[^0-9\,-]+/g : /[^0-9\.-]+/g;
    auctionElement = $("#divAsta" + auctionId);
	timeElement = $("#TempoMancante" + auctionId);
    linkElement = $("#mehodkbdkbd" + auctionId)[0];
    linkElementText = $("#mehodkbdkbd" + auctionId).text();
    currentPriceElement = $("#PrezzoAsta" + auctionId);
    normalPriceElement = $("#divAsta" + auctionId + " .buy-rapid-now");
    normalPrice = currency2Number(normalPriceElement.text().trim());
    priceThreshold = normalPrice * maxPurchasePricePercentage / 100;
    winnerElement = $("#Vincitore" + auctionId);
    loggedUserName = userName;

    bidHackData = {
        who: loggedUserName,
        what: auctionId,
        threshold: priceThreshold
    };

    console.log(bidHackData);

	puntata = setInterval(punta, 100);
}

var punta = function () {
    var timeText = timeElement.text();
    var winnerName = winnerElement.text();
    var curentPriceText = currentPriceElement.text().trim();
    var curentPrice = currency2Number(curentPriceText);

    console.log(timeText, curentPrice, priceThreshold);

	if(timeText === "00:00" && winnerName != loggedUserName && curentPrice <= priceThreshold) {
		linkElement.click();
		clearInterval(puntata);
	} else if(linkElementText === "VENDUTO" || curentPrice > priceThreshold) {
        clearInterval(puntata);
    }
};

function currency2Number(currencyText) {
    var cleanCurrencyText = currencyText.replace(currentRegExp, "");
    cleanCurrencyText = cleanCurrencyText.replace(",", ".");
    return Number(cleanCurrencyText);
}



