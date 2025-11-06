document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let allVideos = [];
    let filteredVideos = [];
    let currentFilter = 'all';
    let currentSearch = '';

    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadVideos();
            setupEventListeners();
        } else {
            // Usuario no autenticado, igual puede ver videos
            await loadVideos();
            setupEventListeners();
        }
    });

    async function loadVideos() {
        try {
            // Simular carga de videos (en un proyecto real vendrían de una API o base de datos)
            allVideos = [
                {
                    id: 1,
                    title: 'Minecraft: Construyendo una Ciudad Epica',
                    thumbnail: 'https://via.placeholder.com/300x180/6c63ff/ffffff?text=Minecraft',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'minecraft',
                    views: 15420,
                    duration: '24:15',
                    uploadDate: '2024-01-15',
                    likes: 1200,
                    description: 'En este episodio construimos una ciudad completa en Minecraft con detalles increíbles y técnicas avanzadas de construcción.'
                },
                {
                    id: 2,
                    title: 'Roblox: Aventura en el Parque de Atracciones',
                    thumbnail: 'https://via.placeholder.com/300x180/ff6584/ffffff?text=Roblox',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'roblox',
                    views: 8920,
                    duration: '18:30',
                    uploadDate: '2024-01-12',
                    likes: 850,
                    description: 'Divertida aventura en Roblox explorando un parque de atracciones lleno de minijuegos y sorpresas.'
                },
                {
                    id: 3,
                    title: 'Tutorial: Cómo Crear un Mod para Minecraft',
                    thumbnail: 'https://via.placeholder.com/300x180/00d9ff/ffffff?text=Tutorial',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'tutoriales',
                    views: 23100,
                    duration: '45:20',
                    uploadDate: '2024-01-10',
                    likes: 2100,
                    description: 'Aprende a crear tu primer mod para Minecraft desde cero. Guía completa para principiantes.'
                },
                {
                    id: 4,
                    title: 'Gameplay: Supervivencia Extrema en Minecraft',
                    thumbnail: 'https://via.placeholder.com/300x180/00ff88/ffffff?text=Gameplay',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'gameplays',
                    views: 18750,
                    duration: '32:45',
                    uploadDate: '2024-01-08',
                    likes: 1650,
                    description: 'Intensa partida de supervivencia en modo extremo. ¿Podré sobrevivir?'
                },
                {
                    id: 5,
                    title: 'Roblox: Construye tu Propio Juego desde Cero',
                    thumbnail: 'https://via.placeholder.com/300x180/ffaa00/ffffff?text=Roblox',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'tutoriales',
                    views: 12500,
                    duration: '38:10',
                    uploadDate: '2024-01-05',
                    likes: 1100,
                    description: 'Guía completa para crear tu primer juego en Roblox Studio.'
                },
                {
                    id: 6,
                    title: 'Minecraft: Redstone Avanzado - Máquinas Automáticas',
                    thumbnail: 'https://via.placeholder.com/300x180/6c63ff/ffffff?text=Minecraft',
                    videoId: 'dQw4w9WgXcQ',
                    category: 'tutoriales',
                    views: 29800,
                    duration: '52:30',
                    uploadDate: '2024-01-03',
                    likes: 2800,
                    description: 'Domina la redstone creando máquinas automáticas complejas y sistemas avanzados.'
                }
            ];

            filteredVideos = [...allVideos];
            renderVideos();

        } catch (error) {
            console.error('Error loading videos:', error);
            utils.showNotification('Error al cargar los videos', 'error');
        }
    }

    function renderVideos() {
        const videosGrid = document.getElementById('videosGrid');
        videosGrid.innerHTML = '';

        if (filteredVideos.length === 0) {
            videosGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-video-slash"></i>
                    <h3>No se encontraron videos</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
            return;
        }

        filteredVideos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-duration">${video.duration}</div>
                    <div class="video-category">${video.category}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span class="video-views">
                            <i class="fas fa-eye"></i> ${video.views.toLocaleString()}
                        </span>
                        <span class="video-date">
                            <i class="fas fa-calendar"></i> ${formatDate(video.uploadDate)}
                        </span>
                    </div>
                </div>
            `;

            videoCard.addEventListener('click', () => openVideoModal(video));
            videosGrid.appendChild(videoCard);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        return `Hace ${Math.floor(diffDays / 30)} meses`;
    }

    function setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                filterVideos();
            });
        });

        // Búsqueda
        document.getElementById('videoSearch').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterVideos();
        });

        // Cargar más videos
        document.getElementById('loadMoreBtn').addEventListener('click', loadMoreVideos);

        // Modal
        document.getElementById('modalClose').addEventListener('click', closeVideoModal);
        document.getElementById('videoModal').addEventListener('click', (e) => {
            if (e.target.id === 'videoModal') closeVideoModal();
        });

        // Acciones del video
        document.getElementById('likeBtn').addEventListener('click', toggleLike);
        document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
        document.getElementById('shareBtn').addEventListener('click', shareVideo);

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeVideoModal();
        });
    }

    function filterVideos() {
        filteredVideos = allVideos.filter(video => {
            const matchesFilter = currentFilter === 'all' || video.category === currentFilter;
            const matchesSearch = video.title.toLowerCase().includes(currentSearch) ||
                                video.description.toLowerCase().includes(currentSearch);
            return matchesFilter && matchesSearch;
        });
        renderVideos();
    }

    function loadMoreVideos() {
        // Simular carga de más videos
        const newVideos = [
            {
                id: 7,
                title: 'Minecraft: Explorando las Nuevas Cuevas',
                thumbnail: 'https://via.placeholder.com/300x180/6c63ff/ffffff?text=Minecraft+New',
                videoId: 'dQw4w9WgXcQ',
                category: 'minecraft',
                views: 8900,
                duration: '28:20',
                uploadDate: '2024-01-01',
                likes: 750,
                description: 'Exploramos las nuevas cuevas y actualizaciones del juego.'
            },
            {
                id: 8,
                title: 'Roblox: Competencia de Parkour',
                thumbnail: 'https://via.placeholder.com/300x180/ff6584/ffffff?text=Roblox+Parkour',
                videoId: 'dQw4w9WgXcQ',
                category: 'roblox',
                views: 11200,
                duration: '21:15',
                uploadDate: '2023-12-28',
                likes: 980,
                description: 'Intensa competencia de parkour con los amigos.'
            }
        ];

        allVideos.push(...newVideos);
        filterVideos();
        utils.showNotification('Más videos cargados', 'success');
    }

    function openVideoModal(video) {
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('videoIframe');

        // Actualizar información del modal
        document.getElementById('modalTitle').textContent = video.title;
        document.getElementById('viewCount').textContent = video.views.toLocaleString();
        document.getElementById('uploadDate').textContent = formatDate(video.uploadDate);
        document.getElementById('videoDuration').textContent = video.duration;
        document.getElementById('videoDescription').textContent = video.description;
        document.getElementById('likeCount').textContent = video.likes.toLocaleString();

        // Configurar iframe del video (usando YouTube como ejemplo)
        iframe.src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;

        // Mostrar modal
        modal.classList.add('show');

        // Registrar visualización si el usuario está logueado
        if (currentUser) {
            registerVideoView(video.id);
        }
    }

    function closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('videoIframe');

        // Detener el video
        iframe.src = '';

        // Ocultar modal
        modal.classList.remove('show');
    }

    async function registerVideoView(videoId) {
        try {
            if (currentUser) {
                await db.collection('user_activity').add({
                    userId: currentUser.uid,
                    videoId: videoId,
                    type: 'video_view',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error registering video view:', error);
        }
    }

    function toggleLike() {
        const likeBtn = document.getElementById('likeBtn');
        const likeCount = document.getElementById('likeCount');
        
        likeBtn.classList.toggle('active');
        if (likeBtn.classList.contains('active')) {
            likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> <span id="likeCount">' + (parseInt(likeCount.textContent) + 1) + '</span>';
            utils.showNotification('Video liked', 'success');
        } else {
            likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i> <span id="likeCount">' + (parseInt(likeCount.textContent) - 1) + '</span>';
        }
    }

    function toggleFavorite() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.classList.toggle('active');
        
        if (favoriteBtn.classList.contains('active')) {
            favoriteBtn.innerHTML = '<i class="fas fa-bookmark"></i> Guardado';
            utils.showNotification('Video agregado a favoritos', 'success');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-bookmark"></i> Guardar';
        }
    }

    function shareVideo() {
        const videoUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: document.getElementById('modalTitle').textContent,
                url: videoUrl
            });
        } else {
            navigator.clipboard.writeText(videoUrl).then(() => {
                utils.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
    }

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
});