console.log("results");

const storedArray = JSON.parse(sessionStorage.getItem("resultArray"));
// console.log(storedArray);

let resultArray;
storedArray ? (resultArray = [...storedArray]) : (resultArray = []);

const $resultBox = $("#resultBox");

// console.log(resultArray);

function getDetails() {
  console.log(resultArray);
  console.log(this.name);
  const printingsArray = resultArray.find((array) => array[0].id === this.id);
  sessionStorage.setItem("printingsArray", JSON.stringify(printingsArray));
//   debugger;
  window.location.href = "details.html";
}

$(".cardSpoiler").off("click").on("click", getDetails);

// Populating result box w/ card images

// resultArray.forEach((card) => {
//   const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
//   if (card.imageUrl) {
//     $spoilerEl.css("background-image", "url(" + card.imageUrl + ")");
//   } else {
//     $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
//   }
//   $spoilerEl.off("click").on("click", getDetails);
//   $resultBox.append($spoilerEl);
// });

for (let i = 0; i < resultArray.length; i++) {
    let card = resultArray[i][0]
    const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
      if (card.imageUrl) {
        $spoilerEl.css("background-image", "url(" + card.imageUrl + ")");
      } else {
        $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
      }
      $spoilerEl.off("click").on("click", getDetails);
      $resultBox.append($spoilerEl);
}