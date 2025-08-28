// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; // Replace with your actual Google Client Secret

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

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
        showNotification('Google sign-in is not available. Please use email login.', 'info');
    }
}

// Handle Google Sign-In Success
function handleGoogleSignIn(userData) {
    // Store user data in localStorage (in real app, send to server)
    localStorage.setItem('googleUserData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    showNotification('Successfully signed in with Google!', 'success');
    
    // Redirect to dashboard or main page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Form Validation
function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Reset previous error states
    clearFormErrors();
    
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (password.length < 1) {
        showFieldError('password', 'Password is required');
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
    
    const fields = document.querySelectorAll('.form-group input');
    fields.forEach(field => {
        field.style.borderColor = '#ddd';
    });
}

// Form submission handler
function handleFormSubmission(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Disable submit button
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';
        
        // Collect form data
        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Check if user exists in localStorage (in real app, verify with server)
            const storedUserData = localStorage.getItem('userData');
            const googleUserData = localStorage.getItem('googleUserData');
            
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                if (userData.email === loginData.email && userData.password === loginData.password) {
                    // Successful login
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    showNotification('Login successful! Welcome back!', 'success');
                    
                    // Redirect to main page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showNotification('Invalid email or password. Please try again.', 'error');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                }
            } else if (googleUserData) {
                const googleUser = JSON.parse(googleUserData);
                if (googleUser.email === loginData.email) {
                    // Google user trying to login with email
                    showNotification('This email is associated with a Google account. Please use Google sign-in.', 'info');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                } else {
                    showNotification('Invalid email or password. Please try again.', 'error');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                }
            } else {
                // No user found
                showNotification('No account found with this email. Please sign up first.', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            }
        }, 1500);
    }
}

// Forgot password function
function showForgotPassword() {
    showNotification('Password reset functionality will be implemented soon. Please contact support.', 'info');
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
    loginForm.addEventListener('submit', handleFormSubmission);
    
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
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Redirect to main page if already logged in
        window.location.href = 'index.html';
    }
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
