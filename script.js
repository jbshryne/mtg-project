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

// DOM ELEMENTS

const $form = $("form");
const $nameInput = $("#nameInput");
const $typeInput = $("#typeInput");
const $allCardsBtn = $("allCardsBtn");
// const $colorInputs = $(".color");

// console.log($colorInputs);

// FUNCTIONS

const searchFnc = (e) => {
  e.preventDefault();
  const resultArray = [];
  const queryArray = [];
  const typeArrays = { supertypes: [], types: [], subtypes: [] };
  const colorArray = [];

  const nameInputText = $nameInput.val().toLowerCase().split(" ").join(",");

  const typeInputArray = $typeInput.val().toLowerCase().split(" ");

  typeInputArray.forEach((type) => {
    if (allSuperTypes.includes(type)) {
      typeArrays.supertypes.push(type);
    } else if (allTypes.includes(type)) {
      typeArrays.types.push(type);
    } else {
      typeArrays.subtypes.push(type);
    }
  });

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

  const $checkedColors = $(".color:checked");

  $checkedColors.each(function () {
    const value = $(this).val();
    colorArray.push(value);
  });

  if (colorArray.length > 0) {
    queryArray.push("colorIdentity=" + colorArray.join(","));
  }

  const queryString = queryArray.join("&");

  $.getJSON(
    `https://api.magicthegathering.io/v1/cards?${queryString}`,
    function (data, textStatus, jqxhr) {
      // console.log(data.cards);
      const resultNames = [];

      data.cards.forEach((card) => {
        if (!resultNames.includes(card.name)) {
          resultArray.push(card);
          resultNames.push(card.name);
        }
      });

      console.log(resultArray);

      // const pageSize = jqxhr.getResponseHeader('Page-Size');
      // const count = jqxhr.getResponseHeader('Count');
      // const totalCount = jqxhr.getResponseHeader('Total-Count');
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
};

$form.on("submit", searchFnc);
