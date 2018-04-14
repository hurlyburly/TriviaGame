// * You'll create a trivia game that shows only one question until the player answers it or their time runs out.
// * If the player selects the correct answer, show a screen congratulating them for choosing the right option. After a few seconds, display the next question -- do this without user input.
// * The scenario is similar for wrong answers and time-outs.
//   * If the player runs out of time, tell the player that time's up and display the correct answer. Wait a few seconds, then show the next question.
//   * If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer. Wait a few seconds, then show the next question.
// * On the final screen, show the number of correct answers, incorrect answers, and an option to restart the game (without reloading the page).

//What the user sees:
//press start button
//display first slide of the trivia
//start countdown, populate question, update buttons
//select answer (only once per slide)
//if answer is correct: populate congratulations log the correct answer to user correct guess score
//if answer is incorrect: populate incorrect response, display information, and log the incorrect answer to user incorrect guess score
//if the user does not make a guess before the countdown ends: populate time out message, display information, and log the missed answer to user incorrect score.
//Once user completes the trivia question set (10 questions?) then end slideshow and display the user score sheet with the total questions, correct score, and incorrect score.

//Setting global variables
var questions;
var correctCount = 0;
var incorrectCount = 0;
var total = 15;
var questionIndex = 0;
var seconds=30;
var timer;
var nextQuestionSeconds = 2;
var nextQuestionTimer;
var queryURL =
  "https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=multiple";

$(".start-game").on("click", function() {
  newQuestion();
});
//getting questions and answers for trivia
function newQuestion() {
  var trivia = $(".trivia-question").html(
    questions.results[questionIndex].question
  );
  //creating new array with all answers and shuffling the answers before attaching to each button
  setAnswers();
  setCountdown();
}
function setAnswers() {
  //attaching position in index to button elements
  var triviaArray = questions.results[questionIndex].incorrect_answers;
  triviaArray.push(questions.results[questionIndex].correct_answer);
  shuffleAnswers(triviaArray);
  //figure out how to write code below more efficiently by using .each on trivia-answer class later.
  $("#answer-a").html(triviaArray[0]);
  $("#answer-b").html(triviaArray[1]);
  $("#answer-c").html(triviaArray[2]);
  $("#answer-d").html(triviaArray[3]);
}
function shuffleAnswers(array) {
  //shuffling the position of the incorrect and correct answers in order to avoid all correct answers being listed on the fourth button
  for (let j = array.length - 1; j > 0; j--) {
    let k = Math.floor(Math.random() * (j + 1));
    [array[j], array[k]] = [array[k], array[j]];
  }
}
function setCountdown() {
  timer = setInterval(function() {
    seconds--;
    if (seconds == 0) {
      clearInterval(timer);
      $(".countdown").html("Time's Out!");
    } else {
      $(".countdown").html("Time Left: " + seconds);
    }
  }, 1000);
  loadNextQuestion();
}
function loadNextQuestion() {
  nextQuestionTimer = setInterval(function() {
    nextQuestionSeconds--;
    }, 1000);
    if (nextQuestionSeconds == 0) {
      clearInterval(nextQuestionTimer);
      nextQuestion();
      nextQuestionSeconds = 2;
    }
  if (questionIndex >= questions.results.length) {
    $(".final-score").show();
    $(".final-hide").hide();
  }
}
function nextQuestion() {
  questionIndex++;
  newQuestion();
}
function correctGuess() {
  correctCount++;
  $(".correct-count").html("Correct: " + correctCount);
  $(".trivia-question").html("Correct!");
}

function incorrectGuess() {
  incorrectCount++;
  $(".incorrect-count").html("Incorrect: " + incorrectCount);
  $(".trivia-question").html("Incorrect!");
}

function totalScore() {
  $(".total-score").html("Score: " + correctCount + "/" + total);
}

function countScore() {
  var guess = questions.results[questionIndex].correct_answer;
  $(".trivia-answer").on("click", function() {
    if (guess == $(this).html()) {
      correctGuess();
    } else {
      incorrectGuess();
    }  
    totalScore();
  });

}

//wrapping ajax call to trivia API
$(document).ready(function() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    questions = response;
    countScore();
  });
});

//game logic
//start game: load first question from array and countdown from 30 seconds
//add score from guess
//if guess is correct and within time limit log as correct
//if guess is incorrect log as incorrect
//if time limit is exceeded then log as incorrect, reset coundown
//load next question
//once all questions are answered display score
