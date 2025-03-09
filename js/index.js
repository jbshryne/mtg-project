$(document).ready(function () {
  //// Load or generate list of searchable sets
  let searchableSets = JSON.parse(localStorage.getItem("searchableSets"));
  let watermarks = JSON.parse(localStorage.getItem("watermarks"));
  let typeCatalog = JSON.parse(localStorage.getItem("typeCatalog"));
  let oracleText = JSON.parse(localStorage.getItem("oracleText"));

  const setCategories = {
    core: ["core"],
    expansion: ["expansion"],
    supplemental: [
      "masters",
      "masterpiece",
      "from_the_vault",
      "spellbook",
      "premium_deck",
      "duel_deck",
      "box",
      "promo",
      "arsenal",
      "draft_innovation",
      "commander",
      "planechase",
      "archenemy",
      "starter",
    ],
    nonDCI: ["vanguard", "funny", "memorabilia"],
    digital: ["alchemy", "treasure_chest"],
    extras: ["token", "minigame"],
  };

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
          setType: set.set_type,
          uri: set.uri,
        };
      });
      searchableSets._dateRetrieved = new Date();

      localStorage.setItem("searchableSets", JSON.stringify(searchableSets));
    });
  }

  const $typeInput = $("#typeInput");
  const $addRandomTypeBtn = $("#addRandomTypeBtn");
  const $randomTypeDropdown = $("#randomTypeDropdown");

  const $rulesTextInput = $("#rulesTextInput");
  const $addRandomRulesBtn = $("#addRandomRulesBtn");
  const $randomRulesDropdown = $("#randomRulesDropdown");

  const $watermarkInput = $("#watermarkInput");
  const $addRandomWatermarkBtn = $("#addRandomWatermarkBtn");
  const $randomWatermarkDropdown = $("#randomWatermarkDropdown");
  const $watermarkSuggestions = $("#watermarkSuggestions");

  const $setInput = $("#setInput");
  const $addRandomSetBtn = $("#addRandomSetBtn");
  const $randomSetDropdown = $("#randomSetDropdown");
  const $setSuggestions = $("#setSuggestions");
  const $selectedSetList = $("#selectedSetList");

  /// SETTING UP INPUTS, BUTTONS, AND DROPDOWNS

  $addRandomTypeBtn.on("click", function () {
    const currentTypeInputVal = $typeInput.val().trim();
    const selectedType = $randomTypeDropdown.val();
    const cardTypes = typeCatalog[selectedType];

    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    if (currentTypeInputVal) {
      $typeInput.val(currentTypeInputVal + " " + randomType);
    } else {
      $typeInput.val(randomType);
    }
  });

  $addRandomRulesBtn.on("click", function () {
    const currentRulesInputVal = $rulesTextInput.val().trim();
    const selectedType = $randomRulesDropdown.val();
    const rulesList = oracleText[selectedType];
    let randomRule = rulesList[Math.floor(Math.random() * rulesList.length)];

    randomRule = randomRule.includes(" ") ? '"' + randomRule + '"' : randomRule;

    if (currentRulesInputVal) {
      $rulesTextInput.val(currentRulesInputVal + " " + randomRule);
    } else {
      $rulesTextInput.val(randomRule);
    }
  });

  $watermarkInput.on("input", function () {
    const inputText = $watermarkInput.val().toLowerCase();
    const watermarkList = Object.keys(watermarks).reduce((acc, key) => {
      acc.push(...watermarks[key]);
      return acc;
    }, []);

    $watermarkSuggestions.empty();

    if (inputText.length >= 1) {
      watermarkList.forEach((watermark) => {
        if (watermark.toLowerCase().startsWith(inputText)) {
          const $suggestion = $(
            `<div class="watermarkSuggestion">${watermark}</div>`
          );

          $suggestion.on("click", function () {
            $watermarkInput.val(watermark);
            $watermarkSuggestions.empty();
          });

          $watermarkSuggestions.append($suggestion);
        }
      });
    }
  });

  $addRandomWatermarkBtn.on("click", function () {
    const selectedType = $randomWatermarkDropdown.val();
    const watermarkList = watermarks[selectedType];
    const randomWatermark =
      watermarkList[Math.floor(Math.random() * watermarkList.length)];
    $watermarkInput.val(randomWatermark);
  });

  $setInput.on("input", function () {
    const inputText = $setInput.val().toLowerCase();
    $setSuggestions.empty();

    if (inputText.length >= 2) {
      Object.keys(searchableSets).forEach((setName, idx) => {
        const set = searchableSets[setName];

        // Check if either set name or set code contains the input text
        if (
          setName.toLowerCase().includes(inputText) ||
          (set.code && set.code.toLowerCase().includes(inputText))
        ) {
          const $suggestion = $(
            `<div class="setSuggestion">${
              set.code && set.code.toUpperCase()
            } - ${setName}</div>`
          );

          $suggestion.on("click", function () {
            $selectedSetList.append(
              `<li data-setcode="${
                set.code
              }" class="selectedSet"><button class="removeSetBtn">X</button>
              ${setName} (${set.code.toUpperCase()})</li>`
            );
            $setSuggestions.empty();
            $setInput.val("");
          });

          $(".removeSetBtn")
            .off()
            .on("click", function () {
              $(this).parent().remove();
            });

          $setSuggestions.append($suggestion);
        }
      });
    }
  });

  $addRandomSetBtn.on("click", function () {
    const selectedCategory = $randomSetDropdown.val();
    const categorySets = setCategories[selectedCategory];

    const setsInCategory = Object.values(searchableSets).filter((set) =>
      categorySets.includes(set.setType)
    );

    const randomSet =
      setsInCategory[Math.floor(Math.random() * setsInCategory.length)];

    const setName = Object.keys(searchableSets).find(
      (key) => searchableSets[key].code === randomSet.code
    );

    $selectedSetList.append(
      `<li data-setcode="${
        randomSet.code
      }" class="selectedSet"><button class="removeSetBtn">X</button>
          ${setName} (${randomSet.code.toUpperCase()})</li>`
    );
    $setSuggestions.empty();
    $setInput.val("");

    $(".removeSetBtn")
      .off()
      .on("click", function () {
        $(this).parent().remove();
      });
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

  const $coloredBoxes = $(".coloredBox");
  const $colorlessBox = $("#colorlessBox");

  $colorlessBox.change(function () {
    if (this.checked) {
      $coloredBoxes.prop("checked", false);
    }
  });

  $coloredBoxes.change(function () {
    if (this.checked) {
      $colorlessBox.prop("checked", false);
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
    submitSearch(clickedBtnId);
  }

  $('input[type="radio"]').change(function () {
    const selectedValue = $('input[name="colorOps"]:checked').val();
    console.log(selectedValue);
  });

  function submitSearch(clickedBtn) {
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

    const typeInputVal = $typeInput.val();
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
        queryArray.push("c:" + colorArray.join(""));
      } else if (colorOperator === "and") {
        queryArray.push("c=" + colorArray.join(""));
      } else if (colorOperator === "not") {
        colorArray.forEach((color) => {
          queryArray.push("-c:" + color);
        });
      } else if (colorOperator === "id") {
        queryArray.push("id:" + colorArray.join(""));
      }
    }

    ////// rules text

    const rulesInputVal = $rulesTextInput.val();
    let rulesInputArray = [];
    let rulesInputString = "";

    if (rulesInputVal) {
      /// Detecting uses of '""' in the input
      const quotedStrings = rulesInputVal.match(/"([^"]*)"/g);
      if (quotedStrings) {
        rulesInputArray = rulesInputVal.split(/"([^"]*)"/g);
        rulesInputArray = rulesInputArray.filter((el) => el !== "");
      } else {
        rulesInputArray = rulesInputVal.split(" ");
      }

      const formattedRulesArray = rulesInputArray.map((rule) => `o:"${rule}"`);
      rulesInputString = `(${formattedRulesArray.join(" ")})`;
      queryArray.push(rulesInputString);

      console.log(rulesInputArray);
    }

    ////// watermark

    let watermarkInputVal = $watermarkInput
      .val()
      .toLowerCase()
      .replace(/[\s']/g, "");

    if (watermarkInputVal) {
      const formattedWatermark = `wm:${watermarkInputVal}`;
      queryArray.push(formattedWatermark);
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
      apiCallUrl = `https://api.scryfall.com/cards/search?order=${orderString}&q=${queryString}`;
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
      watermark: watermarkInputVal,
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
