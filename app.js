/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

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



// Game variables
var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};
var gameStart = false;
var timerInterval;

// Difficulty settings for the game (max number of moves for each star)
var hard = 20;
var medium = 30;
var modal = $("#win-modal");


// Functions for game timer
function updateTimer(state){
  if (state == "stop"){
    clearInterval(timerInterval);
      }
      else{
    timerInterval = setInterval(function() {
      if (timer.seconds >= 60){
        timer.minutes++;
        timer.seconds = 0;
      }
      else if (timer.seconds < 10){
       $(".timer").text(timer.minutes + ":0" + timer.seconds);
      }
      else {
       $(".timer").text(timer.minutes + ":" + timer.seconds);
      }
      timer.seconds++;
    }, 1000);
  }

 };

// Restarts timer when called
function resetTimer(){
  var timerInterval = function(){
  timer.seconds = 0;
  timer.minutes = 0;
  $(".timer").text("0:00");
  }
};

// Randomizes cards from game to game
function updateCards() {
   deck = shuffle(deck);
   var index = 0;
   $.each($(".card i"), function(){
     $(this).attr("class", "fa " + deck[index]);
     index++;
   });
   resetTimer();
};

// Function for completed game popup window
function showModal() {
   modal.css("display", "block");
};

// Removes last star based on number of moves
function removeStar() {
   $(".fa-star").last().attr("class", "fa fa-star-o");
   numStars--;
   $(".num-stars").text(String(numStars));
};

// Restores stars to 3 stars, upon game restart
function resetStars() {
   $(".fa-star-o").attr("class", "fa fa-star");
   numStars = 3;
   $(".num-stars").text(String(numStars));
};

// Updates moves based on user clicks, then updates star ratings based on moves
function updateMoveCounter() {
   $(".moves").text(moveCounter);
   if (moveCounter === hard || moveCounter === medium) {
       removeStar();
   }
};

// Checks if card is a valid move
function isValid(card) {
   return !(card.hasClass("open") || card.hasClass("match"));
};

// Checks if cards match
function checkMatch() {
   if (open[0].children().attr("class")===open[1].children().attr("class")) {
       return true;
   } else {
       return false;
   }
};

// Resets the game and some game variables
var resetGame = function() {
   open = [];
   matched = 0;
   resetTimer("0:00");
   updateMoveCounter();
   $(".card").attr("class", "card");
   updateCards();
   updateTimer("stop");
};

// Checks if all cards match
function hasWon() {
     if (matched === 16) {
       resetGame();
        return true;
    } else {
         return false;
    }

};

// Sets all open cards to the match state and checks if game has been won
var setMatch = function() {
   open.forEach(function(card) {
       card.addClass("match");
   });
   open = [];
   matched += 2;

   if (hasWon()) {
      showModal();
   }
};

// Flips cards back to default
var resetOpen = function() {
   open.forEach(function(card) {
       card.toggleClass("open");
       card.toggleClass("show");
   });
   open = [];
};

// Sets selected card to open
function openCard(card) {
   if (!card.hasClass("open")) {
       card.addClass("open");
       card.addClass("show");
       open.push(card);
   }
};

// Game begins on mouse click and game function
var onClick = function() {
 if (gameStart == false){
   updateTimer("start");
 }
 gameStart = true;
   if (isValid( $(this) )) {

       if (open.length === 0) {
           openCard( $(this) );

       } else if (open.length === 1) {
           openCard( $(this) );
           moveCounter++;
           updateMoveCounter();

           if (checkMatch()) {
               setTimeout(setMatch, 300);

           } else {
               setTimeout(resetOpen, 700);

           }
       }
   }
};

// Restarts game
var playAgain = function() {
  resetGame();
  modal.css("display", "none");

  playAgain.onclick = function() {
      modal.style.display = "none";
  }

  $("#restart").on("click", function() {
     location.reload()
  });

  clearInterval(timer);
};

// Event to open cards on click
$(".card").click(onClick);

// Function to restart the game on icon click
function restartGame() {
 $(".restart").on("click", function() {
     location.reload();
     resetGame();
     //console.log("is this working?");
 });
};

 restartGame();

// Function to restart and play the game again
function startAgain() {
 $(".again").on("click", function() {
     location.reload();
     resetGame();
     console.log("is this working?");
 });
};

 startAgain();

// Randomized cards are provided when game starts and restarts
 $(updateCards);
