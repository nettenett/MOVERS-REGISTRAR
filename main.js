// Global JavaScript Functions for Movers School Registration System

// Global utility functions
const Utils = {
    // Format date to readable string
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (basic)
    isValidPhone: function(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[-\s]/g, ''));
    },

    // Capitalize first letter
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Debounce function for search inputs
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Message display functions
const MessageHandler = {
    // Show success message
    showSuccess: function(message, container = null) {
        this.showMessage(message, 'success', container);
    },

    // Show error message
    showError: function(message, container = null) {
        this.showMessage(message, 'error', container);
    },

    // Show general message
    showMessage: function(message, type = 'info', container = null) {
        // Remove existing messages
        this.clearMessages(container);

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;

        // Insert message
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
        } else {
            const form = document.querySelector('form');
            if (form) {
                form.insertBefore(messageDiv, form.firstChild);
            }
        }

        // Auto-remove after 5 seconds
        setTimeout(() => this.clearMessages(container), 5000);
    },

    // Clear all messages
    clearMessages: function(container = null) {
        const selector = container || document;
        const messages = selector.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    }
};

// Loading state management
const LoadingManager = {
    // Show loading state on button
    showButtonLoading: function(button, text = 'Loading...') {
        button.dataset.originalText = button.textContent;
        button.innerHTML = `<span class="loading"></span> ${text}`;
        button.disabled = true;
    },

    // Hide loading state on button
    hideButtonLoading: function(button) {
        const originalText = button.dataset.originalText || 'Submit';
        button.textContent = originalText;
        button.disabled = false;
        delete button.dataset.originalText;
    },

    // Show page loading overlay
    showPageLoading: function() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading"></div>
                <p>Loading...</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(overlay);
    },

    // Hide page loading overlay
    hidePageLoading: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

// Form validation helpers
const FormValidator = {
    // Validate required fields
    validateRequired: function(fields) {
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                isValid = false;
                errors.push(`${field.name} is required`);
                this.highlightError(element);
            } else {
                this.removeError(element);
            }
        });

        return { isValid, errors };
    },

    // Highlight field with error
    highlightError: function(element) {
        if (element) {
            element.style.borderColor = '#d32f2f';
            element.style.background = '#fff5f5';
        }
    },

    // Remove error highlighting
    removeError: function(element) {
        if (element) {
            element.style.borderColor = '';
            element.style.background = '';
        }
    },

    // Clear all form errors
    clearErrors: function() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.removeError(input));
    }
};

// Local storage helpers
const Storage = {
    // Set item in localStorage
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },

    // Get item from localStorage
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
            return null;
        }
    },

    // Remove item from localStorage
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
    },

    // Clear all localStorage
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    }
};

// Session management
const Session = {
    // Check if user is logged in
    isLoggedIn: function() {
        return Storage.get('currentUser') !== null;
    },

    // Get current user
    getCurrentUser: function() {
        return Storage.get('currentUser');
    },

    // Set current user
    setCurrentUser: function(user) {
        return Storage.set('currentUser', user);
    },

    // Logout user
    logout: function() {
        Storage.remove('currentUser');
        window.location.href = '../pages/login.html';
    },

    // Check user role
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
};

// Navigation helpers
const Navigation = {
    // Go back to previous page
    goBack: function() {
        window.history.back();
    },

    // Redirect with loading
    redirect: function(url, showLoading = true) {
        if (showLoading) {
            LoadingManager.showPageLoading();
        }
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    },

    // Smooth scroll to element
    scrollTo: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            Navigation.scrollTo(targetId);
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Auto-clear form errors when user starts typing
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            FormValidator.removeError(this);
        });

        input.addEventListener('input', function() {
            FormValidator.removeError(this);
        });
    });

    // Add loading animation to form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                LoadingManager.showButtonLoading(submitButton, 'Processing...');
            }
        });
    });

    console.log('Movers School Registration System initialized');
});