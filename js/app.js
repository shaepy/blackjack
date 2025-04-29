// TODO reconsider the display set to none vs flex method of hiding and showing
    // look into using utility classes of .hidden or .flex with display:none/flex and .addClass or .removeClass
// TODO animation when revealing card. slow down actions when adding a card to hand 
// TODO edge case: when two aces are in the hand, it will default both to 1.

/* --------------------------------------- Constants -------------------------------------- */
// Actions
const startGame = document.querySelector('#play')
const playAgain = document.querySelector('#play-again')
const resetWallet = document.querySelector('#reset-wallet')

// Displays
const actionsBar = document.querySelector('#actions')
const dealerElement = document.querySelector('#dealer')
const playerElement = document.querySelector('#player')
const resultDiv = document.querySelector('#result')
const betSelectDiv = document.querySelector('#bet-selection')
const playButtonsDiv = document.querySelector('#buttons')

// Cards, result, totals
const displayDealerCards = document.querySelector('#dealer-cards')
const displayPlayerCards = document.querySelector('#player-cards')
const displayResult = document.querySelector('#result h2')
const displayDealerTotal = document.querySelector('#dealer-total')
const displayPlayerTotal = document.querySelector('#player-total')

/* --------------------------------------- Variables -------------------------------------- */

let table = {dealer: [], player: []}

// Save totals, and dealt card indexes
let dealerTotal, playerTotal, playerNewCardIdx, dealerNewCardIdx

// default bet and wallet
let bet = 10
let wallet = 100
/* ------------------------------------ Event Listeners ------------------------------------ */

startGame.addEventListener('click', play)       
playAgain.addEventListener('click', resetGame)

// when pressing reset button, refill wallet & displayFunds
resetWallet.addEventListener('click', () => {wallet = 200, displayFunds()})

document.querySelector('#hit').addEventListener('click', hit)       
document.querySelector('#stand').addEventListener('click', stand)   
document.querySelector('#info-button').addEventListener('click', toggleHelp)

/* --------------------------------------- Bet Mechanic -------------------------------------- */
const betAmount = document.querySelector('#bet-amnt')

// each bet selector button will save the number to bet and display it
document.querySelectorAll('.bet').forEach(b => b.addEventListener('click', (event) => {
    bet = Number(event.target.innerText)
    console.log('changing bet to:', bet)
    displayFunds()
}))

function displayFunds() {
    betAmount.innerText = bet
    document.querySelector('#wallet-amnt').innerText = wallet
}

/* --------------------------------------- High Score -------------------------------------- */

// IN PROGRESS
const highScoreDiv = document.querySelector('#high-score')
const scoreSection = document.querySelector('#score-section')

let score = 0

function updateHighScore() {
    if (wallet > score) score = wallet, console.log('update to new high score:', score)
    highScoreDiv.innerText = score
}


/* --------------------------------------- Functions --------------------------------------- */

displayFunds()

function play() {
    console.log('game START')
    // TODO: prevents game from starting if wallet is less than bet. need user facing message.
    if (wallet < bet) {
        console.log('not enough money in wallet:', wallet, 'to play bet of:', bet)
        resetWallet.style.display = 'flex'
        return
    }
    console.log('subtracting bet of:', bet, 'from wallet:', wallet)
    wallet -= bet
    console.log('wallet is now:', wallet)

    console.log('turning displays to none and showing game table')
    turnDisplayToNone([startGame, betSelectDiv, resetWallet, playButtonsDiv])
    turnDisplayToFlex([actionsBar, dealerElement, playerElement])

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
    table.dealer.push(getCard())
    table.dealer.push(getCard())
    table.player.push(getCard())
    table.player.push(getCard())
    console.log('Deal 4 cards to table:', table)
}

function addCardTotal() {
    console.log('addCardTotal() - adding total for dealer and player hands')
    dealerTotal = table.dealer.reduce((acc, card) => acc + card.value, 0)
    playerTotal = table.player.reduce((acc, card) => acc + card.value, 0)

    if (dealerTotal > 21) {
        console.log('checking.. this is over 21. dealer total:', dealerTotal)
        table.dealer.forEach(card => {
            if (card.rank === 'ace' && card.aceValueChanged === false) {
                console.log('change this ace, it qualifies:', card)
                card.value = 1
                card.aceValueChanged = true
                dealerTotal -= 10
                console.log('~DEALER~ updated cardValue:', card.value, 'valueChanged:', 
                    card.aceValueChanged, 'handTotal:', dealerTotal)
            }
        })
    }
    if (playerTotal > 21) {
        console.log('checking.. this is over 21. player total:', playerTotal)
        table.player.forEach(card => {
            if (card.rank === 'ace' && card.aceValueChanged === false) {
                console.log('change this ace, it qualifies:', card)
                card.value = 1
                card.aceValueChanged = true
                playerTotal -= 10
                console.log('~PLAYER~ updated cardValue:', card.value, 'valueChanged:', 
                    card.aceValueChanged, 'handTotal:', playerTotal)
            }
        })
    }
}

function checkForBlackjack() {
    console.log('checking for player blackjack')
    if (playerTotal === 21 && dealerTotal < 21) {
        console.log('this is player blackjack, auto win')
        displayResult.innerText = 'Blackjack! You Win'
        wallet += bet + (bet * 1.5)
        displayFunds()
        revealHiddenCard()
        showResultScreen()
    } else if (playerTotal === 21 && dealerTotal === 21) {
        console.log('player has 21 but dealer too. auto stand()')
        stand()
    }
}

function displayCards() {
    if (displayPlayerCards.innerText === '' && displayDealerCards.innerText === '') {
        console.log('displayCards() for the dealt cards')
        displayDealerCards.innerHTML = `<img src=${table.dealer[0].src}>`
        displayDealerCards.innerHTML +=  ` <img src='./img/back-red-1.png' id="hidden-card">`
        displayDealerTotal.innerText = table.dealer[0].value

        displayPlayerCards.innerHTML = `<img src=${table.player[0].src}>`
        displayPlayerCards.innerHTML +=  ` <img src=${table.player[1].src}>`
        displayPlayerTotal.innerText = playerTotal
    }
    else {
        console.log('displayCards() for a player hit card')
        displayPlayerCards.innerHTML += ` <img src=${table.player[playerNewCardIdx].src}>`
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
    if (playerTotal === 21) stand(), console.log('player 21, auto stand()')
    // check for bust
    checkForBust(playerTotal, dealerTotal)
}

// this takes a player total and a dealer total to check for bust
function checkForBust(pTotal, dTotal) {
    console.log('checking for bust (pTotal, dTotal)')
    if (pTotal > 21) {
        console.log('player went over 21. you lose')
        revealHiddenCard()
        showResultScreen()
        displayResult.innerText = `BUST! You Lose`
    } 
    else if (dTotal > 21) {
        console.log('dealer went over 21. you win')
        wallet += bet * 2
        displayFunds()
        showResultScreen()
        displayResult.innerText = 'Dealer BUST! You Win'
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
    displayDealerCards.innerHTML += ` <img src=${table.dealer[dealerNewCardIdx].src}>`
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
        displayResult.innerText = `Push. It's a tie`
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

function resetGame() {    
    console.log('player pressed play again. resetGame() called')
    shuffle()
    table.dealer = []
    table.player = []
    dealerTotal = 0
    playerTotal = 0

    const resetDisplays = [
        displayResult, 
        displayDealerCards, 
        displayDealerTotal, 
        displayPlayerCards, 
        displayPlayerTotal
    ]
    resetDisplays.forEach(div => div.innerText = '')
    console.log('resetting displays, gameTable to none, betScreen to flex')
    turnDisplayToNone([playAgain, actionsBar, resultDiv, dealerElement, playerElement])
    turnDisplayToFlex([playButtonsDiv, startGame, betSelectDiv])

    betAmount.innerText = bet
    // show reset wallet when wallet is less than bet
    if (wallet < bet) resetWallet.style.display = 'flex'
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([scoreSection, playAgain, playButtonsDiv, resultDiv])
    actionsBar.style.display = 'none'
    // this changes the bet display to 0
    betAmount.innerText = '0'
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
        if (card.rank === 'ace') {
            card.value = 11
            card.aceValueChanged = false
        }
    })
}

function toggleHelp() {
    console.log('player pressed on help button')
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
}

// these functions take an array, turn the display of each element to either flex or none
const turnDisplayToFlex = (arr) => arr.forEach(el => el.style.display = 'flex')
const turnDisplayToNone = (arr) => arr.forEach(el => el.style.display = 'none')


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
// 	- optional: have option to play again with same bet

// // * As a user, I should be able to place a bet to start the game.
// //	- we need a starting amount
// //	- store the value of the bet
// // 		- OK to have a single bet amount available to begin (ex. 100)
// //	- deduct from starting amount

// // * As a user, I want to reset my game status when I run out of chips.
// //	- reset game button when pressed,
// //	- resets everything back to starting wallet total