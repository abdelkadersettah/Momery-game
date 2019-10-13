const cards = document.querySelectorAll(".card");
const items = document.querySelectorAll(".card .fa");
const deck = document.querySelector(".deck");

// list that holds all cards
const cardsList = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb"
];
function shuffle(card) {
  card = card.concat(card).sort(() => 0.5 - Math.random());
  items.forEach((element, index) => {
    element.classList.add(card[index]);
  });
}
shuffle(cardsList);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;

//     while (currentIndex !== 0) {
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// }

/*

 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//*list* of "open" cards
const ListOfOpenCards = [];
const listOfMatchCards = [];
//**************display the card's symbol
const displayCard = card => {
  if (ListOfOpenCards.length > 2) {
    return;
  }
  card.classList.add("open", "show");
  ListOfOpenCards.push(card);
};
//************Match card
const matchCard = () => {
  if (ListOfOpenCards.length < 2) return;
  //******prevent  bug when you double click in same card*******
  if (ListOfOpenCards[0] == ListOfOpenCards[1]) {
    ListOfOpenCards.splice(0, 1);
  }
  if (ListOfOpenCards.length == 2) {
    if (
      ListOfOpenCards.every(
        e =>
          e.firstElementChild.className ==
          ListOfOpenCards[0].firstElementChild.className
      )
    ) {
      ListOfOpenCards.forEach(card =>
        card.classList.add("match", "animated", "pulse")
      );
      listOfMatchCards.push(...ListOfOpenCards);
      ListOfOpenCards.splice(0, 2);
    } else {
      ListOfOpenCards.forEach(card => card.classList.add("animated", "shake"));
      setTimeout(removeCard, 800);
    }
  }
};
//Remove card if don't match
const removeCard = () => {
  ListOfOpenCards.forEach(card => card.classList.remove("show", "open"));
  ListOfOpenCards.forEach(card => card.classList.remove("animated", "shake"));
  ListOfOpenCards.splice(0, 2);
};

//increment the move counter and changing the stars Style
let count = 1;
const moveCounter = () => {
  const move = document.querySelector(".moves");
  const star = document.querySelector(".stars").querySelectorAll("li");
  move.textContent = count;
  if (count >= 10 && count <= 15) {
    star[2].firstElementChild.classList.replace("fa-star", "fa-star-o");
  } else if (count >= 15) {
    star[1].firstElementChild.classList.replace("fa-star", "fa-star-o");
  }
  return count++;
};
//timer

let totalSeconds = 0;

const setTime = () => {
  const secondsLabel = document.querySelector(".seconds");
  const minutesLabel = document.querySelector(".minutes");
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
};

const pad = val => {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
};
const timer = setInterval(setTime, 1000);

// display a message with the final score
let countStars = 0;
const finalScore = () => {
  const stars = document.querySelectorAll(".stars i");
  const count = document.querySelector(".moves").textContent;
  const secondsLabel = document.querySelector(".seconds").textContent;
  const minutesLabel = document.querySelector(".minutes").textContent;
  const container = document.querySelector(".container");
  if (listOfMatchCards.length == 16) {
    stars.forEach(e => {
      if (e.classList.contains("fa-star")) {
        countStars++;
      }
    });
    container.innerHTML = `
        <main class="bg-light text-dark">
          <section class="winner-message">
              <h1>Congratulations! You Won</h1>
              <p>
                With <span class="moves">${count}</span> moves and
                <span class="star-number">${countStars}</span> star
              </p>
              <p> in ${minutesLabel} Minutes and ${secondsLabel} seconds </p>
              <p>wow</p>
              <a
                href="/Memory Game project rubric/index.html"
                class="btn btn-info"
                role="button"
                >Play Again
              </a>
            </section>
        </main>
`;
    clearInterval(timer);
  }
};
//restart de game
const restartButton = document.querySelector(".restart");
const restartGame = () => {
  document.location.reload();
};
restartButton.addEventListener("click", restartGame);

//Event listener to card when user Click
cards.forEach(card => {
  card.addEventListener("click", e => {
    const card = e.target;
    moveCounter();
    displayCard(card);
    matchCard();
    finalScore();
  });
}, true);
