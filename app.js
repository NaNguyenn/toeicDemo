const headerElement = document.getElementById('header')
const headerButton = document.getElementById('headerBtn')
const imageContainerElement = document.getElementById('imageContainer')
const questionContainerElement = document.getElementById('questionContainer')
const questionElement = document.getElementById('question')
const questionImageElement = document.getElementById('questionImage')
//const questionAudioElement = document.getElementById('questionAudio')
let currentQuestionIndex

headerButton.addEventListener('click', startDemo)

function startDemo() {
    headerButton.classList.add('hide')
    questionContainerElement.classList.remove('hide')
    imageContainerElement.classList.remove('hide')
    currentQuestionIndex = 0
    setNextQuestion()
    //showScore()
}

async function setNextQuestion() {
    while (currentQuestionIndex < questionsNum) {
        const audio = new Audio(questions[currentQuestionIndex].questionAudio)
        showQuestion(questions[currentQuestionIndex])
        await playAudio(audio)
        currentQuestionIndex++
    }
    showScore()
}

function showQuestion(questionAtGivenIndex) {
    //questionAudioElement.src = questionAtGivenIndex.questionAudio
    questionImageElement.src = questionAtGivenIndex.questionImg

    while (questionContainerElement.childNodes.length > 2) {
        questionContainerElement.removeChild(questionContainerElement.lastChild)
    }
    questionElement.innerText = currentQuestionIndex + 1 + '.'

    //questionAudioElement.play()

    for (let key in questionAtGivenIndex.answers) {
        let label = document.createElement("label")
        label.innerText = key
        questionContainerElement.appendChild(label)
        let input = document.createElement("input")
        input.type = "radio"
        input.name = "answer"
        label.appendChild(input)

        input.addEventListener('change', () => {
            Object.keys(questionAtGivenIndex.answers).forEach(key => {
                questionAtGivenIndex.answers[key] = false
            })
            questionAtGivenIndex.answers[key] = true

            if (key == questionAtGivenIndex.answerCorrect) {
                questionAtGivenIndex.score = 1
            }
        })

    }
}

function showScore() {
    questionImageElement.src = "img/toeic-logo.png"

    let totalScore = 0
    questions.forEach(question => {
        totalScore += question.score
    })
    questionContainerElement.innerHTML = `You scored ${totalScore}/${questionsNum}<button id="reviewBtn">Review</button>`
    const reviewButton = document.getElementById('reviewBtn')
    console.log(headerButton)
    console.log(reviewButton)
    reviewButton.addEventListener('click', startReview)
}

function startReview() {
    headerElement.innerHTML = `<button id="nextBtn">Next</button>`
    const nextButton = document.getElementById('nextBtn')
    currentQuestionIndex = 0
    showAnswer(questions[currentQuestionIndex])
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++
        if (currentQuestionIndex == questionsNum - 1) {
            nextButton.classList.add('hide')
        }
        showAnswer(questions[currentQuestionIndex])
    })

}

function showAnswer(questionAtGivenIndex) {
    questionImageElement.src = questionAtGivenIndex.questionImg

    questionContainerElement.innerHTML = `<div id="question"></div>`
    const questionElement = document.getElementById('question')
    questionElement.innerText = currentQuestionIndex + 1 + '.'
    let audioElement = document.createElement("audio")
    audioElement.src = questionAtGivenIndex.questionAudio
    audioElement.controls = true
    questionElement.appendChild(audioElement)

    //console.log(questionAtGivenIndex.transcripts)
    questionAtGivenIndex.transcripts.forEach(transcript => {
        //console.log(transcript)
        let transcriptElement = document.createElement("div")
        transcriptElement.innerText = transcript.choice + '. ' + transcript.text
        if (transcript.choice == questionAtGivenIndex.answerCorrect) {
            transcriptElement.className = "correct"
        }
        if (questionAtGivenIndex.score == 0) {
            for (let key in questionAtGivenIndex.answers) {
                if (key == transcript.choice && questionAtGivenIndex.answers[key]) {
                    transcriptElement.className = "wrong"
                }
            }
        }
        questionContainerElement.appendChild(transcriptElement)
    })
}

function playAudio(audio) {
    return new Promise(res => {
        audio.play()
        audio.onended = res
    })
}

const questions = [
    {
        questionImg: "img/1.png",
        questionAudio: "audio/1.mp3",
        answerCorrect: "B",
        score: 0,
        answers: {
            "A": false,
            "B": false,
            "C": false,
            "D": false
        },
        transcripts: [
            { choice: 'A', text: "He's parking a truck" },
            { choice: 'B', text: "He's lifting some furniture" },
            { choice: 'C', text: "He's starting an engine" },
            { choice: 'D', text: "He's driving a car" }
        ]
    },
    {
        questionImg: "img/2.png",
        questionAudio: "audio/2.mp3",
        answerCorrect: "C",
        score: 0,
        answers: {
            "A": false,
            "B": false,
            "C": false,
            "D": false
        },
        transcripts: [
            { choice: 'A', text: "Some curtains have been closed" },
            { choice: 'B', text: "Some jackets have been laid on a chair" },
            { choice: 'C', text: "Some people are gathered around a desk" },
            { choice: 'D', text: "Someone is turning on a lamp" }
        ]
    }
]

let questionsNum = questions.length