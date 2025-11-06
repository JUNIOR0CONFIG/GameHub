document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Validación en tiempo real
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    function validateEmail() {
        const email = emailInput.value.trim();
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
        
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            return false;
        } else if (password.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            return false;
        } else {
            passwordError.textContent = '';
            return true;
        }
    }

    // Submit del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isEmailValid && isPasswordValid) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Mostrar loading
            const submitBtn = loginForm.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            submitBtn.disabled = true;
            
            try {
                const result = await loginUser(email, password);
                
                if (result.success) {
                    utils.showNotification('¡Inicio de sesión exitoso!', 'success');
                    
                    // Guardar preferencia de "Recordarme"
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
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
                utils.showNotification('Error al iniciar sesión', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    // Login con Google
    document.querySelector('.btn-google').addEventListener('click', function() {
        utils.showNotification('Login con Google en desarrollo', 'info');
    });

    // Login con Discord
    document.querySelector('.btn-discord').addEventListener('click', function() {
        utils.showNotification('Login con Discord en desarrollo', 'info');
    });

    // Recordar usuario si está guardado
    if (localStorage.getItem('rememberMe') === 'true') {
        // Aquí podrías recuperar el último email usado
        // emailInput.value = localStorage.getItem('lastEmail') || '';
    }
});