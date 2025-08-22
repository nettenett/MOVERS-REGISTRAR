// Admin Registration JavaScript

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const passwordToggle = passwordField.nextElementSibling;
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordToggle.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        passwordToggle.textContent = '👁️';
    }
}

// Validation functions
const RegisterValidator = {
    // Validate name (letters only)
    validateName: function(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    },

    // Validate email
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
        return phoneRegex.test(phone);
    },

    // Validate username
    validateUsername: function(username) {
        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
        return usernameRegex.test(username) && username.length >= 4;
    },

    // Validate password strength
    validatePassword: function(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasMinLength = password.length >= 8;
        
        return {
            isValid: hasUppercase && hasLowercase && hasNumbers && hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumbers,
            hasMinLength
        };
    },

    // Check if username exists
    usernameExists: function(username) {
        const existingAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
        return existingAccounts.some(account => account.username === username);
    },

    // Check if email exists
    emailExists: function(email) {
        const existingAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
        return existingAccounts.some(account => account.email === email);
    }
};

// Real-time validation
function setupRealTimeValidation() {
    const fields = {
        firstName: RegisterValidator.validateName,
        lastName: RegisterValidator.validateName,
        email: RegisterValidator.validateEmail,
        phone: RegisterValidator.validatePhone,
        username: RegisterValidator.validateUsername
    };

    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldId, fields[fieldId]);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(fieldId);
            });
        }
    });

    // Special handling for username availability
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.addEventListener('blur', function() {
            checkUsernameAvailability(this.value);
        });
    }

    // Special handling for email availability
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            checkEmailAvailability(this.value);
        });
    }

    // Password confirmation
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('blur', function() {
            validatePasswordMatch();
        });
    }

    // Password strength indicator
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            showPasswordStrength(this.value);
        });
    }
}

// Validate individual field
function validateField(fieldId, validator) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(fieldId, 'This field is required');
        return false;
    }
    
    if (!validator(value)) {
        let errorMessage = 'Invalid format';
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                errorMessage = 'Name should contain only letters (2-50 characters)';
                break;
            case 'email':
                errorMessage = 'Please enter a valid email address';
                break;
            case 'phone':
                errorMessage = 'Please enter a valid phone number';
                break;
            case 'username':
                errorMessage = 'Username should be 4-20 characters (letters and numbers only)';
                break;
        }
        showFieldError(fieldId, errorMessage);
        return false;
    }
    
    showFieldSuccess(fieldId);
    return true;
}

// Check username availability
function checkUsernameAvailability(username) {
    if (!username || !RegisterValidator.validateUsername(username)) return;
    
    if (RegisterValidator.usernameExists(username)) {
        showFieldError('username', 'Username already exists. Please choose another.');
        return false;
    }
    
    showFieldSuccess('username', 'Username is available');
    return true;
}

// Check email availability
function checkEmailAvailability(email) {
    if (!email || !RegisterValidator.validateEmail(email)) return;
    
    if (RegisterValidator.emailExists(email)) {
        showFieldError('email', 'Email already registered. Please use another email.');
        return false;
    }
    
    showFieldSuccess('email', 'Email is available');
    return true;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!confirmPassword) return;
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        return false;
    }
    
    showFieldSuccess('confirmPassword', 'Passwords match');
    return true;
}

// Show password strength
function showPasswordStrength(password) {
    const validation = RegisterValidator.validatePassword(password);
    const field = document.getElementById('password');
    const existingStrength = field.parentElement.parentElement.querySelector('.password-strength');
    
    if (existingStrength) existingStrength.remove();
    
    if (!password) return;
    
    const strengthDiv = document.createElement('div');
    strengthDiv.className = 'password-strength';
    strengthDiv.innerHTML = `
        <div class="strength-requirements">
            <div class="${validation.hasMinLength ? 'valid' : 'invalid'}">✓ At least 8 characters</div>
            <div class="${validation.hasUppercase ? 'valid' : 'invalid'}">✓ Uppercase letter</div>
            <div class="${validation.hasLowercase ? 'valid' : 'invalid'}">✓ Lowercase letter</div>
            <div class="${validation.hasNumbers ? 'valid' : 'invalid'}">✓ Number</div>
        </div>
    `;
    
    // Add CSS for strength indicator
    if (!document.getElementById('strength-css')) {
        const style = document.createElement('style');
        style.id = 'strength-css';
        style.textContent = `
            .password-strength { margin-top: 10px; }
            .strength-requirements div { font-size: 12px; margin: 2px 0; }
            .strength-requirements .valid { color: #4caf50; }
            .strength-requirements .invalid { color: #999; }
        `;
        document.head.appendChild(style);
    }
    
    field.parentElement.parentElement.appendChild(strengthDiv);
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.className = 'form-group error';
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-text');
    if (existingError) existingError.remove();
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Show field success
function showFieldSuccess(fieldId, message = '') {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.className = 'form-group success';
    
    // Remove existing messages
    const existingError = formGroup.querySelector('.error-text');
    const existingSuccess = formGroup.querySelector('.success-text');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
    
    // Add success message if provided
    if (message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-text';
        successDiv.textContent = message;
        formGroup.appendChild(successDiv);
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.className = 'form-group';
    
    const existingError = formGroup.querySelector('.error-text');
    const existingSuccess = formGroup.querySelector('.success-text');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

// Handle form submission
function handleRegistration(event) {
    event.preventDefault();
    
    // Clear previous messages
    MessageHandler.clearMessages();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields
    if (!validateAllFields(data)) {
        MessageHandler.showError('Please fix the errors above before submitting.');
        return;
    }
    
    // Show loading
    const submitBtn = document.querySelector('.register-btn');
    LoadingManager.showButtonLoading(submitBtn, 'Creating Account...');
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save account to localStorage (in real app, send to server)
            saveAdminAccount(data);
            
            // Show success and redirect
            MessageHandler.showSuccess('Admin account created successfully! Redirecting to login...');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            MessageHandler.showError('Failed to create account. Please try again.');
            LoadingManager.hideButtonLoading(submitBtn);
        }
    }, 2000);
}

// Validate all form fields
function validateAllFields(data) {
    let isValid = true;
    
    // Required field validation
    const requiredFields = [
        { field: 'firstName', validator: RegisterValidator.validateName, message: 'Valid first name is required' },
        { field: 'lastName', validator: RegisterValidator.validateName, message: 'Valid last name is required' },
        { field: 'email', validator: RegisterValidator.validateEmail, message: 'Valid email is required' },
        { field: 'phone', validator: RegisterValidator.validatePhone, message: 'Valid phone number is required' },
        { field: 'username', validator: RegisterValidator.validateUsername, message: 'Valid username is required' }
    ];
    
    requiredFields.forEach(({ field, validator, message }) => {
        if (!data[field] || !validator(data[field])) {
            showFieldError(field, message);
            isValid = false;
        }
    });
    
    // Check username availability
    if (data.username && RegisterValidator.usernameExists(data.username)) {
        showFieldError('username', 'Username already exists');
        isValid = false;
    }
    
    // Check email availability
    if (data.email && RegisterValidator.emailExists(data.email)) {
        showFieldError('email', 'Email already registered');
        isValid = false;
    }
    
    // Password validation
    const passwordValidation = RegisterValidator.validatePassword(data.password);
    if (!passwordValidation.isValid) {
        showFieldError('password', 'Password does not meet requirements');
        isValid = false;
    }
    
    // Password confirmation
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Required selections
    if (!data.department) {
        showFieldError('department', 'Please select a department');
        isValid = false;
    }
    
    if (!data.securityQuestion) {
        showFieldError('securityQuestion', 'Please select a security question');
        isValid = false;
    }
    
    if (!data.securityAnswer) {
        showFieldError('securityAnswer', 'Security answer is required');
        isValid = false;
    }
    
    // Checkbox validation
    if (!data.terms) {
        MessageHandler.showError('You must accept the Terms and Conditions');
        isValid = false;
    }
    
    if (!data.adminCode) {
        MessageHandler.showError('Admin authorization confirmation is required');
        isValid = false;
    }
    
    return isValid;
}

// Save admin account
function saveAdminAccount(data) {
    const existingAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
    
    const newAccount = {
        id: Utils.generateId(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        department: data.department,
        username: data.username.trim().toLowerCase(),
        password: data.password, // In real app, this should be hashed
        securityQuestion: data.securityQuestion,
        securityAnswer: data.securityAnswer.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    existingAccounts.push(newAccount);
    localStorage.setItem('adminAccounts', JSON.stringify(existingAccounts));
    
    console.log('Admin account created:', { username: newAccount.username, email: newAccount.email });
}

// Initialize registration page
document.addEventListener('DOMContentLoaded', function() {
    // Setup form validation
    setupRealTimeValidation();
    
    // Add form submit listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Auto-focus first field
    const firstNameField = document.getElementById('firstName');
    if (firstNameField) {
        firstNameField.focus();
    }
    
    console.log('Admin registration page initialized');
});