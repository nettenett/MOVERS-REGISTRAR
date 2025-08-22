// Login Page JavaScript Functions

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordToggle.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        passwordToggle.textContent = '👁️';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Clear previous error messages
    clearErrorMessage();
    
    // Validate form
    if (!validateLoginForm(username, password)) {
        return;
    }
    
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    showLoading(loginBtn, 'Logging in...');
    
    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
        // Check credentials (replace with real authentication logic)
        if (authenticateUser(username, password)) {
            // Redirect to dashboard on successful login
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid username or password');
            hideLoading(loginBtn, 'Log In');
        }
    }, 2000);
}

// Form validation
function validateLoginForm(username, password) {
    if (!username || !password) {
        showError('Please fill in all fields');
        return false;
    }
    
    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return false;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

// Simulate user authentication (replace with actual API call)
// Admin authentication only
function authenticateUser(username, password) {
    // Admin-only credentials - replace with real authentication
    const adminCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'administrator', password: 'admin2024' },
        { username: 'schooladmin', password: 'school123' }
    ];
    
    return adminCredentials.some(cred => 
        cred.username === username && cred.password === password
    );
}

// Show error message
function showError(message) {
    // Remove existing error message
    clearErrorMessage();
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.textContent = message;
    
    // Insert error message at the top of the form
    const loginForm = document.querySelector('.login-form');
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(clearErrorMessage, 5000);
}

// Clear error message
function clearErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Show loading state
function showLoading(button, text) {
    button.textContent = text;
    button.disabled = true;
}

// Hide loading state
function hideLoading(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

// Handle forgot password
function handleForgotPassword() {
    // Replace with actual forgot password functionality
    alert('Forgot password functionality would redirect to password recovery page.');
    // window.location.href = 'forgot-password.html';
}

// Add input focus effects
function addInputEffects() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Initialize login page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add form submit event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add input focus effects
    addInputEffects();
    
    // Auto-focus on username field
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
});

// Handle Enter key press on password field
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.id === 'password') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    }
});