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
#### MVP User Stories
**As a user,**
- I should be able to place a bet from my wallet to start the game.
- I can see what cards are dealt to me and only one card of the dealer.
- I can `hit` to get another card to add to my hand.
- I can `stand` to end my turn.
- I should see the result of the round (win, lose, push).
- I can see my new wallet total after each result.
- I should have an option to play again.
- I want to reset my game status when I run out of currency.
- I should be able to see instructions on how to play the game.

## ♦️ Planning
- [Project Spec Link](https://www.notion.so/GA-Unit-1-Blackjack-Spec-1df7ed1fdd588080b0eac50acd836b7e)
- [Kanban Board](https://www.notion.so/1e67ed1fdd58801da157e5544ee59df1?v=1e67ed1fdd5881c39a73000cbad160d4&pvs=4)

### Planning Process
1. Created a spec to map out MVP requirements of the game, for General Assembly's project requireemnts (win/lose condition + theme), and other functional and technical considerations
2. Game flowchart to understand order of operations and visualize flow in code
3. Mapped out data structure needed for card deck
4. Pseudo-code
5. Translate into actionable tasks on Kanban board

### Design Process
1. Initial wireframes
2. Mockups with initial design
3. Choosing a final Pixel theme

## ♦️ Code Process

### Early Code 
1. Built out data structure for cards and player/dealer hands
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
    - Created functions for `hit` and `stand` (as they are reused later)
        - `hit` draws another card, calls `addCardTotal` `displayCards`, and `checksForBust`
        - `stand` ends turn, calls `revealHiddenCard`, `dealerHit`, and `compareResult`
5. Dealer's turn logic is to stand at 17 and above and always happens after the player turn
    - `while (dealer.total <= 16) dealerHit()`
6. Win, lose, or tie logic implemented
    - `compareResult` will check the hand totals between player versus dealer (see *Refactoring Code #4*) while adjusting the bet/wallet totals, and `showResultScreen` will display or remove the visual elements
7. Built out a `resetGame()` function that clears results and displays to prep the player to play again after a game ends
    - In the early builds, the `play again` button led you back to the bet screen rather than loading up another game. You had to pass through this screen and press 'play' again. Future improvements made `play again` and `change bet` into separate options for the user.
8. Bet mechanic was added last after the main gameplay was functional and complete.
    - Started as a single bet option then added bet selectors to choose the amount
        - Using `data-bet = "10"` for values since the bets are images
    - Added reset wallet for when player runs out of currency in wallet

### Refactoring Code
1. Refactored from using `.innerHTML` assignments to add card images to `div` placements for cards, and instead now `createCardImg(card)` takes a card object and will construct the entire element before appending it to HTML. 
Created a function that creates the card
2. Originally, the temporary user-facing messages ex. "Your Ace value has been changed" or "You do not have enough funds to play. Reset your wallet" were coded into the HTML and hidden. Since the messages all looked the same and appeared in similar spots, I refactored this to be two dynamic pieces so I could reuse it for any string that needed a temporary user-facing message.
    - `handleFadeEffect(element)` will take an element and apply or remove the opacity fading css classes
    - `createTempMsg(string)` will take a string and make it into a temp message which calls the `handleFadeEffect` to add the effect to this string. 
3. Since the code uses a lot of setting `display: none` and `display: flex` for showing or hiding elements on the page, I use two functions that will take an array and set each element in the array to either `display: flex` or `display: none`
    - `turnDisplayToFlex(arr)` and `turnDisplayToNone(arr)`
    - Improvement would be to change this to utilizing utility classes for displays and applying/removing a separate class but might need to review the current usage of IDs
4. Updated `compareResult()` and `compareSplitResult()` to take all the result cases, including when a player busts. This way, `checkForBust()` only handles the checking of it, passing any visual elements and changing to `isBust: true`, and is directed towards the `compare` functions.
    - Doing this keeps the functions separate. All result outputs are now in either `compareResult` or `compareSplitResult` rather than being in `checkForBust`. The only exception is when getting a natural blackjack (a case that does not result in the normal flow of operations).

## ♦️ Key Takeaways

### Challenges
- Copying by reference or by value for arrays. I didn't realize the Ace value being changed was impacting the original array until later on. Easy fix once I realized the issue by accounting for the reset.
- Using a relative path versus direct path for images in JavaScript for local host versus remote live servers was causing issues. A solution found was to reference the direct path but use a ternary operator to pass in either the local host IP or /pixeljack.
- The Split feature required a lot of areas to refactor and change since the feature was implemented post-MVP. This led to a lot of things breaking during the process. My learning is to keep track of unit testing and existing technical areas the new feature will touch, rather than focusing only on the implementation logic.

### Wins
- Figuring out a card flip animation using transform and perspective with CSS was fun although challenging.
- By building in a modular design and cleaning up code as I went, creating the Double Down feature took only a few hours since I could reuse other functions. `stand()` is reused many times throughout the code. I also found debugging to go quicker when I understood the flow of operations really well thanks to the readability.
- Tracking my tasks in a Kanban board helped me in prioritizing features, bugs, and edge cases as they were discovered and built. 

## ♦️ Future Improvements
- Card counting mode (currently the deck resets every game)
- Adjust cards to be stacked in a peek on top of each other rather than displayed fully
- Potentially, allow player to forfeit game and exit to home screen before game has ended

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