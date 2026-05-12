import { supabase } from './supabaseClient.js';

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
    document.getElementById('authForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const pemail = 'sara@admin.com';
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');

        if (pemail == email){
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error('Error during login:', error.message);
                showToast('Login failed. Please check your credentials.', 'error');
                submitBtn.textContent = 'Sign In';
                submitBtn.disabled = false;
            } else {
                localStorage.setItem('supabaseToken', data.session.access_token);
                authSection.classList.add('hidden');
                adminSection.classList.remove('hidden');
                fetchScores();
            }
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

        const token = localStorage.getItem('supabaseToken');
        let data, error;
        try {
            const response = await fetch('https://lpbrfmaevpidtyhakhfw.supabase.co/functions/v1/create-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.error) {
                error = { message: result.error };
            } else {
                data = result;
            }
        } catch(e) {
            error = { message: 'Network error' };
        }

        if (error) {
            console.error('Error creating user:', error.message);
            let msg = 'Failed to create user.';
            if (error.message.includes('already exists')) msg = 'This student already exists.';
            else if (error.message.includes('Password should be at least 6 characters')) msg = 'Password must be at least 6 characters.';
            showToast(msg, 'error');
            submitBtn.textContent = 'Add Student';
            submitBtn.disabled = false;
        } else {
            console.log('User created:', data);
            showToast(`Student "${studentName}" created successfully!`, 'success');
            document.getElementById('studentName').value = '';
            document.getElementById('password').value = '';
            submitBtn.textContent = 'Add Student';
            submitBtn.disabled = false;
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            adminSection.classList.add('hidden');
            authSection.classList.remove('hidden');
            showToast('Logged out successfully.');
        });
    }
});

async function fetchScores() {
    try {
        scoresTableBody.innerHTML = '';
        const selectedLevel = levelSelect.value;

        let query = supabase.from('scores').select('*');
        if (selectedLevel !== 'all') {
            query = query.eq('level', selectedLevel);
        }

        const { data, error } = await query;
        if (error) throw error;

        let rowCount = 0;

        data.forEach((row) => {
            const studentName = row.student_name;
            const level = row.level;
            const score = row.score;
            const maxScore = row.max_score || '?';

            const tr = createTableRow(studentName, level, score, maxScore);
            scoresTableBody.appendChild(tr);
            rowCount++;
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


    // Manage UI Sections
    const questionsSection = document.getElementById('questionsSection');
    const permissionsSection = document.getElementById('permissionsSection');

    document.getElementById('manageQuestionsBtn').addEventListener('click', () => {
        questionsSection.classList.remove('hidden');
    });
    document.getElementById('closeQuestionsBtn').addEventListener('click', () => {
        questionsSection.classList.add('hidden');
    });

    document.getElementById('managePermissionsBtn').addEventListener('click', () => {
        permissionsSection.classList.remove('hidden');
    });
    document.getElementById('closePermissionsBtn').addEventListener('click', () => {
        permissionsSection.classList.add('hidden');
    });

    // Add Custom Question
    document.getElementById('addQuestionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const level = document.getElementById('qLevel').value;
        const question = document.getElementById('qHtml').value;
        const optionsStr = document.getElementById('qOptions').value;
        const answer = parseInt(document.getElementById('qAnswer').value);

        const options = optionsStr.split(',').map(v => parseInt(v.trim()));

        const { error } = await supabase.from('custom_questions').insert([{
            level, question, options, answer
        }]);

        if (error) {
            showToast('Failed to add question', 'error');
            console.error(error);
        } else {
            showToast('Question added successfully!');
            e.target.reset();
        }
    });

    // Update Permissions
    document.getElementById('updatePermissionsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const student_name = document.getElementById('permStudentName').value.trim();
        const levelsStr = document.getElementById('permLevels').value;
        const allowed_levels = levelsStr.split(',').map(v => v.trim());

        const { error } = await supabase.from('student_permissions').upsert({
            student_name, allowed_levels
        });

        if (error) {
            showToast('Failed to update permissions', 'error');
            console.error(error);
        } else {
            showToast('Permissions updated successfully!');
            e.target.reset();
        }
    });
