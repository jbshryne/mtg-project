console.log("The Deets");

const card = JSON.parse(sessionStorage.getItem("cardDetails"))

$("title").text(card.name + " - MTG Conclave")
$("h1").text(card.name)
const $cardFaceEl = $(".detailImg")

if (card.image_uris) {
    $cardFaceEl.css("background-image", "url(" + card.image_uris.large + ")");
  } else if (card.card_faces) {
    $cardFaceEl.css(
      "background-image",
      "url(" + card.card_faces[0].image_uris.large + ")"
    );
    $backFaceEl = $("<div class='detailImg'></div>")
    $backFaceEl.css("background-image",
    "url(" + card.card_faces[1].image_uris.large + ")");
    $(".displayBox").append($backFaceEl)
  } else {
    $cardFaceEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
  }

// $cardFaceEl.css("backgroundImage", "url(" + card.image_uris.large + ")")