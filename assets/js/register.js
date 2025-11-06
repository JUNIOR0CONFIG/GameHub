document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Validación en tiempo real
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameError = document.getElementById('usernameError');
        
        if (!username) {
            usernameError.textContent = 'El nombre de usuario es requerido';
            return false;
        } else if (username.length < 3) {
            usernameError.textContent = 'El usuario debe tener al menos 3 caracteres';
            return false;
        } else if (username.length > 20) {
            usernameError.textContent = 'El usuario no puede tener más de 20 caracteres';
            return false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            usernameError.textContent = 'Solo se permiten letras, números y guiones bajos';
            return false;
        } else {
            usernameError.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            emailError.textContent = 'El email es requerido';
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Ingresa un email válido';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        
        // Calcular fuerza de la contraseña
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Actualizar indicador visual
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (password.length === 0) {
            strengthFill.style.width = '0%';
            strengthText.textContent = '';
        } else if (strength <= 2) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Débil';
        } else if (strength <= 4) {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Media';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Fuerte';
        }

        if (!password) {
            return false;
        } else if (password.length < 6) {
            return false;
        } else {
            // Validar confirmación si ya hay texto
            if (confirmPasswordInput.value) {
                validateConfirmPassword();
            }
            return true;
        }
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Confirma tu contraseña';
            return false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Las contraseñas no coinciden';
            return false;
        } else {
            confirmPasswordError.textContent = '';
            return true;
        }
    }

    // Submit del formulario
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsAccepted = document.getElementById('acceptTerms').checked;
        
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAccepted) {
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Mostrar loading
            const submitBtn = registerForm.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
            submitBtn.disabled = true;
            
            try {
                const result = await registerUser(email, password, username);
                
                if (result.success) {
                    utils.showNotification('¡Cuenta creada exitosamente!', 'success');
                    
                    // Redirigir al dashboard después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    utils.showNotification(result.error, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                utils.showNotification('Error al crear la cuenta', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } else if (!isTermsAccepted) {
            utils.showNotification('Debes aceptar los términos y condiciones', 'error');
        }
    });

    // Registro con Google
    document.querySelector('.btn-google').addEventListener('click', function() {
        utils.showNotification('Registro con Google en desarrollo', 'info');
    });

    // Registro con Discord
    document.querySelector('.btn-discord').addEventListener('click', function() {
        utils.showNotification('Registro con Discord en desarrollo', 'info');
    });
});