// CONSTANTS & VARIABLES

// Dynamically generate list of all MtG Sets

$.getJSON("https://api.scryfall.com/sets", function (data) {
  const setList = data.data.forEach((set) => {
    const $setOption = $(
      `<option value="${set.code}">${
        set.name
      } (${set.code.toUpperCase()})</option>`
    );
    $("#setDropdown").append($setOption);
  });
});

// $('#setInput').autocomplete({
//   source: allSets
// });

// function scryfallTest() {
//   $.getJSON(`https://api.scryfall.com/catalog/card-names`, function (data) {
//     console.log(data);
//   });
// }

// WIRING UP BUTTONS

$("#allCardsBtn").on("click", searchHandler);
$("#randomBtn").on("click", searchHandler);

// SEARCH LOGIC

function searchHandler(e) {
  e.preventDefault();
  const clickedBtnId = $(e.target).attr("id");
  console.log(clickedBtnId);

  searchFnc(clickedBtnId);
}

function searchFnc(clickedBtn) {
  let apiCallUrl = "";
  let queryArray = [];

  console.log("Searching Database...");

  // CONSTRUCTING THE API CALL

  // name
  const nameInputVal = $("#nameInput").val();
  let nameInputArray = [];

  if (nameInputVal) {
    nameInputArray = nameInputVal.split(" ");
    queryArray.push(...nameInputArray);
  }

  // types
  const typeInputVal = $("#typeInput").val();
  let typeInputArray = [];
  let typeInputString = "";

  if (typeInputVal) {
    typeInputArray = typeInputVal.split(" ");
    const formattedTypeArray = typeInputArray.map((type) => `t:${type}`);
    typeInputString = `(${formattedTypeArray.join(" ")})`;
    queryArray.push(typeInputString);
  }

  // colors
  const colorArray = [];
  const $checkedColors = $(".color:checked");

  $checkedColors.each(function () {
    const value = $(this).val();
    colorArray.push(value);
  });

  if (colorArray.length > 0) {
    queryArray.push("c=" + colorArray.join(""));
  }

  // rarities
  const rarityArray = [];
  const $checkedRarities = $(".rarity:checked");
  let rarityString = "";

  $checkedRarities.each(function () {
    const value = $(this).val();
    rarityArray.push(value);
  });

  if (rarityArray.length > 0) {
    const formattedRarityArray = rarityArray.map((rarity) => `r:${rarity}`);
    rarityString = `(${formattedRarityArray.join(" or ")})`;
    queryArray.push(rarityString);
  }

  // set code

  // const setInputVal = $("#setInput").val();
  // const setInputArray = []
  // let setInputString;
  // if (setInputVal) {
  //   setInputArray = setInputVal.split(" ");
  //   const formattedSetArray = setInputArray.map((setWord) => `s:${setWord}`);
  //   console.log(formattedSetArray);
  //   setInputString = `(${formattedSetArray.join(" or ")})`;
  //   queryArray.push(setInputString);
  // }

  const setCodeVal = $("#setDropdown").val();
  let setInputString;
  if (setCodeVal) {
    setInputString = `s:${setCodeVal}`;
    queryArray.push(setInputString);
  }

  // order of search result list
  const sortOrder = $("#sortDropdown").val();
  let orderString;
  sortOrder === "type" ? (orderString = "color") : (orderString = sortOrder);

  // passing query info to session storage
  const searchParams = {
    nameWords: nameInputArray,
    types: typeInputArray,
    colors: colorArray,
    rarities: rarityArray,
    setCode: setCodeVal,
    sortOrder,
    apiCallUrl,
  };

  sessionStorage.setItem("searchParams", JSON.stringify(searchParams));

  // MAKING THE CALL

  const encodedArray = queryArray.map((query) => encodeURIComponent(query));
  const queryString = encodedArray.join("+");
  console.log(queryString);

  if (clickedBtn === "allCardsBtn") {
    apiCallUrl = `https://api.scryfall.com/cards/search?order=${orderString}&q=${queryString}+game%3Apaper`;
  }
  if (clickedBtn === "randomBtn") {
    apiCallUrl = `https://api.scryfall.com/cards/random?q=${queryString}`;
  }

  $.getJSON(apiCallUrl, function (data, textStatus, jqxhr) {
    console.log("response successful");
    sessionStorage.setItem("queryResponse", JSON.stringify(data));

    console.log(data);
    if (clickedBtn === "allCardsBtn") {
      if (data.data.length === 1) {
        const cardDetails = resultsArray[0];
        console.log(cardDetails);

        sessionStorage.setItem("cardDetails", JSON.stringify(resultsArray[0]));
        debugger;
        window.location.href = "details.html";
      } else {
        // debugger;
        window.location.href = "results.html";
      }
    }
    if (clickedBtn === "randomBtn") {
      sessionStorage.setItem("cardDetails", JSON.stringify(data));
      window.location.href = "details.html";
    }
  }).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
}
