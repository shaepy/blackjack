/* --------------------------------------- Constants -------------------------------------- */

// Messages
const aceChangeMsgDiv = document.querySelector('#ace-change-msg')

// Logos
const largeLogo = document.querySelector('#large-logo')
const smallLogo = document.querySelector('#small-logo')

// Displays
const actionsBar = document.querySelector('#actions')
const resultDiv = document.querySelector('#result')
const gameTable = document.querySelector('#game-table')
const gameBank = document.querySelector('#game-bank')
const homeScreen = document.querySelector('#home-screen')
const playAgainButtons = document.querySelector('#play-again-buttons')

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

let cards = {dealer: [], player: []}

// Save totals, and dealt card indexes
let dealerTotal, playerTotal, playerHitIdx, dealerHitIdx

// default bet and wallet
let bet = 0
let wallet = 100

/* ------------------------------------ Event Listeners ------------------------------------ */

document.querySelector('#start-game').addEventListener('click', play)
document.querySelector('#change-bet').addEventListener('click', goBetScreen)
document.querySelector('#play-again').addEventListener('click', playAgain)
document.querySelector('#hit').addEventListener('click', hit)       
document.querySelector('#stand').addEventListener('click', stand)
document.querySelector('#info-button').addEventListener('click', toggleHelp)

/* --------------------------------------- Bet Mechanic -------------------------------------- */

const resetWallet = document.querySelector('#reset-wallet')
resetWallet.addEventListener('click', () => {wallet = 100, displayFunds()}) // refill wallet & displayFunds

const betAmount = document.querySelectorAll('.bet-amnt h3')
const walletAmount = document.querySelectorAll('.wallet-amnt h3')

// each bet selector button will save the number to bet and display it
document.querySelectorAll('.bet').forEach(b => b.addEventListener('click', (event) => {
    bet = Number(event.target.dataset.bet)
    displayFunds()
}))

function displayFunds() {
    betAmount.forEach(bank => bank.innerText = bet)
    walletAmount.forEach(bank => bank.innerText = wallet)
}

/* --------------------------------------- High Score -------------------------------------- */

// TODO IN PROGRESS 
// !show high score in bet screen 
// high score is updated and shown in gamescreen, but needs one in home screen. 
// do something similar like gamebank and homebank

const scoreSection = document.querySelector('#score-section')

let score = 0

function updateHighScore() {
    if (wallet > score) score = wallet, console.log('update to new high score:', score)
    document.querySelector('#high-score').innerText = score
}

/* --------------------------------------- Start/End Game --------------------------------------- */

[1,2,3,4].forEach(num => {
    console.log(num)
})

displayFunds()

// these functions take an array, turn the display of each element to either flex or none
const turnDisplayToFlex = (arr) => arr.forEach(el => el.style.display = 'flex')
const turnDisplayToNone = (arr) => arr.forEach(el => el.style.display = 'none')

function startGame() {
    wallet -= bet
    displayFunds()
    dealCards()
    addCardTotal()
    displayCards()
    checkForBlackjack()
}

function resetGame() {
    console.log('resetting the game')
    shuffle()
    cards.dealer = []
    cards.player = []
    dealerTotal = playerTotal = 0
    resetDisplays.forEach(div => div.innerText = '')
}

function shuffle() {
    console.log('shuffle() is running...')
    cardDeck.forEach(card => {
        card.hasBeenPlayed = false
        if (card.rank === 'ace') card.value = 11, card.aceValueChanged = false
    })
}

function play() {
    console.log('player pressed play. START')
    // TODO need user facing message. wallet is too low, reset funds
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        return
    }
    // TODO user facing message, bet is below min. amnt
    if (bet < 10) return
    startGame()
    console.log('turning homescreen divs to none and showing game cards')
    turnDisplayToNone([homeScreen, largeLogo, playAgainButtons, resetWallet])
    turnDisplayToFlex([gameTable, smallLogo, gameBank, actionsBar])
}

function goBetScreen() {
    console.log('player pressed changeBet. goBetScreen() called')
    updateHighScore()
    resetGame()
    turnDisplayToNone([gameTable, resultDiv, smallLogo])
    turnDisplayToFlex([homeScreen, largeLogo])
    // show reset wallet when wallet is less than bet
    if (wallet < bet) resetWallet.style.display = 'flex'
}

function playAgain() {
    console.log('this will start a quick play game')
    // TODO need user facing message. wallet is too low, reset funds
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        return
    }
    // TODO user facing message, bet is below min. amnt
    if (bet < 10) return
    resetGame()
    turnDisplayToNone([resultDiv, playAgainButtons, resetWallet])
    turnDisplayToFlex([actionsBar])
    if (wallet < bet) resetWallet.style.display = 'flex'
    startGame()
}

/* --------------------------------------- Gameplay --------------------------------------- */

function getCard() {
    console.log('RUN getCard()')
    const cardDeckCopy = cardDeck.filter((card) => card.hasBeenPlayed === false)
    const x = Math.floor(Math.random() * cardDeckCopy.length)
    const matchIdx = cardDeck.findIndex((card) => card === cardDeckCopy[x])
    cardDeck[matchIdx].hasBeenPlayed = true
    return cardDeckCopy[x]
}

function dealCards() {
    cards.dealer.push(getCard(), getCard())
    cards.player.push(getCard(), getCard())

    // * ace edge case:
    // const ace1 = cardDeck.find(c => c.suit === 'spade' && c.rank === 'ace')
    // const ace2 = cardDeck.find(c => c.suit === 'heart' && c.rank === 'ace')
    // cards.player.push(ace1, ace2)

    console.log('Dealt 4 cards to cards:', cards)
}

function changeAceValues(plyrOrDlr) {
    console.log('running changeAceValues()')
    const aceIdx = plyrOrDlr.findIndex(card => card.rank === 'ace' && !card.aceValueChanged)
    // aceIdx is -1 if no ace is returned
    if (aceIdx !== -1) {
        console.log('there is an ace we can change:', plyrOrDlr[aceIdx])
        plyrOrDlr[aceIdx].value = 1
        plyrOrDlr[aceIdx].aceValueChanged = true
        console.log('changed!', plyrOrDlr[aceIdx])

        if (plyrOrDlr === cards.player) {
            console.log('this is a player')
            playerTotal -= 10

            // display ace change message
            aceChangeMsgDiv.style.display = 'flex'
            const aceMsg = document.createElement('p')
            aceMsg.innerText = 'Your Ace value has changed from 11 to 1.'
            aceChangeMsgDiv.append(aceMsg)
            requestAnimationFrame(() => aceChangeMsgDiv.classList.add('fade-in'))
            setTimeout(() => {
                aceChangeMsgDiv.classList.remove('fade-in')
                aceChangeMsgDiv.classList.add('fade-out')
                setTimeout(() => {
                    aceChangeMsgDiv.style.display = 'none'
                    aceChangeMsgDiv.classList.remove('fade-out')
                    aceChangeMsgDiv.innerHTML = '';
                }, 1000)
            }, 3000)

        } else {
            console.log('this is dealer')
            dealerTotal -= 10
        }
        console.log('ace changed:', plyrOrDlr[aceIdx], playerTotal, dealerTotal)
    } else {
        console.log('there is no ace that qualifies')
    }
}

function addCardTotal() {
    console.log('addCardTotal() - adding total for dealer and player hands')
    dealerTotal = cards.dealer.reduce((acc, card) => acc + card.value, 0)
    playerTotal = cards.player.reduce((acc, card) => acc + card.value, 0)

    if (dealerTotal > 21) {
        console.log('this is over 21. dealer total:', dealerTotal)
        changeAceValues(cards.dealer)
    } 
    if (playerTotal > 21) {
        console.log('this is over 21. player total:', playerTotal)
        changeAceValues(cards.player)
    }
}

function checkForBlackjack() {
    console.log('calling checkForBlackjack()')
    if (playerTotal === 21 && dealerTotal < 21) {
        console.log('this is a blackjack! yay')
        displayResult.innerText = 'Blackjack! You Win'
        wallet += bet + (bet * 1.5)
        displayFunds()
        revealHiddenCard()
        showResultScreen()
    } else if (playerTotal === 21 && dealerTotal === 21) stand()
}

// this creates a card image to display
function createCardImg(card) {
    const cardImage = document.createElement('img')
    cardImage.classList.add('card')
    cardImage.alt = `${card.suit} ${card.rank}`
    cardImage.src = card.src
    return cardImage
}

function displayCards() {
    if (displayPlayerCards.innerHTML === '' && displayDealerCards.innerHTML === '') {
        console.log('displayCards() for the dealt cards')

        // create dealer back card img element
        const hiddenCard = document.createElement('img')
        hiddenCard.classList.add('card')
        hiddenCard.id = 'hidden-card'
        hiddenCard.src = './img/cards/back-blue-1.png'

        // dealer 1st card image
        const dealer1stCard = createCardImg(cards.dealer[0])

        // create player card images
        const player1stCard = createCardImg(cards.player[0])
        const player2ndCard = createCardImg(cards.player[1])

        // DISPLAY HERE
        displayDealerCards.append(dealer1stCard, hiddenCard)
        displayDealerTotal.innerText = cards.dealer[0].value

        displayPlayerCards.append(player1stCard, player2ndCard)
        displayPlayerTotal.innerText = playerTotal
    }
    else {
        console.log('displayCards() for a player hit card')
        const playerHitCard = createCardImg(cards.player[playerHitIdx])
        
        displayPlayerCards.append(playerHitCard)
        displayPlayerTotal.innerText = playerTotal
    }
}

function hit() {
    console.log('player pressed hit()')
    const newCard = getCard()
    cards.player.push(newCard)
    playerHitIdx = cards.player.findIndex((card) => card === newCard)
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
    cards.dealer.push(newCard)
    dealerHitIdx = cards.dealer.findIndex((card) => card === newCard)
    addCardTotal()

    // display dealer card
    const dealerHitCard = createCardImg(cards.dealer[dealerHitIdx])
    displayDealerCards.append(dealerHitCard)
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
        displayResult.innerText = `Push`
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

function revealHiddenCard() {
    console.log('revealHiddenCard(), showing dealers 2nd card')
    const hiddenCard = document.querySelector('#hidden-card')
    if (hiddenCard) hiddenCard.src = cards.dealer[1].src
    displayDealerTotal.innerText = dealerTotal
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([scoreSection, resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar])
    // this changes the bet display to 0
    betAmount[0].innerText = '0'
    updateHighScore()
}

function toggleHelp() {
    console.log('player pressed on help button')
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
}


/* --------------------------------------- Comments -------------------------------------- */

// FIXED. edge case: when two aces are in the hand, it will default both to 1.