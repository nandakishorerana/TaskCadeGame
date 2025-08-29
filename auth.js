// Authentication Management
function showSigninForm() {
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('signinForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function signin(event) {
    event.preventDefault();
    
    const username = document.getElementById('signinUsername').value.trim();
    const password = document.getElementById('signinPassword').value;
    
    if (!username || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username] && users[username].password === password) {
        // Login successful
        const user = {
            username: username,
            email: users[username].email,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
}

function signup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields!');
        return;
    }
    
    if (username.length < 3 || username.length > 20) {
        alert('Username must be between 3 and 20 characters!');
        return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alert('Username can only contain letters and numbers!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        alert('Username already exists! Please choose a different one.');
        return;
    }
    
    // Check if email already exists
    const existingEmails = Object.values(users).map(user => user.email);
    if (existingEmails.includes(email)) {
        alert('Email already registered! Please use a different email.');
        return;
    }
    
    // Create new user
    users[username] = {
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    const user = {
        username: username,
        email: email,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    alert('Account created successfully!');
    window.location.href = 'index.html';
}

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // User is already logged in, redirect to main page
        window.location.href = 'index.html';
    }
}

// Initialize auth page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // Add enter key support for forms
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const signinForm = document.getElementById('signinForm');
            const signupForm = document.getElementById('signupForm');
            
            if (signinForm.style.display !== 'none') {
                signin(e);
            } else if (signupForm.style.display !== 'none') {
                signup(e);
            }
        }
    });
});
