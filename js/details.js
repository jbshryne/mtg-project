$(function () {
  // console.log(window.location.href);

  //// CONSTANTS & VARIABLES

  const symbolCatalog = JSON.parse(localStorage.getItem("symbolCatalog"));
  const searchParams = JSON.parse(localStorage.getItem("searchParams"));
  const card = JSON.parse(localStorage.getItem("cardDetails"));
  if (!card) window.location.href = "index.html";
  const cardGroup = JSON.parse(localStorage.getItem("cardGroup"));
  const cardGroupArray = [];

  console.log(card);

  ////// *** Starting to set up details text below card ***
  const $cardFaceEl = $(".detailImg");
  const $imgBox = $(".imgBox");
  // const $statBox = $(".statBox");
  const $linkBox = $(".linkBox");

  // console.log($statBox)
  const $imgContainer = $("<div class='imgContainer'></div>");

  //// Checking if we are on a card details inspection, randomizer call, or group page
  let currentPage;
  if (window.location.href.search("details") !== -1) currentPage = "details";
  if (window.location.href.search("random") !== -1) currentPage = "random";
  if (window.location.href.search("group") !== -1) currentPage = "group";

  $("title").text(card.name + " - MTG Conclave");

  const $buttonDiv = $('<div class="buttonDiv"></div>');
  const $prevPageBtn = $('<button class="navBtn prevPage">Go Back</button>').on(
    "click",
    () => history.back()
  );

  if (currentPage === "details" || currentPage === "random") {
    $("#cardName").text(card.name);
    const $nextPageBtn = $('<button class="navBtn nextPage"></button>');

    if (card.image_uris) {
      $cardFaceEl.attr("src", card.image_uris.large);

      //// Double-faced cards get side-by-side images of each face
    } else if (card.card_faces) {
      console.log("doublefaced");
      $cardFaceEl.attr("src", card.card_faces[0].image_uris.large);
      $backFaceEl = $("<img class='detailImg'></img>");
      $backFaceEl.attr("src", card.card_faces[1].image_uris.large);
      $("#card-back .displayBox").append($imgContainer).append($backFaceEl);
    } else {
      $cardFaceEl.attr("alt", `${card.name}<br><br>IMAGE NOT AVAILABLE`);
    }

    $linkBox.append(
      `<a href="${card.scryfall_uri}">View this card on Scryfall</a><br>`
    );

    if (
      (card.type_line.search("Basic") !== -1 &&
        card.type_line.search("Land") !== -1) ||
      (card.all_parts && card.type_line.search("Token") === -1)
    ) {
      // let cardsAdded = 0;

      console.log("all parts");
      console.log(card.all_parts);
      // debugger;
      cardGroupArray.push(card);
      for (let i = 0; i < card.all_parts.length; i++) {
        setTimeout(function () {
          $.getJSON(card.all_parts[i].uri, function (cardObj) {
            if (cardObj.oracle_id !== card.oracle_id)
              cardGroupArray.push(cardObj);
          });
        }, i * 50);

        // cardGroupArray.push(card.all_parts[i].name)
      }

      if (card.type_line.search("Basic") !== -1) {
        console.log("basic land");
        $.getJSON(
          `https://api.scryfall.com/cards/search?order=set&q=${card.name}+type%3Abasic+set%3A${card.set}+game%3Apaper&unique=art`,
          function (listObj) {
            listObj.data.forEach((card) => cardGroupArray.push(card));
          }
        );
      }

      $(".detailImg")
        .off("click")
        .on("click", function () {
          localStorage.setItem("cardGroup", JSON.stringify(cardGroupArray));
          window.location.href = "group.html";
        })
        .css("cursor", "pointer");
    }

    //// Displaying card image(s)

    const cardFace = card.card_faces ? card.card_faces[0] : card;

    const generateCardInfo = (cardFace, divId = "card-front") => {
      const formattedOracleText = cardFace.oracle_text
        .replaceAll(`\n`, "<br/>")
        .replaceAll("(", "<em>(")
        .replaceAll(")", ")</em>");
      // console.log(formattedOracleText)

      function replaceSymbolsWithImages(oracleText) {
        const symbolRegex = /\{([^}]+)\}/g;

        const replacedText = oracleText.replace(
          symbolRegex,
          (match, symbol) => {
            const foundSymbol = symbolCatalog.find(
              (data) => data.symbol === `{${symbol}}`
            );
            if (foundSymbol) {
              return `<img src="${foundSymbol.svg_uri}" alt="${foundSymbol.english}" class="symbol-image">`;
            }
            return match; // If symbol not found, return the original text
          }
        );

        const replacedTextArray = replacedText
          .split("<br/>")
          .join('</p><p class="rules-text">');

        return '<p class="rules-text">' + replacedTextArray + "</p>";
      }

      const manaCostWithImages = replaceSymbolsWithImages(cardFace.mana_cost);
      const textWithImages = replaceSymbolsWithImages(formattedOracleText);

      $(`<h4 class="card-name">${cardFace.name}</h4>`).prependTo(
        `#${divId} .stat-box`
      );

      if (cardFace.mana_cost !== "") {
        const $manaValueRow = $(`#${divId} .mana-cost`);
        $(`<td class="stat-label">Mana Cost:</td>`).appendTo($manaValueRow);
        $(`<td class="stat-value">${manaCostWithImages}</td>`).appendTo(
          $manaValueRow
        );
      }

      if (cardFace.type_line !== "") {
        const $cardTypeRow = $(`#${divId} .type-line`);
        $(`<td class="stat-label">Card Type:</td>`).appendTo($cardTypeRow);
        $(`<td class="stat-value">${cardFace.type_line}</td>`).appendTo(
          $cardTypeRow
        );
      }

      if (cardFace.oracle_text !== "") {
        const $rulesTextRow = $(`#${divId} .oracle-text`);
        $(`<td class="stat-label">Rules Text:</td>`).appendTo($rulesTextRow);
        $(`<td class="stat-value">${textWithImages}</td>`).appendTo(
          $rulesTextRow
        );
      }

      if (cardFace.power && cardFace.toughness) {
        const $powerToughnessRow = $(`#${divId} .power-toughness`);
        $(`<td class="stat-label">Power / Toughness:</td>`).appendTo(
          $powerToughnessRow
        );
        $(
          `<td class="stat-value">${cardFace.power} / ${cardFace.toughness}</td>`
        ).appendTo($powerToughnessRow);
      }

      const setName = cardFace.set_name ? cardFace.set_name : card.set_name;
      const setCode = cardFace.set ? cardFace.set : card.set;

      if (cardFace.set_name !== "") {
        const $setNameRow = $(`#${divId} .set-name`);
        $(`<td class="stat-label">Set:</td>`).appendTo($setNameRow);
        $(
          `<td class="stat-value">${setName} (${setCode.toUpperCase()})</td>`
        ).appendTo($setNameRow);
      }
    };

    generateCardInfo(cardFace);

    if (card.card_faces) {
      const $backFaceInfoStructure = $(
        `<div class="displayBox stat-box">
          <table class="stat-table">
            <tr class="mana-cost"></tr>
            <tr class="type-line"></tr>
            <tr class="oracle-text"></tr>
            <tr class="power-toughness"></tr>
          </table>
        </div>`
      );

      $backFaceInfoStructure.appendTo($("#card-back"));

      generateCardInfo(card.card_faces[1], "card-back");
    }

    //// Creating buttons, and dynamically wiring
    //// "next" button depending on where we are

    //// if on "details", get a button to return to search page
    if (currentPage === "details") {
      $nextPageBtn
        .text("New Search")
        .on("click", () => (window.location.href = "index.html"));
    }
    //// if on "random", get a button to get another
    //// random pull using the user's entered parameters
    if (currentPage === "random") {
      $nextPageBtn.text("Re-Randomize!").on("click", () => {
        $.getJSON(searchParams.apiCallUrl, function (dataObj) {
          console.log("response successful");

          localStorage.setItem("cardDetails", JSON.stringify(dataObj));
          location.reload();
        }).fail(function (jqxhr, textStatus, error) {
          console.error("Error:", error);
        });
      });
    }
    $buttonDiv.append($prevPageBtn, $nextPageBtn);
    $buttonDiv.appendTo($("header"));
  }

  if (currentPage === "group") {
    if (card.type_line.search("Basic") !== -1) {
      const pluralForm = /s$/.test(card.name) ? card.name : card.name + "s";

      $("#cardName").text(pluralForm + " from " + card.set_name);
    } else {
      $("#cardName").text(card.name + " & related objects");
    }

    cardGroup.forEach((card) => {
      const $relatedCard = $("<img class='detailImg'></img>");
      $relatedCard.attr("src", card.image_uris.large);
      $imgBox.append($imgContainer).append($relatedCard);
    });
    $buttonDiv.append($prevPageBtn);
    $buttonDiv.appendTo($("header"));
  }
});
