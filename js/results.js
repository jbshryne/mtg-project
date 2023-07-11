$(function () {
  // console.log("results");

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
        return -1; // a before b
      }
      if (itemA > itemB) {
        return 1; // a after b
      }
      return 0; // a and b are equal
    });
  }

  ////// Makes cards redirect to their details page
  function getDetails() {
    console.log(pageArray);
    console.log(this.name);
    const cardDetails = pageArray.find((card) => card.id === this.id);
    sessionStorage.setItem("cardDetails", JSON.stringify(cardDetails));
    // debugger;
    window.location.href = "details.html";
  }

  // PAGINATION & DISPLAYING

  if (!allPages) {
    const allPagesObj = {};

    let completedRequests = 0; // Counter to track completed requests
    // Start sending requests
    for (let i = 1; i <= numberOfPages; i++) {
      //// Spacing requests out, as per rules of Scryfall API
      setTimeout(function () {
        // Making API request
        $.getJSON(searchParams.apiCallUrl + "&page=" + i, function (listObj) {
          console.log(
            `page ${i} of ${numberOfPages} -- top entry: ${listObj.data[0].name}`
          );
          allResultsArray.push(...listObj.data);

          completedRequests++;

          // Check if all requests have completed
          if (completedRequests === numberOfPages) {
            // Perform cutom sorting option and session storage operations
            if (sortOrder === "type") {
              sortFnc(allResultsArray, "type_line");
              console.log(allResultsArray);
            }
            for (let j = 1; j <= numberOfPages; j++) {
              allPagesObj[`page${j}`] = allResultsArray.slice(
                (j - 1) * cardsPerPage,
                j * cardsPerPage
              );
              console.log(allPagesObj[`page${j}`]);
            }

            // populateList(pageArray);

            console.log(allPagesObj);
            sessionStorage.setItem("allPages", JSON.stringify(allPagesObj));

            location.reload();
          }
        });
      }, i * 100); // Delay duration increases for each request
    }
  } else {
    const $buttonDiv = $('<div class="buttonDiv"></div>');
    const $prevPageBtn = $(
      '<button class="navBtn prevPage">Previous Page</button>'
    );
    const $nextPageBtn = $(
      '<button class="navBtn nextPage">Next Page</button>'
    );

    if (allPages[`page${targetPage - 1}`]) {
      $buttonDiv.append($prevPageBtn);
    }

    if (allPages[`page${targetPage + 1}`]) {
      console.log("there's another page");
      $buttonDiv.append($nextPageBtn);
    }

    pageArray.push(...allPages[`page${targetPage}`]);

    ////// Populating result box w/ card images
    console.log("Populating list...");
    for (let i = 0; i < pageArray.length; i++) {
      let card = pageArray[i];
      // console.log(card);
      const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);

      if (card.image_uris) {
        $spoilerEl.css(
          "background-image",
          "url(" + card.image_uris.normal + ")"
        );
      } else if (card.card_faces) {
        // console.log(card.card_faces[0]);
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

    // if (targetPage == 1 && !response.has_more) {
    //   $displayingResults.text(
    //     `Displaying 1-${response.total_cards} of ${response.total_cards} results`
    //   );
    // } else {
    $displayingResults.html(
      `Displaying <b>${
        targetPage * cardsPerPage - (cardsPerPage - 1)
      }</b> - <b>${
        allPages[`page${targetPage}`].length + (targetPage - 1) * cardsPerPage
      }</b> of ${response.total_cards} results`
    );
    // }

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

    $(".cardSpoiler").off("click").on("click", getDetails);
  }
});
