// TODO animation when revealing card. slow down actions when adding a card to hand 
// // FIXED edge case: when two aces are in the hand, it will default both to 1.

/* --------------------------------------- Constants -------------------------------------- */
// Actions
const playButton = document.querySelector('#start-game')
const resetWallet = document.querySelector('#reset-wallet')
const playAgainButtons = document.querySelector('#play-again-buttons')

// Messages
const aceChangeMsg = document.querySelector('#ace-change-msg')

// Logos
const largeLogo = document.querySelector('#large-logo')
const smallLogo = document.querySelector('#small-logo')

// Displays
const actionsBar = document.querySelector('#actions')
const resultDiv = document.querySelector('#result')
const gameTable = document.querySelector('#game-table')
const homeScreen = document.querySelector('#home-screen')

// Cards, result, totals
const displayDealerCards = document.querySelector('#dealer-cards')
const displayPlayerCards = document.querySelector('#player-cards')
const displayResult = document.querySelector('#result h2')
const displayDealerTotal = document.querySelector('#dealer-total')
const displayPlayerTotal = document.querySelector('#player-total')

const resetDisplays = [
    displayResult, 
    displayDealerCards, 
    displayDealerTotal, 
    displayPlayerCards, 
    displayPlayerTotal
]

/* --------------------------------------- Variables -------------------------------------- */

let table = {dealer: [], player: []}

// Save totals, and dealt card indexes
let dealerTotal, playerTotal, playerNewCardIdx, dealerNewCardIdx

// default bet and wallet
let bet = 0
let wallet = 100

/* ------------------------------------ Event Listeners ------------------------------------ */

playButton.addEventListener('click', play)
document.querySelector('#change-bet').addEventListener('click', resetGame)
document.querySelector('#play-again').addEventListener('click', playSameBet)

// when pressing reset button, refill wallet & displayFunds
resetWallet.addEventListener('click', () => {wallet = 100, displayFunds()})

document.querySelector('#hit').addEventListener('click', hit)       
document.querySelector('#stand').addEventListener('click', stand)   
document.querySelector('#info-button').addEventListener('click', toggleHelp)

/* --------------------------------------- Bet Mechanic -------------------------------------- */

const betAmount = document.querySelectorAll('.bet-amnt h3')
const walletAmount = document.querySelectorAll('.wallet-amnt h3')
const gameBank = document.querySelector('#game-bank')

// each bet selector button will save the number to bet and display it
document.querySelectorAll('.bet').forEach(b => b.addEventListener('click', (event) => {
    bet = Number(event.target.dataset.bet)
    console.log('changing bet to:', bet)
    displayFunds()
}))

function displayFunds() {
    betAmount.forEach(bank => bank.innerText = bet)
    walletAmount.forEach(bank => bank.innerText = wallet)
}

/* --------------------------------------- High Score -------------------------------------- */

// TODO IN PROGRESS
const highScoreDiv = document.querySelector('#high-score')
const scoreSection = document.querySelector('#score-section')

let score = 0

function updateHighScore() {
    if (wallet > score) score = wallet, console.log('update to new high score:', score)
    highScoreDiv.innerText = score
}

/* --------------------------------------- Functions --------------------------------------- */

displayFunds()

// these functions take an array, turn the display of each element to either flex or none
const turnDisplayToFlex = (arr) => arr.forEach(el => el.style.display = 'flex')
const turnDisplayToNone = (arr) => arr.forEach(el => el.style.display = 'none')

function play() {
    console.log('game START')
    // TODO need user facing message. wallet is too low, reset funds
    if (wallet < bet) {
        console.log('wallet is too low. reset funds cta set to show')
        resetWallet.style.display = 'flex'
        return
    }
    // TODO needs user facing message, bet is below min. amnt
    if (bet < 10) {
        console.log('bet is 0. cannot start game')
        return
    }
    wallet -= bet
    console.log('turning homescreen divs to none and showing game table')
    turnDisplayToNone([homeScreen, largeLogo, playAgainButtons, resetWallet])
    turnDisplayToFlex([gameTable, smallLogo, gameBank, actionsBar])
    displayFunds()
    dealCards()
    addCardTotal()
    displayCards()
    checkForBlackjack()
}

function resetGame() {    
    console.log('player pressed play again. resetGame() called')
    shuffle()
    table.dealer = []
    table.player = []
    dealerTotal = playerTotal = 0
    resetDisplays.forEach(div => div.innerText = '')

    turnDisplayToNone([gameTable, resultDiv, smallLogo])
    turnDisplayToFlex([homeScreen, largeLogo])

    // show reset wallet when wallet is less than bet
    if (wallet < bet) resetWallet.style.display = 'flex'
}

function playSameBet() {
    console.log('this will start a quick play game')
    // TODO need user facing message. wallet is too low, reset funds
    if (wallet < bet) {
        console.log('wallet is too low. reset funds cta set to show')
        resetWallet.style.display = 'flex'
        return
    }
    // TODO needs user facing message, bet is below min. amnt
    if (bet < 10) {
        console.log('bet is 0. cannot start game')
        return
    }
    shuffle()
    table.dealer = []
    table.player = []
    dealerTotal = playerTotal = 0
    resetDisplays.forEach(div => div.innerText = '')
    turnDisplayToNone([resultDiv, playAgainButtons, resetWallet])
    turnDisplayToFlex([actionsBar])

    if (wallet < bet) resetWallet.style.display = 'flex'

    wallet -= bet
    displayFunds()
    dealCards()
    addCardTotal()
    displayCards()
    checkForBlackjack()
}

function getCard() {
    console.log('RUN getCard()')
    const cardDeckCopy = cardDeck.filter((card) => card.hasBeenPlayed === false)
    const x = Math.floor(Math.random() * cardDeckCopy.length)
    const matchIdx = cardDeck.findIndex((card) => card === cardDeckCopy[x])
    cardDeck[matchIdx].hasBeenPlayed = true
    return cardDeckCopy[x]
}

function dealCards() {
    table.dealer.push(getCard(), getCard())
    table.player.push(getCard(), getCard())

    // ace edge case:
    // const ace1 = cardDeck.find(c => c.suit === 'spade' && c.rank === 'ace')
    // const ace2 = cardDeck.find(c => c.suit === 'heart' && c.rank === 'ace')
    // table.player.push(ace1, ace2)

    console.log('Dealt 4 cards to table:', table)
}

function changeAceValues(plyrOrDlr) {
    console.log('running changeAceValues()')
    const foundAce = plyrOrDlr.findIndex(card => card.rank === 'ace' && !card.aceValueChanged)
    // foundAce is -1 if no ace is returned
    if (foundAce !== -1) {
        console.log('there is an ace we can change:', plyrOrDlr[foundAce])
        plyrOrDlr[foundAce].value = 1
        plyrOrDlr[foundAce].aceValueChanged = true
        console.log('changed!', plyrOrDlr[foundAce])

        if (plyrOrDlr === table.player) {
            console.log('this is a player')
            playerTotal -= 10
            aceChangeMsg.style.display = 'flex'
        } else {
            console.log('this is dealer')
            dealerTotal -= 10
        }

        console.log('ace changed:', plyrOrDlr[foundAce], dealerTotal, playerTotal)
    } else {
        console.log('there is no ace that qualifies')
    }
}


function addCardTotal() {
    console.log('addCardTotal() - adding total for dealer and player hands')
    dealerTotal = table.dealer.reduce((acc, card) => acc + card.value, 0)
    playerTotal = table.player.reduce((acc, card) => acc + card.value, 0)

    if (dealerTotal > 21) {
        console.log('this is over 21. dealer total:', dealerTotal)
        changeAceValues(table.dealer)
    } 
    if (playerTotal > 21) {
        console.log('this is over 21. player total:', playerTotal)
        changeAceValues(table.player)
    }
}

function checkForBlackjack() {
    console.log('calling checkForBlackjack()')
    if (playerTotal === 21 && dealerTotal < 21) {
        displayResult.innerText = 'Blackjack! You Win'
        wallet += bet + (bet * 1.5)
        displayFunds()
        revealHiddenCard()
        showResultScreen()
    } else if (playerTotal === 21 && dealerTotal === 21) stand()
}

function displayCards() {
    if (displayPlayerCards.innerHTML === '' && displayDealerCards.innerHTML === '') {
        console.log('displayCards() for the dealt cards')
        displayDealerCards.innerHTML = `<img src=${table.dealer[0].src} class="card">`
        displayDealerCards.innerHTML +=  `<img src='./img/cards/back-red-1.png' id="hidden-card" class="card">`
        displayDealerTotal.innerText = table.dealer[0].value

        displayPlayerCards.innerHTML = `<img src=${table.player[0].src} class="card">`
        displayPlayerCards.innerHTML += `<img src=${table.player[1].src} class="card">`
        displayPlayerTotal.innerText = playerTotal
    }
    else {
        console.log('displayCards() for a player hit card')
        displayPlayerCards.innerHTML += `<img src=${table.player[playerNewCardIdx].src} class="card">`
        displayPlayerTotal.innerText = playerTotal
    }
}

function hit() {
    console.log('player pressed hit()')
    const newCard = getCard()
    table.player.push(newCard)
    playerNewCardIdx = table.player.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    // if 21, autostand
    if (playerTotal === 21) stand()
    // check for bust
    checkForBust(playerTotal, dealerTotal)
}

// this takes a player total and a dealer total to check for bust
function checkForBust(pTotal, dTotal) {
    console.log('checking for bust (pTotal, dTotal)')
    if (pTotal > 21) {
        revealHiddenCard()
        showResultScreen()
        displayResult.innerText = `You Bust`
    } 
    else if (dTotal > 21) {
        wallet += bet * 2
        displayFunds()
        showResultScreen()
        displayResult.innerText = 'You Win'
        return 1
    }
}

function stand() {
    console.log('stand() is called')
    // dealer's turn
    revealHiddenCard()
    while (dealerTotal <= 16) dealerHit()
    if (!checkForBust(playerTotal, dealerTotal)) compareResult()
}

function dealerHit() {
    console.log('total is <=16. dealerHit')
    const newCard = getCard()
    table.dealer.push(newCard)
    dealerNewCardIdx = table.dealer.findIndex((card) => card === newCard)
    addCardTotal()
    // display dealer card
    displayDealerCards.innerHTML += `<img src=${table.dealer[dealerNewCardIdx].src} class="card">`
    displayDealerTotal.innerText = dealerTotal
}

function compareResult() {
    console.log('compareResult() is running...')
    // returns true if n1 is less than n2 (closer to 21)
    const closerTo21 = (n1, n2) => {
        const diff1 = Math.abs(n1 - 21)
        const diff2 = Math.abs(n2 - 21)
        return diff1 < diff2
    }
    const playerIsWinner = closerTo21(playerTotal, dealerTotal)

    if (playerTotal === dealerTotal) {
        wallet += bet
        displayResult.innerText = `Push (Tie)`
        console.log('playerTotal === dealerTotal. Push')
    } 
    else if (playerIsWinner) {
        wallet += bet * 2
        displayResult.innerText = `You Win`
        console.log('playerIsWinner is true. Player wins')
    }
    else {
        displayResult.innerText = `You Lose`
        console.log('else, Player loses')
    }
    displayFunds()
    showResultScreen()
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([scoreSection, resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar, aceChangeMsg])
    // this changes the bet display to 0
    betAmount[0].innerText = '0'
    updateHighScore()
}

function revealHiddenCard() {
    console.log('revealHiddenCard(), showing dealers 2nd card')
    const hiddenCard = document.querySelector('#hidden-card')
    if (hiddenCard) hiddenCard.src = table.dealer[1].src
    displayDealerTotal.innerText = dealerTotal
}

function shuffle() {
    console.log('shuffle() is running...')
    cardDeck.forEach(card => {
        card.hasBeenPlayed = false
        if (card.rank === 'ace') card.value = 11, card.aceValueChanged = false
    })
}

function toggleHelp() {
    console.log('player pressed on help button')
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
}


/* --------------------------------------- Comments -------------------------------------- */
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

// // * As a user, I should see the result of the round.
// //	- compare the result between my hand and the dealer's
// //		- if myresult is closer to 21 than the dealer's, i win
// //		- add betAmount + betAmount to my wallet
// //		- if dealer's result is closer to 21 than myresult, i lose
// //			- add 0 to my wallet
// //		- else, we draw (push)
// //			- add betAmount to my wallet
// //	- display new wallet total

// // * As a user, I should have the option to play again. 
// // 	- save the wallet total
// // 	- button to tap to play again
// //	- bring player to bet selector with new wallet total
// // optional: have option to play again with same bet

// // * As a user, I should be able to place a bet to start the game.
// //	- we need a starting amount
// //	- store the value of the bet
// // 		- OK to have a single bet amount available to begin (ex. 100)
// //	- deduct from starting amount

// // * As a user, I want to reset my game status when I run out of chips.
// //	- reset game button when pressed,
// //	- resets everything back to starting wallet total