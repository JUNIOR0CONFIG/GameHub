// Configuración de Firebase (gratuita)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
const firebaseConfig = {
    apiKey: "AIzaSyCovWsYvSUOYDkJ-tVYlUMbjzxf6gaUEIw",
    authDomain: "gamehub-02.firebaseapp.com",
    projectId: "gamehub-02",
    storageBucket: "gamehub-02.firebasestorage.app",
    messagingSenderId: "161881593765",
    appId: "1:161881593765:web:fc66f79c7e6bfdb0057a4c",
    measurementId: "G-L1NZ84LJH8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario logueado
        console.log('Usuario conectado:', user.email);
        updateUIForLoggedInUser(user);
    } else {
        // Usuario no logueado
        console.log('Usuario no conectado');
        updateUIForLoggedOutUser();
    }
});

// Función para registrar usuario
async function registerUser(email, password, username) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Guardar datos adicionales en Firestore
        await db.collection('users').doc(user.uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            avatar: 'default.png',
            level: 1,
            exp: 0
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Función para login
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Función para logout
async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Actualizar UI según estado de autenticación
function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> Perfil`;
        loginBtn.href = 'profile.html';
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `Iniciar Sesión`;
        loginBtn.href = 'login.html';
    }
}