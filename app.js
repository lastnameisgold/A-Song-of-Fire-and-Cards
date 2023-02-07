/////////////////////////
// Sources
// 1. GoT Character API - https://thronesapi.com/
// 2. GoT Font - https://www.onlinewebfonts.com/download/97c4b25dc74e0ab045154e75a8fdd69d
// 3.

/////////////////////////
// Variables
const newGame = document.querySelector('#new-game-btn')
const cardTheme = document.querySelector('#select-theme')
const systemTheme = document.querySelector('#toggle-system-theme')
const gameCard = document.querySelector('.got-card')

/////////////////////////////////////
// Create a card with child elements and place it into html > body > main

const main = document.querySelector('main');

// Card
const gotCard = document.createElement('div')
gotCard.classList.add('got-card')

// Character background image
const backgroundImageDiv = document.createElement('div')
backgroundImageDiv.classList.add('got-card')

// Content container
const contentContainerDiv = document.createElement('div')
contentContainerDiv.classList.add('content-container')

// Character name
let name = document.createElement('h3')
name.classList.add('character-name')
name.textContent = "";
contentContainerDiv.appendChild(name);

// Character title
let title = document.createElement('h5')
title.classList.add('character-title')
title.textContent = "";
contentContainerDiv.appendChild(title);

// Character family
let family = document.createElement('p')
family.classList.add('character-family')
family.textContent = "";
contentContainerDiv.appendChild(family);

// Append 
gotCard.appendChild(backgroundImageDiv)
backgroundImageDiv.appendChild(contentContainerDiv)
main.appendChild(gotCard)

////////////////////////////////////

let gotCharacters = []
let randomCharacter = []

// Post MVP features
// let result
// const time



/////////////////////////
// Functions

async function getData(e) {
    event.preventDefault()
    const url = 'https://thronesapi.com/api/v2/Characters'
    console.log(url)

    fetch(url)
    .then(res => {
        return res.json()
    })
    .then(res => {
        // This is where the content will be pulled

        res.forEach(character => {
            gotCharacters.push(character.name)
        })
        
        let randomIndex = Math.floor(Math.random() * gotCharacters.length)
        let randomCharacter = gotCharacters[randomIndex]
        console.log(randomIndex)

        // Character Background Image Div ✅
        let characterImage = document.querySelector('.background-image')
        characterImage.style.backgroundImage = `url('${res[randomIndex].imageUrl}')`
        console.log(characterImage)
  
        // Character Name ✅
        let characterName = document.querySelector('.character-name')
        characterName.innerText = res[randomIndex].fullName
        console.log(characterName)

        // Character Title ✅
        let characterTitle = document.querySelector('.character-title')
        characterTitle.innerText = res[randomIndex].title
        console.log(characterTitle)

        // Character Family ✅
        let characterFamily = document.querySelector('.character-family')
        characterFamily.innerText = res[randomIndex].family
        console.log(characterFamily)

    })
    .catch(err => {
        console.log('something went wrong...', err)
    })
}

gameCard.addEventListener('click', getData)

// When the game starts the cards positions should be randomized
// There should be 2 images of the same type so the user can find the matches
// When a user clicks on a card, the card should flip to reveal the front of the card
// The user can click on another card to flip it and see if it's a match
// If it's a match, both cards remain flipped. If it's not a match, both card will go back to face down
// A sound will play when cards are clicked
// A sound will play when both cards match
// When the user clicks on new game, the cars should be randomize to start a new game
// Any flipped cards should go back to facing down when a new game is restarted
// When the user wins a modal should appear telling the player they won!


/////////////////////////
// Event Listeners


// Pseudo code
// When you first come in, there are no cards on the gameboard
// Text input of numbers. Create and map a number of cards/divs whatever the input.value is.
// If input is not a value, add a message for this is not a number
// Start with a message and a button that creates a number of cards