/* --------------------------------------- Bet Mechanic -------------------------------------- */

const displayBet = document.querySelector('#bet')
const displayWallet = document.querySelector('#wallet')

let bet = 10
let wallet = 100

function displayFunds() {
    displayBet.textContent = bet
    displayWallet.textContent = wallet
}

displayFunds()


/* --------------------------------------- Constants -------------------------------------- */
// Player Actions
const hitButton = document.querySelector('#hit')
const standButton = document.querySelector('#stand')
const startGame = document.querySelector('#play')
const playAgain = document.querySelector('#playAgain')
const actionsBar = document.querySelector('#actions')
const dealerElement = document.querySelector('#dealer')
const playerElement = document.querySelector('#player')
const infoButton = document.querySelector('#info-button')
const instructions = document.querySelector('#instructions')
const resultDiv = document.querySelector('#result')

// Display cards, result, totals
const displayDealerCards = document.querySelector('#dealer-cards')
const displayPlayerCards = document.querySelector('#player-cards')
const displayResult = document.querySelector('#result h2')
const displayDealerTotal = document.querySelector('#dealer-total')
const displayPlayerTotal = document.querySelector('#player-total')

/* --------------------------------------- Variables -------------------------------------- */

let table = {
    dealer: [],
    player: []
}

// Save positions to cards, totals, and dealt card indexes
let dealerCard1, dealerCard2, playerCard1, playerCard2
let dealerTotal, playerTotal
let playerNewCardIdx, dealerNewCardIdx

/* ------------------------------------ Event Listeners ------------------------------------ */

startGame.addEventListener('click', play)
hitButton.addEventListener('click', hit)
standButton.addEventListener('click', stand)
playAgain.addEventListener('click', reset)
infoButton.addEventListener('click', showInstructions)

/* --------------------------------------- Functions --------------------------------------- */

function play() {
    wallet -= bet
    console.log(`wallet is now:`, wallet)
    displayFunds()
    startGame.style.display = 'none'
    actionsBar.style.display = 'flex'
    dealerElement.style.display = 'flex'
    playerElement.style.display = 'flex'
    dealCards()
    addCardTotal()
    displayCards()
    checkForBlackjack()
}

function getCard() {
    // this only grabs cards with hasBeenPlayed as false
    const cardDeckCopy = cardDeck.filter((card) => card.hasBeenPlayed === false)
    const x = Math.floor(Math.random() * cardDeckCopy.length)
    const matchIdx = cardDeck.findIndex((card) => card === cardDeckCopy[x])
    cardDeck[matchIdx].hasBeenPlayed = true
    return cardDeckCopy[x]
}

// this deals cards to the table (2 to dealer, 2 to player)
function dealCards() {
    dealerCard1 = table.dealer[0] = getCard()
    dealerCard2 = table.dealer[1] = getCard()
    playerCard1 = table.player[0] = getCard()
    playerCard2 = table.player[1] = getCard()
}

function addCardTotal() {
    dealerTotal = table.dealer.reduce((acc, card) => acc + card.value, 0)
    playerTotal = table.player.reduce((acc, card) => acc + card.value, 0)
    if (dealerTotal > 21) {
        table.dealer.forEach(card => {
            if (card.rank === 'ace' && card.aceValueChanged === false) {
                card.value = 1
                card.aceValueChanged = true
                dealerTotal -= 10
            }
        })
    }
    if (playerTotal > 21) {
        table.player.forEach(card => {
            if (card.rank === 'ace' && card.aceValueChanged === false) {
                card.value = 1
                card.aceValueChanged = true
                playerTotal -= 10
            }
        })
    }
}

function checkForBlackjack() {
    if (playerTotal === 21 && dealerTotal < 21) {
        displayResult.innerText = '♠️♥️ Blackjack! You Win ♣️♦️'
        resultDiv.style.display = 'flex'  // if result, show resultDiv
        wallet += bet + (bet * (3/2))
        displayFunds()
        revealHiddenCard()
        removeActionBar()
    } else if (playerTotal === 21 && dealerTotal === 21) {
        revealHiddenCard()
        result()
    }
}

function displayCards() {
    if (displayPlayerCards.innerText === '' && displayDealerCards.innerText === '') {
        displayDealerCards.innerHTML = `<img src=${dealerCard1.src}>`
        displayDealerCards.innerHTML +=  ` <img src='./img/back-red-1.png' id="hidden-card">`
        displayDealerTotal.innerText = dealerCard1.value

        displayPlayerCards.innerHTML = `<img src=${playerCard1.src}>`
        displayPlayerCards.innerHTML +=  ` <img src=${playerCard2.src}>`
        displayPlayerTotal.innerText = playerTotal
    }
    else {
        displayPlayerCards.innerHTML += ` <img src=${table.player[playerNewCardIdx].src}>`
        displayPlayerTotal.innerText = playerTotal
    }
}

function hit() {
    const newCard = getCard()
    table.player.push(newCard)
    playerNewCardIdx = table.player.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    // check for bust
    if (playerTotal > 21) {
        displayResult.innerText = `BUST! You Lose 😭`
        resultDiv.style.display = 'flex'  // if result, show resultDiv
        revealHiddenCard()
        removeActionBar()
    } else if (playerTotal === 21) stand()
}

function stand() {
    revealHiddenCard()
    // dealer's turn
    while (dealerTotal <= 16) dealerHit()
    if (dealerTotal > 21) {
        displayResult.innerText = '🎊 You Win! Dealer BUST'
        resultDiv.style.display = 'flex'  // if result, show resultDiv
        wallet += bet * 2
        displayFunds()
        removeActionBar()
        return
    }
    result()
}

function dealerHit () {
    const newCard = getCard()
    table.dealer.push(newCard)
    dealerNewCardIdx = table.dealer.findIndex((card) => card === newCard)
    addCardTotal()
    displayDealerCards.innerHTML += ` <img src=${table.dealer[dealerNewCardIdx].src}>`
    displayDealerTotal.innerText = dealerTotal
}

// returns true if n1 is less than n2 (closer to 21)
function closerTo21(n1, n2) {
    const diff1 = Math.abs(n1 - 21)
    const diff2 = Math.abs(n2 - 21)
    return diff1 < diff2
}

function result() {
    const playerIsWinner = closerTo21(playerTotal, dealerTotal)
    if (playerTotal === dealerTotal) {
        wallet += bet
        displayFunds()
        displayResult.innerText = `Push. It's a tie`
    } 
    else if (playerIsWinner) {
        wallet += bet * 2
        displayFunds()
        displayResult.innerText = `🎉 Congrats! You Win`
    }
    else if (!playerIsWinner) {
        displayResult.innerText = `You Lose 😓`
    }
    resultDiv.style.display = 'flex'  // if result, show resultDiv
    removeActionBar()
}

// eventually will become play again
function reset() {    
    shuffle()
    table.dealer = []
    table.player = []
    dealerTotal = 0
    playerTotal = 0
    displayDealerCards.innerText = ''
    displayDealerTotal.innerText = ''
    displayPlayerCards.innerText = ''
    displayPlayerTotal.innerText = ''
    displayResult.innerText = ''
    startGame.style.display = 'inline'
    playAgain.style.display = 'none'
    actionsBar.style.display = 'none'
    dealerElement.style.display = 'none'
    playerElement.style.display = 'none'
    resultDiv.style.display = 'none'

    if (wallet < bet) {
        console.log('you are out of money, wallet is:', wallet)
        wallet += 50
        console.log('added free money. wallet is now:', wallet)
        displayFunds()
    }
    console.log('wallet currently at', wallet)
}

// removes the actionBar from view and displays playAgain button
function removeActionBar() {
    playAgain.style.display = 'inline'
    actionsBar.style.display = 'none'
}

// reveals the dealer hiddenCard
function revealHiddenCard() {
    const hiddenCard = document.querySelector('#hidden-card')
    if (hiddenCard) hiddenCard.src = dealerCard2.src
    displayDealerTotal.innerText = dealerTotal
}

function shuffle() {
    cardDeck.forEach(card => card.hasBeenPlayed = false)
    cardDeck.forEach(card => {
        if (card.rank === 'ace') card.value = 11
    })
}

function showInstructions() {
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
}






/* --------------------------------------- Comments -------------------------------------- */

// bet screen display appears when play again is hit
// make a bet screen/home menu (where start game button)
// hide bet screen 

// start game is pressed and game screen is displayed
// cards dealt 

// make a result screen
// this has the play again button.
// result screen is defaulted to display: inline
// set result screen display to appear when a result is displayed
// play again button will encompass reset. 
// play again takes you back to bet screen

// reset game remains at top in case of running out of currency

// // As a user, I can see what cards are dealt to me and the dealer
// //	random card generator
// //	deals two cards to dealer 
// //	deals two cards to player
// //	display those cards
// // dealer only shows one card
// //   player shows both cards
// //   if i get blackjack (ace+10), auto win

// // As a user, I can choose 'hit' to get another card and add to my total.
// //   random card generator
// //   keep track of what's in play so we don't deal a card that is already on the table
// //   deals one card to player
// //   display that card
// //   check if:
// // -   (over 21) bust
// //     (at 21 exactly) auto stand
// //     else, i can hit or stand again

// // As a user, I can stand to end my turn.
// //   submit my hand as my final total
// //   end my turn
	
// // As a user, I should see what the Dealer's cards are.
// //-    dealer logic applies
// //   - always hits on <= 16
// //   - and keeps hitting until reaching 17, 21, or bust
// //	- always stands on >= 17

// edge case: when two aces are in the hand, it will default both to 1.

// * As a user, I should see the result of the round.
// //	- compare the result between my hand and the dealer's
// //		- if myresult is closer to 21 than the dealer's, i win
// 			- add betAmount + betAmount to my wallet
// //		- if dealer's result is closer to 21 than myresult, i lose
// 			- add 0 to my wallet
// //		- else, we draw (push)
// 			- add betAmount to my wallet
// 	- display new wallet total

// * As a user, I should have the option to play again. 
// 	- save the wallet total
// 	- button to tap to play again
// 	- bring player to bet selector with new wallet total
// 	- optional: have option to play again with same bet

// * As a user, I should be able to place a bet to start the game.
// 	- we need a starting amount
// 	- store the value of the bet
// 		- OK to have a single bet amount available to begin (ex. 100)
// 	- deduct from starting amount

// * As a user, I want to reset my game status when I run out of chips.
// 	- reset game button when pressed,
// 	- resets everything back to starting wallet total