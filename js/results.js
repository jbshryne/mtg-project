console.log("results");

const storedArray = JSON.parse(sessionStorage.getItem("resultArray"));
console.log(storedArray);

let resultArray;
storedArray ? (resultArray = [...storedArray]) : (resultArray = []);

const $resultBox = $("#resultBox")

console.log(resultArray);

function getDetails() {
    console.log(resultArray);
    console.log(this);
    const card = resultArray.find((card) => card.id === this.id);
    console.log("Clicked " + card.name);
    sessionStorage.setItem("detailsPage", JSON.stringify(card));
    // debugger;
    window.location.href = "details.html";
  }

  $(".cardSpoiler").off("click").on("click", getDetails);

  resultArray.forEach((card) => {
    const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
    if (card.imageUrl) {
      $spoilerEl.css("background-image", "url(" + card.imageUrl + ")");
    } else {
      $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
    }
    $spoilerEl.off("click").on("click", getDetails);
    $resultBox.append($spoilerEl);
  });