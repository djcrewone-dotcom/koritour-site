// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // Replace with your actual Google Client Secret

// DOM Elements
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const termsModal = document.getElementById('termsModal');
const privacyModal = document.getElementById('privacyModal');
const closeButtons = document.querySelectorAll('.close');

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    // Load Google Sign-In API
    if (typeof gapi !== 'undefined') {
        gapi.load('auth2', function() {
            gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID
            });
        });
    }
}

// Google Sign-In Function
function signInWithGoogle() {
    if (typeof gapi !== 'undefined' && gapi.auth2) {
        gapi.auth2.getAuthInstance().signIn().then(
            function(googleUser) {
                const profile = googleUser.getBasicProfile();
                const userData = {
                    id: profile.getId(),
                    name: profile.getName(),
                    email: profile.getEmail(),
                    picture: profile.getImageUrl(),
                    provider: 'google'
                };
                
                // Handle successful Google sign-in
                handleGoogleSignIn(userData);
            },
            function(error) {
                console.error('Google Sign-In Error:', error);
                showNotification('Google sign-in failed. Please try again.', 'error');
            }
        );
    } else {
        // Fallback for when Google API is not loaded
        showNotification('Google sign-in is not available. Please use email signup.', 'info');
    }
}

// Handle Google Sign-In Success
function handleGoogleSignIn(userData) {
    // Store user data in localStorage (in real app, send to server)
    localStorage.setItem('googleUserData', JSON.stringify(userData));
    
    // Show success message
    showNotification('Successfully signed in with Google!', 'success');
    
    // Redirect to dashboard or main page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Form Validation
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const country = document.getElementById('country').value;
    const termsAccepted = document.getElementById('termsAccepted').checked;
    
    // Reset previous error states
    clearFormErrors();
    
    let isValid = true;
    
    // Full Name validation
    if (fullName.length < 2) {
        showFieldError('fullName', 'Full name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Password validation
    if (password.length < 8) {
        showFieldError('password', 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    // Password confirmation validation
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Country validation
    if (!country) {
        showFieldError('country', 'Please select your country');
        isValid = false;
    }
    
    // Terms acceptance validation
    if (!termsAccepted) {
        showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#f44336';
}

// Clear form errors
function clearFormErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const fields = document.querySelectorAll('.form-group input, .form-group select');
    fields.forEach(field => {
        field.style.borderColor = '#ddd';
    });
}

// Form submission handler
function handleFormSubmission(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Disable submit button
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';
        
        // Collect form data
        const formData = new FormData(signupForm);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            country: formData.get('country'),
            marketingAccepted: formData.get('marketingAccepted') === 'on',
            provider: 'email',
            createdAt: new Date().toISOString()
        };
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Store user data (in real app, send to server)
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show success message
            showNotification('Account created successfully! Welcome to KoriTour!', 'success');
            
            // Reset form
            signupForm.reset();
            
            // Redirect to main page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    }
}

// Modal functions
function showTerms() {
    termsModal.style.display = 'block';
}

function showPrivacy() {
    privacyModal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

// Add CSS animations
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
            line-height: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-message {
            flex: 1;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 10001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            top: 15px;
            right: 20px;
        }
        
        .close:hover {
            color: #000;
        }
        
        .terms-content h3 {
            color: #333;
            margin-top: 25px;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .terms-content p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add notification styles
    addNotificationStyles();
    
    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Form submission
    signupForm.addEventListener('submit', handleFormSubmission);
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Real-time password confirmation validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    function checkPasswordMatch() {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = '#f44336';
        } else if (confirmPassword.value) {
            confirmPassword.style.borderColor = '#4CAF50';
        } else {
            confirmPassword.style.borderColor = '#ddd';
        }
    }
    
    password.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);
    
    // Real-time email validation
    const email = document.getElementById('email');
    email.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#f44336';
        } else if (this.value) {
            this.style.borderColor = '#4CAF50';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
});

// Load Google Sign-In API
function loadGoogleSignInAPI() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);
}

// Load Google API when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleSignInAPI);
} else {
    loadGoogleSignInAPI();
}
