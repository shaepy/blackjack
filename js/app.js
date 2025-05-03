/* --------------------------------------- Constants -------------------------------------- */

// Message elements
const aceMsgElement = document.querySelector('#ace-change-msg')
const lowBetDiv = document.querySelector('#low-bet')
const lowWalletDiv = document.querySelector('#low-wallet')

// Logo elemenets
const largeLogo = document.querySelector('#large-logo')
const smallLogo = document.querySelector('#small-logo')

// Display elements
const actionsBar = document.querySelector('#actions')
const resultDiv = document.querySelector('#result')
const gameTable = document.querySelector('#game-table')
const gameBank = document.querySelector('#game-bank')
const homeScreen = document.querySelector('#home-screen')
const playAgainButtons = document.querySelector('#play-again-buttons')

// Cards, result, handTotal elements
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

// High score displays
const gameScoreDiv = document.querySelector('#game-score')
const homeScoreDiv = document.querySelector('#home-score')
const highScoreDisplays = document.querySelectorAll('.high-score')

/* --------------------------------------- Variables -------------------------------------- */

let dealer = {cards: [], total: 0, hitCardIdx: 0}
let player = {cards: [], total: 0, hitCardIdx: 0}

let bet = score = 0
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
// refill wallet & displayFunds
resetWallet.addEventListener('click', () => {wallet = 100, displayFunds()})

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

/* --------------------------------------- Start/End Game --------------------------------------- */

displayFunds()

// this takes an element and applies the fade in/fade out transition
function handleFadeMsg(element) {
    console.log('handling temporary message')
    element.style.display = 'flex'
    requestAnimationFrame(() => element.classList.add('fade-in'))
    setTimeout(() => {
        element.classList.remove('fade-in')
        element.classList.add('fade-out')
        setTimeout(() => {
            element.style.display = 'none'
            element.classList.remove('fade-out')
        }, 1000)
    }, 2000)
}

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
    dealer.cards = []
    player.cards = []
    dealer.total = player.total = 0
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
    console.log('player pressed play from bet screen. START')
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        handleFadeMsg(lowWalletDiv)
        return
    } else if (bet < 10) {
        handleFadeMsg(lowBetDiv)
        return
    }
    console.log('turning homescreen divs to none and showing game cards')
    turnDisplayToNone([homeScreen, largeLogo, playAgainButtons, resetWallet])
    turnDisplayToFlex([gameTable, smallLogo, gameBank, actionsBar])
    startGame()
}

function goBetScreen() {
    console.log('player pressed changeBet. goBetScreen() called')
    resetGame()
    turnDisplayToNone([gameTable, resultDiv, smallLogo])
    turnDisplayToFlex([homeScreen, largeLogo])
    // show reset wallet when wallet is less than bet
    if (wallet < bet) resetWallet.style.display = 'flex'
}

function playAgain() {
    console.log('this will start a quick play game')
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        handleFadeMsg(lowWalletDiv)
        return
    } else if (bet < 10) {
        handleFadeMsg(lowBetDiv)
        return
    }
    resetGame()
    console.log('turning result divs, play again buttons to none. showing actions bar')
    turnDisplayToNone([resultDiv, playAgainButtons, resetWallet])
    turnDisplayToFlex([actionsBar])
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
    dealer.cards.push(getCard(), getCard())
    player.cards.push(getCard(), getCard())

    // * ace edge case
    // const ace1 = cardDeck.find(c => c.suit === 'spade' && c.rank === 'ace')
    // const ace2 = cardDeck.find(c => c.suit === 'heart' && c.rank === 'ace')
    // player.cards.push(ace1, ace2)

    // * blackjack edge case
    // const testcard10 = cardDeck.find(c => c.value === 10)
    // const testace11 = cardDeck.find(c => c.rank === 'ace')
    // player.cards.push(testcard10, testace11)

    console.log('player hand:', player, 'dealer hand:', dealer)
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

        if (plyrOrDlr === player.cards) {
            console.log('this is a player')
            player.total -= 10
            // display ace change message with fade
            handleFadeMsg(aceMsgElement)
        } else {
            console.log('this is dealer')
            dealer.total -= 10
        }
        console.log('ace changed:', plyrOrDlr[aceIdx], player.total, dealer.total)
    } else {
        console.log('there is no ace that qualifies')
    }
}

function addCardTotal() {
    console.log('addCardTotal() - adding total for dealer and player hands')
    dealer.total = dealer.cards.reduce((acc, card) => acc + card.value, 0)
    player.total = player.cards.reduce((acc, card) => acc + card.value, 0)

    if (dealer.total > 21) {
        console.log('this is over 21. dealer total:', dealer.total)
        changeAceValues(dealer.cards)
    } 
    if (player.total > 21) {
        console.log('this is over 21. player total:', player.total)
        changeAceValues(player.cards)
    }
}

function checkForBlackjack() {
    console.log('calling checkForBlackjack()')
    if (player.total === 21 && dealer.total < 21) {
        console.log('this is a blackjack! yay')
        displayResult.innerText = 'Blackjack! You Win'
        wallet += bet + (bet * 1.5)
        setTimeout(revealHiddenCard, 350)
        setTimeout(displayFunds, 500)
        setTimeout(showResultScreen, 500)
    } else if (player.total === 21 && dealer.total === 21) stand()
}

// This takes a card object and creates a card image HTML element to display
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

        // Use createCardImg to append here
        displayDealerCards.append(createCardImg(dealer.cards[0]), hiddenCard)
        displayDealerTotal.innerText = dealer.cards[0].value
        displayPlayerCards.append(createCardImg(player.cards[0]), createCardImg(player.cards[1]))
        displayPlayerTotal.innerText = player.total
    }
    else {
        console.log('displayCards() for a player hit card')
        displayPlayerCards.append(createCardImg(player.cards[player.hitCardIdx]))
        displayPlayerTotal.innerText = player.total
    }
}

function hit() {
    console.log('player pressed hit()')
    const newCard = getCard()
    player.cards.push(newCard)
    player.hitCardIdx = player.cards.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    console.log(player)
    // if 21, autostand
    if (player.total === 21) stand()
    // check for bust
    checkForBust(player.total, dealer.total)
}

// this takes a player total and a dealer total to check for bust
function checkForBust(pTotal, dTotal) {
    console.log('checking for bust (pTotal, dTotal)')
    if (pTotal > 21) {
        setTimeout(revealHiddenCard, 350)
        setTimeout(showResultScreen, 500)
        displayResult.innerText = `You Bust`
    } 
    else if (dTotal > 21) {
        wallet += bet * 2
        setTimeout(displayFunds, 500)
        setTimeout(showResultScreen, 500)
        displayResult.innerText = 'You Win'
        return 1
    }
}

function stand() {
    console.log('stand() is called')
    // dealer's turn
    setTimeout(revealHiddenCard, 350)
    while (dealer.total <= 16) dealerHit()
    if (!checkForBust(player.total, dealer.total)) compareResult()
}

function dealerHit() {
    console.log('total is <=16. dealerHit')
    const newCard = getCard()
    dealer.cards.push(newCard)
    dealer.hitCardIdx = dealer.cards.findIndex((card) => card === newCard)
    addCardTotal()
    // display dealer card
    const dealerHitCard = createCardImg(dealer.cards[dealer.hitCardIdx])
    setTimeout(() => {
        displayDealerCards.append(dealerHitCard)
        displayDealerTotal.innerText = dealer.total
    }, 350)
}

function compareResult() {
    console.log('compareResult() is running...')
    // returns true if n1 is less than n2 (closer to 21)
    const closerTo21 = (n1, n2) => {
        const diff1 = Math.abs(n1 - 21)
        const diff2 = Math.abs(n2 - 21)
        return diff1 < diff2
    }
    const playerIsWinner = closerTo21(player.total, dealer.total)

    if (player.total === dealer.total) {
        wallet += bet
        displayResult.innerText = `Push`
    } 
    else if (playerIsWinner) {
        wallet += bet * 2
        displayResult.innerText = `You Win`
    }
    else {
        displayResult.innerText = `You Lose`
    }
    setTimeout(displayFunds, 500)
    setTimeout(showResultScreen, 500)
}

function revealHiddenCard() {
    console.log('revealHiddenCard(), showing dealers 2nd card')
    const hiddenCard = document.querySelector('#hidden-card')
    if (hiddenCard) hiddenCard.src = dealer.cards[1].src
    displayDealerTotal.innerText = dealer.total
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar])

    // this changes the bet display to 0
    betAmount[0].innerText = '0'

    // check for high score
    if (wallet > score) {
        score = wallet
        console.log('wallet is greater than 0, so score is now:', score)
        turnDisplayToFlex([gameScoreDiv, homeScoreDiv])
        highScoreDisplays.forEach(display => display.innerText = score)
    }
}

function toggleHelp() {
    console.log('player pressed on help button')
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
}