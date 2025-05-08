/* --------------------------------------- Constants -------------------------------------- */
// Card flip
const divToAddCardFlip = document.querySelector('#flip-animation-here')

// Logo elemenets
const largeLogo = document.querySelector('#large-logo')
const smallLogo = document.querySelector('#small-logo')

// Display elements
const bodyElement = document.querySelector('body')
const actionsBar = document.querySelector('#actions')
const resultDiv = document.querySelector('#result')
const gameTable = document.querySelector('#game-table')
const gameBank = document.querySelector('#game-bank')
const homeScreen = document.querySelector('#home-screen')
const playAgainButtons = document.querySelector('#play-again-buttons')
const resetWallet = document.querySelector('#reset-wallet')

// Cards, result, handTotal elements
const displayDealerCards = document.querySelector('#dealer-cards')
const displayPlayerCards = document.querySelector('#player-cards')
const displayH2Result = document.querySelector('#result h2')
const displayDealerTotal = document.querySelector('#dealer-total')
const displayPlayerTotal = document.querySelector('#player-total')

// High score displays
const gameScoreDiv = document.querySelector('#game-score')
const homeScoreDiv = document.querySelector('#home-score')

// Split feature elements
const displaySplitCards = document.querySelector('#splitHand-cards')
const displaySplitTotal = document.querySelector('#splitHand-total')
const firstHandDiv = document.querySelector('#split-view-1')
const secondHandDiv = document.querySelector('#split-view-2')
const splitButton = document.querySelector('#split')
const doubleButton = document.querySelector('#double')
const hitButton = document.querySelector('#hit')
const standButton = document.querySelector('#stand')

// To check if local server or remote
const srcUrl = window.location.hostname === '127.0.0.1' ? '' : '/pixeljack';

/* --------------------------------------- Variables -------------------------------------- */

let dealer = {cards: [], total: 0, hitCardIdx: 0}
let player = {cards: [], total: 0, hitCardIdx: 0}
let splitHand = {cards: [], total: 0, hitCardIdx: 0}

let activeHand = player
let bet = score = 0
let wallet = 200

/* ------------------------------------ Event Listeners ------------------------------------ */

// play button - start game
document.querySelector('#start-game').addEventListener('click', () => {
    console.log('player pressed play from bet screen. START')
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        createTempMsg('Your wallet is too low. Reset to add gold')
        return
    } else if (bet < 10) {
        createTempMsg('Choose a bet amount to start a game')
        return
    }
    bodyElement.style.backgroundImage = `url("${srcUrl}/img/assets/dealer-bg.png")`;
    turnDisplayToNone([homeScreen, largeLogo, playAgainButtons, resetWallet])
    turnDisplayToFlex([gameTable, smallLogo, gameBank, actionsBar])
    startGame()
})

// go to change bet screen
document.querySelector('#change-bet').addEventListener('click', () => {
    resetGame()
    turnDisplayToNone([gameTable, resultDiv, smallLogo, secondHandDiv])
    turnDisplayToFlex([homeScreen, largeLogo])
    bodyElement.style.backgroundImage = `url("${srcUrl}/img/assets/pixel-casino-floor-bg.png")`;
    if (wallet < bet) resetWallet.style.display = 'flex'
})

// play again 
document.querySelector('#play-again').addEventListener('click', () => {
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        createTempMsg('Your wallet is too low. Reset to add gold')
        return
    } else if (bet < 10) {
        createTempMsg('Choose a bet amount to start a game')
        return
    }
    resetGame()
    turnDisplayToNone([resultDiv, playAgainButtons, resetWallet, secondHandDiv])
    turnDisplayToFlex([actionsBar])
    startGame()
})

// toggle instructions - info icon
document.querySelector('#info-button').addEventListener('click', () => {
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
})

// split feature
splitButton.addEventListener('click', () => {
        console.log('player presses split button')
        console.log('your current bet:', bet, 'your current wallet:', wallet)
    
        // deduct bet from wallet
        wallet -= bet
        bet += bet
        console.log('your bet now:', bet, 'your wallet now:', wallet)
        displayFunds()
    
        createTempMsg('Your cards have been split')
        turnDisplayToFlex([secondHandDiv])
    
        setDisableAttr([splitButton, doubleButton])
    
        splitHand.cards.push(player.cards.pop())
        document.querySelectorAll('#player-cards img')[1].remove()
        
        // reset totals
        splitHand.total = player.total = 0
        // display border
        firstHandDiv.classList.add('cards-border')
    
        // deal cards FOR SPLIT HAND
        player.cards.push(getCard())
        splitHand.cards.push(getCard())
        addCardTotal()
        displaySplitTotal.innerText = splitHand.total
        displayPlayerTotal.innerText = player.total
        displayPlayerCards.append(createCardImg(player.cards[1]))
        displaySplitCards.append(createCardImg(splitHand.cards[0]), createCardImg(splitHand.cards[1]))
})

// double down feature
doubleButton.addEventListener('click', () => {
    console.log('player wants to double down')
    if (wallet < bet) {
        createTempMsg('Your wallet is too low to double your bet')
        return
    }
    setDisableAttr([splitButton])
    // add to bet, deduct from wallet
    console.log('bet is:', bet, 'wallet is:', wallet)
    wallet -= bet
    bet += bet
    console.log('bet is now:', bet, 'wallet is now:', wallet)
    displayFunds()
    hit()
    console.log('player hand:', player)
    // we only want this to happen if checkforbust does not happen
    if (!checkForBust(activeHand)) {
        console.log('player did not bust')
        stand()
    }
    // back to original bet after results
    bet = bet / 2
    console.log('bet is now:', bet, 'wallet is now:', wallet)
})

// player actions
hitButton.addEventListener('click', hit)
standButton.addEventListener('click', stand)


/* --------------------------------------- Bet Mechanic -------------------------------------- */

// reset wallet and displayFunds()
resetWallet.addEventListener('click', () => {wallet = 200, displayFunds()})

const h3betAmounts = document.querySelectorAll('.bet-amnt h3')
const h3walletAmounts = document.querySelectorAll('.wallet-amnt h3')

document.querySelectorAll('.bet').forEach(b => b.addEventListener('click', (e) => {
    bet = Number(e.target.dataset.bet)
    displayFunds()
}))

function displayFunds() {
    h3betAmounts.forEach(amnt => amnt.innerText = bet)
    h3walletAmounts.forEach(amnt => amnt.innerText = wallet)
}

/* --------------------------------------- Start/Reset Game --------------------------------------- */

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
    // reset activehand if split
    if (activeHand === splitHand) activeHand = player
    dealer.cards = []
    player.cards = []
    splitHand.cards = []
    dealer.total = player.total = splitHand.total = 0
    const resetDisplays = [
        displayH2Result,
        displayDealerTotal, 
        displayPlayerCards, 
        displayPlayerTotal,
        displaySplitCards,
        displaySplitTotal
    ]
    resetDisplays.forEach(div => div.innerText = '')
    removeDisableAttr([hitButton, standButton])
    // reset dealer cards
    divToAddCardFlip.classList.remove("flip-card-inner")
    document.querySelector('#hidden-card').remove()
    document.querySelectorAll('#dealer-cards img.dealer-card').forEach(img => img.remove())
}

function shuffle() {
    console.log('shuffle() is running...')
    cardDeck.forEach(card => {
        card.hasBeenPlayed = false
        if (card.rank === 'ace') card.value = 11, card.aceValueChanged = false
    })
}

/* --------------------------------------- Gameplay --------------------------------------- */

function getCard() {
    console.log('getCard() is running')
    const cardDeckCopy = cardDeck.filter((card) => card.hasBeenPlayed === false)
    const x = Math.floor(Math.random() * cardDeckCopy.length)
    const matchIdx = cardDeck.findIndex((card) => card === cardDeckCopy[x])
    cardDeck[matchIdx].hasBeenPlayed = true
    return cardDeckCopy[x]
}

function dealCards() {
    dealer.cards.push(getCard(), getCard())
    player.cards.push(getCard(), getCard())

    // * split cards
    // const splitcard1 = cardDeck.find(c => c.rank === '5' && c.suit === 'spade')
    // const splitcard2 = cardDeck.find(c => c.rank === '5' && c.suit === 'heart')
    // player.cards.push(splitcard1, splitcard2)

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
        console.log('player can split. matching ranks found')
        if (wallet < bet) {
            console.log('not enough in wallet to split cards')
            createTempMsg('You do not have enough funds to split your cards')
            return
        }
        removeDisableAttr([splitButton])
    }
}

function changeAceValues(handOfCards) {
    const aceIdx = handOfCards.findIndex(card => card.rank === 'ace' && !card.aceValueChanged)
    // if an ace is returned (aceIdx is not -1)
    if (aceIdx !== -1) {
        console.log('there is an ace we can change:', handOfCards[aceIdx])
        handOfCards[aceIdx].value = 1
        handOfCards[aceIdx].aceValueChanged = true
        console.log('changed!', handOfCards[aceIdx])
        if (handOfCards === activeHand.cards) {
            console.log('this is a player')
            player.total -= 10
            createTempMsg(`Your Ace value has changed from 11 to 1`)
        } else {
            console.log('this is dealer')
            dealer.total -= 10
        }
        console.log('ace changed:', handOfCards[aceIdx], player.total, dealer.total)
    } else {
        // remove later
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
        displayH2Result.innerText = 'Pixeljack! You Win'
        wallet += bet + (bet * 1.5)
        setTimeout(revealHiddenCard, 300)
        setTimeout(displayFunds, 450)
        setTimeout(showResultScreen, 450)
    } else if (player.total === 21 && dealer.total === 21) stand()
}

function displayCards() {
    if (displayPlayerCards.innerHTML === '') {
        console.log('displayCards() for the dealt cards')

        const hiddenCard = createCardImg(dealer.cards[0])
        hiddenCard.id = 'hidden-card'
        document.querySelector('.flip-card-front').append(hiddenCard)

        const dealer2ndCard = createCardImg(dealer.cards[1])
        dealer2ndCard.classList.add('dealer-card')
        displayDealerCards.append(dealer2ndCard)

        displayPlayerCards.append(createCardImg(player.cards[0]), createCardImg(player.cards[1]))

        displayDealerTotal.innerText = dealer.cards[1].value
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
    const newCard = getCard()
    activeHand.cards.push(newCard)
    console.log('new card added:', activeHand)

    if (player.cards.length > 2) setDisableAttr([splitButton, doubleButton])

    // if you hit while a split button is active, this means you did not split

    activeHand.hitCardIdx = activeHand.cards.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    console.log('total is now:', activeHand)
    // if 21, autostand
    if (activeHand.total === 21) {
        // !TODO USER FACING MESSAGE OR ANIMATION, AUTO STAND. REPLACE MSG STRING
        createTempMsg('Stand on 21')
        stand()
        return
    }
    // check for bust
    checkForBust(activeHand)
}

function checkForBust(hand) {
    if (player.total > 21 && splitHand.total > 21) {     // BOTH SPLIT HANDS BUST
        // auto lose, skip dealer turn
        console.log('BOTH HANDS BUST')
        bet = bet / 2
        revealHiddenCard()
        showResultScreen()
        displayH2Result.innerText = `Both Hands Bust`
        return
    }

    if (hand.total > 21) {
        console.log('this hand is a player and a BUST')
        // check if this hand is split
        if (splitHand.cards.length > 0) {
            console.log('this is a SPLIT with a bust. auto standing now')
            // !TODO USER FACING MESSAGE OR ANIMATION, AUTO STAND. REPLACE MSG STRING
            createTempMsg('Bust')
            stand()
            return
        } 
        // proceed as normal
        setTimeout(revealHiddenCard, 300)
        setTimeout(showResultScreen, 450)
        displayH2Result.innerText = `You Bust`
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
        firstHandDiv.classList.remove('cards-border')
        secondHandDiv.classList.add('cards-border')
        return
    }

    setDisableAttr([hitButton, standButton, doubleButton])
    // dealer's turn
    setTimeout(revealHiddenCard, 300)
    while (dealer.total <= 16) dealerHit()
    compareResult(activeHand.total, dealer.total)
}

function dealerHit() {
    console.log('total is <=16. dealerHit')
    const newCard = getCard()
    dealer.cards.push(newCard)
    dealer.hitCardIdx = dealer.cards.findIndex((card) => card === newCard)
    addCardTotal()
    // display dealer card
    const dealerHitCard = createCardImg(dealer.cards[dealer.hitCardIdx])
    dealerHitCard.classList.add('dealer-card')
    setTimeout(() => {
        displayDealerCards.append(dealerHitCard)
        displayDealerTotal.innerText = dealer.total
    }, 300)
}

// to get to compareResult() that means player DID NOT BUST
function compareResult(firstTotal, secondTotal) {
    console.log('compareResult() is running...')
    if (activeHand === splitHand) { // this is a splitHand comparison
        compareSplitResult()
        return
    }

    const isDealerBust = dealer.total > 21
    if (isDealerBust || firstTotal - secondTotal > 0) {
        console.log(`PLAYER WINS`)
        wallet += bet * 2
        displayH2Result.innerText = 'You Win'
    } else if (firstTotal - secondTotal === 0) {
        console.log(`IT'S A TIE`)
        wallet += bet
        displayH2Result.innerText = `Push`
    } 
    else { 
        console.log(`PLAYER LOSES`)
        displayH2Result.innerText = `You Lose`
    }
    setTimeout(displayFunds, 450)
    setTimeout(showResultScreen, 450)
}

function compareSplitResult() {
    const isPlayerBust = player.total > 21
    const isSplitBust = splitHand.total > 21
    const isDealerBust = dealer.total > 21

    function compareHands(handTotal, label) {
        if (isDealerBust || handTotal - dealer.total > 0) {
            wallet += bet
            displayH2Result.innerHTML += ` ${label} Wins<br>`
        } else if (handTotal - dealer.total === 0) {
            wallet += bet / 2
            displayH2Result.innerHTML += ` ${label} Push<br>`
        } else {
            displayH2Result.innerHTML += ` ${label} Loses<br>`
        }
    }

    if (!isPlayerBust) {compareHands(player.total, '1st Hand')}
    if (!isSplitBust) {compareHands(splitHand.total, '2nd Hand')}
    // set bet back to regular amount before split
    bet = bet / 2
    setTimeout(displayFunds, 450)
    setTimeout(showResultScreen, 450)
}

function revealHiddenCard() {
    divToAddCardFlip.classList.add("flip-card-inner")
    displayDealerTotal.innerText = dealer.total
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar])
    secondHandDiv.classList.remove('cards-border')
    // this changes the game screen bet display to 0
    h3betAmounts[0].innerText = '0'

    // check if double was disabled
    if (doubleButton.disabled === true) removeDisableAttr([doubleButton])

    // check for high score
    if (wallet > score) {
        score = wallet
        console.log('wallet is greater than 0, so score is now:', score)
        turnDisplayToFlex([gameScoreDiv, homeScoreDiv])
        createTempMsg(`Your high score is now ${score}`)
        document.querySelectorAll('.high-score').forEach(display => display.innerText = score)
    }
}

/* --------------------------------------- UI / Visuals -------------------------------------- */
// this takes a card object and creates a card image HTML element to display
function createCardImg(card) {
    const cardImage = document.createElement('img')
    cardImage.classList.add('card')
    cardImage.alt = `${card.suit} ${card.rank}`
    cardImage.src = card.src
    return cardImage
}

// this takes an element and applies the fade in/fade out transition
function handleFadeEffect(element) {
    console.log('handling temporary message')
    element.style.display = 'flex'
    requestAnimationFrame(() => element.classList.add('fade-in'))
    setTimeout(() => {
        element.classList.remove('fade-in')
        element.classList.add('fade-out')
        setTimeout(() => {
            element.style.display = 'none'
            element.classList.remove('fade-out')
            element.innerText = ''
        }, 1000)
    }, 2000)
}

function createTempMsg(string) {
    const pElement = document.createElement('p')
    pElement.innerText = string
    const tempMessageDiv = document.querySelector('#temp-msg')
    tempMessageDiv.append(pElement)
    handleFadeEffect(tempMessageDiv)
}

// these functions take an array, turn the display of each element to either flex or none
const turnDisplayToFlex = (arr) => arr.forEach(el => el.style.display = 'flex')
const turnDisplayToNone = (arr) => arr.forEach(el => el.style.display = 'none')

// these will take an array and remove or set the 'disabled' attribute for each element
const setDisableAttr = (arr) => arr.forEach(el => {
    if (el.disabled === false) el.setAttribute('disabled', '')
})
const removeDisableAttr = (arr) => arr.forEach(el => {
    if (el.disabled === true) el.removeAttribute('disabled')
})

/* --------------------------------------- Execute on Start -------------------------------------- */

displayFunds()