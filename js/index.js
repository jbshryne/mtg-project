$(document).ready(function () {
  let searchCatalogs = JSON.parse(localStorage.getItem("searchCatalogs"));

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

  // const searchCatalogs = window.searchCatalogs;
  let searchParams = JSON.parse(localStorage.getItem("searchParams"));

  const { typeCatalog, rulesTextCatalog, setCatalog, watermarkCatalog } =
    searchCatalogs;

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

  const $setInput = $("#setInput");
  const $addSetTextBtn = $("#addSetTextBtn");
  const $addRandomSetBtn = $("#addRandomSetBtn");
  const $randomSetDropdown = $("#randomSetDropdown");
  const $setSuggestions = $("#setSuggestions");
  const $selectedSetList = $("#selectedSetList");

  const $watermarkInput = $("#watermarkInput");
  const $addWatermarkTextBtn = $("#addWatermarkTextBtn");
  const $addRandomWatermarkBtn = $("#addRandomWatermarkBtn");
  const $selectedWatermarkList = $("#selectedWatermarkList");

  const $artInput = $("#artInput");
  const $addArtTextBtn = $("#addArtTextBtn");
  const $addRandomArtBtn = $("#addRandomArtBtn");
  const $selectedArtList = $("#selectedArtList");

  const $functionInput = $("#functionInput");
  const $addFunctionTextBtn = $("#addFunctionTextBtn");
  const $addRandomFunctionBtn = $("#addRandomFunctionBtn");
  const $selectedFunctionList = $("#selectedFunctionList");

  $(".addToList").hover(function () {
    $(this).attr("title", 'Add to "OR" list');
  });

  ////// SETTING UP INPUTS & BUTTONS

  function populateSuggestionList(
    thisInput,
    catalog,
    isAdditive = false,
    type
  ) {
    const $thisInput = $(thisInput);
    const inputVal = $thisInput.val();

    let inputText = "";
    let isNegative = false;

    if (isAdditive) {
      const inputWords = inputVal.split(" ");
      inputText = inputWords[inputWords.length - 1].toLowerCase();
    } else {
      inputText = inputVal.toLowerCase();
    }

    if (inputText.startsWith("-")) {
      isNegative = true;
      inputText = inputText.substring(1);
    }

    // console.log(inputText);

    const $suggestions = $thisInput
      .closest(".searchField")
      .find(".suggestions");

    let suggestionsList = [""];

    if (type === "atag") {
      suggestionsList = catalog.atag;
    } else if (type === "otag") {
      suggestionsList = catalog.otag;
    } else {
      suggestionsList = Object.keys(catalog).reduce((acc, key) => {
        acc.push(...catalog[key]);
        return acc;
      }, []);
    }

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
            inputWords[inputWords.length - 1] = `${
              isNegative ? "-" : ""
            }${suggestionText}`;
            console.log(isNegative && "-");
            $thisInput.val(inputWords.join(" ") + " ");
          } else {
            $thisInput.val(`${isNegative ? "-" : ""}${suggestionText}`);
          }
          $suggestions.empty();
        });

        $suggestions.append($suggestion);
      }
    });
  }

  function getRandomChoice(thisButton, catalog, isAdditive = false, type) {
    const $input = $(thisButton).closest(".searchField").find("input");
    let selectedGroup;

    if (type == "atag" || type == "otag") {
      selectedGroup = type;
    } else {
      selectedGroup = $(thisButton)
        .closest(".searchField")
        .find("select")
        .val();
    }

    let choiceList;

    if (selectedGroup === "any") {
      const allChoices = Object.values(catalog).reduce((acc, group) => {
        return acc.concat(group);
      }, []);
      choiceList = allChoices;
    } else {
      choiceList = catalog[selectedGroup];
    }

    let randomChoice =
      choiceList[Math.floor(Math.random() * choiceList.length)];

    if (type == "rulesText") {
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
    addTextToList(this, "selectedRulesList", true);
  });

  $addRandomRulesBtn
    .on("click", function () {
      getRandomChoice(this, rulesTextCatalog, true, "rulesText");
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
    let inputText = $setInput.val().toLowerCase();
    let isNegative = false;

    if (inputText.startsWith("-")) {
      isNegative = true;
      inputText = inputText.substring(1);
    }

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
            $setInput.val(
              `${isNegative ? "-" : ""}${setName} [${set.code.toUpperCase()}]`
            );
          });

          if (set.code.length === 3) $setSuggestions.prepend($suggestion);
          else $setSuggestions.append($suggestion);
        }
      });
    }
  });

  $addSetTextBtn.on("click", function () {
    // const isNegative = $setInput.val().startsWith("-");

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

  $addArtTextBtn.on("click", function () {
    addTextToList(this, "selectedArtList", true);
  });

  $addRandomArtBtn
    .on("click", function () {
      const thisInput = this;
      $.getJSON("./assets/tagCatalog.json", function (data) {
        getRandomChoice(thisInput, data, true, "atag");
      });
    })
    .hover(function () {
      $(this).attr("title", 'Get random "art tag"');
    });

  $artInput.on("input", function () {
    const thisInput = this;
    $.getJSON("./assets/tagCatalog.json", function (data) {
      populateSuggestionList(thisInput, data, true, "atag");
    });
  });

  $addFunctionTextBtn.on("click", function () {
    addTextToList(this, "selectedFunctionList");
  });

  $addRandomFunctionBtn
    .on("click", function () {
      const thisInput = this;
      $.getJSON("./assets/tagCatalog.json", function (data) {
        getRandomChoice(thisInput, data, true, "otag");
      });
    })
    .hover(function () {
      $(this).attr("title", 'Get random "oracle tag"');
    });

  $functionInput.on("input", function () {
    const thisInput = this;
    $.getJSON("./assets/tagCatalog.json", function (data) {
      populateSuggestionList(thisInput, data, true, "otag");
    });
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

    ////// ORIGINAL FUNCTION:
    // function formatFieldParams($inputVal, $selectedList, fieldSymbol) {
    //   let inputVal = $inputVal.val();
    //   let inputArray = [];
    //   let inputString = "";

    //   console.log(inputVal);

    //   if (inputVal) {
    //     if (fieldSymbol === "wm") {
    //       inputVal = inputVal.toLowerCase().replace(/[\s']/g, "");
    //     }
    //     inputArray.push(inputVal.trim());
    //   }

    //   if ($selectedList.children().length > 0) {
    //     $selectedList.children().each(function () {
    //       let text = $(this).text().trim().substring(2);
    //       if (fieldSymbol === "wm") {
    //         text = text.toLowerCase().replace(/[\s']/g, "");
    //       }
    //       inputArray.push(text);
    //     });
    //   }

    //   if (inputArray.length > 0) {
    //     if (fieldSymbol === "s") {
    //       inputArray = inputArray.map((param) => {
    //         const isNegative = param.startsWith("-");

    //         param = param.match(/\[(.*?)\]/)?.[1]?.toLowerCase();

    //         return `${isNegative ? "-" : ""}${param}`;
    //       });
    //     }

    //     const formattedArray = inputArray.map((param) => {
    //       const params = param.match(/-"[^"]+"|"[^"]+"|\S+/g); // Match phrases in quotes or single params

    //       const formattedParams = params.map((p) => {
    //         const isNegative = p.startsWith("-");

    //         if (isNegative) {
    //           p = p.replace(/^-/g, "");
    //         }

    //         // if (fieldSymbol === "s") {
    //         //   console.log("set");
    //         //   console.log(p);
    //         //   p = param.match(/\[(.*?)\]/)?.[1]?.toLowerCase() || param;
    //         // }

    //         // if (fieldSymbol === "o") {
    //         //   p = param.replace(/"/g, "").replace(" ", "\\s");
    //         //   p = "/\\b" + p + "\\b/";
    //         // }

    //         const formattedP = `${isNegative ? "-" : ""}${fieldSymbol}:${p}`;
    //         console.log(formattedP);
    //         return formattedP;
    //         // return `${fieldSymbol}:${p}`;
    //       });
    //       return `(${formattedParams.join(" ")})`;
    //     });
    //     inputString = `(${formattedArray.join(" or ")})`;
    //     console.log("input string for", fieldSymbol, inputString);
    //     queryArray.push(inputString);
    //   }

    //   return inputArray;
    // }

    ////// GPT FUNCTION:
    function formatFieldParams($inputVal, $selectedList, fieldSymbol) {
      let inputArray = [];
      let inputString = "";

      // 1. Collect main input
      let mainVal = $inputVal.val();
      if (mainVal) {
        if (fieldSymbol === "wm") {
          mainVal = mainVal.toLowerCase().replace(/[\s']/g, "");
        }
        inputArray.push(mainVal.trim());
      }

      // 2. Collect selected list items
      $selectedList.children().each(function () {
        let text = $(this).text().trim().substring(2);
        if (fieldSymbol === "wm") {
          text = text.toLowerCase().replace(/[\s']/g, "");
        }
        inputArray.push(text);
      });

      // 3. Special handling for set codes (s:)
      if (inputArray.length && fieldSymbol === "s") {
        inputArray = inputArray.map((param) => {
          const isNegative = param.startsWith("-");
          let cleaned = param.match(/\[(.*?)\]/)?.[1]?.toLowerCase() || param;
          return `${isNegative ? "-" : ""}${cleaned}`;
        });
      }

      // 4. Format each parameter into Scryfall syntax
      if (inputArray.length) {
        const formattedArray = inputArray.map((param) => {
          // Split into quoted phrases or single tokens
          const tokens = param.match(/-"[^"]+"|"[^"]+"|\S+/g) || [];

          const formattedTokens = tokens.map((token) => {
            const isNegative = token.startsWith("-");
            let term = isNegative ? token.slice(1) : token;

            const isQuoted = /^".+"$/.test(term);

            if (isQuoted) {
              // Leave quoted phrases as exact matches
              term = term; // keep quotes
            } else if (["o", "t"].includes(fieldSymbol)) {
              // Wrap unquoted words in whole-word regex
              term = term
                .replace(/\//g, "\\/") // Escape forward slashes
                .replace(/\s+/g, "\\s"); // Space → \s for regex matching
              term = `/\\b${term}\\b/`;
            }

            return `${isNegative ? "-" : ""}${fieldSymbol}:${term}`;
          });

          return `(${formattedTokens.join(" ")})`;
        });

        // 5. Join groups with OR
        inputString = `(${formattedArray.join(" or ")})`;
        queryArray.push(inputString);

        console.log("input string for", fieldSymbol, inputString);
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
    const isFunny = $("#isFunnyCheckbox").prop("checked");

    if (firstPrintings) {
      queryArray.push("is:firstprint");
    }

    if (includeExtras) {
      queryArray.push("include:extras");
    }

    if (isFunny) {
      queryArray.push("is:funny");
    }

    ////// art

    let artInputArray = [];
    if ($selectedArtList.children().length > 0 || $artInput.val()) {
      artInputArray = formatFieldParams($artInput, $selectedArtList, "atag");
    }

    ////// functions
    let functionInputArray = [];
    if ($selectedFunctionList.children().length > 0 || $functionInput.val()) {
      functionInputArray = formatFieldParams(
        $functionInput,
        $selectedFunctionList,
        "otag"
      );
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

    console.log(queryString);
    // debugger;

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
        selectedArtList: artInputArray,
        selectedFunctionList: functionInputArray,
      },
      sortOrder,
      apiCallUrl,
    };

    localStorage.setItem("searchParams", JSON.stringify(searchParams));
    // debugger;

    //// MAKING THE CALL

    $.getJSON(apiCallUrl, function (dataObj, textStatus, jqxhr) {
      console.log("response successful");

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
            window.location.href = "details.html";
          } else {
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
