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

// Player actions
const hitButton = document.querySelector('#hit')
const standButton = document.querySelector('#stand')
const doubleButton = document.querySelector('#double')
const splitButton = document.querySelector('#split')
const actionButtons = document.querySelectorAll('#actions button')

// To check if local server or remote
const srcUrl = window.location.hostname === '127.0.0.1' ? '' : '/pixeljack';

/* --------------------------------------- Variables -------------------------------------- */

let dealer = {cards: [], total: 0, hitCardIdx: 0, isBust: false}
let player = {cards: [], total: 0, hitCardIdx: 0, isBust: false}
let splitHand = {cards: [], total: 0, hitCardIdx: 0, isBust: false}
const allHands = [player, dealer, splitHand]

let activeHand = player
let bet = score = 0
let wallet = 200

/* --------------------------------------- Audio -------------------------------------- */

const selectCoinSound = new Audio('/assets/audio/chips-stack.mp3')
const dealingCardsSound = new Audio('/assets/audio/cards-being-dealt.mp3')
const playerWinSound = new Audio('/assets/audio/pixel-coin-collect-win.mp3')
const playerBustSound = new Audio('/assets/audio/pixeljack-bust.mp3')
const hitCardSound = new Audio('/assets/audio/card-hit.mp3')
const splitCardSound = new Audio('/assets/audio/card-split.mp3')
const blackjackSound = new Audio('/assets/audio/pixeljack.mp3')
const playerLoseSound = new Audio('/assets/audio/player-lose.mp3')
const playerPushSound = new Audio('/assets/audio/player-push.mp3')

/* ------------------------------------ Event Listeners ------------------------------------ */

document.querySelector('#start-game').addEventListener('click', () => {
    if (wallet < bet) {
        resetWallet.style.display = 'flex'
        createTempMsg('Your wallet is too low. Reset to add gold')
        return
    } else if (bet < 10) {
        createTempMsg('Choose a bet amount to start a game')
        return
    }
    bodyElement.style.backgroundImage = `url("${srcUrl}/assets/img/dealer-bg.png")`;
    turnDisplayToNone([homeScreen, largeLogo, playAgainButtons, resetWallet])
    turnDisplayToFlex([gameTable, smallLogo, gameBank, actionsBar])
    dealingCardsSound.play()
    startGame()
})

document.querySelector('#change-bet').addEventListener('click', () => {
    resetGame()
    turnDisplayToNone([gameTable, resultDiv, smallLogo, secondHandDiv])
    turnDisplayToFlex([homeScreen, largeLogo])
    bodyElement.style.backgroundImage = `url("${srcUrl}/assets/img/pixel-casino-floor-bg.png")`;
    if (wallet < bet) resetWallet.style.display = 'flex'
})

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

document.querySelector('#info-button').addEventListener('click', () => {
    const instructions = document.querySelector('#instructions')
    if (window.getComputedStyle(instructions).display === 'flex') {
        instructions.style.display = 'none'
    } else {instructions.style.display = 'flex'}
})

splitButton.addEventListener('click', () => {
    // deduct bet from wallet
    wallet -= bet
    bet += bet
    displayFunds()
    createTempMsg('Your cards have been split')
    turnDisplayToFlex([secondHandDiv])
    setDisableAttr([splitButton, doubleButton])
    splitHand.cards.push(player.cards.pop())
    document.querySelectorAll('#player-cards img')[1].remove()
    splitHand.total = player.total = 0
    firstHandDiv.classList.add('cards-border')
    // deal cards FOR SPLIT HAND
    player.cards.push(getCard())
    splitHand.cards.push(getCard())
    addCardTotal()
    displaySplitTotal.innerText = splitHand.total
    displayPlayerTotal.innerText = player.total
    displayPlayerCards.append(createCardImg(player.cards[1]))
    displaySplitCards.append(createCardImg(splitHand.cards[0]), createCardImg(splitHand.cards[1]))
    splitCardSound.play()
})

doubleButton.addEventListener('click', () => {
    if (wallet < bet) {
        createTempMsg('Your wallet is too low to double your bet')
        return
    }
    setDisableAttr([splitButton])
    // add to bet, deduct from wallet
    wallet -= bet
    bet += bet
    displayFunds()
    hit()
    if (!player.isBust) stand()
    // back to original bet after results
    bet = bet / 2
})

hitButton.addEventListener('click', hit)
standButton.addEventListener('click', stand)

/* --------------------------------------- Bet Mechanic -------------------------------------- */

resetWallet.addEventListener('click', () => {wallet = 200, displayFunds()})

const h3betAmounts = document.querySelectorAll('.bet-amnt h3')
const h3walletAmounts = document.querySelectorAll('.wallet-amnt h3')

document.querySelectorAll('.bet').forEach(b => b.addEventListener('click', (e) => {
    bet = Number(e.target.dataset.bet)
    selectCoinSound.play()
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
    if (window.getComputedStyle(instructions).display === 'flex') instructions.style.display = 'none'
}

function resetGame() {
    console.log('shuffling...')
    cardDeck.forEach(card => {
        card.hasBeenPlayed = false
        if (card.rank === 'ace') card.value = 11, card.aceValueChanged = false
    })
    if (activeHand === splitHand) activeHand = player
    allHands.forEach(hand => {
        hand.cards = []
        hand.total = 0
        hand.isBust = false
    })
    const resetDisplays = [
        displayH2Result,
        displayDealerTotal, 
        displayPlayerCards, 
        displayPlayerTotal,
        displaySplitCards,
        displaySplitTotal
    ]
    resetDisplays.forEach(div => div.innerText = '')
    removeDisableAttr([hitButton, standButton, doubleButton])
    // reset dealer cards
    divToAddCardFlip.classList.remove("flip-card-inner")
    document.querySelector('#hidden-card').remove()
    document.querySelectorAll('#dealer-cards img.dealer-card').forEach(img => img.remove())
}

/* --------------------------------------- Gameplay --------------------------------------- */

function getCard() {
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

    if (player.cards[0].rank === player.cards[1].rank) {
        if (wallet < bet) {
            createTempMsg('You do not have enough funds to split your cards')
            return
        }
        removeDisableAttr([splitButton])
    }
}

function checkForAce(hand) {
    const aceIdx = hand.cards.findIndex(card => card.rank === 'ace' && !card.aceValueChanged)
    if (aceIdx !== -1) {
        hand.cards[aceIdx].value = 1
        hand.cards[aceIdx].aceValueChanged = true
        if (hand === player || hand === splitHand) {
            hand.total -= 10
            createTempMsg(`Your Ace value has changed from 11 to 1`)
        } else {
            dealer.total -= 10
        }
    }
}

function addCardTotal() {
    allHands.forEach(hand => hand.total = hand.cards.reduce((acc, card) => acc + card.value, 0))
    if (dealer.total > 21) checkForAce(dealer)
    if (splitHand.total > 21) checkForAce(splitHand)
    if (player.total > 21) {
        if (player.cards[0].rank === 'ace' && player.cards[1].rank === 'ace' && player.cards.length < 3 && splitHand.total <= 0) {
            player.total = 12
            return
        }
        checkForAce(player)
        if (player.total > 21) checkForAce(player)
    }
}

function checkForBlackjack() {
    if (player.total === 21 && dealer.total < 21) {
        setDisableAttr(actionButtons)
        wallet += bet + (bet * 1.5)
        displayH2Result.innerText = 'Pixeljack! You Win'
        blackjackSound.play()
        setTimeout(revealHiddenCard, 300)
        setTimeout(displayFunds, 450)
        setTimeout(showResultScreen, 450)
    } else if (player.total === 21 && dealer.total === 21) stand()
}

function displayCards() {
    if (displayPlayerCards.innerHTML === '') {
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
    const newCard = getCard()
    activeHand.cards.push(newCard)
    hitCardSound.play()
    if (player.cards.length > 2) setDisableAttr([splitButton, doubleButton])
    activeHand.hitCardIdx = activeHand.cards.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    if (activeHand.total === 21) {
        createTempMsg('Stand on 21')
        stand()
        return
    }
    checkForBust(activeHand)
}

function checkForBust(hand) {
    const createBustTag = (div) => {
        const bustTag = document.createElement('span')
        bustTag.innerText = 'BUST'
        div.append(bustTag)
    }
    if (player.total > 21 && splitHand.total > 21) {
        player.isBust = true
        splitHand.isBust = true
        createBustTag(displaySplitTotal)
        compareSplitResult()
        return
    }
    if (hand.total > 21) {
        // check if this hand is split
        if (splitHand.cards.length > 0) {
            hand.isBust = true
            if (hand === player) {createBustTag(displayPlayerTotal)} 
            else {createBustTag(displaySplitTotal)}
            stand()
            return
        } 
        hand.isBust = true
        createBustTag(displayPlayerTotal)
        compareResult()
    }
}

function stand() {
    if (activeHand === player && splitHand.cards.length > 0) {
        activeHand = splitHand
        firstHandDiv.classList.remove('cards-border')
        secondHandDiv.classList.add('cards-border')
        return
    }
    // dealer's turn
    setDisableAttr(actionButtons)
    setTimeout(revealHiddenCard, 300)
    while (dealer.total <= 16) dealerHit()
    compareResult()
}

function dealerHit() {
    console.log('total is <=16. dealerHit() running')
    const newCard = getCard()
    dealer.cards.push(newCard)
    dealer.hitCardIdx = dealer.cards.findIndex((card) => card === newCard)
    addCardTotal()
    if (dealer.total > 21) dealer.isBust = true
    // display dealer card
    const dealerHitCard = createCardImg(dealer.cards[dealer.hitCardIdx])
    dealerHitCard.classList.add('dealer-card')
    setTimeout(() => {
        displayDealerCards.append(dealerHitCard)
        displayDealerTotal.innerText = dealer.total
    }, 300)
}

function compareResult() {
    console.log('compareResult() is running...')
    if (activeHand === splitHand) {
        compareSplitResult()
        return
    }
    if (player.isBust) {
        console.log('comparing result complete. player isBust')
        setDisableAttr(actionButtons)
        setTimeout(revealHiddenCard, 300)
        setTimeout(showResultScreen, 450)
        displayH2Result.innerText = `You Bust`
        playerBustSound.play()
        return
    }
    if (dealer.isBust|| player.total - dealer.total > 0) {
        wallet += bet * 2
        displayH2Result.innerText = 'You Win'
        playerWinSound.play()
    } else if (player.total - dealer.total === 0) {
        wallet += bet
        displayH2Result.innerText = `Push`
        playerPushSound.play()
    } else { 
        displayH2Result.innerText = `You Lose`
        playerLoseSound.play()
    }
    setTimeout(displayFunds, 450)
    setTimeout(showResultScreen, 450)
}

function compareSplitResult() {
    if (player.isBust && splitHand.isBust) {
        setDisableAttr(actionButtons)
        setTimeout(revealHiddenCard, 300)
        setTimeout(showResultScreen, 450)
        displayH2Result.innerText = `Both Hands Bust`
        playerBustSound.play()
        bet = bet / 2
        return
    }
    function compareHands(handTotal, label) {
        if (dealer.isBust || handTotal - dealer.total > 0) {
            wallet += bet
            displayH2Result.innerHTML += ` ${label} Wins<br>`
            playerWinSound.play()
        } else if (handTotal - dealer.total === 0) {
            wallet += bet / 2
            displayH2Result.innerHTML += ` ${label} Push<br>`
            playerPushSound.play()
        } else {
            displayH2Result.innerHTML += ` ${label} Loses<br>`
            playerLoseSound.play()
        }
    }
    if (!player.isBust) {compareHands(player.total, '1st Hand')}
    if (!splitHand.isBust) {compareHands(splitHand.total, '2nd Hand')}
    setTimeout(displayFunds, 450)
    setTimeout(showResultScreen, 450)
    // set bet back to regular amount before split
    bet = bet / 2
}

function revealHiddenCard() {
    divToAddCardFlip.classList.add("flip-card-inner")
    displayDealerTotal.innerText = dealer.total
}

function showResultScreen() {
    console.log('showResultScreen()')
    turnDisplayToFlex([resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar])
    secondHandDiv.classList.remove('cards-border')
    h3betAmounts[0].innerText = '0'
    // check for high score
    if (wallet > score) {
        score = wallet
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
    const tempMsgDiv = document.querySelector('#temp-msg')
    tempMsgDiv.append(pElement)
    handleFadeEffect(tempMsgDiv)
}

// these functions take an array, turn the display of each element to either flex or none
const turnDisplayToFlex = (arr) => arr.forEach(el => el.style.display = 'flex')
const turnDisplayToNone = (arr) => arr.forEach(el => el.style.display = 'none')

// these will take an array and remove or set the 'disabled' attribute for each element
const setDisableAttr = (arr) => arr.forEach(el => {if (el.disabled === false) el.setAttribute('disabled', '')})
const removeDisableAttr = (arr) => arr.forEach(el => {if (el.disabled === true) el.removeAttribute('disabled')})

/* --------------------------------------- Execute on Start -------------------------------------- */

displayFunds()