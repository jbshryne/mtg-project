$(document).ready(function () {
  //// Load or generate lists of card types, watermarks, and set codes
  let searchCatalogs = JSON.parse(localStorage.getItem("searchCatalogs"));
  let searchParams = JSON.parse(localStorage.getItem("searchParams"));

  ////// Check if searchCatalogs are outdated or null
  const currentDate = Date.now();

  if (searchCatalogs && searchCatalogs._dateRetrieved) {
    const dateRetrieved = Date.parse(searchCatalogs._dateRetrieved);
    const timeDifference = currentDate - dateRetrieved;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 24) {
      searchCatalogs = null;
    }
  }

  if (!searchCatalogs) {
    searchCatalogs = {
      typeCatalog: {
        supertypes: [],
        mainCardTypes: [],
        creatureTypes: [],
        planeswalkerTypes: [],
        landTypes: [],
        artifactTypes: [],
        enchantmentTypes: [],
        spellTypes: [],
        battleTypes: [],
      },
      rulesTextCatalog: {
        "keyword-abilities": [],
        "keyword-actions": [],
        "ability-words": [],
        "flavor-words": [],
      },
      setCatalog: [],
      watermarkCatalog: {
        faction: [
          "Abzan",
          "Agents of Sneak",
          "Atarka",
          "Azorius",
          "Boros",
          "Brokers",
          "Cabaretti",
          "Crossbreed Labs",
          "Dimir",
          "Dromoka",
          "Goblin Explosioneers",
          "Golgari",
          "Gruul",
          "Izzet",
          "Jeskai",
          "Kolaghan",
          "League of Dastardly Doom",
          "Lorehold",
          "Maestros",
          "Mardu",
          "Mirran",
          "Obscura",
          "Ojutai",
          "Order of the Widget",
          "Orzhov",
          "Phyrexian",
          "Prismari",
          "Quandrix",
          "Rakdos",
          "Riveteers",
          "Selesnya",
          "Silumgar",
          "Silverquill",
          "Simic",
          "Sultai",
          "Tarkir",
          "Temur",
          "Witherbloom",
        ],
        cardInfo: ["Conspiracy", "Desparked", "Foretell", "Set"],
        promo: [
          "Arena",
          "Color Pie",
          "CoroCoro",
          "DCI",
          "Dengeki Maoh",
          "Flavor",
          "FNM",
          "Grand Prix",
          "Hero's Path",
          "Japan Junior",
          "Judge Academy",
          "Junior",
          "Junior APAC",
          "Junior Europe",
          "MagicFest",
          "MPS",
          "MTG",
          "MTG 10",
          "MTG 15",
          "Planeswalker",
          "Pro Tour",
          "Scholarship",
          "Trump Katsumai",
          "WOTC",
          "WPN",
        ],
        crossover: ["Cutie Mark", "D&D", "Nerf", "Transformers"],
      },
      _dateRetrieved: new Date(),
    };

    const endpoints = {
      supertypes: "catalog/supertypes",
      mainCardTypes: "catalog/card-types",
      creatureTypes: "catalog/creature-types",
      planeswalkerTypes: "catalog/planeswalker-types",
      landTypes: "catalog/land-types",
      artifactTypes: "catalog/artifact-types",
      enchantmentTypes: "catalog/enchantment-types",
      spellTypes: "catalog/spell-types",
      battleTypes: "catalog/battle-types",
      "keyword-abilities": "catalog/keyword-abilities",
      "keyword-actions": "catalog/keyword-actions",
      "ability-words": "catalog/ability-words",
      "flavor-words": "catalog/flavor-words",
      sets: "sets",
    };

    const timedSearchFetch = (type, urlTag) => {
      const category = urlTag.endsWith("types")
        ? "typeCatalog"
        : "rulesTextCatalog";

      return new Promise((resolve) => {
        setTimeout(() => {
          $.getJSON("https://api.scryfall.com/" + urlTag, function (response) {
            urlTag == "sets"
              ? (searchCatalogs.setCatalog = response.data.reduce(
                  (acc, set) => {
                    acc[set.name] = {
                      code: set.code,
                      setType: set.set_type,
                      uri: set.uri,
                    };
                    return acc;
                  },
                  {}
                ))
              : (searchCatalogs[category][type] = response.data);
            resolve();
          });
        }, 100);
      });
    };

    const fetchSearchData = async () => {
      for (const [type, urlTag] of Object.entries(endpoints)) {
        await timedSearchFetch(type, urlTag);
      }
      localStorage.setItem("searchCatalogs", JSON.stringify(searchCatalogs));
    };

    fetchSearchData();
  }

  const { typeCatalog, rulesTextCatalog, setCatalog, watermarkCatalog } =
    searchCatalogs;

  // if (searchParams) {
  //   console.log(searchParams);

  //   const prefillList = (listName) => {
  //     const list = searchParams.selectedParams[listName];
  //     const $list = $("#" + listName);
  //     if (list.length > 0) {
  //       list.forEach((item) => {
  //         $list.append(
  //           `<li class="selectedItem"><button class="removeParamBtn smallButton">X</button> ${item}</li>`
  //         );
  //       });
  //       $list.css("display", "block");
  //     }
  //   };

  //   prefillList("selectedNameList");
  //   prefillList("selectedTypeList");
  //   prefillList("selectedRulesList");
  //   prefillList("selectedWatermarkList");
  //   prefillList("selectedSetList");
  // }

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

  const $nameInput = $("#nameInput");
  const $addNameTextBtn = $("#addNameTextBtn");
  const $selectedNameList = $("#selectedNameList");

  const $typeInput = $("#typeInput");
  const $addTypeTextBtn = $("#addTypeTextBtn");
  const $addRandomTypeBtn = $("#addRandomTypeBtn");
  const $selectedTypeList = $("#selectedTypeList");

  const $rulesTextInput = $("#rulesTextInput");
  const $addRulesTextBtn = $("#addRulesTextBtn");
  const $addRandomRulesBtn = $("#addRandomRulesBtn");
  const $selectedRulesList = $("#selectedRulesList");

  const $watermarkInput = $("#watermarkInput");
  const $addWatermarkTextBtn = $("#addWatermarkTextBtn");
  const $addRandomWatermarkBtn = $("#addRandomWatermarkBtn");
  const $selectedWatermarkList = $("#selectedWatermarkList");

  const $setInput = $("#setInput");
  const $addSetTextBtn = $("#addSetTextBtn");
  const $addRandomSetBtn = $("#addRandomSetBtn");
  const $randomSetDropdown = $("#randomSetDropdown");
  const $setSuggestions = $("#setSuggestions");
  const $selectedSetList = $("#selectedSetList");

  $(".addToList").hover(function () {
    $(this).attr("title", 'Add to "OR" list');
  });

  ////// SETTING UP INPUTS & BUTTONS

  function populateSuggestionList(thisInput, catalog, isAdditive = false) {
    const $thisInput = $(thisInput);
    const inputVal = $thisInput.val();

    let inputText = "";
    if (isAdditive) {
      const inputWords = inputVal.split(" ");
      inputText = inputWords[inputWords.length - 1].toLowerCase();
    } else {
      inputText = inputVal.toLowerCase();
    }

    console.log(inputText);

    const $suggestions = $thisInput
      .closest(".searchField")
      .find(".suggestions");

    const suggestionsList = Object.keys(catalog).reduce((acc, key) => {
      acc.push(...catalog[key]);
      return acc;
    }, []);

    $suggestions.empty();

    if (inputText.length >= 1) {
      $(document).on("click", function (event) {
        if (
          !$(event.target).closest($thisInput).length &&
          !$(event.target).closest($suggestions).length
        ) {
          console.log("Clicked outside");
          $suggestions.empty();
          setTimeout(() => {
            $(document).off("click");
          }, 100);
        }
      });
    }
    if (inputText.length < 1) {
      $suggestions.empty();
      $(document).off("click");
      return;
    }
    suggestionsList.forEach((suggestion) => {
      if (suggestion.toLowerCase().startsWith(inputText)) {
        const suggestionText = suggestion;
        const $suggestion = $(
          `<div class="suggestion">${suggestionText}</div>`
        );

        $suggestion.on("click", function () {
          if (isAdditive) {
            const inputWords = $thisInput.val().trim().split(" ");
            inputWords[inputWords.length - 1] = suggestionText;
            $thisInput.val(inputWords.join(" ") + " ");
          } else {
            $thisInput.val(suggestionText);
          }
          $suggestions.empty();
        });

        $suggestions.append($suggestion);
      }
    });
  }

  function getRandomChoice(
    thisButton,
    catalog,
    isAdditive = false,
    isRules = false
  ) {
    const $input = $(thisButton).closest(".searchField").find("input");
    const selectedGroup = $(thisButton)
      .closest(".searchField")
      .find("select")
      .val();
    const choiceList = catalog[selectedGroup];
    let randomChoice =
      choiceList[Math.floor(Math.random() * choiceList.length)];

    if (isRules) {
      console.log(randomChoice);
      randomChoice = randomChoice.includes(" ")
        ? '"' + randomChoice + '"'
        : randomChoice;
    }

    if (isAdditive) {
      const inputVal = $input.val().trim();
      if (inputVal) {
        $input.val(inputVal + " " + randomChoice);
      } else {
        $input.val(randomChoice);
      }
    } else {
      console.log("else");
      $input.val(randomChoice);
    }
  }

  function addTextToList(thisButton, listId) {
    const $textInput = $(thisButton).closest(".searchField").find("input");
    const $list = $("#" + listId);
    const inputVal = $textInput.val().trim();

    if (inputVal) {
      $list.css("display", "block");
      $list.append(
        `<li class="selectedItem"><button class="removeParamBtn smallButton">X</button> ${inputVal}</li>`
      );
      $textInput.val("");
      setupRemoveButtons(listId);
    }
  }

  function setupRemoveButtons(listId) {
    $(".removeParamBtn")
      .off()
      .on("click", function () {
        if ($(this).parent().siblings().length === 0) {
          $(this).parent().parent().css("display", "none");
        }

        const updatedList = searchParams.selectedParams[listId].filter(
          (item) => {
            console.log($(this).parent().text().trim().substring(2));
            return item !== $(this).parent().text().trim().substring(2);
          }
        );

        // const updatedSearchParams = {
        //   ...searchParams,
        // };

        // updatedSearchParams.selectedParams[listId] = updatedList;

        // // localStorage.removeItem("searchParams");

        // localStorage.setItem(
        //   "searchParams",
        //   JSON.stringify(updatedSearchParams)
        // );

        // debugger;
        $(this).parent().remove();

        // console.log("clicked");
      });
  }

  $addNameTextBtn.on("click", function () {
    addTextToList(this, "selectedNameList");
  });

  $typeInput.on("input", function () {
    populateSuggestionList(this, typeCatalog, true);
  });

  $addTypeTextBtn.on("click", function () {
    addTextToList(this, "selectedTypeList");
  });

  $addRandomTypeBtn
    .on("click", function () {
      getRandomChoice(this, typeCatalog, true);
    })
    .hover(function () {
      $(this).attr("title", "Get random type from selected category");
    });

  $addRulesTextBtn.on("click", function () {
    addTextToList(this, "selectedRulesList");
  });

  $addRandomRulesBtn
    .on("click", function () {
      getRandomChoice(this, rulesTextCatalog, true, true);
    })
    .hover(function () {
      $(this).attr("title", "Get random word or phrase from selected category");
    });

  $watermarkInput.on("input", function () {
    populateSuggestionList(this, watermarkCatalog);
  });

  $addWatermarkTextBtn.on("click", function () {
    addTextToList(this, "selectedWatermarkList");
  });

  $addRandomWatermarkBtn
    .on("click", function () {
      getRandomChoice(this, watermarkCatalog);
    })
    .hover(function () {
      $(this).attr("title", "Get random watermark from selected category");
    });

  $setInput.on("input", function () {
    const inputText = $setInput.val().toLowerCase();
    $setSuggestions.empty();

    if (inputText.length >= 2) {
      Object.keys(setCatalog).forEach((setName, idx) => {
        const set = setCatalog[setName];

        // Check if either set name or set code contains the input text
        if (
          setName.toLowerCase().includes(inputText) ||
          (set.code && set.code.toLowerCase().includes(inputText))
        ) {
          const newSuggestionText = `${setName} (${
            set.code && set.code.toUpperCase()
          })`;

          const $suggestion = $(
            `<div class="suggestion">${newSuggestionText}</div>`
          );

          $suggestion.on("click", function () {
            $setSuggestions.empty();
            $setInput.val(`${setName} [${set.code.toUpperCase()}]`);
          });

          $setSuggestions.append($suggestion);
        }
      });
    }
  });

  $addSetTextBtn.on("click", function () {
    const setCode = $setInput
      .val()
      .match(/\[(.*?)\]/)[1]
      .toUpperCase();
    const setName = $setInput
      .val()
      .replace(/\s*\[.*?\]/, "")
      .trim();

    console.log(setCode, setName);

    if (
      setCode &&
      setName &&
      (Object.keys(setCatalog).includes(setName) ||
        Object.values(setCatalog).some(
          (set) => set.code.toUpperCase() === setCode
        ))
    ) {
      $selectedSetList.append(
        `<li data-setcode="${setCode}" class="selectedSet"><button class="removeParamBtn smallButton">X</button>
          ${setName} [${setCode}]</li>`
      );
      $selectedSetList.css("display", "block");
      $setSuggestions.empty();
      $setInput.val("");
      setupRemoveButtons("selectedSetList");
    }
  });

  $addRandomSetBtn
    .on("click", function () {
      const selectedCategory = $randomSetDropdown.val();
      const categorySets = setCategories[selectedCategory];

      const setsInCategory = Object.values(setCatalog).filter((set) =>
        categorySets.includes(set.setType)
      );

      const randomSet =
        setsInCategory[Math.floor(Math.random() * setsInCategory.length)];

      const setName = Object.keys(setCatalog).find(
        (key) => setCatalog[key].code === randomSet.code
      );

      $setSuggestions.empty();
      $setInput.val(`${setName} [${randomSet.code.toUpperCase()}]`);
      setupRemoveButtons();
    })
    .hover(function () {
      $(this).attr("title", "Get random set from selected category");
    });

  ////// SETTING UP THE COLOR CHECKBOXES

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

  $("#allCardsBtn").on("click", searchButtonHandler);
  $("#randomBtn").on("click", searchButtonHandler);

  const $errorMessage = $(".errorMessage");
  window.onbeforeunload = function () {
    $errorMessage.empty();
  };

  ////// SEARCH LOGIC

  //// Wrapper function to keep track of which button was clicked
  function searchButtonHandler(e) {
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

    function formatFieldParams($inputVal, $selectedList, fieldSymbol) {
      let inputVal = $inputVal.val();
      let inputArray = [];
      let inputString = "";

      if (inputVal) {
        if (fieldSymbol === "wm") {
          inputVal = inputVal.toLowerCase().replace(/[\s']/g, "");
        }
        inputArray.push(inputVal.trim());
      }

      if ($selectedList.children().length > 0) {
        $selectedList.children().each(function () {
          let text = $(this).text().trim().substring(2);
          if (fieldSymbol === "wm") {
            text = text.toLowerCase().replace(/[\s']/g, "");
          }
          inputArray.push(text);
        });
      }

      if (inputArray.length > 0) {
        const formattedArray = inputArray.map((param) => {
          const params = param.match(/"[^"]+"|\S+/g); // Match phrases in quotes or single params
          const formattedParams = params.map((p) => {
            if (fieldSymbol === "s") {
              p = param.match(/\[(.*?)\]/)?.[1]?.toLowerCase() || param;
            }
            if (fieldSymbol === "o") {
              p = param.replace(/"/g, "").replace(" ", "\\s");
              p = "/\\b" + p + "\\b/";
            }
            return `${fieldSymbol}:${p}`;
          });
          return `(${formattedParams.join(" ")})`;
        });
        inputString = `(${formattedArray.join(" or ")})`;
        queryArray.push(inputString);
      }

      return inputArray;
    }

    console.log("Searching Database...");

    //// CONSTRUCTING THE API CALL

    ////// name

    let nameInputArray = [];

    if ($selectedNameList.children().length > 0 || $nameInput.val()) {
      nameInputArray = formatFieldParams($nameInput, $selectedNameList, "name");
    }

    ////// types

    let typeInputArray = [];

    if ($selectedTypeList.children().length > 0 || $typeInput.val()) {
      typeInputArray = formatFieldParams($typeInput, $selectedTypeList, "t");
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

    let rulesTextInputArray = [];

    if ($selectedRulesList.children().length > 0 || $rulesTextInput.val()) {
      rulesTextInputArray = formatFieldParams(
        $rulesTextInput,
        $selectedRulesList,
        "o"
      );
    }

    ////// watermark

    let watermarkInputArray = [];

    if ($selectedWatermarkList.children().length > 0 || $watermarkInput.val()) {
      watermarkInputArray = formatFieldParams(
        $watermarkInput,
        $selectedWatermarkList,
        "wm"
      );
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

    ////// sets

    let setInputArray = [];

    if ($selectedSetList.children().length > 0 || $setInput.val()) {
      setInputArray = formatFieldParams($setInput, $selectedSetList, "s");
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
      selectedParams: {
        selectedNameList: nameInputArray,
        selectedTypeList: typeInputArray,
        selectedRulesList: rulesTextInputArray,
        colors: colorArray,
        rarities: rarityArray,
        selectedSetList: setInputArray,
        selectedWatermarkList: watermarkInputArray,
      },
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
