# **MTG CONCLAVE**

*Live on Github Pages*: [jbshryne.github.io/mtg-project](https://jbshryne.github.io/mtg-project)

## **About The Project**

My website will be called "MTG Conclave", utilizing the [Scryfall](https://scryfall.com/) *Magic* card database. The initial feature of my site is a Card Search interface, with a couple of distinct features not available on similar sites I use:

### "Improved" Options for Sorting Search Results

- Specifically, the ability to sort cards by Card Types, which was a feature I loved from an old database site that got merged into Scryfall a few years back & that Scryfall has never chosen to implement.

### Ability to Customize Random Searches

- Aside from just having a button to pull a totally random card from all of *Magic*, I'd like the ability to generate random cards within certain parameters -- i.e. from a specific set, or of a specific Creature type and rarity.

## **Built With**

- HTML
- CSS
- JavaScript
- jQuery
- Scryfall API

## **Approach Taken** *(Project Week)*

Using my wireframe as reference, I began by buliding the structure of the `index.html` (Search) page. I used jQuery to make an AJAX call, then went through each input to construct the url based on the user query. As an aside, I actually ended up switching API's about halfway through, which (among many other upgrades) allowed me to add a dynamically generated dropdown menu of every *Magic* set for one of the parameter inputs. <br><br> Next I built the `results.html` page, and had it populate with card images based on data pulled from the API, and saved to `sessionStorage` to access across the different pages. I then added a `.on()` event to each image, which redirects to that card's `details.html` page (at the moment,  just a larger view of the card). In one tweak for handling odd-ball cards, I made double-faced card results generate side-by-side images of the two faces.<br><br> With the basic structure and functionality done, I focused on my 'Search by Card Type' feature.  I deduced that since the Scryfall API only returns results of up to 175 cards at a time, that in order to fully sort multi-page result list, I needed to set up a loop of API calls for the subsequent pages, adding an incrementing `setTimeout` count as per the rules documentation, and then handle the "pagination" myself.  (My other idea of 'Specified Randomization' was actually already built into a seperate API endpoint, a fact that still baffles me as to why Scryfall isn't utilizing this logic for its users!)<br><br>The last functionality I implemented was creating different navigation buttons for the `results`, `details`, and `random` pages (the latter of which I broke out into its own html file that still imports script from `details.js`), and a display of which results are being shown out of how many total cards.  Lastly, I imported some high-fantasy looking Google fonts (suggestions by ChatGPT) and styled an overall 'dark mode' theme. 

## **Wireframes**

### Home Screen:

![Home Screen](assets/Home.png)

### Results:

![Results](assets/Results.png)

### Card Details:

![Details](assets/Details.png)

## **Stretch Goals**

- ### Minigames

  - I'm thinking about a game or two that utilizie the "specified randomization" logic, like being given art from a random card from a set of your choice & guessing the name of the card. (These games could have difficulty levels, as in Easy being multiple choice, and Advanced being you just type in your answer)

  - Maybe some games based on real cards: [Goblin Game](https://scryfall.com/card/pls/61/goblin-game), [Water Gun Balloon Game](https://scryfall.com/card/unf/538/water-gun-balloon-game), [Trivia Contest](https://scryfall.com/search?q=trivia+contest) ?

- ### Card Design engine
