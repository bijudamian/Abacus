// Import Firebase and necessary functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
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
const db = getFirestore(app);

// Example quiz data
const quizData = [
{"question": "<p>54</p><p>10</p><p>-5</p><p>-3</p>", "options": [66, 54, 56], "answer": 56},
{"question": "<p>64</p><p>-3</p><p>-5</p><p>4</p>", "options": [58, 62, 60], "answer": 60},
{"question": "<p>52</p><p>10</p><p>-5</p><p>-1</p>", "options": [64, 54, 56], "answer": 56},
{"question": "<p>52</p><p>10</p><p>-5</p><p>-1</p>", "options": [56, 58, 64], "answer": 56},
{"question": "<p>51</p><p>10</p><p>-5</p><p>4</p>", "options": [60, 54, 68], "answer": 60}
];

// Function to save quiz data to Firestore
async function saveQuizData(level, quizData) {
    const quizRef = collection(db, `Quizzes/level${level}/questions`);

    for (let i = 0; i < quizData.length; i++) {
        const questionDoc = doc(quizRef, `question${i + 1}`);
        await setDoc(questionDoc, quizData[i]);
    }
    console.log(`Quiz data for level ${level} saved successfully!`);
}

// Call the function to save data
const levelIndex = 1; // Change this to the appropriate level
saveQuizData(levelIndex, quizData);
