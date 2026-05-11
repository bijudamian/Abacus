import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {firebaseConfig} from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const scoresTableBody = document.getElementById('scoresTableBody');
const authSection = document.getElementById('authSection');
const adminSection = document.getElementById('adminSection');
const levelSelect = document.getElementById('levelSelect');

// --- Toast notifications ---
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle authentication
    document.getElementById('authForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const pemail = 'sara@admin.com'
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');

        if (pemail == email){
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    authSection.classList.add('hidden');
                    adminSection.classList.remove('hidden');
                    fetchScores();
                })
                .catch(error => {
                    console.error('Error during login:', error.message);
                    showToast('Login failed. Please check your credentials.', 'error');
                    submitBtn.textContent = 'Sign In';
                    submitBtn.disabled = false;
                });
        } else {
            showToast('Unauthorized. Admin access only.', 'error');
        }
    });
    

    levelSelect.addEventListener('change', fetchScores);

    document.getElementById('addUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const studentName = document.getElementById('studentName').value.trim();
        const email = `${studentName}@saraabacus.com`;
        const password = document.getElementById('password').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');

        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created and added to Firestore:', user);
            showToast(`Student "${studentName}" created successfully!`, 'success');
            document.getElementById('studentName').value = '';
            document.getElementById('password').value = '';
        } catch (error) {
            console.error('Error creating user:', error.message);
            let msg = 'Failed to create user.';
            if (error.code === 'auth/email-already-in-use') msg = 'This student already exists.';
            else if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
            showToast(msg, 'error');
        } finally {
            submitBtn.textContent = 'Add Student';
            submitBtn.disabled = false;
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                adminSection.classList.add('hidden');
                authSection.classList.remove('hidden');
                showToast('Logged out successfully.');
            });
        });
    }
});

async function fetchScores() {
    try {
        scoresTableBody.innerHTML = '';
        const selectedLevel = levelSelect.value;
        const scoresSnapshot = await getDocs(collection(db, 'scores'));
        let rowCount = 0;

        scoresSnapshot.forEach((doc) => {
            const studentName = doc.id;
            const levels = doc.data();

            for (const level in levels) {
                if (levels[level].hasOwnProperty('score') && (selectedLevel === 'all' || selectedLevel === level)) {
                    const score = levels[level].score;
                    const maxScore = levels[level].maxScore || '?';
                    const row = createTableRow(studentName, level, score, maxScore);
                    scoresTableBody.appendChild(row);
                    rowCount++;
                }
            }
        });

        if (rowCount === 0) {
            scoresTableBody.innerHTML = '<tr><td colspan="3" class="empty-table">No scores found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching scores:', error);
        scoresTableBody.innerHTML = '<tr><td colspan="3" class="empty-table">Error loading scores.</td></tr>';
    }
}

function createTableRow(studentName, level, score, maxScore) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = studentName;

    const levelCell = document.createElement('td');
    levelCell.textContent = level.replace('level', 'Level ');

    const scoreCell = document.createElement('td');
    const percent = maxScore !== '?' ? Math.round((score / maxScore) * 100) : null;
    const color = percent >= 70 ? '#10b981' : percent >= 40 ? '#f59e0b' : '#ef4444';
    scoreCell.innerHTML = `<strong style="color: ${color}">${score}</strong> / ${maxScore}${percent !== null ? ` <span style="color: ${color}; font-size: 0.8rem">(${percent}%)</span>` : ''}`;

    row.appendChild(nameCell);
    row.appendChild(levelCell);
    row.appendChild(scoreCell);

    return row;
}
