const $allCardsBtn = $("allCardsBtn");
const $form = $("form");

console.log($allCardsBtn);

const searchFnc = (e) => {
  e.preventDefault();

  $.getJSON(
    "https://api.magicthegathering.io/v1/cards",
    function (data, textStatus, jqxhr) {
      console.log(data);

      // const pageSize = jqxhr.getResponseHeader('Page-Size');
      // const count = jqxhr.getResponseHeader('Count');
      // const totalCount = jqxhr.getResponseHeader('Total-Count');
    }
  ).fail(function (jqxhr, textStatus, error) {
    console.error("Error:", error);
  });
};

$form.on("submit", searchFnc);
