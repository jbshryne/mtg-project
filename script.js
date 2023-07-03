$.ajax({
  url: "https://api.magicthegathering.io/v1/cards?name=nissa&types=planeswalker",
  success: function (data) {
    // Handle data
    console.log(data);
  },
  error: function (xhr, status, error) {
    // Handle errors
    console.error(error);
  },
});