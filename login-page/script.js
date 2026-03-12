document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleIcon = document.getElementById('toggleIcon');
    const submitBtn = document.getElementById('submitBtn');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon classes
        if (type === 'text') {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });

    // Toggle between Login and Sign Up
    const createAccountLink = document.querySelector('.create-account');
    const headerTitle = document.querySelector('.login-header h2');
    const headerDesc = document.querySelector('.login-header p');
    const submitText = document.querySelector('.btn-text');
    const forgotPassword = document.querySelector('.forgot-password');
    const rememberMe = document.querySelector('.remember-me');
    const footerText = document.querySelector('.login-footer p');

    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset form state on toggle
        loginForm.reset();
        resetError(emailInput);
        resetError(passwordInput);

        const isSignup = loginForm.dataset.mode === 'signup';
        
        if (isSignup) {
            // Switch to Login
            loginForm.dataset.mode = 'login';
            headerTitle.textContent = 'Welcome back';
            headerDesc.textContent = 'Please enter your details to sign in.';
            submitText.textContent = 'Sign In';
            forgotPassword.style.display = 'block';
            rememberMe.style.visibility = 'visible';
            footerText.innerHTML = `Don't have an account? <a href="#" class="create-account">Sign up</a>`;
        } else {
            // Switch to Sign Up
            loginForm.dataset.mode = 'signup';
            headerTitle.textContent = 'Create an account';
            headerDesc.textContent = 'Enter your details to register.';
            submitText.textContent = 'Sign Up';
            forgotPassword.style.display = 'none';
            rememberMe.style.visibility = 'hidden';
            footerText.innerHTML = `Already have an account? <a href="#" class="create-account">Sign in</a>`;
        }

        // Re-attach event listener to the new link created by innerHTML replacement
        const newToggleLink = document.querySelector('.create-account');
        if(newToggleLink) {
            newToggleLink.addEventListener('click', arguments.callee);
        }
    });

    // Form Validation and Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Reset previous errors
        resetError(emailInput);
        resetError(passwordInput);

        // Validate Email
        const emailValue = emailInput.value.trim();
        if (!emailValue) {
            showError(emailInput, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Password
        const passwordValue = passwordInput.value;
        if (!passwordValue) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }

        // If valid, simulate API call
        if (isValid) {
            // Simulate loading state
            submitBtn.classList.add('loading');
            
            // Disable inputs during submission
            emailInput.disabled = true;
            passwordInput.disabled = true;

            const isLoginMode = loginForm.dataset.mode !== 'signup';
            const endpoint = isLoginMode ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                submitBtn.classList.remove('loading');
                emailInput.disabled = false;
                passwordInput.disabled = false;

                if (status === 200 || status === 201) {
                    // Success! Save user info and redirect
                    localStorage.setItem('user', JSON.stringify(body.user));
                    window.location.href = 'dashboard.html';
                } else {
                    // Show error from backend
                    showError(emailInput, body.message || 'Authentication failed');
                    // Focus password field on error
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            })
            .catch(error => {
                submitBtn.classList.remove('loading');
                emailInput.disabled = false;
                passwordInput.disabled = false;
                console.error('Auth Error:', error);
                showError(emailInput, 'Network error. Please make sure the backend server is running.');
            });
        }
    });

    // Remove error styling on input dynamically
    emailInput.addEventListener('input', () => resetError(emailInput));
    passwordInput.addEventListener('input', () => resetError(passwordInput));

    // Helper Functions
    function showError(inputElement, message) {
        const inputGroup = inputElement.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');
        
        inputGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function resetError(inputElement) {
        const inputGroup = inputElement.closest('.input-group');
        inputGroup.classList.remove('error');
    }

    function isValidEmail(email) {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add subtle interactive scaling effects on input focus
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        
        input.addEventListener('focus', function() {
            wrapper.style.transform = 'scale(1.01)';
            wrapper.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            wrapper.style.transform = 'scale(1)';
        });
    });
});
