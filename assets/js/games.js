document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let allGames = [];
    let filteredGames = [];
    let currentFilter = 'all';
    let currentSearch = '';

    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadGames();
            setupEventListeners();
        } else {
            await loadGames();
            setupEventListeners();
        }
    });

    async function loadGames() {
        try {
            // Simular carga de juegos y servidores
            allGames = [
                {
                    id: 1,
                    title: 'Minecraft Survival',
                    cover: 'https://via.placeholder.com/280x200/6c63ff/ffffff?text=Minecraft',
                    category: 'minecraft',
                    players: 154,
                    rating: 4.8,
                    description: 'Servidor de survival vanilla con economía y eventos especiales. ¡Únete a nuestra comunidad!',
                    ip: 'mc.gamehub.com',
                    version: '1.19.2',
                    status: 'online',
                    onlinePlayers: 154,
                    maxPlayers: 200,
                    featured: true
                },
                {
                    id: 2,
                    title: 'Roblox Adventure',
                    cover: 'https://via.placeholder.com/280x200/ff6584/ffffff?text=Roblox',
                    category: 'roblox',
                    players: 89,
                    rating: 4.6,
                    description: 'Diversos juegos de aventura en Roblox. Parkour, obbys y mucho más.',
                    ip: 'roblox.gamehub.com',
                    version: 'Latest',
                    status: 'online',
                    onlinePlayers: 89,
                    maxPlayers: 100,
                    featured: true
                },
                {
                    id: 3,
                    title: 'Minecraft Creative',
                    cover: 'https://via.placeholder.com/280x200/00d9ff/ffffff?text=Minecraft+Creative',
                    category: 'minecraft',
                    players: 42,
                    rating: 4.7,
                    description: 'Modo creativo ilimitado. Construye tus sueños sin límites.',
                    ip: 'creative.gamehub.com',
                    version: '1.19.2',
                    status: 'online',
                    onlinePlayers: 42,
                    maxPlayers: 50
                },
                {
                    id: 4,
                    title: 'Roblox Tycoon',
                    cover: 'https://via.placeholder.com/280x200/00ff88/ffffff?text=Roblox+Tycoon',
                    category: 'roblox',
                    players: 67,
                    rating: 4.5,
                    description: 'Juegos de tycoon y simulación. Construye tu imperio.',
                    ip: 'tycoon.gamehub.com',
                    version: 'Latest',
                    status: 'online',
                    onlinePlayers: 67,
                    maxPlayers: 80
                },
                {
                    id: 5,
                    title: 'Minecraft Minigames',
                    cover: 'https://via.placeholder.com/280x200/ffaa00/ffffff?text=Minecraft+Games',
                    category: 'minecraft',
                    players: 128,
                    rating: 4.9,
                    description: 'Diversos minijuegos: BedWars, SkyWars, Build Battle y más.',
                    ip: 'games.gamehub.com',
                    version: '1.19.2',
                    status: 'online',
                    onlinePlayers: 128,
                    maxPlayers: 150
                },
                {
                    id: 6,
                    title: 'Roblox FPS',
                    cover: 'https://via.placeholder.com/280x200/6c63ff/ffffff?text=Roblox+FPS',
                    category: 'roblox',
                    players: 93,
                    rating: 4.4,
                    description: 'Juegos de disparos en primera persona. ¡Demuestra tu puntería!',
                    ip: 'fps.gamehub.com',
                    version: 'Latest',
                    status: 'online',
                    onlinePlayers: 93,
                    maxPlayers: 100
                }
            ];

            filteredGames = [...allGames];
            renderFeaturedServers();
            renderGames();

        } catch (error) {
            console.error('Error loading games:', error);
            utils.showNotification('Error al cargar los juegos', 'error');
        }
    }

    function renderFeaturedServers() {
        const featuredServers = document.getElementById('featuredServers');
        const featuredGames = allGames.filter(game => game.featured);

        featuredServers.innerHTML = '';

        featuredGames.forEach(game => {
            const serverCard = document.createElement('div');
            serverCard.className = 'server-card featured';
            serverCard.innerHTML = `
                <div class="server-header">
                    <div class="server-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="server-info">
                        <h3>${game.title}</h3>
                        <span class="server-game">${game.category.toUpperCase()}</span>
                    </div>
                </div>
                <div class="server-stats">
                    <div class="server-stat">
                        <span class="stat-value">${game.onlinePlayers}/${game.maxPlayers}</span>
                        <span class="stat-label">Jugadores</span>
                    </div>
                    <div class="server-stat">
                        <span class="stat-value">${game.rating}</span>
                        <span class="stat-label">Rating</span>
                    </div>
                </div>
                <div class="server-status">
                    <div class="status-indicator ${game.status}"></div>
                    <span class="status-text">${game.status === 'online' ? 'En línea' : 'Desconectado'}</span>
                </div>
                <div class="server-actions">
                    <button class="btn btn-primary" onclick="joinServer('${game.ip}')">
                        <i class="fas fa-play"></i> Unirse
                    </button>
                    <button class="btn btn-secondary" onclick="openGameModal(${game.id})">
                        <i class="fas fa-info"></i> Info
                    </button>
                </div>
            `;
            featuredServers.appendChild(serverCard);
        });
    }

    function renderGames() {
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = '';

        if (filteredGames.length === 0) {
            gamesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-gamepad"></i>
                    <h3>No se encontraron juegos</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
            return;
        }

        filteredGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <div class="game-cover">
                    <img src="${game.cover}" alt="${game.title}">
                    <div class="game-category">${game.category}</div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-meta">
                        <span class="game-players">
                            <i class="fas fa-users"></i> ${game.players}
                        </span>
                        <span class="game-rating">
                            <i class="fas fa-star"></i> ${game.rating}
                        </span>
                    </div>
                </div>
            `;

            gameCard.addEventListener('click', () => openGameModal(game.id));
            gamesGrid.appendChild(gameCard);
        });
    }

    function setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                filterGames();
            });
        });

        // Búsqueda
        document.getElementById('gameSearch').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterGames();
        });

        // Cargar más juegos
        document.getElementById('loadMoreBtn').addEventListener('click', loadMoreGames);

        // Modal
        document.getElementById('gameModalClose').addEventListener('click', closeGameModal);
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') closeGameModal();
        });

        // Acciones del modal
        document.getElementById('playBtn').addEventListener('click', playGame);
        document.getElementById('joinServerBtn').addEventListener('click', joinServerFromModal);

        // Cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }

    function filterGames() {
        filteredGames = allGames.filter(game => {
            const matchesFilter = currentFilter === 'all' || 
                                (currentFilter === 'popular' && game.rating >= 4.7) ||
                                game.category === currentFilter;
            const matchesSearch = game.title.toLowerCase().includes(currentSearch) ||
                                game.description.toLowerCase().includes(currentSearch);
            return matchesFilter && matchesSearch;
        });
        renderGames();
    }

    function loadMoreGames() {
        // Simular carga de más juegos
        const newGames = [
            {
                id: 7,
                title: 'Minecraft Roleplay',
                cover: 'https://via.placeholder.com/280x200/ff6584/ffffff?text=Minecraft+RP',
                category: 'minecraft',
                players: 56,
                rating: 4.6,
                description: 'Servidor de roleplay con historias y personajes únicos.',
                ip: 'roleplay.gamehub.com',
                version: '1.19.2',
                status: 'online',
                onlinePlayers: 56,
                maxPlayers: 60
            }
        ];

        allGames.push(...newGames);
        filterGames();
        utils.showNotification('Más juegos cargados', 'success');
    }

    function openGameModal(gameId) {
        const game = allGames.find(g => g.id === gameId);
        if (!game) return;

        const modal = document.getElementById('gameModal');
        
        // Actualizar información del modal
        document.getElementById('gameModalTitle').textContent = game.title;
        document.getElementById('gameHeroImage').src = game.cover;
        document.getElementById('gameDescription').textContent = game.description;
        document.getElementById('onlinePlayers').textContent = game.onlinePlayers;
        document.getElementById('gameRating').textContent = game.rating;
        document.getElementById('gameLikes').textContent = Math.floor(game.players * 2.5);
        document.getElementById('serverIP').textContent = game.ip;
        document.getElementById('serverVersion').textContent = game.version;
        document.getElementById('serverStatus').textContent = game.status === 'online' ? 'Online' : 'Offline';
        document.getElementById('serverStatus').className = `detail-value ${game.status}`;

        // Almacenar juego actual para las acciones
        modal.currentGame = game;

        // Mostrar modal
        modal.classList.add('show');

        // Registrar visualización si el usuario está logueado
        if (currentUser) {
            registerGameView(game.id);
        }
    }

    function closeGameModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
        modal.currentGame = null;
    }

    async function registerGameView(gameId) {
        try {
            if (currentUser) {
                await db.collection('user_activity').add({
                    userId: currentUser.uid,
                    gameId: gameId,
                    type: 'game_view',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error registering game view:', error);
        }
    }

    function playGame() {
        const modal = document.getElementById('gameModal');
        const game = modal.currentGame;
        
        if (game) {
            utils.showNotification(`Iniciando ${game.title}...`, 'info');
            // Aquí iría la lógica para iniciar el juego
            // Por ejemplo, redirigir a la página del juego o abrir el cliente
        }
    }

    function joinServerFromModal() {
        const modal = document.getElementById('gameModal');
        const game = modal.currentGame;
        
        if (game) {
            joinServer(game.ip);
        }
    }

    function joinServer(ip) {
        utils.showNotification(`Conectando a ${ip}...`, 'info');
        
        // Simular conexión al servidor
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% de éxito
            if (success) {
                utils.showNotification('¡Conectado al servidor exitosamente!', 'success');
            } else {
                utils.showNotification('Error al conectar al servidor', 'error');
            }
        }, 2000);
    }

    async function handleLogout(e) {
        e.preventDefault();
        const result = await logoutUser();
        if (result.success) {
            utils.showNotification('Sesión cerrada correctamente', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    // Hacer funciones globales para los botones en el HTML
    window.joinServer = joinServer;
    window.openGameModal = openGameModal;
});