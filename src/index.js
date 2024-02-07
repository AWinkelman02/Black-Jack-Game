import _ from 'lodash';
import './style.css';
import { createDeck } from './components';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(response => response.json())
  .then(data => setDeck(data.deck_id));
});

const startGameButton = document.getElementById('startgame');

let deckID;
let playerCards = [];
let dealerCards = [];

function setDeck(deckData){
  deckID = deckData;
  return deckID
};

startGameButton.addEventListener('mousedown', () => {
  initializeGame();
  console.log(playerCards, dealerCards)
});

//hit button listener

//stay button listener

//setup player and dealer cards
async function initializeGame(){
  await dealCard().then( result => {playerCards.push(result.cards);});
  await dealCard().then( result => {dealerCards.push(result.cards);});
  await dealCard().then( result => {playerCards.push(result.cards);});
  await dealCard().then( result => {dealerCards.push(result.cards);});

    //show cards stored in arrays
    //remove start game button
    //place hit/stay buttons
}

//deal card logic
async function dealCard(num){
  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/`);
    const parsedResponse = response.json();
    return parsedResponse;
  } catch(error){
    console.log(error);
  }
};

//check score logic
//win loss logic