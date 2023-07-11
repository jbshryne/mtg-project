console.log(window.location.href);

const searchParams = JSON.parse(sessionStorage.getItem("searchParams"));
const card = JSON.parse(sessionStorage.getItem("cardDetails"));

const $displayBox = $(".displayBox");
const $statBox = $(".statBox");

let currentPage;
if (window.location.href.search("details") !== -1) currentPage = "details";
if (window.location.href.search("random") !== -1) currentPage = "random";
const $cardFaceEl = $(".detailImg");

$("title").text(card.name + " - MTG Conclave");
$("#cardName").text(card.name);

if (card.image_uris) {
  $cardFaceEl.css("background-image", "url(" + card.image_uris.large + ")");
} else if (card.card_faces) {
  $cardFaceEl.css(
    "background-image",
    "url(" + card.card_faces[0].image_uris.large + ")"
  );
  $backFaceEl = $("<div class='detailImg'></div>");
  $backFaceEl.css(
    "background-image",
    "url(" + card.card_faces[1].image_uris.large + ")"
  );
  $(".displayBox").append($backFaceEl);
} else {
  $cardFaceEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
}

const $buttonDiv = $('<div class="buttonDiv"></div>');

const $prevPageBtn = $('<button class="navBtn prevPage">Go Back</button>').on(
  "click",
  () => history.back()
);

const $nextPageBtn = $('<button class="navBtn nextPage"></button>');

if (currentPage === "details") {
  $nextPageBtn
    .text("New Search")
    .on("click", () => (window.location.href = "index.html"));
}
if (currentPage === "random") {
  $nextPageBtn.text("Re-Randomize!").on("click", () => {
    $.getJSON(searchParams.apiCallUrl, function (dataObj) {
      console.log("response successful");
      // debugger;
    
      sessionStorage.setItem("cardDetails", JSON.stringify(dataObj));
      location.reload();
    }).fail(function (jqxhr, textStatus, error) {
      console.error("Error:", error);
    });
  });
}
$buttonDiv.append($prevPageBtn, $nextPageBtn)
$buttonDiv.appendTo($('footer'))

// const $statLabelBox = $('<div class="statLabelBox"></div>');
// const $statValueBox = $('<div class="statValueBox"></div>');

// const $manaCostLabel = $('<div class="statLabel"></div>').text("Mana Cost");
// const $manaCostValue = $('<div class="statValue"></div>').text(card.mana_cost);