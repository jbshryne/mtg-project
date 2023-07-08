console.log("results");

const searchParams = JSON.parse(sessionStorage.getItem("searchParams"))
const response = JSON.parse(sessionStorage.getItem("queryResponse"));

// const sortOrder = searchParams.sortOrder;
console.log(searchParams);
const storedArray = response.data;
console.log(storedArray);

let resultsArray;
storedArray ? (resultsArray = [...storedArray]) : (resultsArray = []);

const $displayBox = $(".displayBox");

console.log(resultsArray);

function getDetails() {
  console.log(resultsArray);
  console.log(this.name);
  const cardDetails = resultsArray.find((card) => card.id === this.id);
  sessionStorage.setItem("cardDetails", JSON.stringify(cardDetails));
  //   debugger;
  window.location.href = "details.html";
}

$(".cardSpoiler").off("click").on("click", getDetails);

// Populating result box w/ card images

for (let i = 0; i < resultsArray.length; i++) {
  let card = resultsArray[i];
  // console.log(card);
  const $spoilerEl = $(`<div class="cardSpoiler" id="${card.id}"></div>`);
  if (card.image_uris) {
    $spoilerEl.css("background-image", "url(" + card.image_uris.normal + ")");
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

console.log($displayBox)






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