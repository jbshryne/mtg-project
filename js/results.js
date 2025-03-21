$(function () {
  //// CONSTANTS AND VARIABLES

  const searchParams = JSON.parse(localStorage.getItem("searchParams"));
  const response = JSON.parse(localStorage.getItem("queryResponse"));
  const allPages = JSON.parse(localStorage.getItem("allPages"));
  const targetPage = JSON.parse(localStorage.getItem("targetPage"));
  // let currentPage = window.location.href;
  if (!response) window.location.href = "index.html";

  const $displayBox = $(".displayBox");
  const $displayingResults = $("#displayingResults");
  const $imgContainer = $("<div class='imgContainer'></div>");

  let allResultsArray = [];
  const pageArray = [];
  const sortOrder = searchParams.sortOrder;
  const numberOfPages = Math.ceil(response.total_cards / 175);
  const cardsPerPage = 175;

  // value objects
  const colorValues = {
    c: 0,
    w: 1,
    u: 2,
    b: 3,
    r: 4,
    g: 5,
    wu: 6,
    ub: 7,
    br: 8,
    rg: 9,
    gw: 10,
    wb: 11,
    ur: 12,
    bg: 13,
    rw: 14,
    gu: 15,
    gwu: 16,
    wub: 17,
    ubr: 18,
    brg: 19,
    rgw: 20,
    wur: 21,
    ubg: 22,
    brw: 23,
    rgu: 24,
    gwb: 25,
    ubrg: 26,
    wbrg: 27,
    wurg: 28,
    wubg: 29,
    wubr: 30,
    wubrg: 31,
  };

  const rarityValues = {
    mythic: 1,
    rare: 2,
    uncommon: 3,
    common: 4,
  };

  const basicLandValues = {
    Plains: 1,
    Island: 2,
    Swamp: 3,
    Mountain: 4,
    Forest: 5,
    Wastes: 6,
  };

  //// FUNCTIONS

  function joinIfArray(attr) {
    if (Array.isArray(attr)) {
      return attr.join();
    } else return attr;
  }

  function sortFnc(a, b, param) {
    // console.log("sortFnc fires:", a.name, b.name)
    // debugger;
    let valueObj;
    if (param === "rarity") {
      valueObj = rarityValues;
    }
    if (param === "colors" || param === "color_identity") {
      valueObj = colorValues;
    }

    if (valueObj) {
      // console.log(`sorting ${a.name} and ${b.name} by ${param}`);
      let paramOfA = a[param];
      let paramOfB = b[param];

      const aParamValue = valueObj[paramOfA] || 0;
      const bParamValue = valueObj[paramOfB] || 0;
      if (aParamValue < bParamValue) {
        // console.log(paramOfA, " < ", paramOfB);
        return -1; // a goes before b
      }
      if (aParamValue > bParamValue) {
        return 1; // a goes after b
      }
      return 0;
    }
    if (a[param] < b[param]) {
      return -1; // a goes before b
    }
    if (a[param] > b[param]) {
      return 1; // a goes after b
    }
    return 0; // a === b
  }

  function sortHandler(array, primeParam, secondParam, thirdParam) {
    function mainSorter(array) {
      array.sort(function (a, b) {
        let primeOfA = joinIfArray(a[primeParam]).toLowerCase();
        let primeOfB = joinIfArray(b[primeParam]).toLowerCase();
        //  console.log("sorting ", a.name, " and ", b.name);
        // debugger
        if (primeOfA !== primeOfB) {
          //  console.log(primeParam, ": ", primeOfA, " !== ", primeOfB);
          return sortFnc(a, b, primeParam);
        }

        let secondOfA = joinIfArray(a[secondParam]).toLowerCase();
        let secondOfB = joinIfArray(b[secondParam]).toLowerCase();

        // debugger
        if (secondParam && secondOfA !== secondOfB) {
          //  console.log(secondParam, ": ", secondOfA, " !== ", secondOfB);
          return sortFnc(a, b, secondParam);
        }

        let thirdOfA = joinIfArray(a[thirdParam]).toLowerCase();
        let thirdOfB = joinIfArray(b[thirdParam]).toLowerCase();
        //  console.log(thirdParam, ": ", thirdOfA, " === ", thirdOfB);
        if (thirdParam && thirdOfA !== thirdOfB) {
          //  console.log(thirdOfA, " !== ", thirdOfB);
          // debugger;
          return sortFnc(a, b, thirdParam);
        }
        return 0; // a === b
      });
    }

    const creatureArray = array.filter(
      (card) =>
        card.type_line.search("Creature") !== -1 &&
        card.type_line.search("Land") === -1
    );

    const nonCreatureArray = array.filter(
      (card) =>
        card.type_line.search("Creature") === -1 &&
        card.type_line.search("Land") === -1
    );

    const landArray = array.filter(
      (card) =>
        card.type_line.search("Land") !== -1 &&
        card.type_line.search("Basic") === -1
    );

    const basicLandArray = array.filter(
      (card) =>
        card.type_line.search("Land") !== -1 &&
        card.type_line.search("Basic") !== -1
    );

    mainSorter(creatureArray);
    mainSorter(nonCreatureArray);
    mainSorter(landArray);
    sortBasicLands(basicLandArray);

    // console.log(creatureArray);

    // debugger;

    return creatureArray
      .concat(nonCreatureArray)
      .concat(landArray)
      .concat(basicLandArray);
  }

  function sortBasicLands(array) {
    array.sort(function (a, b) {
      const aValue = basicLandValues[a.name] || 0;
      const bValue = basicLandValues[b.name] || 0;

      return aValue - bValue;
    });
  }

  ////// Click event for cards to redirect to their details page
  function getDetails() {
    const card = pageArray.find((card) => card.id === this.id);
    localStorage.setItem("cardDetails", JSON.stringify(card));
    // debugger;

    if (card.type_line.search("Basic") !== -1) {
      const cardGroupArray = [];
      console.log("basic land");
      $.getJSON(
        `https://api.scryfall.com/cards/search?order=set&q=${card.name}+set%3A${card.set}+game%3Apaper&unique=art`,
        function (listObj) {
          listObj.data.forEach((card) => cardGroupArray.push(card));
        }
      ).then(function () {
        localStorage.setItem("cardGroup", JSON.stringify(cardGroupArray));
        window.location.href = "group.html";
      });
    } else {
      window.location.href = "details.html";
    }
  }

  //// PAGINATION & DISPLAYING

  ////// If this is a newly entered search...
  if (!allPages) {
    const allPagesObj = {};
    const downloadedPages = {};
    let completedRequests = 0;

    for (let i = 1; i <= numberOfPages; i++) {
      //// Spacing requests out, as per rules of Scryfall API
      setTimeout(function () {
        $.getJSON(searchParams.apiCallUrl + "&page=" + i, function (listObj) {
          downloadedPages[i] = listObj.data;

          // allResultsArray.push(...listObj.data);

          completedRequests++;
          //// Check if all requests have been completed
          if (completedRequests === numberOfPages) {
            //// Collapse downloadedPages into allResultsArray
            // ...
            for (let j = 1; j <= numberOfPages; j++) {
              // console.log(downloadedPages[j]);
              allResultsArray.push(...downloadedPages[j]);
            }
            // debugger;

            //// Handle custom Param option
            if (sortOrder === "type") {
              allResultsArray = sortHandler(
                allResultsArray,
                "type_line",
                "rarity",
                "color_identity"
              );
            }
            //// Handle pagination & localStorage saving
            for (let j = 1; j <= numberOfPages; j++) {
              allPagesObj[`page${j}`] = allResultsArray.slice(
                (j - 1) * cardsPerPage,
                j * cardsPerPage
              );
            }

            localStorage.setItem("allPages", JSON.stringify(allPagesObj));

            //// Reloading to populate page with images

            // debugger;
            location.reload();
          }
        });
      }, i * 100); // Delay duration increases for each request
    }
    ////// If results data has been properly handled
    ////// and can be pulled from localStorage...
  } else {
    //// Creating buttons
    const $buttonDiv = $('<div class="buttonDiv"></div>');

    const $prevPageBtn = $(
      '<button class="navBtn prevPage">Previous Page</button>'
    );
    const $nextPageBtn = $(
      '<button class="navBtn nextPage">Next Page</button>'
    );
    //// Only rendering if applicable
    // $("<button>Go Back</button>")
    //   .on("click", () => history.back())
    //   .appendTo($buttonDiv);

    if (allPages[`page${targetPage - 1}`]) {
      $buttonDiv.append($prevPageBtn);
    }

    if (allPages[`page${targetPage + 1}`]) {
      $buttonDiv.append($nextPageBtn);
    }

    $("<button>New Search</button>")
      .on("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
      })
      .appendTo($buttonDiv);

    ////// Populating result box w/ card images
    pageArray.push(...allPages[`page${targetPage}`]);
    console.log("Populating list...");

    for (let i = 0; i < pageArray.length; i++) {
      let card = pageArray[i];
      const $spoilerEl = $(`<img class="cardSpoiler" id="${card.id}"></img>`);

      if (card.image_uris) {
        $spoilerEl.attr("src", card.image_uris.normal);
        //// Double-faced cards currently show front side by default
      } else if (card.card_faces) {
        $spoilerEl.attr("src", card.card_faces[0].image_uris.normal);
      } else {
        $spoilerEl.attr("alt", `${card.name}, IMAGE NOT AVAILABLE`);
      }

      $spoilerEl.off("click").on("click", getDetails);
      $displayBox.append($imgContainer).append($spoilerEl);
    }

    //// Displaying which results are being shown
    //// (i.e. 1 - 175) and total pages of cards
    $displayingResults.html(
      `Displaying <b>${
        targetPage * cardsPerPage - (cardsPerPage - 1)
      }</b> - <b>${
        allPages[`page${targetPage}`].length + (targetPage - 1) * cardsPerPage
      }</b> of ${response.total_cards} results`
    );
    // }

    //// Rendering buttons & implementing functionality
    $buttonDiv.appendTo($("header"));
    $buttonDiv.clone().appendTo($("footer"));

    $prevPageBtn.off("click").on("click", () => {
      localStorage.setItem("targetPage", targetPage - 1);
      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      };

      // history.back();
      location.reload();
    });

    $nextPageBtn.off("click").on("click", () => {
      localStorage.setItem("targetPage", targetPage + 1);
      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      };

      location.reload();
    });
  }
});

//  TO ADD:

//    Maintain search params on index page
//    Let sort order be ascending/descending, changeable on results page
//    Add keyboard functionality to dropdowns
//    Search by mana value

//  Nitpicky search stuff:

//    * Make relevant card face show in search results (i.e. Insidious Mist for "SOI + Elemental")
