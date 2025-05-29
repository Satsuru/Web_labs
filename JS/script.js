// Константы
const REVIEW_DELAY = 3000; // 3 секунды для показа ошибок (m)
const QUESTIONS = [
    {
        image: '../RESOURCE/dog1.jpg',
        question: 'Какое животное изображено на картинке?',
        answers: ['Кошка', 'Собака', 'Лиса', 'Волк', 'Медведь'],
        correct: 1
    },
    {
        image: '../RESOURCE/cat2.png',
        question: 'Что это за животное?',
        answers: ['Тигр', 'Лев', 'Кошка', 'Рысь', 'Леопард'],
        correct: 2
    },
    {
        image: '../RESOURCE/owl1.jpg',
        question: 'Какая птица показана на изображении?',
        answers: ['Ворона', 'Голубь', 'Орел', 'Сова', 'Ястреб'],
        correct: 3
    },
    {
        image: '../RESOURCE/cat3.png',
        question: 'Кто это?',
        answers: ['Тигр', 'Кошка', 'Леопард', 'Ягуар', 'Пума'],
        correct: 1
    },
    {
        image: '../RESOURCE/elephant1.jpg',
        question: 'Какое это животное?',
        answers: ['Носорог', 'Бегемот', 'Слон', 'Мамонт', 'Буйвол'],
        correct: 2
    },
    {
        image: '../RESOURCE/cat4.png',
        question: 'Кто изображен на фото?',
        answers: ['Рысь', 'Кошка', 'Тигр', 'Лев', 'Пантера'],
        correct: 1
    },
    {
        image: '../RESOURCE/cat5.jpg',
        question: 'Что это за животное?',
        answers: ['Тигр', 'Кошка', 'Леопард', 'Ягуар', 'Гепард'],
        correct: 1
    },
    {
        image: '../RESOURCE/pigeon1.jpg',
        question: 'Какая птица на картинке?',
        answers: ['Голубь', 'Орел', 'Сокол', 'Ястреб', 'Сорока'],
        correct: 0
    },
    {
        image: '../RESOURCE/wolf1.jpg',
        question: 'Какое это животное?',
        answers: ['Собака', 'Волк', 'Лиса', 'Койот', 'Шакал'],
        correct: 1
    },
    {
        image: '../RESOURCE/cow1.png',
        question: 'Кто это?',
        answers: ['Корова', 'Бизон', 'Буйвол', 'Як', 'Зубр'],
        correct: 0
    }
];

// Элементы DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');
const nextReviewBtn = document.getElementById('next-review-btn');
const timeLimitInput = document.getElementById('time-limit');
const timerDisplay = document.getElementById('timer');
const reviewTimerDisplay = document.getElementById('review-timer');
const quizImage = document.getElementById('quiz-image');
const reviewImage = document.getElementById('review-image');
const questionText = document.getElementById('question-text');
const reviewQuestion = document.getElementById('review-question');
const answersContainer = document.getElementById('answers-container');
const feedback = document.getElementById('feedback');
const correctCount = document.getElementById('correct-count');
const totalQuestions = document.getElementById('total-questions');
const correctAnswer = document.getElementById('correct-answer');

// Переменные состояния
let currentQuestionIndex = 0;
let userAnswers = new Map();
let incorrectQuestions = new Set();
let timer;
let timeLeft;
let reviewTimer;
let reviewTimeLeft;

// Инициализация викторины
function initQuiz() {
    currentQuestionIndex = 0;
    userAnswers.clear();
    incorrectQuestions.clear();
    totalQuestions.textContent = QUESTIONS.length;
    correctCount.textContent = '0';
    
    const timeLimit = parseInt(timeLimitInput.value) || 10;
    timeLeft = timeLimit;
    
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    reviewScreen.classList.add('hidden');
    
    showQuestion();
    startTimer();
}

// Показать вопрос
function showQuestion() {
    const question = QUESTIONS[currentQuestionIndex];
    quizImage.src = question.image;
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.id = `answer-${index}`;
        radio.value = index;
        
        const label = document.createElement('label');
        label.htmlFor = `answer-${index}`;
        label.textContent = answer;
        
        answerDiv.appendChild(radio);
        answerDiv.appendChild(label);
        answersContainer.appendChild(answerDiv);
        
        radio.addEventListener('change', () => {
            submitBtn.disabled = false;
        });
    });
    
    feedback.classList.add('hidden');
    submitBtn.disabled = true;
}

// Таймер для вопроса
function startTimer() {
    timerDisplay.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

// Обработка истечения времени
function handleTimeout() {
    userAnswers.set(currentQuestionIndex, -1); // -1 означает "время истекло"
    incorrectQuestions.add(currentQuestionIndex);
    showFeedback(false);
    
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

// Показать обратную связь
function showFeedback(isCorrect) {
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
        feedback.textContent = 'Правильно!';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = 'Неправильно!';
        feedback.className = 'feedback incorrect';
    }
}

// Следующий вопрос
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < QUESTIONS.length) {
        const timeLimit = parseInt(timeLimitInput.value) || 10;
        timeLeft = timeLimit;
        showQuestion();
        startTimer();
    } else {
        showResults();
    }
}

// Показать результаты
function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    let correct = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
        if (userAnswers.get(i) === QUESTIONS[i].correct) {
            correct++;
        } else {
            incorrectQuestions.add(i);
        }
    }
    
    correctCount.textContent = correct;
}

// Показать ошибки
function reviewIncorrect() {
    if (incorrectQuestions.size === 0) {
        alert('У вас нет ошибок для просмотра!');
        return;
    }
    
    resultsScreen.classList.add('hidden');
    reviewScreen.classList.remove('hidden');
    
    // Преобразуем Set в массив для удобства
    const incorrectArray = Array.from(incorrectQuestions);
    let currentReviewIndex = 0;
    
    function showReviewQuestion(index) {
        if (index >= incorrectArray.length) {
            reviewScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            return;
        }
        
        const questionIndex = incorrectArray[index];
        const question = QUESTIONS[questionIndex];
        
        reviewImage.src = question.image;
        reviewQuestion.textContent = question.question;
        correctAnswer.textContent = question.answers[question.correct];
        
        reviewTimeLeft = REVIEW_DELAY / 1000;
        reviewTimerDisplay.textContent = reviewTimeLeft;
        
        // Скрываем кнопку "Следующий" и показываем только через 1 секунду
        nextReviewBtn.classList.add('hidden');
        
        reviewTimer = setInterval(() => {
            reviewTimeLeft--;
            reviewTimerDisplay.textContent = reviewTimeLeft;
            
            if (reviewTimeLeft <= 0) {
                clearInterval(reviewTimer);
                currentReviewIndex++;
                showReviewQuestion(currentReviewIndex);
            }
            
            // Показываем кнопку "Следующий" через 1 секунду
            if (reviewTimeLeft === (REVIEW_DELAY / 1000 - 1)) {
                nextReviewBtn.classList.remove('hidden');
            }
        }, 1000);
    }
    
    nextReviewBtn.addEventListener('click', () => {
        clearInterval(reviewTimer);
        currentReviewIndex++;
        showReviewQuestion(currentReviewIndex);
    });
    
    showReviewQuestion(currentReviewIndex);
}

// Обработчики событий
startBtn.addEventListener('click', initQuiz);

submitBtn.addEventListener('click', () => {
    clearInterval(timer);
    
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) return;
    
    const answerIndex = parseInt(selectedAnswer.value);
    userAnswers.set(currentQuestionIndex, answerIndex);
    
    const isCorrect = answerIndex === QUESTIONS[currentQuestionIndex].correct;
    if (!isCorrect) {
        incorrectQuestions.add(currentQuestionIndex);
    }
    
    showFeedback(isCorrect);
    
    setTimeout(() => {
        nextQuestion();
    }, 2000);
});

reviewBtn.addEventListener('click', reviewIncorrect);

restartBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    startScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    reviewScreen.classList.add('hidden');
});