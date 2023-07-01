

$.ajax({
  url: "https://api.magicthegathering.io/v1/cards?name=nissa&types=planeswalker",
  success: function (data) {
    // Handle the API response data here
    console.log(data);
  },
  error: function (xhr, status, error) {
    // Handle any errors that occurred during the API call
    console.error(error);
  },
});

