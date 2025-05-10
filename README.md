# ♠️ Pixeljack

**Deployment Link - https://shaepy.github.io/pixeljack/**

<img src="https://github.com/user-attachments/assets/b112bc3f-c518-4d47-8057-ce2ac7b098d6" width="500px">
<img src="https://github.com/user-attachments/assets/f1b2105e-7036-4e86-beaa-53a8a17c3a1a" width="500px">

### Description
Pixeljack is a pixel-style Blackjack game where you try to beat the dealer by getting as close to 21 as possible without going over. Both you and the dealer start with two cards and take turns choosing to 'hit' (get another card) or 'stand' (keep your hand). Whoever gets closer to 21 without going over wins.

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
<img alt="game flowchart" src="https://github.com/user-attachments/assets/372d64a5-b477-4535-bf27-e2085134fce7" width="420px">

### Planning Process
1. Created a [Project Spec](https://www.notion.so/GA-Unit-1-Blackjack-Spec-1df7ed1fdd588080b0eac50acd836b7e) to map out MVP requirements for the game
2. Game flowchart (image above) to understand order of operations and visualize flow in code
3. Mapped out [Data Structure](https://www.notion.so/GA-Unit-1-Blackjack-Spec-1df7ed1fdd588080b0eac50acd836b7e?pvs=4#1df7ed1fdd58805baae6e37aceb7fc98) needed for card deck
4. [Pseudo-code](https://www.notion.so/GA-Unit-1-Blackjack-Spec-1df7ed1fdd588080b0eac50acd836b7e?pvs=4#1df7ed1fdd588022aea2f82e5c355636)
5. Translate into actionable tasks on [Kanban Board](https://www.notion.so/1e67ed1fdd58801da157e5544ee59df1?v=1e67ed1fdd5881c39a73000cbad160d4&pvs=4)

### Design Process
#### Initial wireframes
<img alt="game screen" src="https://github.com/user-attachments/assets/95e77dd5-2ab7-44ec-b2a7-78ddc6e95b68" width="300px">
<img alt="result screen" src="https://github.com/user-attachments/assets/bfec5590-c02c-467f-9c27-a7c2ac5c6614" width="300px">
<img alt="mobile screen" src="https://github.com/user-attachments/assets/d068e7ac-1944-47f0-930a-c8d87c5a990d" height="200px">

#### Mockups with initial design
<img alt="bet screen" src="https://github.com/user-attachments/assets/76b545c9-7a39-4b46-a3c0-ab992bb7fff1" width="300px">
<img alt="game screen" src="https://github.com/user-attachments/assets/ff851454-641d-4221-9dee-b52dc9b9e6f0" width="300px">
<img alt="result screen" src="https://github.com/user-attachments/assets/f67a7907-55b5-44d4-abef-4becdbea8929" width="300px">
<img alt="old theme sketch" src="https://github.com/user-attachments/assets/3169b643-b49a-4c37-a3b3-576bfcabb1c4" width="400px">

#### Choosing a Pixel theme
<img alt="pixeljack sketch" src="https://github.com/user-attachments/assets/2af4ecc1-bdeb-4772-a5ce-081d77d2c430" height="200px">
<img alt="pixel theme with gradient background" src="https://github.com/user-attachments/assets/e12b2991-3b3c-4a07-8cd6-fa1befb1af15" height="200px">
<br>
<img height="200" alt="mobile-pj" src="https://github.com/user-attachments/assets/49d06bac-1940-4c0d-8d1a-7336b0a2723e" />
<img height="200" alt="desktop-pj" src="https://github.com/user-attachments/assets/1dbd0311-6e01-48de-a8fb-473c058b1bfc" />


## ♦️ Code Process

### Early Code 
1. Built out data structure for cards and player/dealer hands
    - `cardDeck` holds 52 card objects
    - I started with a single object for the table to hold both dealer and player cards. ie `let table = {dealer: [], player: []}`, which is later changed to separate objects of `dealer = {cards: [], total: [], hitCardIdx: 0}` for player and splitHand as well

<img height="350" alt="starting concept" src="https://github.com/user-attachments/assets/d4163840-dc46-4695-b9db-625e2b8a352f">
<img height="350" alt="html scaffold" src="https://github.com/user-attachments/assets/56842fe6-acd9-4886-8dfc-baefbd58837c">


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

<img width="200" alt="blackjack win" src="https://github.com/user-attachments/assets/18f3a552-fbf9-4de6-a4ad-f098c21ab16a" />

7. Built out a `resetGame()` function that clears results and displays to prep the player to play again after a game ends
    - In the early builds, the `play again` button led you back to the bet screen rather than loading up another game. You had to pass through this screen and press 'play' again. Future improvements made `play again` and `change bet` into separate options for the user.

<img width="200" alt="bet and wallet on game screen" src="https://github.com/user-attachments/assets/4eabf71c-d9dd-43f1-95de-5bf70504ed93" />

8. Bet mechanic was added last after the main gameplay was functional and complete.
    - Started as a single bet option then added bet selectors to choose the amount
        - Using `data-bet = "10"` for values since the bets are images
    - Added reset wallet for when player runs out of currency in wallet
9. Once the MVP requirements were functional and tested, I had a basic Blackjack skin for the game theme and used CSS to make it responsive for mobile and web (before deciding on a pixel theme).

<img height="240" alt="mobile home screen" src="https://github.com/user-attachments/assets/e0b41cc6-5dc8-4f1f-b7ac-48a47c80dcbd" />
<img height="240" alt="mobile game screen" src="https://github.com/user-attachments/assets/4109cbcc-2a5f-4124-97f9-63d71566d25f" />
<br>
<img height="100" alt="desktop bet screen" src="https://github.com/user-attachments/assets/9867e0f0-202b-44dc-ae8b-32469eb07acd" />
<img height="100" alt="desktop game screen" src="https://github.com/user-attachments/assets/8360d999-fc02-42ae-8c2f-5ff21488eae6" />
<img height="100" alt="desktop blackjack" src="https://github.com/user-attachments/assets/5c5dcb5e-9e48-4d25-9740-8a62dae18cf2" />

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
- Using a relative path versus direct path for images in JavaScript for local host versus remote live servers was causing issues. A solution found was to reference the direct path but use a ternary operator to pass in either the local host IP or /pixeljack.
- The Split feature required a lot of areas to refactor and change since the feature was implemented post-MVP. This led to a lot of things breaking during the process. My learning is to keep track of unit testing and existing technical areas the new feature will touch, rather than focusing only on the implementation logic.
- The ability for Aces to be flexible of either 1 or 11 value made Split hands difficult. It opened up a lot of edge cases since having a pair of aces can lead to the total of '22' unless accounting for switches to the value of 1. A large majority of time spent in implementing the Split feature was fixing cases and issues derived from this flexibility.

<img width="500" alt="edge case two aces" src="https://github.com/user-attachments/assets/9b8af7ee-c0a5-4e5e-b846-e7eaca70c558">

### Wins
- Figuring out a card flip animation using transform and perspective with CSS was fun although challenging.
- Tracking my tasks in a Kanban board helped me in prioritizing features, bugs, and edge cases as they were discovered and built.
    - This also helped when I needed to create the post-MVP features: Split and Double Down. I was able to use the Kanban Board tasks similar to JIRA style tickets for myself.
    - On each 'ticket', I would do a mini-planning for each feature. This included user stories, psuedo-code, technical challenges to consider, etc. Even some scratch code to think things through.

<img height="400" alt="user stories for split" src="https://github.com/user-attachments/assets/3abcb809-17d7-41e2-a2d8-56fb7ab2e040">
<img height="400" alt="sketch code for split" src="https://github.com/user-attachments/assets/c0e9864d-5f43-4d6a-9978-47288965f5ae" />

- By building in a modular design and cleaning up redundant code as I went, building the Double Down feature took only a few hours due to the reusability of previous functions. I also found debugging to go quicker when I understood the flow of operations really well thanks to the readability.
    - `createTempMsg` creates a temporary message that displays with a fade-in/fade-out effect to inform users when they do not have enough coins
    - `displayFunds` will show the updated wallet and bet
    - `hit` will `getCard` and call to display the card, `addCardTotal`, and `checkForBust`
    - If player did not bust, call `stand`
    - Return bet to normal

<img width="500" alt="double down code" src="https://github.com/user-attachments/assets/6c6a63e7-cb0c-4def-a180-426f76222bd1">

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
