// secure-server.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const quizData = require('./quizData'); // Import quiz data

const app = express();
const port = 3000;

const options = {
    key: readFileSync('R:/Projects/Abacus/private-key.pem'),
    cert: readFileSync('R:/Projects/Abacus/certificate.pem')
};

app.use(cors());
app.use(bodyParser.json());

app.post('/validate-quiz', (req, res) => {
    const { answers } = req.body;
    let score = 0;
    const detailedResults = [];

    for (let i = 0; i < quizData.length; i++) {
        const correct = quizData[i].options[answers[i]] === quizData[i].answer;
        if (correct) {
            score++;
        }
        detailedResults.push({ userAnswer: answers[i], correct });
    }

    res.json({ score, detailedResults });
});

https.createServer(options, app).listen(port, () => {
    console.log(`Secure server is running on https://localhost:${port}`);
});
