console.log("results");

const response = JSON.parse(sessionStorage.getItem("queryResponse"));

const storedArray = response.data;
console.log(storedArray);

let resultsArray;
storedArray ? (resultsArray = [...storedArray]) : (resultsArray = []);

const $displayBox = $(".displayBox");

console.log(resultsArray);

function getDetails() {
  console.log(resultsArray);
  console.log(this.name);
  const cardDetails = resultsArray.find((card) => card.id === this.id);
  sessionStorage.setItem("cardDetails", JSON.stringify(cardDetails));
  //   debugger;
  window.location.href = "details.html";
}

$(".cardSpoiler").off("click").on("click", getDetails);

// Populating result box w/ card images

// resultsArray.forEach((card) => {
//   const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
//   if (card.imageUrl) {
//     $spoilerEl.css("background-image", "url(" + card.imageUrl + ")");
//   } else {
//     $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
//   }
//   $spoilerEl.off("click").on("click", getDetails);
//   $displayBox.append($spoilerEl);
// });

for (let i = 0; i < resultsArray.length; i++) {
  let card = resultsArray[i];
  // console.log(card);
  const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
  if (card.image_uris) {
    $spoilerEl.css("background-image", "url(" + card.image_uris.normal + ")");
  } else if (card.card_faces) {
    // console.log(card.card_faces[0]);
    $spoilerEl.css(
      "background-image",
      "url(" + card.card_faces[0].image_uris.normal + ")"
    );
  } else {
    $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
  }
  $spoilerEl.off("click").on("click", getDetails);
  $displayBox.append($spoilerEl);
}

console.log($displayBox)