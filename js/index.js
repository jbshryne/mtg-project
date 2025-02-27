$(document).ready(function () {
  //// Load or generate list of searchable sets
  let searchableSets = JSON.parse(localStorage.getItem("searchableSets"));

  //// Check if searchableSets is null or outdated
  const currentDate = new Date();

  if (searchableSets && searchableSets._dateRetrieved) {
    const dateRetrieved = new Date(searchableSets._dateRetrieved);
    const timeDifference = currentDate - dateRetrieved;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 24) {
      searchableSets = null;
    }
  }

  if (!searchableSets) {
    $.getJSON("https://api.scryfall.com/sets", function (setsResponse) {
      const sets = setsResponse.data;

      searchableSets = {};
      sets.forEach((set) => {
        searchableSets[set.name] = {
          code: set.code,
          uri: set.uri,
        };
      });
      searchableSets._dateRetrieved = new Date();

      localStorage.setItem("searchableSets", JSON.stringify(searchableSets));
    });
  }

  const $setInput = $("#setInput");
  const $setSuggestions = $("#setSuggestions");
  const $selectedSetList = $("#selectedSetList");

  //// Register input event listener for set input

  $setInput.on("input", function () {
    const inputText = $setInput.val().toLowerCase();
    $setSuggestions.empty();

    if (inputText.length >= 2) {
      Object.keys(searchableSets).forEach((setName) => {
        const set = searchableSets[setName];

        // Check if either set name or set code contains the input text
        if (
          setName.toLowerCase().includes(inputText) ||
          set.code.toLowerCase().includes(inputText)
        ) {
          const $suggestion = $(
            `<div class="setSuggestion">${set.code.toUpperCase()} - ${setName}</div>`
          );

          $suggestion.on("click", function () {
            $selectedSetList.append(
              `<li data-setcode="${
                set.code
              }" class="selectedSet">${setName} (${set.code.toUpperCase()})</li>`
            );
            $setSuggestions.empty();
            $setInput.val("");
          });

          $setSuggestions.append($suggestion);
        }
      });
    }
  });

  function constructSetCodesQueryString() {
    const selectedSetElements = $(".selectedSet"); // Assuming you've used this class for selected <li> elements
    const setCodes = selectedSetElements
      .map((_, element) => {
        console.log(element.dataset.setcode);
        return $(element).data("setcode").toLowerCase();
      })
      .get();

    // Constructing the set codes query string
    const setCodesQueryString = setCodes
      .map((code) => `s:${code}`)
      .join(" OR ");

    return setCodesQueryString;
  }

  /// SETTING UP THE COLOR CHECKBOXES

  const $boxW = $("#boxW");
  const $boxU = $("#boxU");
  const $boxB = $("#boxB");
  const $boxR = $("#boxR");
  const $boxG = $("#boxG");
  const $boxC = $("#boxC");

  $boxC.change(function () {
    if (this.checked) {
      $boxW.prop("checked", false);
      $boxU.prop("checked", false);
      $boxB.prop("checked", false);
      $boxR.prop("checked", false);
      $boxG.prop("checked", false);
    }
  });

  const $coloredBoxes = $boxW.add($boxU).add($boxB).add($boxR).add($boxG);

  $coloredBoxes.change(function () {
    if (this.checked) {
      $boxC.prop("checked", false);
    }
  });

  ////// WORKING WITH OTHER DOM ELEMENTS

  $("#allCardsBtn").on("click", searchHandler);
  $("#randomBtn").on("click", searchHandler);

  const $errorMessage = $(".errorMessage");
  window.onbeforeunload = function () {
    $errorMessage.empty();
  };

  ////// SEARCH LOGIC

  //// Wrapper function to keep track of which button was clicked
  function searchHandler(e) {
    e.preventDefault();

    const clickedBtnId = $(e.target).attr("id");
    searchFnc(clickedBtnId);
  }

  $('input[type="radio"]').change(function () {
    const selectedValue = $('input[name="colorOps"]:checked').val();
    console.log(selectedValue);
  });

  function searchFnc(clickedBtn) {
    $errorMessage.text("");

    localStorage.removeItem("searchParams");
    localStorage.removeItem("queryResponse");
    localStorage.removeItem("allPages");
    localStorage.setItem("targetPage", 1);

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

    const colorOperator = $('input[name="colorOps"]:checked').val();
    const colorArray = [];
    const $checkedColors = $(".color:checked");

    $checkedColors.each(function () {
      const value = $(this).val();
      colorArray.push(value);
    });

    if (colorArray.length > 0) {
      if (colorOperator === "or") {
        // const formattedColorArray = colorArray.map((color) => `c:${color}`);
        // const colorString = `(${formattedColorArray.join(" or ")})`;
        // queryArray.push(colorString);
        queryArray.push("c:" + colorArray.join(""));
      } else if (colorOperator === "and") {
        queryArray.push("c=" + colorArray.join(""));
      } else if (colorOperator === "id") {
        queryArray.push("id:" + colorArray.join(""));
      }
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

    const setCodesQueryString = constructSetCodesQueryString();

    if (setCodesQueryString) {
      const stringWithParentheses = `(${setCodesQueryString})`;
      console.log(stringWithParentheses);
      queryArray.push(stringWithParentheses);
    }

    ////// other options

    const firstPrintings = $("#firstPrintingsCheckbox").prop("checked");
    const includeExtras = $("#includeExtrasCheckbox").prop("checked");

    if (firstPrintings) {
      queryArray.push("is:firstprint");
    }

    if (includeExtras) {
      queryArray.push("include:extras");
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

    ////// Passing query info to localStorage

    const searchParams = {
      nameWords: nameInputArray,
      types: typeInputArray,
      colors: colorArray,
      rarities: rarityArray,
      setName: $setInput.val(),
      sortOrder,
      apiCallUrl,
    };

    localStorage.setItem("searchParams", JSON.stringify(searchParams));

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
        localStorage.setItem("queryResponse", JSON.stringify(dataObj));

        ////// Passing results to localStorage
        const resultsArray = dataObj.data;
        console.log(dataObj);

        ////// Redirecting to proper page based on
        ////// button clicked and number of results
        if (clickedBtn === "allCardsBtn") {
          if (resultsArray.length === 1) {
            localStorage.setItem(
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
          localStorage.setItem("cardDetails", JSON.stringify(dataObj));
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
