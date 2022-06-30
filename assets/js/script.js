const header = $("#header");
const viewHighscoresLink = header.find(".view-highscores-link");
const countDown = header.find(".count-down");

const intro = $("#intro");
const buttonStartQuiz = intro.find(".button-start-quiz");

const quizPage = $(".quiz-page");

const quizResult = $(".quiz-result");

const highscoresList = $(".highscore-list");

var questionIndex = 0;
var currentCountDown = 0;
var currentScore = 0;
var finalScore = 0;
var interval = undefined;

function renderQuestion(question){
    clearQuestion();
    quizPage.find(".questions").text(question.title);
    
    const choices = quizPage.find(".choices");
    question.choices.forEach(choice => {
        choices.append("<li><button>" + choice + "</button></li>");
    });

    quizPage.find(".choices").find("button").on("click", function (event) {
        var $button = $(event.target);
        if($button.text() === question.answer){
            quizPage.find(".result").text("correct!");
            currentScore++;
        }else{
            quizPage.find(".result").text("wrong!");
            currentCountDown -= 10;
            if(currentCountDown < 1 || (questionIndex === questions.length && currentScore === 0)){
                countDown.text(0)
                renderQuizResult();
            }
        }

        choices.find("button").prop("disabled",true);

        setTimeout(function(){
            nextQuestion();
        }, 500)
    })

    questionIndex++; // increment questionIndex
}

function nextQuestion() {

    if(questions.length > questionIndex){
        const question = questions[questionIndex];
        renderQuestion(question);
    }else{
        renderQuizResult();
    }

}

function clearQuestion(){
    quizPage.find(".choices").empty();
    quizPage.find(".questions").empty();
    quizPage.find(".result").text("");
}

function renderQuizResult(){

    finalScore = currentCountDown > 0 ? currentCountDown : 0;
    if((questionIndex === questions.length && currentScore === 0))
        finalScore = 0;

    quizResult.find(".score").text(finalScore);
    quizResult.find("input").val("");
    clearInterval(interval);
    hideElement(quizPage);
    showElement(quizResult);
}

function renderHighScores() {
    hideElement(quizResult);
    showElement(highscoresList);

    highscoresList.find(".results").empty();
    var scores = JSON.parse(localStorage.getItem("scores"));
    if(scores)
        scores.forEach(function(score){
            highscoresList.find(".results").append(`<li>${score.initials} - ${score.score}</li>`);
        });
    
    highscoresList.find("#goBack").on("click", function(event) {
        event.preventDefault();
        goBack();
    });

    highscoresList.find("#clearScores").on("click", function(event) {
        event.preventDefault();
        clearScores();
    });

}

function goBack() {
    init();
    showElement(intro);
}

function saveScore(initials, score) {
    // to local storage
    var lsScores = localStorage.getItem("scores");
    var scores = lsScores ? JSON.parse(lsScores) : [];
    
    scores.push({initials, score});
    localStorage.setItem("scores", JSON.stringify(scores));
}

function clearScores() {
    localStorage.removeItem("scores");
    highscoresList.find(".results").empty();
}

function reset() {
    questionIndex = 0;
    currentScore = 0;
    finalScore = 0;
}

function countDownTimer(){
    currentCountDown = 75;
    interval = setInterval(function() {
        currentCountDown--;
        countDown.text(currentCountDown)
        // Display 'counter' wherever you want to display it.
        if (currentCountDown===0) {
            clearInterval(interval);
            renderQuizResult();
        }
    }, 1000);
}

function hideElement(htmlElement) {
    // var $el = $(htmlElement);
    htmlElement.hide();
}

function showElement(htmlElement) {
    // var $el = $(htmlElement);
    htmlElement.show();
}

// function init is called upon page load
function init(){
    hideElement(quizPage)
    hideElement(quizResult)
    hideElement(highscoresList)
    countDown.text(0);
}

// Events
viewHighscoresLink.on("click", () => {
    init();
    hideElement(intro);
    renderHighScores();
})

buttonStartQuiz.on("click", () => {
    hideElement(intro);
    reset();

    const question = questions[questionIndex];
    
    renderQuestion(question);
    showElement(quizPage);
    countDownTimer();
})

quizResult.find("form[name='form-highscores']").submit(function(event){
    event.preventDefault();
    var $form = $(event.target);
    var info = $form.serializeArray();
    var initials = info[0].value;
    if(initials){
        saveScore(initials, finalScore);
        renderHighScores();
    }
})

init();