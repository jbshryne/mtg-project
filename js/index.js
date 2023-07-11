$(function () {
  const searchParams = JSON.parse(sessionStorage.getItem("searchParams"));

  //// CONSTANTS & VARIABLES

  ////// Dynamically generate dropdown list of sets

  const $setList = $("#setDropdown");

  $.getJSON("https://api.scryfall.com/sets", function (listObj) {
    listObj.data.forEach((set) => {
      const $setOption = $(
        `<option class="setOption" value="${set.code}">${
          set.name
        } (${set.code.toUpperCase()})</option>`
      );
      if (searchParams && searchParams.setCode) {
        const $selectedSet = $(`.setOption[value=${searchParams.setCode}]`);
        $selectedSet.attr("selected", "selected");
      }
      $setList.append($setOption);
    });
  });

  //// WIRING UP BUTTONS

  $("#allCardsBtn").on("click", searchHandler);
  $("#randomBtn").on("click", searchHandler);
  const $errorMessage = $(".errorMessage")
  window.onbeforeunload = function () {
    $errorMessage.empty()
  };

  //// SEARCH LOGIC

  ////// wrapper function to grab & pass clicked button
  function searchHandler(e) {
    e.preventDefault();
    const clickedBtnId = $(e.target).attr("id");
    console.log(clickedBtnId);

    searchFnc(clickedBtnId);
  }

  function searchFnc(clickedBtn) {
    sessionStorage.clear();
    let apiCallUrl = "";
    let queryArray = [];

    console.log("Searching Database...");

    //// CONSTRUCTING THE API CALL

    ////// name
    const nameInputVal = $("#nameInput").val();
    let nameInputArray = [];

    if (nameInputVal) {
      nameInputArray = nameInputVal.split(" ");
      queryArray.push(...nameInputArray);
    }

    ////// types
    const typeInputVal = $("#typeInput").val();
    let typeInputArray = [];
    let typeInputString = "";

    if (typeInputVal) {
      typeInputArray = typeInputVal.split(" ");
      const formattedTypeArray = typeInputArray.map((type) => `t:${type}`);
      typeInputString = `(${formattedTypeArray.join(" ")})`;
      queryArray.push(typeInputString);
    }

    ////// colors
    const colorArray = [];
    const $checkedColors = $(".color:checked");

    $checkedColors.each(function () {
      const value = $(this).val();
      colorArray.push(value);
    });

    if (colorArray.length > 0) {
      queryArray.push("c=" + colorArray.join(""));
    }

    ////// rarities
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

    ////// set codex
    const setCodeVal = $("#setDropdown").val();
    let setInputString;
    if (setCodeVal) {
      setInputString = `s:${setCodeVal}`;
      queryArray.push(setInputString);
    }

    ////// order of search result list
    const sortOrder = $("#sortDropdown").val();
    let orderString;
    sortOrder === "type" ? (orderString = "name") : (orderString = sortOrder);

    const encodedArray = queryArray.map((query) => encodeURIComponent(query));
    const queryString = encodedArray.join("+");
    console.log(queryString);

    if (clickedBtn === "allCardsBtn") {
      apiCallUrl = `https://api.scryfall.com/cards/search?order=${orderString}&q=${queryString}+game%3Apaper`;
    }
    if (clickedBtn === "randomBtn") {
      apiCallUrl = `https://api.scryfall.com/cards/random?q=${queryString}`;
    }

    ////// passing query info to session storage
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

    //// MAKING THE CALL

    $.getJSON(apiCallUrl, function (dataObj, textStatus, jqxhr) {
      console.log("response successful");
      // debugger;

      if (dataObj.total_cards > 1000) {
        $errorMessage.text(
          "Those results are over 1000 cards! Please narrow your search parameters."
        );
        return;
      } else {
        sessionStorage.setItem("queryResponse", JSON.stringify(dataObj));

        const resultsArray = dataObj.data;
        console.log(dataObj);
        if (clickedBtn === "allCardsBtn") {
          if (resultsArray.length === 1) {
            const cardDetails = resultsArray[0];
            console.log(cardDetails);

            sessionStorage.setItem(
              "cardDetails",
              JSON.stringify(resultsArray[0])
            );
            // debugger;
            window.location.href = "details.html";
          } else {
            // debugger;
            window.location.href = "results.html";
          }
        }
        if (clickedBtn === "randomBtn") {
          sessionStorage.setItem("cardDetails", JSON.stringify(dataObj));
          window.location.href = "random.html";
        }
      }
    }).fail(function (jqxhr, textStatus, error) {
      console.error("Error:", jqxhr);
      if (JSON.parse(jqxhr.responseText).code === "not_found")
      $errorMessage.text(
        "Sorry, we couldn't find any cards that match those parameters"
      );
    });
  }
});
