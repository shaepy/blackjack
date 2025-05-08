# ♠️ pixeljack (wip)

**https://shaepy.github.io/pixeljack/**

Pixeljack is a fun, pixel-style Blackjack game where you try to beat the dealer by getting as close to 21 as possible without going over. 

Both you and the dealer start with two cards and take turns choosing to 'hit' (get another card) or 'stand' (keep your hand). Whoever gets closer to 21 without going over wins.

//Insert screenshots here when done//

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
// Elaborate further
1. Created a spec
2. Game flowchart
3. Mapped out data structure needed for card deck
4. Pseudo-code
5. Translate into actionable tasks on Kanban board

## ♦️ Code Process
// Elaborate further
1. Built out data structure
2. Scaffolding for HTML for a dealer, player, and 2 buttons for `hit` and `stand`
3. Dealing the cards
    - Created `getCard()` that grabs a random card from the `cardDeck` array
    - `dealCards()` adds 2 cards to each hand (player and dealer)
    - `addCardTotal()` calculates the total of each hand
    - Display those cards using `displayCards()` which later on is used to also display hit cards from the player

## ♦️ Design Process
// Elaborate further
1. Initial wireframes
2. Mockups with initial design
3. Choosing a Pixel theme
4. AI-generated background images

## ♦️ Next Steps
- (05/05/25) Split feature has been merged successfully
- Double down feature
- Card counting mode

## ♦️ Resources Used
- Card assets by Magory: https://magory.itch.io/cute-pixel-playing-cards
- Icons by Yusuf Matra: https://thenounproject.com/creator/yusufmatra/
- Cursors by Kenney: https://kenney.nl/assets/cursor-pixel-pack