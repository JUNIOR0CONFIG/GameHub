document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await loadUserData(user);
            await loadUserStats(user);
            await loadRecentActivity(user);
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

    async function loadUserData(user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                document.getElementById('userName').textContent = userData.username || 'Usuario';
                
                // Actualizar nivel y exp si existen
                if (userData.level) {
                    document.getElementById('userLevel').textContent = userData.level;
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async function loadUserStats(user) {
        try {
            // Simular datos de estadísticas (en un proyecto real, estos vendrían de la base de datos)
            const stats = {
                videosWatched: 12,
                comicsRead: 8,
                achievements: 5,
                level: 3
            };

            // Animar contadores
            animateCounter('videosWatched', stats.videosWatched);
            animateCounter('comicsRead', stats.comicsRead);
            animateCounter('achievements', stats.achievements);
            document.getElementById('userLevel').textContent = stats.level;

        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const duration = 2000; // 2 segundos
        const step = targetValue / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    async function loadRecentActivity(user) {
        try {
            // Simular actividad reciente
            const activities = [
                {
                    type: 'video',
                    title: 'Gameplay Minecraft Episodio 5',
                    time: 'Hace 2 horas',
                    icon: 'fas fa-play-circle'
                },
                {
                    type: 'comic',
                    title: 'Aventura Espacial #3',
                    time: 'Hace 1 día',
                    icon: 'fas fa-book'
                },
                {
                    type: 'achievement',
                    title: 'Logro desbloqueado: Lector Ávido',
                    time: 'Hace 2 días',
                    icon: 'fas fa-trophy'
                }
            ];

            const activityList = document.getElementById('activityList');
            activityList.innerHTML = '';

            activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <i class="${activity.icon} activity-icon"></i>
                    <div class="activity-info">
                        <p>${activity.title}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });

        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    // Simular actualización en tiempo real del estado del servidor
    function updateServerStatus() {
        const servers = document.querySelectorAll('.server-status-indicator');
        servers.forEach(server => {
            // Simular cambio aleatorio de estado (solo para demostración)
            if (Math.random() > 0.8) { // 20% de probabilidad de cambio
                server.classList.toggle('online');
                server.classList.toggle('offline');
                const status = server.classList.contains('online') ? 'Online' : 'Offline';
                server.querySelector('span').textContent = status;
            }
        });
    }

    // Actualizar estado cada 30 segundos
    setInterval(updateServerStatus, 30000);
});