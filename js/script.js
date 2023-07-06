function getDetails() {
  console.log(resultArray);
  console.log(this);
  const card = resultArray.find((card) => card.id === this.id);
  console.log("Clicked " + card.name);
  sessionStorage.setItem("detailsPage", JSON.stringify(card));
  // debugger;
  window.location.href = "details.html";
}

// CONSTANTS & VARIABLES

const allSuperTypes = [
  "basic",
  "elite",
  "legendary",
  "ongoing",
  "snow",
  "token",
  "world",
];

const allTypes = [
  "artifact",
  "battle",
  "conspiracy",
  "creature",
  "emblem",
  "enchantment",
  "hero",
  "instant",
  "land",
  "phenomenon",
  "plane",
  "planeswalker",
  "scheme",
  "sorcery",
  "tribal",
  "vanguard",
];

const storedArray = JSON.parse(sessionStorage.getItem("resultArray"));
console.log(storedArray);

let resultArray;
storedArray ? (resultArray = [...storedArray]) : (resultArray = []);

const $resultBox = $("#resultBox").html(sessionStorage.getItem("resultBox"));
sessionStorage.setItem("resultBox", $resultBox.html());

console.log(resultArray);
// sessionStorage.setItem("resultArray", JSON.stringify(resultArray));

// SEARCH LOGIC

$("#allCardsBtn").on("click", searchFnc);
$(".cardSpoiler").off("click").on("click", getDetails);

function searchFnc(e) {
  e.preventDefault();

  resultArray = [];
  $resultBox.empty();

  console.log("Searching Database...");
  console.log($("form"));

  // Define arrays
  const queryArray = [];
  const typeArrays = { supertypes: [], types: [], subtypes: [] };
  const colorArray = [];
  const rarityArray = [];

  // Convert user input for API call

  const nameInputText = $("#nameInput")
    .val()
    .toLowerCase()
    .split(" ")
    .join(",");

  const typeInputArray = $("#typeInput").val().toLowerCase().split(" ");

  typeInputArray.forEach((type) => {
    if (allSuperTypes.includes(type)) {
      typeArrays.supertypes.push(type);
    } else if (allTypes.includes(type)) {
      typeArrays.types.push(type);
    } else {
      typeArrays.subtypes.push(type);
    }
  });

  const $checkedColors = $(".color:checked");

  $checkedColors.each(function () {
    const value = $(this).val();
    colorArray.push(value);
  });

  const $checkedRarities = $(".rarity:checked");

  $checkedRarities.each(function () {
    const value = $(this).val();
    rarityArray.push(value);
  });

  const setInputText = $("#setInput").val();

  // Construsting the API Call

  if (nameInputText) {
    queryArray.push("name=" + nameInputText);
  }
  if (typeArrays.supertypes.length > 0) {
    queryArray.push("supertypes=" + typeArrays.supertypes.join(","));
  }
  if (typeArrays.types.length > 0) {
    queryArray.push("types=" + typeArrays.types.join(","));
  }
  if (typeArrays.subtypes.length > 0) {
    queryArray.push("subtypes=" + typeArrays.subtypes.join(","));
  }
  if (colorArray.length > 0) {
    queryArray.push("colorIdentity=" + colorArray.join(","));
  }
  if (rarityArray.length > 0) {
    queryArray.push("rarity=" + rarityArray.join("|"));
  }
  if (setInputText) {
    queryArray.push("setName=" + setInputText);
  }

  const queryString = queryArray.join("&");

  // Making the call

  $.getJSON(
    `https://api.magicthegathering.io/v1/cards?${queryString}`,
    function (data, textStatus, jqxhr) {
      console.log("response successful");
      // Filtering down single result per card

      const resultNames = [];

      data.cards.forEach((card) => {
        if (!resultNames.includes(card.name) && card.imageUrl) {
          resultArray.push(card);
          resultNames.push(card.name);
          // console.log(`${card.name} // COST: ${card.manaCost} // TYPE: ${card.type}`)
          console.log(card);
        }
      });

      // Populating result box w/ card images

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

      sessionStorage.setItem("resultArray", JSON.stringify(resultArray));
      sessionStorage.setItem("resultBox", $resultBox.html());

      // Pagination

      // const pageSize = jqxhr.getResponseHeader('Page-Size');
      // const count = jqxhr.getResponseHeader('Count');
      // const totalCount = jqxhr.getResponseHeader('Total-Count');
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
}
