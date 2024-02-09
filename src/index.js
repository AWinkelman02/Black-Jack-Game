import _, { forEach, get } from 'lodash';
import './style.css';
import { Player } from './player';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(response => response.json())
  .then(data => setDeck(data.deck_id));
});

const DEALER_DECISION_DELAY = 1500;

const startGameButton = document.getElementById('startgame');
const hitButton = document.getElementById('hit');
const stayButton = document.getElementById('stay');
const newGameButton = document.getElementById('newgame');

const player = new Player('Player', 0, 0, 0, false);
const dealer = new Player('Dealer', 0, 0, 0, false);

let deckID;

//let playerTurn = true;
let dealerTurn = false;

function setDeck(deckData){
  deckID = deckData;
  return deckID
};

startGameButton.addEventListener('click', () => {
  initializeGame();
});

//hit button listener
hitButton.addEventListener('click', () => {
  //hit button requests a new card
  hitMe();
  //check score
    //if under 21 allow for another hit
    //if over 21, end game, bust
});

//stay button listener
stayButton.addEventListener('click', () => {
  setFinalScore(player);
  stay();
});

//new game button listener
newGameButton.addEventListener('click', () => {
  //reset everything
  //initializeGame();
});

//setup player and dealer cards
async function initializeGame(){
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  await dealCard().then( result => {dealer.cards.push(result.cards[0])});
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  await dealCard().then( result => {dealer.cards.push(result.cards[0])});

  getScore(player);
  getScore(dealer);

  console.log(player)
    //show cards stored in arrays
    //remove start game button
    //place hit/stay buttons
}

//hit me
async function hitMe(){
  await dealCard().then( result => {player.cards.push(result.cards[0])});
  //check score
  getScore(player);
  //console.log(playerCards);
  console.log(player);
  //check bust
  bustCheck(player);
}

async function stay(){
  //let playerTurn = false;
  dealerTurn = true;
  await dealerStarts();
}

async function dealerStarts(){
  console.log('Dealer Start');
  //flip card
  console.log(dealer.cards);
  while(dealerTurn){
    await gameDelay(DEALER_DECISION_DELAY);
    getScore(dealer);
    console.log(dealer);
    if(dealer.highCount <= 16) {
      winCheck();
      console.log('Dealer Draws')
      await gameDelay(DEALER_DECISION_DELAY);
      await dealCard().then( result => {dealer.cards.push(result.cards[0])});
    } else if (dealer.highCount < 22){
      dealerTurn = false;
      console.log('Dealer Stays')
      await gameDelay(DEALER_DECISION_DELAY);
      winCheck();
      return
    } else {
      dealerTurn = false;
      bustCheck(dealer);
      return
    }
  }
}

//deal card logic
async function dealCard(){
  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/`);
    const parsedResponse = response.json();
    return parsedResponse;
  } catch(error){
    console.log(error);
  }
};

//check score logic
function getScore(person){
  let lowCount = 0;
  let highCount = 0;
  let oneAce = false;
  for (let i = 0; i < person.cards.length; i++) {
    if(person.cards[i].value === 'JACK' || person.cards[i].value === 'KING' || person.cards[i].value === 'QUEEN') lowCount+=10;
    else if(person.cards[i].value === 'ACE') lowCount += 1;
    else lowCount += Number(person.cards[i].value);
  }
  for (let j = 0; j < person.cards.length; j++) {
    if(person.cards[j].value === 'JACK' || person.cards[j].value === 'KING' || person.cards[j].value === 'QUEEN') highCount+=10;
    else if(person.cards[j].value === 'ACE') {
      if(oneAce) highCount += 1;
      else {
        highCount += 11;
        oneAce = true;
      }
    }
    else highCount += Number(person.cards[j].value);
  }
  person.lowCount = lowCount;
  person.highCount = highCount;
}

//win loss logic
function bustCheck(person){
  if( person.lowCount > 21 ){
    person.bust = true;
    console.log(`${person.name} Busts`);
  }
  //after bust, show end game modal, lock interaction, show new game button
}

function setFinalScore(person){
  if (person.highCount > 21){
    person.finalScore = person.lowCount;
  } else {
    person.finalScore = person.highCount;
  }
  console.log(person.finalScore);
}

function winCheck(){
  if (player.finalScore > dealer.highCount){
    if(dealerTurn === false){
      console.log('Player Wins')
    }
  } else if (player.finalScore < dealer.highCount){
    console.log('Dealer Wins')
    dealerTurn = false;
  } else {
    dealerTurn = false;
    console.log('Push')
  }
}

async function gameDelay(delay){
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay);
  });
}