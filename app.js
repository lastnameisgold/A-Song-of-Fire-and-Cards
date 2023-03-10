/////////////////////////
// Variables

const body = document.querySelector('body');
const newGameBtn = document.querySelector('.new-game-btn');
const dismissBtn = document.querySelector('.dismiss-btn');
const startGameBtn = document.querySelector('.start-game-btn')
const darkModeBtn = document.querySelector('.dark-mode-btn');
const darkModeIcon = document.querySelector('.dark-mode-icon')
const modalContainer =document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const gameplayModalContainer =document.querySelector('.gameplay-modal-container');
const gameplayModal = document.querySelector('.gameplay-modal');

/////////////////////////
// Functions

// Game of Thrones API
const thronesAPIUrl = 'https://thronesapi.com/api/v2/Characters/'

// Main container with id of game
const game = document.getElementById('game')

let isPaused = false;
let firstPick = undefined;
let cardsMatch = undefined;

const loadCharacters = async () => {
    // Create a random set of cards
    const randomIds = new Set();
    while(randomIds.size < 10) {
        const randomNumber = Math.floor(Math.random() * 53);
        randomIds.add(randomNumber);
    }
    console.log([...randomIds]);

    const gotPromises = [...randomIds].map(id => fetch(thronesAPIUrl + id));
    const responses = await Promise.all(gotPromises);
    return await Promise.all(responses.map(res => res.json()));
}

const displayCharacter = (character) => {
    // Creates 2 of the same character
    character.sort( _ => Math.random() - 0.5);
    // Generates a card based on the values pulled from the API
    // Card gets placed into the HTML
    const gameHTML = character.map(character => {
        return `
            <div class="card" onclick="clickCard(event)" data-gotcharacter="${character.fullName}">
                <div class="back"></div>
                <div class="front rotated" style="background-image: url('${character.imageUrl}')">
                    <div class="background-image">
                        <div class="content-container">
                            <h3 class="character-name">${character.fullName}</h3>
                            <h5 class="character-title">${character.title}</h5>
                            <p class="character-family">${character.family}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('');
    game.innerHTML = gameHTML;
    // changeBackground();
}

/*
const backgroundOptions = [
    'https://www.xtrafondos.com/wallpapers/vertical/jon-snow-con-dragon-de-juego-de-tronos-4921.jpg',
    'https://www.xtrafondos.com/wallpapers/vertical/tyrion-y-drogon-de-juego-de-tronos-2070.jpg',
    'https://www.xtrafondos.com/wallpapers/vertical/juego-de-tronos-personajes-en-trono-de-hierro-3190.jpg'
]


const changeBackground = () => {
    const changeBg = document.querySelectorAll('.back');
    for (let i = 0 ; i < changeBg.length ; i++) {
        const imageUrl = backgroundOptions[i % backgroundOptions.length];
        changeBg[i].style.backgroundImage = `url(${imageUrl})`;        
    }
}
console.log(changeBackground);

newGameBtn.addEventListener('click', changeBackground);
*/

// Click to flip card
const clickCard = (event) => {
    const gotCard = event.currentTarget;
    const [front, back] = getFrontAndBack(gotCard);

    if(back.classList.contains('rotated') || isPaused)  return;

    isPaused = true;

    rotateElements([front, back]);
    
    if(!firstPick) {
        firstPick = gotCard;
        isPaused = false;
    }else {
        const secondGotCharacter = gotCard.dataset.gotcharacter;
        const firstGotCharacter = firstPick.dataset.gotcharacter;
        if(firstGotCharacter != secondGotCharacter) {
            const [firstBack, firstFront] = getFrontAndBack(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstBack, firstFront]);
                firstPick = null;
                isPaused = false;
            }, 1000)
        }else {
            cardsMatch++;
            if(cardsMatch === 10) {
                // Show modal when the player wins
                setTimeout(() => { 
                    modalContainer.classList.add('show')
                }, 800);
                setTimeout(() => {
                    modal.classList.add('show')
                }, 1000);
                // Click dismiss button to close modal
                dismissBtn.addEventListener('click', () => {
                    modalContainer.classList.remove('show')
                    modal.classList.remove('show')
                });
                // Click outside of modal to close modal
                modalContainer.addEventListener('click', () => {
                    modalContainer.classList.remove('show')
                    modal.classList.remove('show')
                });
            }
            firstPick = null;
            isPaused = false;
        }
    }
}

// Rotate cards
const rotateElements = (elements) => {
    if(typeof elements != 'object' || !elements.length) return
    elements.forEach(element => element.classList.toggle('rotated'));
}


const getFrontAndBack = (card) => {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back];
}

// Toggle dark mode for different parts of the UI
function toggleDarkMode() {
    body.classList.toggle("dark-mode");
    newGameBtn.classList.toggle("dark-mode");
    dismissBtn.classList.toggle("dark-mode");
    modal.classList.toggle("dark-mode");
    darkModeBtn.classList.toggle("dark-mode");
    if (darkModeIcon.innerText === "dark_mode") {
        darkModeIcon.innerText = "light_mode";
    } else {
        darkModeIcon.innerText = "dark_mode";
    }
}

// Reset game
const resetGame = () => {
    const character = loadCharacters();
    displayCharacter([character, character]);
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    cardsMatch = 0;
    setTimeout(async() => {
        const character = await loadCharacters();
        displayCharacter([...character, ...character]);
        isPaused = false;
    }, 200);
}
resetGame();


/////////////////////////
// Event Listeners

// Click button to start a new game
newGameBtn.addEventListener('click', () => {
    resetGame();
});

// Dark mode button
darkModeBtn.addEventListener('click', () => {
    toggleDarkMode();
});

startGameBtn.addEventListener('click', () => {
    gameplayModalContainer.classList.add('hide')
    gameplayModal.classList.add('hide')
});

/////////////////////////
// Sources
// 1. GoT Character API - https://thronesapi.com/
// 2. GoT Font - https://www.onlinewebfonts.com/download/97c4b25dc74e0ab045154e75a8fdd69d
// 3. Building a JavaScript Memory Match Game - https://www.jamesqquick.com/blog/build-a-javascript-memory-match-game/
// 4. Create a Modal (Popup) with HTML/CSS and JavaScript - https://youtu.be/XH5OW46yO8I

// Pseudo code
// When the game starts the cards positions should be randomized ???
// There should be 2 images of the same type so the user can find the matches ???
// When a user clicks on a card, the card should flip to reveal the front of the card ???
// The user can click on another card to flip it and see if it's a match ???
// If it's a match, both cards remain flipped. If it's not a match, both card will go back to face down ???
// When the user clicks on new game, the cars should be randomize to start a new game ???
// Any flipped cards should go back to facing down when a new game is restarted ???
// When the user wins a modal should appear telling the player they won! ???

// When you first come in, there are no cards on the gameboard
// Text input of numbers. Create and map a number of cards/divs whatever the input.value is.
// If input is not a value, add a message for this is not a number
// Start with a message and a button that creates a number of cards

// Post MVP features
// let result
// const time
// A sound will play when cards are clicked
// A sound will play when both cards match


// Instructions for how to play the game
// Like a modal screen to display 
