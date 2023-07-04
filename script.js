const $form = $("form");
const $nameInput = $("#nameInput");
const $typeInput = $("#typeInput");
const $allCardsBtn = $("allCardsBtn");

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

console.log($allCardsBtn);

const searchFnc = (e) => {
  e.preventDefault();
  const resultArray = [];

  const nameInputText = $nameInput.val().toLowerCase().split(" ").join(",");
  const nameApiAppend = nameInputText ? "name=" + nameInputText : "";

  const typeArrays = { supertypes: [], types: [], subtypes: [] };
  const typeCallsArray = [];
  const typeInputArray = $typeInput.val().toLowerCase().split(" ");

  // console.log(typeInputArray);

  typeInputArray.forEach((type) => {
    if (allSuperTypes.includes(type)) {
      typeArrays.supertypes.push(type);
    } else if (allTypes.includes(type)) {
      typeArrays.types.push(type);
    } else {
      typeArrays.subtypes.push(type);
    }
  });

  if (typeArrays.supertypes.length !== 0) {
    typeCallsArray.push("supertypes=" + typeArrays.supertypes.join(","));
  }

  if (typeArrays.types.length !== 0) {
    typeCallsArray.push("types=" + typeArrays.types.join(","));
  }

  if (typeArrays.subtypes.length !== 0) {
    typeCallsArray.push("subtypes=" + typeArrays.subtypes.join(","));
  }

  const typeApiCall = typeCallsArray.join("&")

  // const colorId = $('#colorIdField input[type="checkbox"]');

  $.getJSON(
    `https://api.magicthegathering.io/v1/cards?${typeApiCall}`,
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
