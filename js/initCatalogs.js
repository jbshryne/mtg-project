let searchCatalogs = JSON.parse(localStorage.getItem("searchCatalogs"));

const currentDate = Date.now();

if (searchCatalogs && searchCatalogs._dateRetrieved) {
  const dateRetrieved = Date.parse(searchCatalogs._dateRetrieved);
  const timeDifference = currentDate - dateRetrieved;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference > 24) {
    searchCatalogs = null;
  }
}

if (!searchCatalogs) {
  searchCatalogs = {
    typeCatalog: {
      supertypes: [],
      mainCardTypes: [],
      creatureTypes: [],
      planeswalkerTypes: [],
      landTypes: [],
      artifactTypes: [],
      enchantmentTypes: [],
      spellTypes: [],
      battleTypes: [],
    },
    rulesTextCatalog: {
      "keyword-abilities": [],
      "keyword-actions": [],
      "ability-words": [],
      "flavor-words": [],
    },
    setCatalog: [],
    watermarkCatalog: {
      faction: [
        "Abzan",
        "Agents of Sneak",
        "Atarka",
        "Azorius",
        "Boros",
        "Brokers",
        "Cabaretti",
        "Crossbreed Labs",
        "Dimir",
        "Dromoka",
        "Goblin Explosioneers",
        "Golgari",
        "Gruul",
        "Izzet",
        "Jeskai",
        "Kolaghan",
        "League of Dastardly Doom",
        "Lorehold",
        "Maestros",
        "Mardu",
        "Mirran",
        "Obscura",
        "Ojutai",
        "Order of the Widget",
        "Orzhov",
        "Phyrexian",
        "Prismari",
        "Quandrix",
        "Rakdos",
        "Riveteers",
        "Selesnya",
        "Silumgar",
        "Silverquill",
        "Simic",
        "Sultai",
        "Tarkir",
        "Temur",
        "Witherbloom",
      ],
      cardInfo: ["Conspiracy", "Desparked", "Foretell", "Set"],
      promo: [
        "Arena",
        "Color Pie",
        "CoroCoro",
        "DCI",
        "Dengeki Maoh",
        "Flavor",
        "FNM",
        "Grand Prix",
        "Hero's Path",
        "Japan Junior",
        "Judge Academy",
        "Junior",
        "Junior APAC",
        "Junior Europe",
        "MagicFest",
        "MPS",
        "MTG",
        "MTG 10",
        "MTG 15",
        "Planeswalker",
        "Pro Tour",
        "Scholarship",
        "Trump Katsumai",
        "WOTC",
        "WPN",
      ],
      crossover: ["Cutie Mark", "D&D", "Nerf", "Transformers"],
    },
    _dateRetrieved: new Date(),
  };

  const endpoints = {
    supertypes: "catalog/supertypes",
    mainCardTypes: "catalog/card-types",
    creatureTypes: "catalog/creature-types",
    planeswalkerTypes: "catalog/planeswalker-types",
    landTypes: "catalog/land-types",
    artifactTypes: "catalog/artifact-types",
    enchantmentTypes: "catalog/enchantment-types",
    spellTypes: "catalog/spell-types",
    battleTypes: "catalog/battle-types",
    "keyword-abilities": "catalog/keyword-abilities",
    "keyword-actions": "catalog/keyword-actions",
    "ability-words": "catalog/ability-words",
    "flavor-words": "catalog/flavor-words",
    sets: "sets",
  };

  const timedSearchFetch = (type, urlTag) => {
    const category = urlTag.endsWith("types")
      ? "typeCatalog"
      : "rulesTextCatalog";

    return new Promise((resolve) => {
      setTimeout(() => {
        $.getJSON("https://api.scryfall.com/" + urlTag, function (response) {
          urlTag == "sets"
            ? (searchCatalogs.setCatalog = response.data.reduce((acc, set) => {
                acc[set.name] = {
                  code: set.code,
                  setType: set.set_type,
                  uri: set.uri,
                };
                return acc;
              }, {}))
            : (searchCatalogs[category][type] = response.data);
          resolve();
        });
      }, 100);
    });
  };

  const fetchSearchData = async () => {
    const promises = [];

    for (let [type, urlTag] of Object.entries(endpoints)) {
      promises.push(timedSearchFetch(type, urlTag));
    }

    return Promise.all(promises).then(() => {
      localStorage.setItem("searchCatalogs", JSON.stringify(searchCatalogs));
    });
  };

  fetchSearchData();
}
window.searchCatalogs = searchCatalogs;
