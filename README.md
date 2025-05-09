# ♠️ pixeljack (wip)

**https://shaepy.github.io/pixeljack/**

Pixeljack is a fun, pixel-style Blackjack game where you try to beat the dealer by getting as close to 21 as possible without going over. 

Both you and the dealer start with two cards and take turns choosing to 'hit' (get another card) or 'stand' (keep your hand). Whoever gets closer to 21 without going over wins.

[screenshots here when done]

## ♦️ Tech Stack
- HTML
- CSS
- JavaScript

## ♦️ Requirements
#### General Assembly Reqs
- A win/lose condition
- A theme
- Submit an initial data structure of your game state along with your pseudocode

#### MVP User Stories
**Core Gameplay - As a user,**
- I can see what cards are dealt to me and only one card of the dealer.
- I can `hit` to get another card to add to my hand.
- I can `stand` to end my turn.
- I should see the result of the round (win, lose, push).
- I should have an option to play again.
- I should be able to see instructions on how to play the game.

**Adding Bet Mechanic - As a user,**
- I should be able to place a bet from my wallet to start the game.
- I can see my new wallet total after each result.
- I want to reset my game status when I run out of currency.

## ♦️ Planning
- [Project Spec Link](https://www.notion.so/GA-Unit-1-Blackjack-Spec-1df7ed1fdd588080b0eac50acd836b7e)
- [Kanban Board](https://www.notion.so/1e67ed1fdd58801da157e5544ee59df1?v=1e67ed1fdd5881c39a73000cbad160d4&pvs=4)

### Planning Process
1. Created a spec
2. Game flowchart
3. Mapped out data structure needed for card deck
4. Pseudo-code
5. Translate into actionable tasks on Kanban board

## ♦️ Code Process
### Early Code Process
1. Built out data structure for cards and hands
    - `cardDeck` array to hold 52 card objects
    - I started with a single object for the table to hold both dealer and player cards. ie `let table = {dealer: [], player: []}`, which is later changed to separate objects of `dealer = {cards: [], total: [], hitCardIdx: 0}` and one for `player`, as well as `splitHand` 
2. Scaffolding HTML for a dealer, player, and 2 buttons for `hit` and `stand`
3. Using JavaScript to deal the cards to each hand, then display it
    - Created `getCard()` that grabs a random card from the `cardDeck` array. It filters through only the cards where `hasBeenPlayed: false` to avoid dealing duplicates.
    - `dealCards()` adds 2 cards to each hand (player and dealer)
    - `addCardTotal()` calculates the total of each hand using `reduce` with a check for whether an Ace can be changed if hand has busted
    - Display those cards using `displayCards()`
    - Created a `checkForBlackjack()` (ace and 10) which leads to an auto win unless Dealer has 21, which auto stands
4. Attached event listeners and functions to `hit` and `stand` buttons 
    - Hit:
    - Stand: 
5. Dealer's turn logic
6. Handle win/lose conditions and display results
7. Option to play again
8. Bet mechanic was added last after the main gameplay was functional and complete.
    - Started as a single bet option
    - Added reset wallet for when player runs out of currency in wallet

### Refactored Improvements
1. Refactored from using `.innerHTML` assignments to add card images to `div` placements for cards, and instead now `createCardImg(card)` takes a card object and will construct the entire element before appending it to HTML. 
Created a function that creates the card
2. Originally, the temporary user-facing messages ex. "Your Ace value has been changed" or "You do not have enough funds to play. Reset your wallet" were coded into the HTML and hidden. Since the messages all looked the same and appeared in similar spots, I refactored this to be two dynamic pieces so I could reuse it for any string that needed a temporary user-facing message.
    - `handleFadeEffect(element)` will take an element and apply or remove the opacity fading css classes
    - `createTempMsg(string)` will take a string and make it into a temp message which calls the `handleFadeEffect` to add the effect to this string. 
3. Since the code uses a lot of setting `display: none` and `display: flex` for showing or hiding elements on the page, I use two functions that will take an array and set each element in the array to either `display: flex` or `display: none`
    - `turnDisplayToFlex(arr)` and `turnDisplayToNone(arr)`
    - Improvement would be to change this to utilizing utility classes for displays and applying/removing a separate class but might need to review the current usage of IDs

## ♦️ Key Takeaways

### Challenges
- Reference or value for arrays (didn't realize the Ace value being changed was impacting the original array until later, then had to add it to my shuffle() to account for the Aces)
- Using a relative path versus direct path for images in JavaScript for local host versus remote live servers
- Split feature required a lot of areas to refactor or change since the feature was implemented post-MVP. In the future, keep track of unit testing or existing areas the feature will touch, not just the implementation logic and how to build it.

### Wins
-  Figuring out card flip animation and transform with CSS

## ♦️ Design Process (elaborate)
1. Initial wireframes
2. Mockups with initial design
3. Choosing a Pixel theme
4. AI-generated background images

## ♦️ Next Steps
- (05/05/25) Split feature has been merged successfully
- Double down feature
- Card counting mode

## ♦️ Resources Used
- Card assets by [Magory.itch.io](https://magory.itch.io/cute-pixel-playing-cards)
- Cursors by [Kenney.nl](https://kenney.nl/assets/cursor-pixel-pack)
- Icons
    - [Yusuf Matra](https://thenounproject.com/creator/yusufmatra/)
    - [Favicon](https://www.flaticon.com/free-icon/cards_8315168) 
    - [Nazar](https://thenounproject.com/creator/eyeshapedamulet/)
- Audio
    - [freesound community](https://pixabay.com/users/freesound_community-46691455/)
    - [Kenney.nl](https://kenney.nl/assets/casino-audio)
    - [Lumora Studios](https://pixabay.com/users/lumora_studios-39090352/)