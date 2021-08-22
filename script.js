// const QUESTION_URL = "https://opentdb.com/api.php?amount=10&category=19&type=multiple" // math
// const QUESTION_URL = "https://opentdb.com/api.php?amount=10&category=9&type=multiple"  // general
const QUESTION_URL = "https://opentdb.com/api.php?amount=10&category=10&type=multiple" //books
const startButtom = document.getElementById("start-btn")
const nextButtom = document.getElementById("next-btn")
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtons = document.getElementById('answer-buttons')
let shuffledQuestions, currentQuestionIndex


function getQuestionList() {
    return fetch(QUESTION_URL)
        .then(response => response.json())
        .then(data => data.results)
}

function htmlEntities(str) {
    return str.replaceAll('&amp;', "&").replaceAll('&lt;', "<").replaceAll('&gt;', ">")
        .replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll("&rsquo;", "’");
}
async function generateQuizList() {
    const list = await getQuestionList()

    list.forEach(element => {
        let incorrect_answers = element.incorrect_answers
        let incorrect_answers_list = []
        let questions_list = []
        incorrect_answers.forEach(inc => {
            let incorrect_answers_obj = {}
            let decoded_inc = htmlEntities(inc)
            incorrect_answers_list.push({ text: decoded_inc, correct: false })
        })
        let decoded_correct = htmlEntities(element.correct_answer)
        incorrect_answers_list.push({ text: decoded_correct, correct: true })
        questions_list = incorrect_answers_list.sort(() => Math.random() - 0.5)
        questions.push({
            question: htmlEntities(element.question),
            answers: incorrect_answers_list
        })
        console.log(questions)
    })

}
generateQuizList()
startButtom.addEventListener('click', startGame)
nextButtom.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function startGame() {
    startButtom.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function resetState() {
    clearStatusClass(document.body)
    nextButtom.classList.add('hide')
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }

}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtons.appendChild(button)
    })

}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtons.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButtom.classList.remove('hide')
    } else {
        startButtom.innerText = 'Restart'
        startButtom.classList.remove('hide')
    }

}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else { element.classList.add('wrong') }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')

}
const questions = []