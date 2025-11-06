document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;

    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadProfileData(user);
            await loadUserStats(user);
            await loadAchievements(user);
            setupEventListeners();
        } else {
            window.location.href = 'login.html';
        }
    });

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', async function(e) {
        e.preventDefault();
        const result = await logoutUser();
        if (result.success) {
            utils.showNotification('Sesión cerrada correctamente', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    async function loadProfileData(user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                // Actualizar información básica
                document.getElementById('profileUsername').textContent = userData.username || 'Usuario';
                document.getElementById('displayName').value = userData.displayName || '';
                document.getElementById('bio').value = userData.bio || '';
                document.getElementById('website').value = userData.website || '';
                
                // Actualizar avatar si existe
                if (userData.avatarUrl) {
                    document.getElementById('profileAvatar').src = userData.avatarUrl;
                }
                
                // Actualizar nivel y experiencia
                if (userData.level) {
                    document.getElementById('profileLevel').textContent = userData.level;
                }
                if (userData.exp) {
                    document.getElementById('currentExp').textContent = userData.exp;
                    updateLevelProgress(userData.exp, userData.level || 1);
                }

                // Cargar preferencias
                loadPreferences(userData.preferences || {});
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
            utils.showNotification('Error al cargar el perfil', 'error');
        }
    }

    function updateLevelProgress(exp, level) {
        const expForNextLevel = level * 500; // Fórmula simple
        const progress = (exp / expForNextLevel) * 100;
        document.getElementById('levelProgress').style.width = `${Math.min(progress, 100)}%`;
        document.getElementById('nextLevelExp').textContent = expForNextLevel;
    }

    function loadPreferences(preferences) {
        document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
        document.getElementById('newsletter').checked = preferences.newsletter !== false;
        document.getElementById('theme').value = preferences.theme || 'dark';
        document.getElementById('language').value = preferences.language || 'es';
    }

    async function loadUserStats(user) {
        try {
            // Simular estadísticas (en un proyecto real vendrían de la base de datos)
            const stats = {
                videos: 24,
                comics: 15,
                time: '36h',
                achievements: 8
            };

            document.getElementById('statVideos').textContent = stats.videos;
            document.getElementById('statComics').textContent = stats.comics;
            document.getElementById('statTime').textContent = stats.time;
            document.getElementById('statAchievements').textContent = stats.achievements;

        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    async function loadAchievements(user) {
        try {
            const achievements = [
                {
                    id: 1,
                    name: 'Primeros Pasos',
                    description: 'Completa tu registro',
                    icon: 'fas fa-user-plus',
                    unlocked: true
                },
                {
                    id: 2,
                    name: 'Espectador',
                    description: 'Mira 10 videos',
                    icon: 'fas fa-play-circle',
                    unlocked: true
                },
                {
                    id: 3,
                    name: 'Lector',
                    description: 'Lee 5 comics',
                    icon: 'fas fa-book',
                    unlocked: true
                },
                {
                    id: 4,
                    name: 'Explorador',
                    description: 'Visita todas las secciones',
                    icon: 'fas fa-compass',
                    unlocked: false
                },
                {
                    id: 5,
                    name: 'Social',
                    description: 'Completa tu perfil',
                    icon: 'fas fa-users',
                    unlocked: false
                },
                {
                    id: 6,
                    name: 'Veterano',
                    description: 'Nivel 10 alcanzado',
                    icon: 'fas fa-star',
                    unlocked: false
                }
            ];

            const achievementsGrid = document.getElementById('achievementsGrid');
            achievementsGrid.innerHTML = '';

            achievements.forEach(achievement => {
                const achievementElement = document.createElement('div');
                achievementElement.className = `achievement-item ${achievement.unlocked ? '' : 'locked'}`;
                achievementElement.innerHTML = `
                    <div class="achievement-icon">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                `;
                achievementsGrid.appendChild(achievementElement);
            });

        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    function setupEventListeners() {
        // Upload de avatar
        document.getElementById('avatarUpload').addEventListener('change', handleAvatarUpload);
        document.querySelector('.avatar-container').addEventListener('click', () => {
            document.getElementById('avatarUpload').click();
        });

        // Formularios
        document.getElementById('basicInfoForm').addEventListener('submit', handleBasicInfoSubmit);
        document.getElementById('preferencesForm').addEventListener('submit', handlePreferencesSubmit);
    }

    async function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            utils.showNotification('Por favor selecciona una imagen válida', 'error');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            utils.showNotification('La imagen debe ser menor a 5MB', 'error');
            return;
        }

        try {
            // Mostrar loading
            const avatar = document.getElementById('profileAvatar');
            const originalSrc = avatar.src;
            avatar.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><path fill="%236c63ff" d="M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2Z"/></svg>';

            // Subir imagen a Firebase Storage
            const storageRef = firebase.storage().ref();
            const avatarRef = storageRef.child(`avatars/${currentUser.uid}/${file.name}`);
            const snapshot = await avatarRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Actualizar avatar en la interfaz
            avatar.src = downloadURL;

            // Guardar URL en Firestore
            await db.collection('users').doc(currentUser.uid).update({
                avatarUrl: downloadURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            utils.showNotification('Avatar actualizado correctamente', 'success');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            utils.showNotification('Error al subir el avatar', 'error');
            // Restaurar imagen original en caso de error
            avatar.src = originalSrc;
        }
    }

    async function handleBasicInfoSubmit(event) {
        event.preventDefault();
        
        const displayName = document.getElementById('displayName').value.trim();
        const bio = document.getElementById('bio').value.trim();
        const website = document.getElementById('website').value.trim();

        try {
            await db.collection('users').doc(currentUser.uid).update({
                displayName: displayName || null,
                bio: bio || null,
                website: website || null,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            utils.showNotification('Información guardada correctamente', 'success');
        } catch (error) {
            console.error('Error saving basic info:', error);
            utils.showNotification('Error al guardar la información', 'error');
        }
    }

    async function handlePreferencesSubmit(event) {
        event.preventDefault();
        
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            newsletter: document.getElementById('newsletter').checked,
            theme: document.getElementById('theme').value,
            language: document.getElementById('language').value
        };

        try {
            await db.collection('users').doc(currentUser.uid).update({
                preferences: preferences,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            utils.showNotification('Preferencias guardadas correctamente', 'success');
        } catch (error) {
            console.error('Error saving preferences:', error);
            utils.showNotification('Error al guardar las preferencias', 'error');
        }
    }

    // Efectos visuales para las tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las tarjetas del perfil
    document.querySelectorAll('.profile-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});