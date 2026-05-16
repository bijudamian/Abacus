// quiz.js
// Import Firebase and necessary functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoo1UZt6daTqU1BRmTJoxJN601KNhvf4c",
    authDomain: "abacus-1cd92.firebaseapp.com",
    projectId: "abacus-1cd92",
    storageBucket: "abacus-1cd92.appspot.com",
    messagingSenderId: "52069573106",
    appId: "1:52069573106:web:224d42e32e098446a34b6b",
    measurementId: "G-NCZPLYG1NR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('contextmenu', event => event.preventDefault());

const quizData = [
    {
      "question": "<p>9</p><p>-5</p><p>-2</p><p>6</p><p>-3</p>",
      "options": [
        4,
        3,
        5
      ],
      "answer": 5
    },
    {
      "question": "<p>3</p><p>2</p><p>5</p><p>4</p><p>6</p>",
      "options": [
        19,
        20,
        17
      ],
      "answer": 20
    },
    {
      "question": "<p>4</p><p>-3</p><p>8</p><p>-7</p><p>6</p>",
      "options": [
        7,
        14,
        8
      ],
      "answer": 8
    },
    {
      "question": "<p>1</p><p>9</p><p>2</p><p>5</p><p>3</p>",
      "options": [
        16,
        28,
        20
      ],
      "answer": 20
    },
    {
      "question": "<p>6</p><p>1</p><p>-5</p><p>4</p><p>2</p>",
      "options": [
        8,
        11,
        16
      ],
      "answer": 8
    },
    {
      "question": "<p>3</p><p>-2</p><p>7</p><p>-5</p><p>3</p>",
      "options": [
        3,
        9,
        6
      ],
      "answer": 6
    },
    {
      "question": "<p>7</p><p>3</p><p>4</p><p>-3</p><p>5</p>",
      "options": [
        17,
        24,
        16
      ],
      "answer": 16
    },
    {
      "question": "<p>3</p><p>6</p><p>9</p><p>-6</p><p>3</p>",
      "options": [
        22,
        16,
        15
      ],
      "answer": 15
    },
    {
      "question": "<p>5</p><p>4</p><p>-6</p><p>2</p><p>3</p>",
      "options": [
        8,
        12,
        11
      ],
      "answer": 8
    },
    {
      "question": "<p>9</p><p>-5</p><p>1</p><p>3</p><p>-7</p>",
      "options": [
        2,
        7,
        1
      ],
      "answer": 1
    },
    {
      "question": "<p>8</p><p>-5</p><p>2</p><p>4</p>",
      "options": [
        9,
        3,
        12
      ],
      "answer": 9
    },
    {
      "question": "<p>42</p><p>-1</p><p>6</p>",
      "options": [
        50,
        55,
        47
      ],
      "answer": 47
    },
    {
      "question": "<p>22</p><p>2</p><p>3</p><p>-5</p>",
      "options": [
        21,
        20,
        22
      ],
      "answer": 22
    },
    {
      "question": "<p>30</p><p>4</p><p>-5</p><p>3</p>",
      "options": [
        27,
        40,
        32
      ],
      "answer": 32
    },
    {
      "question": "<p>88</p><p>8</p><p>9</p><p>-6</p><p>9</p>",
      "options": [
        108,
        115,
        109
      ],
      "answer": 108
    },
    {
      "question": "<p>55</p><p>-2</p><p>7</p><p>4</p>",
      "options": [
        64,
        68,
        59
      ],
      "answer": 64
    },
    {
      "question": "<p>54</p><p>6</p><p>5</p><p>-1</p>",
      "options": [
        61,
        69,
        64
      ],
      "answer": 64
    },
    {
      "question": "<p>32</p><p>8</p><p>9</p>",
      "options": [
        52,
        49,
        44
      ],
      "answer": 49
    },
    {
      "question": "<p>65</p><p>4</p><p>5</p><p>9</p>",
      "options": [
        83,
        89,
        87
      ],
      "answer": 83
    },
    {
      "question": "<p>29</p><p>-3</p><p>2</p><p>9</p>",
      "options": [
        32,
        40,
        37
      ],
      "answer": 37
    },
    {
      "question": "<p>78</p><p>5</p><p>6</p><p>-7</p>",
      "options": [
        90,
        82,
        76
      ],
      "answer": 82
    },
    {
      "question": "<p>25</p><p>6</p><p>4</p><p>2</p>",
      "options": [
        37,
        44,
        41
      ],
      "answer": 37
    },
    {
      "question": "<p>14</p><p>6</p><p>9</p><p>5</p>",
      "options": [
        30,
        29,
        34
      ],
      "answer": 34
    },
    {
      "question": "<p>22</p><p>3</p><p>9</p><p>8</p>",
      "options": [
        49,
        42,
        40
      ],
      "answer": 42
    },
    {
      "question": "<p>55</p><p>3</p><p>9</p><p>6</p><p>2</p>",
      "options": [
        75,
        69,
        80
      ],
      "answer": 75
    },
    {
      "question": "<p>29</p><p>-4</p><p>8</p><p>-3</p><p>6</p>",
      "options": [
        34,
        31,
        36
      ],
      "answer": 36
    },
    {
      "question": "<p>19</p><p>-7</p><p>4</p><p>8</p><p>5</p>",
      "options": [
        35,
        29,
        33
      ],
      "answer": 29
    },
    {
      "question": "<p>6</p><p>5</p><p>1</p><p>8</p><p>3</p>",
      "options": [
        20,
        26,
        23
      ],
      "answer": 23
    },
    {
      "question": "<p>2</p><p>4</p><p>6</p><p>9</p><p>8</p>",
      "options": [
        26,
        25,
        29
      ],
      "answer": 29
    },
    {
      "question": "<p>24</p><p>8</p><p>5</p><p>-2</p>",
      "options": [
        37,
        32,
        35
      ],
      "answer": 35
    },
    {
      "question": "<p>3</p><p>8</p><p>5</p><p>-6</p>",
      "options": [
        11,
        5,
        10
      ],
      "answer": 10
    },
    {
      "question": "<p>23</p><p>8</p><p>5</p><p>-1</p>",
      "options": [
        42,
        31,
        35
      ],
      "answer": 35
    },
    {
      "question": "<p>78</p><p>-3</p><p>-5</p><p>4</p>",
      "options": [
        75,
        76,
        74
      ],
      "answer": 74
    },
    {
      "question": "<p>9</p><p>-6</p><p>4</p><p>-2</p>",
      "options": [
        5,
        11,
        7
      ],
      "answer": 5
    },
    {
      "question": "<p>4</p><p>-3</p><p>1</p><p>1</p>",
      "options": [
        11,
        4,
        3
      ],
      "answer": 3
    },
    {
      "question": "<p>8</p><p>-3</p><p>4</p><p>2</p>",
      "options": [
        11,
        17,
        10
      ],
      "answer": 11
    },
    {
      "question": "<p>7</p><p>4</p><p>1</p><p>6</p>",
      "options": [
        19,
        18,
        17
      ],
      "answer": 18
    },
    {
      "question": "<p>6</p><p>-5</p><p>9</p><p>5</p>",
      "options": [
        15,
        12,
        14
      ],
      "answer": 15
    },
    {
      "question": "<p>7</p><p>-5</p><p>4</p><p>-2</p>",
      "options": [
        10,
        4,
        6
      ],
      "answer": 4
    },
    {
      "question": "<p>4</p><p>-2</p><p>4</p><p>2</p>",
      "options": [
        6,
        14,
        8
      ],
      "answer": 8
    },
    {
      "question": "<p>8</p><p>-7</p><p>-1</p><p>4</p>",
      "options": [
        8,
        11,
        4
      ],
      "answer": 4
    },
    {
      "question": "<p>2</p><p>4</p><p>-1</p><p>3</p>",
      "options": [
        4,
        15,
        8
      ],
      "answer": 8
    },
    {
      "question": "<p>4</p><p>4</p><p>-7</p><p>1</p>",
      "options": [
        1,
        4,
        2
      ],
      "answer": 2
    },
      {
        "question": "<p>99</p><p>-6</p><p>4</p><p>-2</p>",
        "options": [
          95,
          98,
          103
        ],
        "answer": 95
      },
      {
        "question": "<p>49</p><p>-3</p><p>1</p><p>1</p>",
        "options": [
          56,
          46,
          48
        ],
        "answer": 48
      },
      {
        "question": "<p>84</p><p>-3</p><p>4</p><p>2</p>",
        "options": [
          95,
          81,
          87
        ],
        "answer": 87
      },
      {
        "question": "<p>88</p><p>-7</p><p>-1</p><p>4</p>",
        "options": [
          91,
          84,
          85
        ],
        "answer": 84
      },
      {
        "question": "<p>22</p><p>4</p><p>-1</p><p>3</p>",
        "options": [
          33,
          30,
          28
        ],
        "answer": 28
      },
      {
        "question": "<p>44</p><p>4</p><p>-7</p><p>1</p>",
        "options": [
          45,
          44,
          42
        ],
        "answer": 42
      },
      {
        "question": "<p>28</p><p>-1</p><p>-3</p><p>5</p>",
        "options": [
          29,
          30,
          27
        ],
        "answer": 29
      },
      {
        "question": "<p>56</p><p>-3</p><p>6</p><p>-2</p>",
        "options": [
          62,
          57,
          56
        ],
        "answer": 57
      },
      {
        "question": "<p>45</p><p>-3</p><p>7</p><p>-6</p>",
        "options": [
          39,
          49,
          43
        ],
        "answer": 43
      },
      {
        "question": "<p>77</p><p>-3</p><p>5</p><p>-7</p>",
        "options": [
          72,
          68,
          69
        ],
        "answer": 72
      },
      {
        "question": "<p>66</p><p>-3</p><p>-3</p><p>8</p>",
        "options": [
          76,
          66,
          68
        ],
        "answer": 68
      },
      {
        "question": "<p>87</p><p>-2</p><p>-3</p><p>4</p>",
        "options": [
          93,
          82,
          86
        ],
        "answer": 86
      },
      {
        "question": "<p>95</p><p>-3</p><p>5</p><p>-2</p>",
        "options": [
          95,
          100,
          98
        ],
        "answer": 95
      },
      {
        "question": "<p>97</p><p>-3</p><p>5</p><p>-8</p>",
        "options": [
          85,
          91,
          87
        ],
        "answer": 91
      },
      {
        "question": "<p>19</p><p>-8</p><p>6</p><p>-5</p>",
        "options": [
          12,
          6,
          15
        ],
        "answer": 12
      },
      {
        "question": "<p>25</p><p>2</p><p>-3</p><p>5</p>",
        "options": [
          37,
          29,
          34
        ],
        "answer": 29
      },
      {
        "question": "<p>17</p><p>-3</p><p>5</p><p>8</p>",
        "options": [
          34,
          27,
          35
        ],
        "answer": 27
      },
      {
        "question": "<p>27</p><p>-5</p><p>8</p><p>6</p>",
        "options": [
          33,
          38,
          36
        ],
        "answer": 36
      },
      {
        "question": "<p>18</p><p>8</p><p>-5</p><p>9</p>",
        "options": [
          34,
          25,
          30
        ],
        "answer": 30
      },
      {
        "question": "<p>39</p><p>-2</p><p>8</p><p>-5</p>",
        "options": [
          35,
          43,
          40
        ],
        "answer": 40
      },
      {
        "question": "<p>27</p><p>8</p><p>-2</p><p>9</p>",
        "options": [
          42,
          36,
          50
        ],
        "answer": 42
      },
      {
        "question": "<p>56</p><p>-2</p><p>9</p><p>5</p>",
        "options": [
          68,
          64,
          63
        ],
        "answer": 68
      },
      {
        "question": "<p>58</p><p>8</p><p>-1</p><p>4</p>",
        "options": [
          69,
          65,
          74
        ],
        "answer": 69
      },
      {
        "question": "<p>22</p><p>5</p><p>-4</p><p>8</p>",
        "options": [
          31,
          34,
          33
        ],
        "answer": 31
      },
      {
        "question": "<p>11</p><p>7</p><p>-6</p><p>8</p>",
        "options": [
          20,
          15,
          14
        ],
        "answer": 20
      },
      {
        "question": "<p>16</p><p>-4</p><p>5</p><p>9</p>",
        "options": [
          28,
          26,
          20
        ],
        "answer": 26
      },
      {
        "question": "<p>23</p><p>6</p><p>-3</p><p>4</p>",
        "options": [
          30,
          29,
          37
        ],
        "answer": 30
      },
      {
        "question": "<p>58</p><p>2</p><p>6</p><p>4</p>",
        "options": [
          72,
          70,
          73
        ],
        "answer": 70
      },
      {
        "question": "<p>18</p><p>2</p><p>5</p><p>4</p>",
        "options": [
          28,
          29,
          23
        ],
        "answer": 29
      },
      {
        "question": "<p>25</p><p>4</p><p>1</p><p>7</p>",
        "options": [
          44,
          40,
          37
        ],
        "answer": 37
      },
      {
        "question": "<p>33</p><p>-1</p><p>8</p><p>6</p>",
        "options": [
          46,
          54,
          47
        ],
        "answer": 46
      },
      {
        "question": "<p>22</p><p>8</p><p>3</p><p>5</p>",
        "options": [
          43,
          38,
          36
        ],
        "answer": 38
      },
      {
        "question": "<p>15</p><p>4</p><p>2</p><p>7</p>",
        "options": [
          28,
          24,
          34
        ],
        "answer": 28
      },
      {
        "question": "<p>4</p><p>-3</p><p>4</p><p>2</p>",
        "options": [
          8,
          9,
          7
        ],
        "answer": 7
      },
      {
        "question": "<p></p><p>7</p><p>1</p><p>5</p>",
        "options": [
          52,
          55,
          61
        ],
        "answer": 55
      },
      {
        "question": "<p>29</p><p>1</p><p>5</p><p>3</p>",
        "options": [
          33,
          46,
          38
        ],
        "answer": 38
      },
      {
        "question": "<p>9</p><p>1</p><p>7</p>",
        "options": [
          17,
          15,
          12
        ],
        "answer": 17
      },
      {
        "question": "<p>2</p><p>4</p><p>-5</p><p>4</p>",
        "options": [
          5,
          11,
          13
        ],
        "answer": 5
      },
      {
        "question": "<p>3</p><p>3</p><p>-5</p><p>7</p>",
        "options": [
          8,
          16,
          4
        ],
        "answer": 8
      },
      {
        "question": "<p>9</p><p>-8</p><p>3</p><p>2</p>",
        "options": [
          6,
          4,
          3
        ],
        "answer": 6
      },
      {
        "question": "<p>5</p><p>4</p><p>-8</p><p>6</p>",
        "options": [
          7,
          9,
          13
        ],
        "answer": 7
      },
      {
        "question": "<p>5</p><p>-2</p><p>7</p><p>4</p>",
        "options": [
          14,
          12,
          17
        ],
        "answer": 14
      },
      {
        "question": "<p>2</p><p>9</p><p>6</p><p>-4</p>",
        "options": [
          7,
          17,
          13
        ],
        "answer": 13
      },
      {
        "question": "<p>4</p><p>2</p><p>5</p><p>6</p>",
        "options": [
          17,
          24,
          19
        ],
        "answer": 17
      },
      {
        "question": "<p>8</p><p>5</p><p>7</p><p>8</p>",
        "options": [
          28,
          36,
          34
        ],
        "answer": 28
      },
      {
        "question": "<p>7</p><p>6</p><p>2</p><p>4</p>",
        "options": [
          17,
          19,
          22
        ],
        "answer": 19
      },
      {
        "question": "<p>3</p><p>6</p><p>-4</p><p>7</p>",
        "options": [
          12,
          6,
          17
        ],
        "answer": 12
      },
      {
        "question": "<p>8</p><p>3</p><p>7</p><p>-5</p>",
        "options": [
          9,
          7,
          13
        ],
        "answer": 13
      },
      {
        "question": "<p>2</p><p>3</p><p>9</p><p>8</p>",
        "options": [
          24,
          22,
          29
        ],
        "answer": 22
      },
      {
        "question": "<p>6</p><p>3</p><p>-4</p><p>9</p>",
        "options": [
          8,
          11,
          14
        ],
        "answer": 14
      },
      {
        "question": "<p>6</p><p>-1</p><p>9</p><p>5</p>",
        "options": [
          19,
          17,
          18
        ],
        "answer": 19
      },
      {
        "question": "<p>9</p><p>-4</p><p>9</p><p>6</p>",
        "options": [
          25,
          26,
          20
        ],
        "answer": 20
      },
      {
        "question": "<p>8</p><p>-3</p><p>9</p><p>-2</p>",
        "options": [
          12,
          8,
          6
        ],
        "answer": 12
      },
      {
        "question": "<p>7</p><p>-3</p><p>2</p><p>-5</p>",
        "options": [
          3,
          1,
          4
        ],
        "answer": 1
      },
      {
        "question": "<p>8</p><p>-3</p><p>-4</p><p>6</p>",
        "options": [
          5,
          8,
          7
        ],
        "answer": 7
      },
      {
        "question": "<p>4</p><p>1</p><p>-2</p><p>6</p>",
        "options": [
          9,
          6,
          5
        ],
        "answer": 9
      },
      {
        "question": "<p>6</p><p>-4</p><p>2</p><p>3</p>",
        "options": [
          2,
          14,
          7
        ],
        "answer": 7
      }
  ];

const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const optionA = document.getElementById("a_text");
const optionB = document.getElementById("b_text");
const optionC = document.getElementById("c_text");

const timeEl = document.getElementById("time");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownEl = document.getElementById("countdown");

// buttons
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
// let time = 0;
let timer;
let countdown;

// new
let userAnswers = Array(quizData.length).fill(null);

function startCountdown() {
    let countdownTime = 3;
    countdownEl.innerText = countdownTime;
    countdownOverlay.style.display = 'flex';
    
    countdown = setInterval(() => {
        countdownTime--;
        countdownEl.innerText = countdownTime;
        
        if (countdownTime <= 0) {
            clearInterval(countdown);
            countdownOverlay.style.display = 'none';
            startTimer();
            loadQuiz();
        }
    }, 1000);
}

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerHTML = formatQuestion(currentQuiz + 1, currentQuizData.question);
    optionA.innerText = currentQuizData.options[0];
    optionB.innerText = currentQuizData.options[1];
    optionC.innerText = currentQuizData.options[2];
    
    if (userAnswers[currentQuiz] !== null) {
        answerEls[userAnswers[currentQuiz]].checked = true;
    }

    previousBtn.style.display = currentQuiz > 0 ? 'inline-block' : 'none';
    nextBtn.style.display = currentQuiz < quizData.length - 1 ? 'inline-block' : 'none';
    submitBtn.style.display = currentQuiz === quizData.length - 1 ? 'inline-block' : 'none';
}

function formatQuestion(number, question) {
    return `<p id="dont">Question ${number} / ${quizData.length}</p>${question}`;
}

function getSelected() {
    let answerIndex = null;
    answerEls.forEach((answerEl, index) => {
        if (answerEl.checked) {
            answerIndex = index;
        }
    });
    return answerIndex;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => {
        answerEl.checked = false;
    });
}

function startTimer() {
    let timeLeft = 3000; // 45 minutes in seconds

    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeEl.innerText = `${pad(minutes)}:${pad(seconds)}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleQuizSubmission();
        }

        timeLeft--;
    }, 1000);
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

nextBtn.addEventListener("click", () => {
    const answerIndex = getSelected();
    if (answerIndex !== null) {
        userAnswers[currentQuiz] = answerIndex;
        currentQuiz++;
        loadQuiz();
    }
});

previousBtn.addEventListener("click", () => {
    if (currentQuiz > 0) {
        currentQuiz--;
        loadQuiz();
    }
});

submitBtn.addEventListener("click", handleQuizSubmission);

function handleQuizSubmission() {
    const answerIndex = getSelected();
    if (answerIndex !== null) {
        userAnswers[currentQuiz] = answerIndex;
    }

    clearInterval(timer);
    const score = calculateScore();
    const detailedResults = generateDetailedResults();
    displayScoreAndResults(score, detailedResults);
    setupNavigation();
    saveResultsToFirestore(score, detailedResults);
}

function calculateScore() {
    let score = 0;
    for (let i = 0; i < quizData.length; i++) {
        const isCorrect = quizData[i].options[userAnswers[i]] === parseInt(quizData[i].answer);
        if (isCorrect) {
            score++;
        }
    }
    return score;
}

function generateDetailedResults() {
    return quizData.map((questionData, i) => ({
        question: questionData.question,
        options: questionData.options,
        userAnswer: userAnswers[i],
        correct: questionData.options[userAnswers[i]] === parseInt(questionData.answer),
        answer: questionData.answer
    }));
}

function displayScoreAndResults(score, detailedResults) {
    quiz.innerHTML = `
        <div id="score-section">
            <h2 id="result">You answered correctly ${score}/${quizData.length} questions.<br><br> In ${timeEl.innerText}</h2>
            <button id="view-answers-btn" style="padding: 10px 20px; margin-top: 20px;">View Answers</button>
            <button id="home-btn" style="padding: 10px 20px; margin-top: 20px;">Home</button>
        </div>
        <div id="result-section">
            ${generateResultHTML(detailedResults)}
            <button id="back-btn" style="padding: 10px 20px; margin-top: 20px;">Back</button>
        </div>
    `;

    document.getElementById("result-section").style.display = "none";
}

function setupNavigation() {
    document.getElementById("view-answers-btn").addEventListener("click", () => {
        document.getElementById("score-section").style.display = "none";
        document.getElementById("result-section").style.display = "block";
    });

    document.getElementById("back-btn").addEventListener("click", () => {
        document.getElementById("result-section").style.display = "none";
        document.getElementById("score-section").style.display = "block";
    });

    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = '../dashboard.html';
    });
}

function saveResultsToFirestore(score, detailedResults) {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const scoreRef = collection(db, 'scores');
        const userDocRef = doc(scoreRef, userName);

        getDoc(userDocRef).then((docSnapshot) => {
            const scoreData = {
                score: score,
                maxScore: quizData.length,
                timestamp: serverTimestamp(),
                results: detailedResults
            };

            if (docSnapshot.exists()) {
                updateDoc(userDocRef, {
                    level1: scoreData
                }).then(() => {
                    console.log('Score updated successfully!');
                }).catch((error) => {
                    console.error('Error updating score: ', error);
                });
            } else {
                setDoc(userDocRef, {
                    level1: scoreData
                }).then(() => {
                    console.log('Score saved successfully!');
                }).catch((error) => {
                    console.error('Error saving score: ', error);
                });
            }
        }).catch((error) => {
            console.error('Error fetching user document: ', error);
        });
    }
}

function generateResultHTML(detailedResults) {
    return detailedResults.map((result, i) => `
        <div style="background-color: white; color: black; padding: 20px;">
            <h3>Question ${i + 1}</h3>
            <p>${result.question}</p>
            ${result.options.map((option, idx) => `
                <button style="background-color: ${
                    result.userAnswer === idx ? (result.correct ? 'green' : 'red') : 'grey'
                };">
                    ${option}
                </button>
            `).join('')}
            <p>Correct answer: ${result.answer}</p>
            <hr>
        </div>
    `).join('');
}

// Start the countdown on page load
window.onload = () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const scoreRef = collection(db, 'scores');
        const userDocRef = doc(scoreRef, userName);

        getDoc(userDocRef).then((docSnapshot) => {
            if (docSnapshot.exists() && docSnapshot.data().level1) {
                console.error('User has already completed the quiz.');
                document.getElementById("quiz").classList.add("quiz-attempted");
                quiz.innerHTML = '<h2>You have already completed the quiz.</h2><br><button><a href="../dashboard.html">Home</a></button>';
                const countdownOverlay = document.getElementById("countdown-overlay");
                countdownOverlay.style.display = 'none';
            } else {
                startCountdown();
            }
        }).catch((error) => {
            console.error('Error checking quiz status: ', error);
        });
    } else {
        startCountdown();
    }
};
