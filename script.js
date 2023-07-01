// const mtg = require("mtgsdk");

// // mtg.card.where({ subtypes: "adventure", set: "ELD" }).then((cards) => {
// //   cards.forEach((card) => {
// //     console.log(card.name);
// //   });
// // });

// // mtg.card.where({type: "advisor", page: 2, pageSize: 100})
// // .then(cards => {
// //     console.log(cards[0].name)
// //     // cards.forEach(card => console.log(card.name))
// // })

// mtg.set.where({ name: 'eldr' })
// .then(sets => {
//   console.log(sets)
// })

$.ajax({
  url: "https://api.magicthegathering.io/v1/cards",
  // method: 'GET',
  // dataType: 'json',
  success: function (data) {
    // Handle the API response data here
    console.log(data);
  },
  error: function (xhr, status, error) {
    // Handle any errors that occurred during the API call
    console.error(error);
  },
});

