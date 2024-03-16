var welcheevent = document.getElementById("event");
var ersteDiv = document.getElementById("produktersteller");
var zweiteDiv = document.getElementById("deineprodukte");
var gesamtEinnahmen = document.getElementById("gesamt-einnahmen");
var touchStartX, touchEndX, mouseStartX, mouseEndX;
var currentDiv = 0; // Variable, um den aktuellen Zustand zu verfolgen
var drückzähler = 0;
var gesamteinahmenbutton = document.getElementById("gesamteinahmenbutton");
var zurück = document.getElementById("zurück");
var zusammen = document.getElementById("gesamt-einnahmen");
var gesamtE = 0;

//Für anzahl div
var listP = [];

// Array zur Aufbewahrung der Produkte
var produkte = [];

// Array zur Aufbewarung der produkte als liste
var listprodukt = [];

// Produktzähler für eindeutige IDs
var produktZaehler = 0;

// Gesamtpreis initialisieren
var gesamtpreis = 0;

// Hinzufügen eines Produkts
function produktHinzufuegen() {
  let produktName = document.getElementById("produktNameInput").value;
  produktName.id = "produkt_name";
  let produktPreis = document.getElementById("preisInput").value;
  let produktFarbeText = document
    .getElementById("farbeInput")
    .value.toLowerCase(); // Farbname in Kleinbuchstaben
  let produktFarbe = farbeNachHex(produktFarbeText); // Farbname in Hexadezimal umwandeln

  if (produktName && produktPreis && produktFarbe) {
    var produkt = {
      id: produktZaehler++, // Eindeutige ID für jedes Produkt
      name: produktName,
      preis: parseFloat(produktPreis),
      farbe: produktFarbe,
    };

    produkte.push(produkt);

    // Felder zurücksetzen
    document.getElementById("produktNameInput").value = "";
    document.getElementById("preisInput").value = "";
    document.getElementById("farbeInput").value = "";

    // Produkte anzeigen
    renderProdukte();

    eigeneProduktButton();
  }
}

// Produkte anzeigen
function renderProdukte() {
  var alleProdukteDiv = document.getElementById("alleprodukte");
  alleProdukteDiv.innerHTML = "";

  produkte.forEach(function (produkt) {
    var produktContainer = document.createElement("div");
    produktContainer.className = "produkt-container";

    //Neu
    produktContainer.id = "produktContainer_" + produkt.id;
    //Schluss
    var produktButton = document.createElement("button");
    produktButton.innerHTML =
      produkt.name + "<br><small>" + produkt.preis.toFixed(2) + " €</small>";
    produktButton.id = "produkt_" + produkt.id;
    produktButton.style.backgroundColor = produkt.farbe;

    //Neu

    //Schluss

    produktButton.addEventListener("click", function () {
      anzahlfunction(produkt.name);
      addPreisToGesamtpreis(produkt.preis);
      jawoll(gesamtpreis);
      addToList(produkt.name);
    });

    gesamteinahmenbutton.addEventListener("click", function () {
      zuGesamteinnahmen();
    });

    zurück.addEventListener("click", function () {
      zurückzuprodukte();
    });

    produktContainer.appendChild(produktButton);

    var alleprodukte = document.getElementById("alleprodukte");
    alleprodukte.appendChild(produktContainer);

    var minusB = document.createElement("button");

    minusB.className = "minus-button";
    minusB.addEventListener("click", function () {
      handleMinusClick(produkt.name, gesamtpreis);
    });
    produktContainer.appendChild(minusB);
    pruefeUndLoescheDuplikate();
  });
}

// Produkt löschen
function produktLoeschen(produktId) {
  var index = produkte.findIndex(function (produkt) {
    return produkt.id === produktId;
  });

  if (index !== -1) {
    var deletedProduct = produkte[index];
    produkte.splice(index, 1);

    // Hier überprüfen, ob der produktContainerclone vorhanden ist und ihn löschen
    var produktContainerId = "produktContainer_" + deletedProduct.id;
    var produktContainerCloneId = "produktContainerClone_" + deletedProduct.id;
    var produktUeberschriftId = "überschrift" + deletedProduct.id;

    var produktContainer = document.getElementById(produktContainerId);
    var produktContainerclone = document.getElementById(
      produktContainerCloneId
    );
    var produktUeberschrift = document.getElementById(produktUeberschriftId);

    if (produktContainer) {
      produktContainer.parentNode.removeChild(produktContainer);
    }

    if (produktContainerclone) {
      produktContainerclone.parentNode.removeChild(produktContainerclone);
    }

    if (produktUeberschrift) {
      produktUeberschrift.parentNode.removeChild(produktUeberschrift);
    }

    renderProdukte();
    updateGesamtpreis();
    gesamtEinnahmen();
  }
}

// Berechnung des Gesamtpreises
function addPreisToGesamtpreis(preis) {
  gesamtpreis += preis;
  updateGesamtpreis();
  addPreisToGEsamtE(preis);
}

// Aktualisieren des Gesamtpreis-Divs
function updateGesamtpreis() {
  document.getElementById("gesamtpreis").textContent =
    gesamtpreis.toFixed(2) + " €";
}

// Gesamtpreis zurücksetzen
function resetGesamtpreis() {
  gesamtpreis = 0;

  updateGesamtpreis();
}

// Gesamtpreis zurücksetzen-Button
var resetButton = document.getElementById("gesamtpreis-loeschen");
resetButton.textContent = "Gesamtpreis zurücksetzen";
resetButton.addEventListener("click", resetGesamtpreis);
resetButton.addEventListener("click", resetanzahl);

// Funktion zur Umwandlung eines Farbnamens in eine Hexadezimalfarbe
function farbeNachHex(farbeText) {
  var farben = {
    rot: "#FF0000",
    grün: "#008000",
    blau: "#0000FF",
    gelb: "#FFFF00",
    orange: "#FFA500",
    violett: "#800080",
    rosa: "#FFC0CB",
    braun: "#A52A2A",
  };

  return farben[farbeText] || "#FFFFFF"; // Standardfarbe ist Weiß
}

// Produkt Hinzufügen-Button
document
  .getElementById("produkt_hinzufügen")
  .addEventListener("click", produktHinzufuegen);

// Produkte anzeigen
renderProdukte();

// Annahme: div1 und div2 sind die beiden zu überprüfenden Div-Elemente

var div1 = document.getElementById("alleprodukte"); // Hier 'div1' durch die tatsächliche ID deines ersten Divs ersetzen
var div2 = document.getElementById("verschieben"); // Hier 'div2' durch die tatsächliche ID deines zweiten Divs ersetzen

var rect1 = div1.getBoundingClientRect();
var rect2 = div2.getBoundingClientRect();

// Überprüfe, ob die beiden Rechtecke sich überlappen
if (
  rect1.top < rect2.bottom &&
  rect1.bottom > rect2.top &&
  rect1.left < rect2.right &&
  rect1.right > rect2.left
) {
  // Wenn sie sich überlappen, erhöhe den Abstand um 50 Pixel auf der y-Achse
  div2.style.marginTop = (parseInt(div2.style.marginTop) || 0) + 50 + "px";
}

function addEvent() {
  // Das Textfeld abrufen
  var inputText = document.getElementById("event-input").value;

  // Das Div-Element abrufen, in dem die Buttons hinzugefügt werden sollen
  var buttonContainer = document.getElementById("wahl");

  // Ein neues Div-Element erstellen, um den Button und den Löschen-Button zu gruppieren
  var buttonWrapper = document.createElement("div");

  // Ein neues Button-Element erstellen
  var newButton = document.createElement("button");
  newButton.id = "event-button";

  // Den Text des Buttons auf den eingegebenen Text setzen
  newButton.innerText = inputText;

  // Ein neues Löschen-Button-Element erstellen
  var deleteButton = document.createElement("button");
  deleteButton.id = "deleteButton";
  deleteButton.onclick = function () {
    // Den neuen Button und das Wrapper-Div entfernen
    buttonContainer.removeChild(buttonWrapper);
  };

  // Den Button und den Löschen-Button dem Wrapper-Div hinzufügen
  buttonWrapper.appendChild(newButton);
  buttonWrapper.appendChild(deleteButton);

  // Den Wrapper-Div dem Div hinzufügen
  buttonContainer.appendChild(buttonWrapper);

  newButton.addEventListener("click", wegvonevent);
  newButton.addEventListener("click", function () {
    createHeading(inputText);
  });

  document.getElementById("event-input").value = "";
}

if (document.getElementById("event-button")) {
  document
    .getElementById("event-button")
    .addEventListener("click", wegvonevent);
}

function wegvonevent() {
  if (welcheevent.style.display !== "none") {
    welcheevent.style.display = "none";
    ersteDiv.style.display = "block";
  } else {
    welcheevent.style.display = "block";
    ersteDiv.style.display = "none";
  }
}

var zählerProProdukt = {};
function anzahlfunction(produktName) {
  // Das Div-Element mit der ID "anzahl" abrufen
  var anzahlDiv = document.getElementById("anzahl");
  // Generiere eine eindeutige ID für das Div
  var divId = `produkt-${produktName}`;

  // Das aktuelle Div mit der entsprechenden ID abrufen oder erstellen
  var existierendesDiv =
    document.getElementById(divId) || document.createElement("div");
  existierendesDiv.id = divId; // Setze die ID für das Div

  // Zähler für das aktuelle Produkt initialisieren oder aktualisieren
  if (!zählerProProdukt.hasOwnProperty(produktName)) {
    zählerProProdukt[produktName] = 1;
  } else {
    zählerProProdukt[produktName]++;
  }

  // Textinhalt für das Div aktualisieren
  existierendesDiv.textContent = `${produktName}: ${zählerProProdukt[produktName]}`;

  // Überprüfen, ob das Produkt bereits im Div ist
  if (!existierendesDiv.parentNode) {
    // Wenn nicht, das Div dem Div mit der ID "anzahl" hinzufügen
    anzahlDiv.appendChild(existierendesDiv);
  } else {
    // Wenn das Produkt bereits im Div ist, aktualisiere das Div
    anzahlDiv.replaceChild(existierendesDiv, document.getElementById(divId));
  }
}

function handleMinusClick(produktName, einnahme) {
  if (
    zählerProProdukt.hasOwnProperty(produktName) &&
    zählerProProdukt[produktName] > 0
  ) {
    zählerProProdukt[produktName]--;

    var produkt = produkte.find((p) => p.name === produktName);
    if (produkt) {
      gesamtpreis -= produkt.preis;
      einnahme -= produkt.preis; // Abziehen des Preises von der Gesamteinnahme
      minusvonGEsamtE(produkt.preis);
      updateGesamtpreis();
    }

    // Produktdiv und Minus-Button entfernen, wenn der Zähler auf 0 ist
    if (zählerProProdukt[produktName] === 0) {
      pruefeProduktVerschwinden();
      var anzahlDiv = document.getElementById("anzahl");

      // Produktdiv entfernen
      var produktDiv = document.getElementById(`produkt-${produktName}`);
      if (produktDiv) {
        anzahlDiv.removeChild(produktDiv);
      }

      // Minus-Button entfernen
      var minusButton = document.getElementById(`minus-${produktName}`);
      if (minusButton) {
        anzahlDiv.removeChild(minusButton);
      }
    } else {
      // Zähler aktualisieren, wenn er größer als 0 ist
      var existierendesDiv = document.getElementById(`produkt-${produktName}`);
      if (existierendesDiv) {
        existierendesDiv.textContent = `${produktName}: ${zählerProProdukt[produktName]}`;
      }
    }

    // Aktualisierung der Gesamteinnahmen
    jawoll(gesamtpreis);
    dokumentiereEinnahmen();
  }
}

function resetanzahl() {
  document.getElementById("anzahl").innerHTML = "";
  zählerProProdukt = {};
}





function createHeading(inputText) {
  // Überschrift erstellen
  var heading = document.createElement("h2");
  heading.textContent = inputText;

  // Eine Überschrift in das erste Div einfügen
  var überschriftdiv = document.getElementById("überschrift");
  überschriftdiv.innerHTML = ""; // Alten Inhalt löschen
  überschriftdiv.appendChild(heading);

  // Eine weitere Überschrift in das zweite Div einfügen
  var überschriftdiv2 = document.getElementById("überschrift2");
  überschriftdiv2.innerHTML = ""; // Alten Inhalt löschen
  überschriftdiv2.appendChild(heading.cloneNode(true)); // Klone das Element, um es erneut zu verwenden

  var überschrift3 = document.getElementById("überschrift3");
  überschrift3.innerHTML = "";
  überschrift3.appendChild(heading.cloneNode(true));
}

function zuGesamteinnahmen() {
  welcheevent.style.display = "none";
  ersteDiv.style.display = "none";
  zweiteDiv.style.display = "none";
  zusammen.style.display = "block";
}
function zurückzuprodukte() {
  welcheevent.style.display = "none";
  ersteDiv.style.display = "none";
  zweiteDiv.style.display = "block";
  zusammen.style.display = "none";
}

function deledeG() {
  document.getElementById("documentation").innerHTML = "";
  document.getElementById("jawoll").innerHTML = "0" + " €";
  gesamtE = 0;
}


// ...

// Aktualisierte Funktion zur Dokumentation der Einnahmen
function dokumentiereEinnahmen() {
  // Das Div-Element für die Dokumentation abrufen
  var documentationDiv = document.getElementById("documentation");

  // Produkte und ihre Anzahl durchgehen und dokumentieren
  produkte.forEach(function (produkt) {
    var produktName = produkt.name;
    var produktAnzahl = zählerProProdukt[produktName] || 0;

    // Die Dokumentation für das Produkt abrufen oder erstellen
    var produktInfoDiv = documentationDiv.querySelector(
      `#produkt-${produktName}`
    );

    if (produktInfoDiv) {
      // Produktdiv und Minus-Button entfernen, wenn der Zähler auf 0 ist
      if (produktAnzahl === 0) {
        documentationDiv.removeChild(produktInfoDiv);
      } else {
        // Den Text für das Div aktualisieren
        produktInfoDiv.textContent = `${produktName}: ${produktAnzahl} Stück - Einnahmen durch Produkt: ${(
          produkt.preis * produktAnzahl
        ).toFixed(2)} € `;
      }
    } else if (produktAnzahl > 0) {
      // Das Div erstellen, wenn es nicht existiert und die Anzahl größer als 0 ist
      produktInfoDiv = document.createElement("div");
      produktInfoDiv.id = `produkt-${produktName}`;
      produktInfoDiv.textContent = `${produktName}: ${produktAnzahl} Stück - Einnahmen durch Produkt: ${(
        produkt.preis * produktAnzahl
      ).toFixed(2)} €`;
      documentationDiv.appendChild(produktInfoDiv);
    }
  });
}

function pruefeProduktVerschwinden() {
  // Alle Minus-Buttons mit der Klasse "minus-button" abrufen
  var minusButtons = document.getElementsByClassName("minus-button");

  // Durch alle Minus-Buttons iterieren
  for (var i = 0; i < minusButtons.length; i++) {
    // ID des aktuellen Minus-Buttons
    var minusButtonId = minusButtons[i].id;

    // Produktname extrahieren
    var produktName = minusButtonId.split("-")[1];

    // Überprüfen, ob das Produkt im anzahl div vorhanden ist
    var produktDiv = document.getElementById(`produkt-${produktName}`);
    if (!produktDiv || !produktDiv.hasChildNodes()) {
      // Wenn nicht, Minus-Button löschen
      var minusButton = document.getElementById(minusButtonId);
      if (minusButton) {
        minusButton.parentNode.removeChild(minusButton);
      }
    }
  }
}

function changeto2() {
  welcheevent.style.display = "none";
  ersteDiv.style.display = "block";
}
function changeto3() {
  ersteDiv.style.display = "none";
  zweiteDiv.style.display = "block";
}
function changeto4() {
  zweiteDiv.style.display = "none";
  gesamtEinnahmen.style.display = "block";
}

function changeto3M() {
  gesamtEinnahmen.style.display = "none";
  zweiteDiv.style.display = "block";
}
function changeto2M() {
  zweiteDiv.style.display = "none";
  ersteDiv.style.display = "block";
}
function changeto1M() {
  ersteDiv.style.display = "none";
  welcheevent.style.display = "block";
}

renderProdukte();

document
  .getElementById("produkt_hinzufügen")
  .addEventListener("click", produkteliste);

function deleteElement(uniqueId) {
  // Das spezifische Element anhand der ID entfernen
  var elementToDelete = document.getElementById(uniqueId);
  elementToDelete.parentNode.removeChild(elementToDelete);

  // Die ID des zugehörigen Produktbuttons extrahieren
  var productId = uniqueId.replace("product_", "");
  var productButtonId = "produkt_" + productId;

  // Den zugehörigen Produktbutton entfernen
  var productButton = document.getElementById(productButtonId);
  if (productButton) {
    // Hier die Änderung: Den Produktbutton aus dem "deineprodukte" Div entfernen
    var deineProdukteDiv = document.getElementById("deineprodukte");
    deineProdukteDiv.removeChild(productButton);
  }
}
function pruefeUndLoescheDuplikate() {
  // Das Div mit der ID "produktediv" abrufen
  var produktediv = document.getElementById("produktediv");

  // Alle Kinder des "produktediv" abrufen
  var produktContainerClones = produktediv.getElementsByClassName(
    "produkt-container-clone"
  );

  // Ein Set erstellen, um eindeutige IDs zu verfolgen
  var uniqueIds = new Set();

  // Durch alle Produktcontainerclones iterieren
  for (var i = 0; i < produktContainerClones.length; i++) {
    var clone = produktContainerClones[i];

    // Die ID des aktuellen Produktcontainerclones abrufen
    var cloneId = clone.id;

    // Überprüfen, ob die ID bereits im Set vorhanden ist
    if (uniqueIds.has(cloneId)) {
      // Wenn ja, das Duplikat löschen
      clone.parentNode.removeChild(clone);
    } else {
      // Wenn nicht, die ID zum Set hinzufügen
      uniqueIds.add(cloneId);
    }
  }
}

function eigeneProduktButton() {
  // Das Div mit der ID "produktediv" abrufen
  var produktediv = document.getElementById("produktediv");

  // Alle Kinder des "produktediv" entfernen, um die Überschriften zu aktualisieren
  produktediv.innerHTML = "";

  // Durch alle Produkte im Array iterieren
  for (const produkt of produkte) {
    var loeschenButton = document.createElement("button");
    loeschenButton.id = "loeschen";

    loeschenButton.addEventListener("click", function () {
      produktLoeschen(produkt.id);
      ueberschriftLoeschen(loeschenButton);
    });

    // Eine Überschrift erstellen
    var produktUeberschrift = document.createElement("h3");
    produktUeberschrift.innerHTML = "<span>" + produkt.name + "</span>";
    produktUeberschrift.id = "überschrift" + produkt.id;
    produktUeberschrift.appendChild(loeschenButton);

    // Die Überschrift dem "produktediv" hinzufügen
    produktediv.appendChild(produktUeberschrift);
  }
}
function addPreisToGEsamtE(preis) {
  gesamtE += preis;
  var div = document.getElementById("jawoll");
  div.textContent = gesamtE + " €";
}

function minusvonGEsamtE(preis) {
  gesamtE -= preis;
  var div = document.getElementById("jawoll");
  div.textContent = gesamtE + " €";
}