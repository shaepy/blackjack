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

/* --------------------------------------- Split Feature -------------------------------------- */

let splitHand = {cards: [], total: 0, hitCardIdx: 0}
let activeHand = player

const displaySplitCards = document.querySelector('#splitHand-cards')
const displaySplitTotal = document.querySelector('#splitHand-total')
const splitCardsViewDiv = document.querySelector('#split-view-2')

document.querySelector('#split').addEventListener('click', splitCards)

function splitCards() {
    console.log('player presses split button')

    // split the cards
    turnDisplayToFlex([splitCardsViewDiv])
    const splitCard = player.cards.pop()
    splitHand.cards.push(splitCard)
    console.log('split hand is now:', splitHand.cards)

    // display splitHand
    displaySplitCards.append(createCardImg(splitHand.cards[0]))

    // show total
    splitHand.total = splitHand.cards[0].value
    displaySplitTotal.innerText = splitHand.total

    player.total = player.cards[0].value
    displayPlayerTotal.innerText = player.total

    // remove from player cards
    const playerCardsImages = document.querySelectorAll('#player-cards img')
    console.log(playerCardsImages)
    playerCardsImages[1].remove()
}

const resetDisplays = [
    displayResult, 
    displayDealerCards, 
    displayDealerTotal, 
    displayPlayerCards, 
    displayPlayerTotal,
    displaySplitCards,
    displaySplitTotal
]

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

    // reset activehand
    if (activeHand === splitHand) activeHand = player

    dealer.cards = []
    player.cards = []
    splitHand.cards = []
    dealer.total = player.total = splitHand.total = 0
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
    turnDisplayToNone([gameTable, resultDiv, smallLogo, splitCardsViewDiv])
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
    turnDisplayToNone([resultDiv, playAgainButtons, resetWallet, splitCardsViewDiv])
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
    // player.cards.push(getCard(), getCard())

    // * split cards
    const splitcard1 = cardDeck.find(c => c.rank === '8' && c.suit === 'spade')
    const splitcard2 = cardDeck.find(c => c.rank === '8' && c.suit === 'heart')
    player.cards.push(splitcard1, splitcard2)

    // * ace edge case
    // const ace1 = cardDeck.find(c => c.suit === 'spade' && c.rank === 'ace')
    // const ace2 = cardDeck.find(c => c.suit === 'heart' && c.rank === 'ace')
    // player.cards.push(ace1, ace2)

    // * blackjack edge case
    // const testcard10 = cardDeck.find(c => c.value === 10)
    // const testace11 = cardDeck.find(c => c.rank === 'ace')
    // player.cards.push(testcard10, testace11)

    // if dealt cards are same rank, show split button
    if (player.cards[0].rank === player.cards[1].rank) {
        document.querySelector('#split').style.display = 'flex'
    }

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
    splitHand.total = splitHand.cards.reduce((acc, card) => acc + card.value, 0)

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

        if (activeHand === player) {
            displayPlayerCards.append(createCardImg(activeHand.cards[activeHand.hitCardIdx]))
            displayPlayerTotal.innerText = activeHand.total
        } else {
            displaySplitCards.append(createCardImg(activeHand.cards[activeHand.hitCardIdx]))
            displaySplitTotal.innerText = activeHand.total
        }
    }
}

function hit() {
    console.log('player pressed hit()')

    console.log(activeHand)

    const newCard = getCard()
    activeHand.cards.push(newCard)
    console.log('new card added:', activeHand)

    activeHand.hitCardIdx = activeHand.cards.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    console.log('total is now:', activeHand)
    // if 21, autostand
    if (activeHand.total === 21) {
        stand()
        return
    }
    // check for bust
    checkForBust(activeHand)
}

// this takes a player total and a dealer total to check for bust
function checkForBust(hand) {
    console.log(`checking for bust with ${hand}:`, hand)

    // BOTH SPLIT HANDS BUST
    if (player.total > 21 && splitHand.total > 21) {
        // auto lose, skip dealer turn
        console.log('BOTH HANDS BUST')
        setTimeout(revealHiddenCard, 350)
        setTimeout(showResultScreen, 500)
        displayResult.innerText = `Both Hands Bust`
        return
    }

    // is it player or dealer?
    if (hand === activeHand && hand.total > 21) {
        console.log('this hand is a player and a BUST')
        // check if this hand is split
        if (splitHand.cards.length > 0) {
            console.log('this is a SPLIT with a bust. auto standing now')
            stand()
            return
        } 
        // proceed as normal
        setTimeout(revealHiddenCard, 350)
        setTimeout(showResultScreen, 500)
        displayResult.innerText = `You Bust`
    } 
    // it is dealer
    else if (hand === dealer && hand.total > 21) {
        // if dealer has bust while player hand is split, return to compare the result
        if (splitHand.cards.length > 0) {
            console.log('dealer BUST while player has split. compare hands')
            return
        } 
        // else player auto wins
        wallet += bet * 2
        setTimeout(displayFunds, 500)
        setTimeout(showResultScreen, 500)
        displayResult.innerText = 'You Win'
        return 1
    }
}


function stand() {
    console.log('stand() is called')

    // check if there's a split hand
    if (activeHand === player && splitHand.cards.length > 0) {
        console.log('this is a splitHand stand. change activeHand')
        // play splitHand
        activeHand = splitHand // change activeHand
        console.log(activeHand)
        return
    }

    // dealer's turn
    setTimeout(revealHiddenCard, 350)
    while (dealer.total <= 16) dealerHit()
    if (!checkForBust(dealer)) compareResult(activeHand.total, dealer.total)
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

function compareResult(firstTotal, secondTotal) {
    console.log('compareResult() is running...')

    if (activeHand === splitHand) {
        // this is a splitHand comparison. we need to also check the splitHand 
        compareSplitResult()
        return
    }

    if (firstTotal - secondTotal === 0) {
        // TIE
        console.log(`IT'S A TIE`)
        wallet += bet
        displayResult.innerText = `Push`
    } else if (firstTotal - secondTotal < 0) {
        // WIN
        console.log(`PLAYER WINS`)
        wallet += bet * 2
        displayResult.innerText = `You Win`
    } else { 
        // LOSE if positive integer
        console.log(`PLAYER LOSES`)
        displayResult.innerText = `You Lose`
    }
    setTimeout(displayFunds, 500)
    setTimeout(showResultScreen, 500)
}

function compareSplitResult() {
    if (playerStandTotal > 21 && splitStandTotal > 21) {
        console.log('you BUST both')
        displayResult.innerText = `Both Hands Bust`
        return
    }
    
    if (playerStandTotal > 21) {
        console.log('you BUST both')
        displayResult.innerText = `Both Hands Win`
    } else if (splitStandTotal > 21) {

    }

    if (!playerStandTotal && !splitStandTotal ) {
        // you lose both
        console.log('you LOSE both')
        displayResult.innerText = `Both Hands Lose`
    } else if (playerStandTotal && splitStandTotal) {
        // you win both
        console.log('you WIN both')
        displayResult.innerText = `Both Hands Win`
    } else {
        // you win one
        console.log('you WIN one')
        displayResult.innerText = `One Hand Won`
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