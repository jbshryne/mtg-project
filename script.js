// CONSTANTS & VARIABLES

const allSuperTypes = [
  "basic",
  "elite",
  "legendary",
  "ongoing",
  "snow",
  "token",
  "world",
];

const allTypes = [
  "artifact",
  "battle",
  "conspiracy",
  "creature",
  "emblem",
  "enchantment",
  "hero",
  "instant",
  "land",
  "phenomenon",
  "plane",
  "planeswalker",
  "scheme",
  "sorcery",
  "tribal",
  "vanguard",
];

// SEARCH LOGIC

$("form").on("submit", searchFnc);

function searchFnc(e) {
  e.preventDefault();

  // Define arrays
  const resultArray = [];
  const queryArray = [];
  const typeArrays = { supertypes: [], types: [], subtypes: [] };
  const colorArray = [];
  const rarityArray = [];

  // Convert user input for API call

  const nameInputText = $("#nameInput")
    .val()
    .toLowerCase()
    .split(" ")
    .join(",");

  const typeInputArray = $("#typeInput").val().toLowerCase().split(" ");

  typeInputArray.forEach((type) => {
    if (allSuperTypes.includes(type)) {
      typeArrays.supertypes.push(type);
    } else if (allTypes.includes(type)) {
      typeArrays.types.push(type);
    } else {
      typeArrays.subtypes.push(type);
    }
  });

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

  const setInputText = $("#setInput").val();

  // Construsting the API Call

  if (nameInputText) {
    queryArray.push("name=" + nameInputText);
  }
  if (typeArrays.supertypes.length > 0) {
    queryArray.push("supertypes=" + typeArrays.supertypes.join(","));
  }
  if (typeArrays.types.length > 0) {
    queryArray.push("types=" + typeArrays.types.join(","));
  }
  if (typeArrays.subtypes.length > 0) {
    queryArray.push("subtypes=" + typeArrays.subtypes.join(","));
  }
  if (colorArray.length > 0) {
    queryArray.push("colorIdentity=" + colorArray.join(","));
  }
  if (rarityArray.length > 0) {
    queryArray.push("rarity=" + rarityArray.join("|"));
  }
  if (setInputText) {
    queryArray.push("setName=" + setInputText)
  }

  const queryString = queryArray.join("&");

  // Making the call

  $.getJSON(
    `https://api.magicthegathering.io/v1/cards?${queryString}`,
    function (data, textStatus, jqxhr) {
      // Changing to show single result per card

      const resultNames = [];

      data.cards.forEach((card) => {
        if (!resultNames.includes(card.name)) {
          resultArray.push(card);
          resultNames.push(card.name);
          console.log(`${card.name} // COST: ${card.manaCost} // TYPE: ${card.type}`)
        }
      });

      // Pagination

      // const pageSize = jqxhr.getResponseHeader('Page-Size');
      // const count = jqxhr.getResponseHeader('Count');
      // const totalCount = jqxhr.getResponseHeader('Total-Count');
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
}
