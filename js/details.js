$(function () {
  // console.log(window.location.href);

  //// CONSTANTS & VARIABLES

  const searchParams = JSON.parse(localStorage.getItem("searchParams"));
  const card = JSON.parse(localStorage.getItem("cardDetails"));
  if (!card) window.location.href = "index.html";
  const cardGroup = JSON.parse(localStorage.getItem("cardGroup"));
  const cardGroupArray = [];

  console.log(card)

  ////// *** Starting to set up details text below card ***
  const $cardFaceEl = $(".detailImg");
  const $imgBox = $(".imgBox");
  const $statBox = $(".statBox");
  const $linkBox = $(".linkBox");

  console.log($statBox)
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
      $cardFaceEl.attr("src", card.card_faces[0].image_uris.large);
      $backFaceEl = $("<img class='detailImg'></img>");
      $backFaceEl.attr("src", card.card_faces[1].image_uris.large);
      $(".displayBox").append($imgContainer).append($backFaceEl);
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
      if (card.all_parts) {
        for (let i = 0; i < card.all_parts.length; i++) {
          setTimeout(function () {
            $.getJSON(card.all_parts[i].uri, function (cardObj) {
              cardGroupArray.push(cardObj);
            });
            // cardsAdded++;
            // if (cardsAdded === card.all_parts.length) {
            //   console.log(cardGroupArray);
            //   localStorage.setItem(
            //     "cardGroup",
            //     JSON.stringify(cardGroupArray)
            //   );
            // }
          }, i * 50);

          // cardGroupArray.push(card.all_parts[i].name)
        }
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

    //// Displaying card image

    $(`<h4 class="card-name">${card.name}</h4>`).prependTo('.stat-box')

    const $manaValueRow = $('.mana-cost')
    $(`<div class="statValue">${card.mana_cost}</div>`).appendTo($manaValueRow)

    const $cardTypeRow = $('.type-line')
    $(`<div class="statValue">${card.type_line}</div>`).appendTo($cardTypeRow)

    const $rulesTextRow = $('.oracle-text')
    $(`<div class="statValue">${card.oracle_text}</div>`).appendTo($rulesTextRow)

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
          // debugger;

          localStorage.setItem("cardDetails", JSON.stringify(dataObj));
          location.reload();
        }).fail(function (jqxhr, textStatus, error) {
          console.error("Error:", error);
        });
      });
    }
    $buttonDiv.append($prevPageBtn, $nextPageBtn);
    $buttonDiv.appendTo($("header"));
    console.log($buttonDiv)
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
