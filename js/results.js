$(function () {
  //// CONSTANTS AND VARIABLES

  const searchParams = JSON.parse(sessionStorage.getItem("searchParams"));
  const response = JSON.parse(sessionStorage.getItem("queryResponse"));
  const allPages = JSON.parse(sessionStorage.getItem("allPages"));

  const targetPage = JSON.parse(sessionStorage.getItem("targetPage"));
  if (!targetPage) sessionStorage.setItem("targetPage", 1);

  const $displayBox = $(".displayBox");
  const $displayingResults = $("#displayingResults");

  const allResultsArray = [];
  const pageArray = [];
  const sortOrder = searchParams.sortOrder;
  const numberOfPages = Math.ceil(response.total_cards / 175);
  const cardsPerPage = 175;

  //// FUNCTIONS

  ////// Sorts cards by characteristic
  function sortFnc(array, sortParam) {
    array.sort(function (a, b) {
      const itemA = a[sortParam].toLowerCase();
      const itemB = b[sortParam].toLowerCase();
      if (itemA < itemB) {
        return -1; //// a goes before b
      }
      if (itemA > itemB) {
        return 1; //// a goes after b
      } else return 0; //// a === b
    });
  }

  ////// Click event for cards to redirect to their details page
  function getDetails() {
    const cardDetails = pageArray.find((card) => card.id === this.id);
    sessionStorage.setItem("cardDetails", JSON.stringify(cardDetails));
    // debugger;
    window.location.href = "details.html";
  }

  //// PAGINATION & DISPLAYING

  ////// If this is a newly entered search...
  if (!allPages) {
    const allPagesObj = {};
    let completedRequests = 0;

    for (let i = 1; i <= numberOfPages; i++) {
      //// Spacing requests out, as per rules of Scryfall API
      setTimeout(function () {
        $.getJSON(searchParams.apiCallUrl + "&page=" + i, function (listObj) {
          allResultsArray.push(...listObj.data);

          completedRequests++;

          //// Check if all requests have been completed
          if (completedRequests === numberOfPages) {
            //// Handle custom sorting option
            if (sortOrder === "type") {
              sortFnc(allResultsArray, "type_line");
            }
            //// Handle pagination & sessionStorage saving
            for (let j = 1; j <= numberOfPages; j++) {
              allPagesObj[`page${j}`] = allResultsArray.slice(
                (j - 1) * cardsPerPage,
                j * cardsPerPage
              );
            }

            sessionStorage.setItem("allPages", JSON.stringify(allPagesObj));

            //// Reload page to begin list population
            location.reload();
          }
        });
      }, i * 100); // Delay duration increases for each request
    }
    ////// If results data has been properly handled
    ////// and can be pulled from sessionStorage...
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
    if (allPages[`page${targetPage - 1}`]) {
      $buttonDiv.append($prevPageBtn);
    }

    if (allPages[`page${targetPage + 1}`]) {
      $buttonDiv.append($nextPageBtn);
    }

    ////// Populating result box w/ card images
    pageArray.push(...allPages[`page${targetPage}`]);
    console.log("Populating list...");

    for (let i = 0; i < pageArray.length; i++) {
      let card = pageArray[i];
      const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);

      if (card.image_uris) {
        $spoilerEl.css(
          "background-image",
          "url(" + card.image_uris.normal + ")"
        );
        //// Double-faced cards currently show front side by default
      } else if (card.card_faces) {
        $spoilerEl.css(
          "background-image",
          "url(" + card.card_faces[0].image_uris.normal + ")"
        );
      } else {
        $spoilerEl.html(`${card.name}<br><br>IMAGE NOT AVAILABLE`);
      }

      $spoilerEl.off("click").on("click", getDetails);
      $displayBox.append($spoilerEl);
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

    $(".prevPage")
      .off("click")
      .on("click", () => {
        sessionStorage.setItem("targetPage", targetPage - 1);
        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        };
        location.reload();
      });

    $(".nextPage")
      .off("click")
      .on("click", () => {
        sessionStorage.setItem("targetPage", targetPage + 1);
        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        };
        location.reload();
      });
  }
});
