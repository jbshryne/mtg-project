// CONSTANTS & VARIABLES

// Dynamically get list of all MtG Sets
const allSets = [];

$.getJSON("https://api.scryfall.com/sets", function (data) {
  allSets.push(...data.data);
});

// $('#setInput').autocomplete({
//   source: allSets
// });

// function scryfallTest() {
//   $.getJSON(`https://api.scryfall.com/catalog/card-names`, function (data) {
//     console.log(data);
//   });
// }

// HELPER FUNCTIONS

$("#allCardsBtn").on("click", searchHandler);
$("#randomBtn").on("click", searchHandler);

// function typeLineSort(array) {
//   array.sort(function (a, b) {
//     const typeA = a.type_line.toLowerCase(); // Convert to uppercase for case-insensitive comparison
//     const typeB = b.type_line.toLowerCase();
//     if (typeA < typeB) {
//       return -1; // a should be sorted before b
//     }
//     if (typeA > typeB) {
//       return 1; // a should be sorted after b
//     }
//     return 0; // a and b are equal in terms of sorting
//   });
// }

// SEARCH LOGIC

function searchHandler(e) {
  e.preventDefault();
  let searchType;
  const clickedBtnId = $(e.target).attr("id");
  console.log(clickedBtnId);

  searchFnc(clickedBtnId);
}

function searchFnc(clickedBtn) {
  const colorArray = [];
  const rarityArray = [];
  let apiCallUrl = "";

  console.log("Searching Database...");

  // Convert user input for API call

  const nameInputArray = $("#nameInput").val().split(" ");

  console.log(nameInputArray);

  let typeInputString;
  if ($("#typeInput").val()) {
    const typeInputArray = $("#typeInput").val().split(" ");
    const formattedTypeArray = typeInputArray.map((type) => `t:${type}`);
    typeInputString = `(${formattedTypeArray.join(" ")})`;
  }

  const $checkedColors = $(".color:checked");

  $checkedColors.each(function () {
    const value = $(this).val();
    colorArray.push(value);
  });

  const $checkedRarities = $(".rarity:checked");

  $checkedRarities.each(function () {
    const value = $(this).val();
    rarityArray.push(value);
  });

  let rarityString;
  if (rarityArray.length > 0) {
    const formattedRarityArray = rarityArray.map((rarity) => `r:${rarity}`);
    rarityString = `(${formattedRarityArray.join(" or ")})`;
  }

  let setInputString;
  if ($("#setInput").val()) {
    const setInputArray = $("#setInput").val().split(" ");
    const formattedSetArray = setInputArray.map((setWord) => `s:${setWord}`);
    setInputString = `(${formattedSetArray.join(" or ")})`;
  }

  // Construsting the API Call

  let queryArray = [];

  if (nameInputArray.length > 0) {
    console.log(nameInputArray);
    queryArray.push(...nameInputArray);
  }
  if (typeInputString) {
    queryArray.push(typeInputString);
  }
  if (colorArray.length > 0) {
    queryArray.push("id:" + colorArray.join(""));
  }
  if (rarityString) {
    queryArray.push(rarityString);
  }
  if (setInputString) {
    queryArray.push(setInputString);
  }

  // console.log($("#sortDropdown").val());

  const encodedArray = queryArray.map((query) => encodeURIComponent(query));
  const queryString = encodedArray.join("+");
  console.log(queryString);

  const sortOrder = $("#sortDropdown").val();
  let orderString;
  sortOrder === "type" ? (orderString = "color") : (orderString = sortOrder);

  if (clickedBtn === "allCardsBtn") {
    apiCallUrl = `https://api.scryfall.com/cards/search?order=${orderString}&q=${queryString}+game%3Apaper`;
  }
  if (clickedBtn === "randomBtn") {
    apiCallUrl = `https://api.scryfall.com/cards/random?q=${queryString}`
  }
  // Making the call

  //////// MOVE TO RESULTS PAGE
  // function handleMorePages(pageCount, apiCall) {
  //   var completedRequests = 0; // Counter to track completed requests

  //   // Start sending requests
  //   for (let i = 2; i <= pageCount; i++) {
  //     // Create a closure to preserve the value of i
  //     setTimeout(function () {
  //       // Make the API request here
  //       $.getJSON(apiCall + "&page=" + i, function (data) {
  //         console.log(
  //           `page ${i} of ${pageCount} -- top entry: ${data.data[0].name}`
  //         );
  //         allResultsArray.push(...data.data);

  //         completedRequests++; // Increment the counter for completed requests

  //         // Check if all requests have completed
  //         if (completedRequests === pageCount - 1) {
  //           // Perform sorting and session storage operations
  //           if (sortOrder === "type") {
  //             typeLineSort(resultsArray);
  //             typeLineSort(allResultsArray);
  //           }
  //           sessionStorage.setItem("resultsArray", JSON.stringify(resultsArray));
  //           console.log("allResultsArray is set");
  //           sessionStorage.setItem(
  //             "allResultsArray",
  //             JSON.stringify(allResultsArray)
  //           );

  //           // Redirect to "results.html" after a delay
  //           setTimeout(function () {
  //             window.location.href = "results.html";
  //           }, 500);
  //         }
  //       });
  //     }, i * 100); // Delay duration increases for each request
  //   }
  // }

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
      debugger;
      window.location.href = "results.html";
    }
    }
    if (clickedBtn === "randomBtn") {
      sessionStorage.setItem("cardDetails", JSON.stringify(data));
      window.location.href = "details.html";
    }
    // console.log(data.next_page);
    
    // // PAGINATION
    // const numberOfPages = Math.ceil(data.total_cards / 175);
    // console.log(numberOfPages);
    
    // sessionStorage.setItem("resultsArray", JSON.stringify(resultsArray));
    
    // // console.log(allResultsArray.length); ???
    
    // if (data.has_more) {
      //   allResultsArray.push(...resultsArray);
      //   console.log("allResultsArray is populated with resultsArray")
      //   handleMorePages(numberOfPages, apiCallUrl);
      // }
      

  }).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
}
