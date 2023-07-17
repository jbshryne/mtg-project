// $(function () {
  ////// Dynamically generate dropdown list of sets

  const searchParams = JSON.parse(sessionStorage.getItem("searchParams"));
  const $setList = $("#setDropdown");

  if (!sessionStorage.getItem("setListHtml")) {
    console.log(sessionStorage.getItem("setListHtml"));
    $.getJSON("https://api.scryfall.com/sets", function (listObj) {
      console.log("api call");
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
    }).then(function () {
      sessionStorage.setItem("setListHtml", $setList.html())
    });  
    
  } else {
    $setList.html(sessionStorage.getItem("setListHtml"))
  }


  //// WORKING WITH OTHER DOM ELEMENTS

  $("#allCardsBtn").on("click", searchHandler);
  $("#randomBtn").on("click", searchHandler);

  const $errorMessage = $(".errorMessage");
  window.onbeforeunload = function () {
    $errorMessage.empty();
  };

  //// SEARCH LOGIC

  ////// Wrapper function to keep track of which button was clicked
  function searchHandler(e) {
    e.preventDefault();

    const clickedBtnId = $(e.target).attr("id");
    searchFnc(clickedBtnId);
  }

  function searchFnc(clickedBtn) {
    // sessionStorage.clear();
    sessionStorage.removeItem("searchParams");
    sessionStorage.removeItem("queryResponse");
    sessionStorage.removeItem("allPages");
    sessionStorage.setItem("targetPage", 1)
    
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

    ////// set code
    const setCodeVal = $("#setDropdown").val();
    let setInputString;
    if (setCodeVal) {
      setInputString = `s:${setCodeVal}`;
      queryArray.push(setInputString);
    }

    ////// sort order of search result list
    const sortOrder = $("#sortDropdown").val();
    let orderString;
    sortOrder === "type" ? (orderString = "color") : (orderString = sortOrder);

    const encodedArray = queryArray.map((query) => encodeURIComponent(query));
    const queryString = encodedArray.join("+");

    if (clickedBtn === "allCardsBtn") {
      apiCallUrl = `https://api.scryfall.com/cards/search?order=${orderString}&q=${queryString}+game%3Apaper`;
    }
    if (clickedBtn === "randomBtn") {
      apiCallUrl = `https://api.scryfall.com/cards/random?q=${queryString}`;
    }

    ////// Passing query info to sessionStorage
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

      ////// Capping search at 1000 results
      if (dataObj.total_cards > 1000) {
        $errorMessage.text(
          "Those results are over 1000 cards! Please narrow your search parameters."
        );
        return;
      } else {
        sessionStorage.setItem("queryResponse", JSON.stringify(dataObj));

        ////// Passing results to sessionStorage
        const resultsArray = dataObj.data;
        console.log(dataObj);

        ////// Redirecting to proper page based on
        ////// button clicked and number of results
        if (clickedBtn === "allCardsBtn") {
          if (resultsArray.length === 1) {
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
// });
