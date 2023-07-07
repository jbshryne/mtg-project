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

// function scryfallTest() {
//   $.getJSON(`https://api.scryfall.com/catalog/card-names`, function (data) {
//     console.log(data);
//   });
// }

$("#allCardsBtn").on("click", searchFnc);
// $("#randomBtn").on("click", scryfallTest);

// SEARCH LOGIC

function searchFnc(e) {
  e.preventDefault();

  const resultArray = [];

  console.log("Searching Database...");

  const queryArray = [];
  const colorArray = [];
  // const rarityArray = [];

  // Convert user input for API call

  const nameInputString = $("#nameInput").val().split(" ").join("+");

  let typeInputString;
  if ($("#typeInput").val()) {
    const typeInputArray = $("#typeInput").val().split(" ");
    const formattedTypeArray = typeInputArray.map((type) => `t:${type}`);
    typeInputString = `(${formattedTypeArray.join(" ")})`;
  }

  const $checkedColors = $(".color:checked");

  $checkedColors.each(function () {
    const value = $(this).val();
    colorArray.push(value);
  });

  const $checkedRarities = $(".rarity:checked");

  // $checkedRarities.each(function () {
  //   const value = $(this).val();
  //   rarityArray.push(value);
  // });

  // const setInputText = $("#setInput").val();

  // Construsting the API Call

  if (nameInputString) {
    queryArray.push(nameInputString);
  }
  if (typeInputString) {
    queryArray.push(typeInputString);
  }
  if (colorArray.length > 0) {
    queryArray.push("id:" + colorArray.join(""));
  }
  // if (rarityArray.length > 0) {
  //   queryArray.push("rarity=" + rarityArray.join("|"));
  // }
  // if (setInputText) {
  //   queryArray.push("setName=" + setInputText);
  // }

  // console.log($("#sortDropdown").val());

  // queryArray.push("orderBy=" + $("#sortDropdown").val())

  const encodedArray = queryArray.map(query => encodeURIComponent(query))

  const queryString = encodedArray.join("+");

  // Making the call

  $.getJSON(
    `https://api.scryfall.com/cards/search?q=${queryString}`,
    function (data, textStatus, jqxhr) {
      console.log("response successful");

      console.log(data.data);

      // data.data.forEach(card => console.log(card.name))

      // const resultNames = [];

      // data.cards.forEach((card) => {
      //   if (!resultNames.includes(card.name)) {
      //     const printingsArray = [];
      //     printingsArray.push(card);
      //     resultArray.push(printingsArray);

      //     resultNames.push(card.name);
      //     // console.log(card);
      //   } else {
      //     const idx = resultNames.findIndex((name) => name === card.name);
      //     resultArray[idx].push(card);
      //   }
      // });

      // console.log(resultArray);

      // // Passing on Page & Total Count info

      // const pageSize = jqxhr.getResponseHeader("Page-Size");
      // const count = jqxhr.getResponseHeader("Count");
      // const totalCount = jqxhr.getResponseHeader("Total-Count");

      // console.log(jqxhr.getAllResponseHeaders());

      // const responseHeaders = {
      //   pageSize,
      //   count,
      //   totalCount,
      // };

      // // console.log(responseHeaders);

      sessionStorage.setItem("resultArray", JSON.stringify(data.data));
      // sessionStorage.setItem(
      //   "responseHeaders",
      //   JSON.stringify(responseHeaders)
      // );
      // debugger;

      window.location.href = "results.html";
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
}
