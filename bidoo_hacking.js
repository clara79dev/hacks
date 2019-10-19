function bidSetup(userName, auctionId, maxPurchasePricePercentage=50, decimalSign=",") {
    debugger;
	if(typeof currentBid !== 'undefined')
        clearInterval(currentBid);

    currentRegExp = decimalSign === "," ? /[^0-9\,-]+/g : /[^0-9\.-]+/g;
    auctionElement = $("#divAsta" + auctionId);
	timeElement = $("#TempoMancante" + auctionId);
	linkElement = $("#mehodkbdkbd" + auctionId)[0];
    currentPriceElement = $("#PrezzoAsta" + auctionId);
    normalPriceElement = $("#divAsta" + auctionId + " .buy-rapid-now");
    normalPrice = currency2Number(normalPriceElement.text().trim());
    priceThreshold = normalPrice * maxPurchasePricePercentage / 100;
    winnerElement = $("#Vincitore" + auctionId);
    loggedUserName = userName;

	puntata = setInterval(punta, 100);
}

var punta = function () {
    debugger;
    var timeText = timeElement.text();
    var winnerName = winnerElement.text();
    var curentPriceText = currentPriceElement.text().trim();
    var curentPrice = currency2Number(curentPriceText);

	if(timeText === "00:00" && winnerName != loggedUserName && curentPrice < priceThreshold) {
		linkElement.click();
		clearInterval(puntata);
	}
};

function currency2Number(currencyText) {
    return Number(currencyText.replace(currentRegExp, ""));
}



