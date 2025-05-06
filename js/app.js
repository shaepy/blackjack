/* --------------------------------------- Constants -------------------------------------- */

// Message elements
const tempMessageDiv = document.querySelector('#temp-msg')

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
const displayH2Result = document.querySelector('#result h2')
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
const splitButton = document.querySelector('#split')

splitButton.addEventListener('click', splitCards)

// when we split
// highlight hand 1
// border when the hand is active

const firstHandDiv = document.querySelector('#split-view-1')
const secondHandDiv = document.querySelector('#split-view-2')

// have a class with a border
// .cards-border
// when splitcards is called
// activate the border class to player-cards
// when we switch the activeHand, switch the border classes
// remove from player-cards, add to split-cards

function splitCards() {
    console.log('player presses split button')

    // deduct bet from wallet
    console.log('your current bet:', bet, 'your current wallet:', wallet)
    wallet -= bet
    bet += bet
    console.log('your bet now:', bet, 'your wallet now:', wallet)
    displayFunds()

    createMsgString('Your cards have been split')
    turnDisplayToFlex([splitCardsViewDiv])
    turnDisplayToNone([splitButton])

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
            element.innerText = ''
        }, 1000)
    }, 2000)
}

function createMsgString(string) {
    const pElement = document.createElement('p')
    pElement.innerText = string
    tempMessageDiv.append(pElement)
    handleFadeMsg(tempMessageDiv)
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
    const resetDisplays = [
        displayH2Result,
        displayDealerCards, 
        displayDealerTotal, 
        displayPlayerCards, 
        displayPlayerTotal,
        displaySplitCards,
        displaySplitTotal
    ]
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
        createMsgString('Your wallet is too low. Reset to add funds')
        return
    } else if (bet < 10) {
        createMsgString('Choose a bet amount to start a game')
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
        createMsgString('Your wallet is too low. Reset to add funds')
        return
    } else if (bet < 10) {
        createMsgString('Choose a bet amount to start a game')
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
    const splitcard1 = cardDeck.find(c => c.rank === '3' && c.suit === 'spade')
    const splitcard2 = cardDeck.find(c => c.rank === '3' && c.suit === 'heart')
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
        if (wallet < bet) {
            console.log('not enough in wallet to split cards')
            createMsgString('You do not have enough funds to split your cards')
            return
        }
        splitButton.style.display = 'flex'
    }
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
            createMsgString(`Your Ace value has changed from 11 to 1`)
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
        displayH2Result.innerText = 'Blackjack! You Win'
        wallet += bet + (bet * 1.5)
        setTimeout(revealHiddenCard, 300)
        setTimeout(displayFunds, 450)
        setTimeout(showResultScreen, 450)
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

    if (player.cards.length > 2) splitButton.style.display = 'none'

    activeHand.hitCardIdx = activeHand.cards.findIndex((card) => card === newCard)
    addCardTotal()
    displayCards()
    console.log('total is now:', activeHand)
    // if 21, autostand
    if (activeHand.total === 21) {
        // !TODO USER FACING MESSAGE OR ANIMATION, AUTO STAND
        createMsgString('Stand on 21')
        stand()
        return
    }
    // check for bust
    checkForBust(activeHand)
}

// this takes a player total and a dealer total to check for bust
function checkForBust(hand) {

    // BOTH SPLIT HANDS BUST
    if (player.total > 21 && splitHand.total > 21) {
        // auto lose, skip dealer turn
        console.log('BOTH HANDS BUST')
        bet = bet / 2
        revealHiddenCard()
        showResultScreen()
        displayH2Result.innerText = `Both Hands Bust`
        return
    }

    // is it player or dealer?
    if (hand === activeHand && hand.total > 21) {
        console.log('this hand is a player and a BUST')
        // check if this hand is split
        if (splitHand.cards.length > 0) {
            console.log('this is a SPLIT with a bust. auto standing now')
            // !TODO USER FACING MESSAGE OR ANIMATION, AUTO STAND
            createMsgString('Bust')
            stand()
            return
        } 
        // proceed as normal
        setTimeout(revealHiddenCard, 300)
        setTimeout(showResultScreen, 450)
        displayH2Result.innerText = `You Bust`
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
    setTimeout(() => {
        displayDealerCards.append(dealerHitCard)
        displayDealerTotal.innerText = dealer.total
    }, 300)
}

// * to get to compareResult() that means player DID NOT BUST
function compareResult(firstTotal, secondTotal) {
    console.log('compareResult() is running...')
    if (activeHand === splitHand) {
        // this is a splitHand comparison
        compareSplitResult()
        return
    }
    const isDealerBust = dealer.total > 21
    if (isDealerBust || firstTotal - secondTotal > 0) {
        // WIN
        wallet += bet * 2
        displayH2Result.innerText = 'You Win'
    } else if (firstTotal - secondTotal === 0) {
        // TIE
        console.log(`IT'S A TIE`)
        wallet += bet
        displayH2Result.innerText = `Push`
    } 
    else { 
        // LOSE
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
    console.log('revealHiddenCard(), showing dealers 2nd card')
    const hiddenCard = document.querySelector('#hidden-card')
    if (hiddenCard) hiddenCard.src = dealer.cards[1].src
    displayDealerTotal.innerText = dealer.total
}

function showResultScreen() {
    console.log('showResultScreen(), showing elements')
    turnDisplayToFlex([resultDiv, playAgainButtons])
    turnDisplayToNone([actionsBar])
    secondHandDiv.classList.remove('cards-border')

    // this changes the bet display to 0
    betAmount[0].innerText = '0'
    // check for high score
    if (wallet > score) {
        score = wallet
        console.log('wallet is greater than 0, so score is now:', score)
        turnDisplayToFlex([gameScoreDiv, homeScoreDiv])
        createMsgString(`Your high score is now ${score}`)
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