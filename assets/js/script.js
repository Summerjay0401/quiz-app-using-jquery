const header = $("#header");
const viewHighscoresLink = header.find(".view-highscores-link");
const countDown = header.find(".time");

const intro = $("#intro");
const buttonStartQuiz = intro.find(".button-start-quiz");

const quizPage = $(".quiz-page");

const quizResult = $(".quiz-result");

const highscoresList = $(".highscore-list");

var questionIndex = 0;
var currentScore = 0;

function hideElement(el) {
    var $el = $(el);
    $el.hide();
}

function showElement(el) {
    var $el = $(el);
    $el.show();
}

function renderQuestion(question){
    quizPage.find(".questions").text(question.title);
    
    const choices = quizPage.find(".choices");
    question.choices.forEach(choice => {
        choices.append("<li><button>" + choice + "</button></li>");
    });

    choices.find("button").on("click", function (event) {
        var $button = $(event.target);
        if($button.text() === question.answer){
            currentScore++;
            quizPage.find(".result").text("correct!")
        }else{
            quizPage.find(".result").text("wrong!")
        }

        choices.find("button").prop("disabled",true);

        setTimeout(function(){
            nextQuestion();
        }, 1000)
    })

    questionIndex++; // increment questionIndex
}

function nextQuestion() {

    if(questions.length > questionIndex){
        const question = questions[questionIndex];
        clearQuestion();
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
    quizResult.find(".score").text(currentScore);
    quizResult.find("input").text("");

    quizResult.find("form[name='form-highscores']").submit(function(event){
        event.preventDefault();
        var $form = $(event.target);
        var info = $form.serializeArray();
        var initials = info[0].value;
        if(initials){
            saveScore(initials, currentScore);
            renderHighScores();
        }
    })

    hideElement(quizPage);
    showElement(quizResult);
}

function renderHighScores() {
    hideElement(quizResult);
    showElement(highscoresList);

    var scores = JSON.parse(localStorage.getItem("scores"));
    console.log(scores);
    scores.forEach(function(score){
        highscoresList.find(".results").append(`<li>${score.initials} - ${score.score}</li>`);
    });
    

}

function saveScore(initials, score) {
    // to local storage
    var lsScores = localStorage.getItem("scores");
    var scores = lsScores ? JSON.parse(lsScores) : [];
    localStorage.setItem("scores", JSON.stringify([...scores, {initials, score}]));
}

function reset() {
    questionIndex = 0;
    currentScore = 0;
}

// function init is called upon page load
function init(){
    hideElement(quizPage)
    hideElement(quizResult)
    hideElement(highscoresList)
}

// Events
viewHighscoresLink.on("click", () => {
    console.log("clicked")
    console.log(questions)
})

buttonStartQuiz.on("click", () => {
    hideElement(intro);
    reset();

    const question = questions[questionIndex];
    
    renderQuestion(question);
    showElement(quizPage);
})

init();