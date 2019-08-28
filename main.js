var cards = {};

var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

function LoadCard(cardBox) {
    var cardName = document.getElementById(cardBox).getElementsByClassName("cardNameInput")[0].value;
    var modCardName = cardName.replace(" ", "+");
    var client = new HttpClient();
    client.get('https://api.scryfall.com/cards/named?fuzzy=' + modCardName, function (response) {
        console.log(response);
        var cardObject = JSON.parse(response);
        document.getElementById(cardBox).getElementsByClassName("cardDisplay")[0].src = cardObject["image_uris"]["png"];
        cards[cardBox] = new Card(cardObject);
        UpdateSynergies();
        }
    )
}

function UpdateSynergies() {
    document.getElementById("synergies").innerHTML = "";
    var cardArray = Object.values(cards)
    for (var i = 0; i < cardArray.length; i++) {
        for (var j = 0; j < cardArray[i].synergies.length; j++) {
            cardArray[i].synergies[j].MakeSynergyDisplay();
        }
    }
}

class Card {
    constructor(cardJSON) {
        this.synergies = [];
        this.name = cardJSON["name"];
        this.colorIdentity = cardJSON["color_identity"];
        for (var i = 0; i < this.colorIdentity.length; i++) {
            this.synergies.push(new Synergy(this.colorIdentity[i], 1));
        }
    }
}

class Synergy {
    constructor(name, strength) {
        this.name = name;
        this.strength = strength;
    }

    MakeSynergyDisplay() {
        var mainBox = document.createElement("div");
        var nameBox = document.createElement("div");
        var strengthBox = document.createElement("div");
        var nameNode = document.createTextNode(this.name);
        var strengthNode = document.createTextNode(this.strength);

        mainBox.classList += "synergyBox ";
        nameBox.classList += "nameBox ";
        strengthBox.classList += "strengthBox ";
        
        nameBox.appendChild(nameNode);
        strengthBox.appendChild(strengthNode);
        mainBox.appendChild(nameBox);
        mainBox.appendChild(strengthBox);

        document.getElementById("synergies").appendChild(mainBox);
    }

}