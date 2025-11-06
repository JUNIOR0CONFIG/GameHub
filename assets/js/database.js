document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let allServers = [];
    let filteredServers = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'players';

    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadServers();
            setupEventListeners();
        } else {
            await loadServers();
            setupEventListeners();
        }
    });

    async function loadServers() {
        try {
            // Intentar cargar de Firebase primero
            const result = await database.servers.getServers({
                sortBy: 'onlinePlayers'
            });

            if (result.success && result.data.length > 0) {
                allServers = result.data;
            } else {
                // Usar datos de ejemplo si no hay datos en Firebase
                allServers = await loadSampleServers();
            }

            updateGlobalStats();
            filteredServers = [...allServers];
            renderServers();

        } catch (error) {
            console.error('Error loading servers:', error);
            utils.showNotification('Error al cargar los servidores', 'error');
        }
    }

    async function loadSampleServers() {
        // Datos de ejemplo
        return [
            {
                id: '1',
                name: 'Survival Paradise',
                ip: 'survival.gamehub.com',
                version: '1.19.2',
                category: 'survival',
                onlinePlayers: 154,
                maxPlayers: 200,
                status: 'online',
                rating: 4.8,
                votes: 1280,
                description: 'Servidor survival vanilla con economía y eventos especiales. ¡Únete a nuestra comunidad!',
                features: ['Economía', 'McMMO', 'Clanes', 'Eventos', 'Tiendas'],
                banner: 'https://via.placeholder.com/800x200/6c63ff/ffffff?text=Survival+Paradise',
                icon: '🌲',
                website: 'https://survival.gamehub.com',
                uptime: 99.2
            },
            {
                id: '2',
                name: 'Creative World',
                ip: 'creative.gamehub.com',
                version: '1.19.2',
                category: 'creative',
                onlinePlayers: 42,
                maxPlayers: 50,
                status: 'online',
                rating: 4.7,
                votes: 890,
                description: 'Modo creativo ilimitado. Construye tus sueños sin límites.',
                features: ['Creative', 'WorldEdit', 'VoxelSniper', 'Schematics'],
                banner: 'https://via.placeholder.com/800x200/00d9ff/ffffff?text=Creative+World',
                icon: '🏗️',
                website: 'https://creative.gamehub.com',
                uptime: 98.5
            },
            {
                id: '3',
                name: 'Minigames Mania',
                ip: 'minigames.gamehub.com',
                version: '1.19.2',
                category: 'minigames',
                onlinePlayers: 128,
                maxPlayers: 150,
                status: 'online',
                rating: 4.9,
                votes: 2100,
                description: 'Diversos minijuegos: BedWars, SkyWars, Build Battle y más.',
                features: ['BedWars', 'SkyWars', 'BuildBattle', 'Spleef', 'Parkour'],
                banner: 'https://via.placeholder.com/800x200/ff6584/ffffff?text=Minigames+Mania',
                icon: '🎮',
                website: 'https://minigames.gamehub.com',
                uptime: 99.8
            },
            {
                id: '4',
                name: 'Roleplay City',
                ip: 'roleplay.gamehub.com',
                version: '1.19.2',
                category: 'roleplay',
                onlinePlayers: 87,
                maxPlayers: 100,
                status: 'online',
                rating: 4.6,
                votes: 670,
                description: 'Servidor de roleplay con historias y personajes únicos.',
                features: ['Roleplay', 'Jobs', 'Economía', 'Casas', 'Vehicles'],
                banner: 'https://via.placeholder.com/800x200/00ff88/ffffff?text=Roleplay+City',
                icon: '🎭',
                website: 'https://roleplay.gamehub.com',
                uptime: 97.3
            },
            {
                id: '5',
                name: 'Modded Universe',
                ip: 'modded.gamehub.com',
                version: '1.18.2',
                category: 'modded',
                onlinePlayers: 56,
                maxPlayers: 80,
                status: 'online',
                rating: 4.5,
                votes: 450,
                description: 'Servidor modded con los mejores mods de tecnología y magia.',
                features: ['Tekkit', 'FTB', 'Magic', 'Technology', 'Adventure'],
                banner: 'https://via.placeholder.com/800x200/ffaa00/ffffff?text=Modded+Universe',
                icon: '⚡',
                website: 'https://modded.gamehub.com',
                uptime: 96.8
            },
            {
                id: '6',
                name: 'Hardcore Survival',
                ip: 'hardcore.gamehub.com',
                version: '1.19.2',
                category: 'survival',
                onlinePlayers: 92,
                maxPlayers: 120,
                status: 'online',
                rating: 4.7,
                votes: 780,
                description: 'Survival hardcore con dificultad aumentada y desafíos únicos.',
                features: ['Hardcore', 'Custom Mobs', 'Challenges', 'Seasons'],
                banner: 'https://via.placeholder.com/800x200/6c63ff/ffffff?text=Hardcore+Survival',
                icon: '💀',
                website: 'https://hardcore.gamehub.com',
                uptime: 98.1
            }
        ];
    }

    function updateGlobalStats() {
        const totalServers = allServers.length;
        const totalPlayers = allServers.reduce((sum, server) => sum + server.onlinePlayers, 0);
        const onlineServers = allServers.filter(server => server.status === 'online').length;

        document.getElementById('totalServers').textContent = totalServers;
        document.getElementById('totalPlayers').textContent = totalPlayers.toLocaleString();
        document.getElementById('onlineServers').textContent = onlineServers;
    }

    function renderServers() {
        const serversGrid = document.getElementById('serversGrid');
        serversGrid.innerHTML = '';

        if (filteredServers.length === 0) {
            serversGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-gray);">
                    <i class="fas fa-server" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 style="color: var(--text-light); margin-bottom: 10px;">No se encontraron servidores</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
            return;
        }

        filteredServers.forEach(server => {
            const serverCard = document.createElement('div');
            serverCard.className = 'server-card';
            serverCard.innerHTML = `
                <div class="server-banner">
                    <img src="${server.banner}" alt="${server.name}">
                    <div class="server-status ${server.status === 'online' ? 'status-online' : 'status-offline'}">
                        <i class="fas fa-circle"></i>
                        ${server.status === 'online' ? 'Online' : 'Offline'}
                    </div>
                    <div class="server-icon">
                        ${server.icon}
                    </div>
                </div>
                <div class="server-info">
                    <div class="server-header">
                        <div>
                            <h3 class="server-title">${server.name}</h3>
                            <span class="server-category">${server.category}</span>
                        </div>
                        <div class="server-rating">
                            <i class="fas fa-star"></i>
                            ${server.rating}
                        </div>
                    </div>
                    <p class="server-description">${server.description}</p>
                    <div class="server-stats">
                        <div class="server-players">
                            <i class="fas fa-users"></i>
                            ${server.onlinePlayers}/${server.maxPlayers}
                        </div>
                        <div class="server-version">
                            v${server.version}
                        </div>
                    </div>
                    <div class="server-actions">
                        <button class="btn-connect" onclick="connectToServer('${server.ip}')">
                            <i class="fas fa-plug"></i> Conectar
                        </button>
                        <button class="btn-info" onclick="openServerModal('${server.id}')">
                            <i class="fas fa-info"></i>
                        </button>
                    </div>
                </div>
            `;
            serversGrid.appendChild(serverCard);
        });
    }

    function setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                filterServers();
            });
        });

        // Búsqueda
        document.getElementById('serverSearch').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterServers();
        });

        // Ordenamiento
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            currentSort = e.target.value;
            sortServers();
        });

        // Cargar más servidores
        document.getElementById('loadMoreBtn').addEventListener('click', loadMoreServers);

        // Modal
        document.getElementById('serverModalClose').addEventListener('click', closeServerModal);
        document.getElementById('serverModal').addEventListener('click', (e) => {
            if (e.target.id === 'serverModal') closeServerModal();
        });

        // Acciones del modal
        document.getElementById('connectBtn').addEventListener('click', connectFromModal);
        document.getElementById('voteBtn').addEventListener('click', voteForServer);
        document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
        document.getElementById('shareBtn').addEventListener('click', shareServer);

        // Cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }

    function filterServers() {
        filteredServers = allServers.filter(server => {
            const matchesFilter = currentFilter === 'all' || server.category === currentFilter;
            const matchesSearch = server.name.toLowerCase().includes(currentSearch) ||
                                server.description.toLowerCase().includes(currentSearch) ||
                                server.ip.toLowerCase().includes(currentSearch);
            return matchesFilter && matchesSearch;
        });
        sortServers();
    }

    function sortServers() {
        switch (currentSort) {
            case 'players':
                filteredServers.sort((a, b) => b.onlinePlayers - a.onlinePlayers);
                break;
            case 'rating':
                filteredServers.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Para datos de ejemplo, ordenar por ID (simula fecha)
                filteredServers.sort((a, b) => b.id - a.id);
                break;
            case 'name':
                filteredServers.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        renderServers();
    }

    function loadMoreServers() {
        // Simular carga de más servidores
        const newServers = [
            {
                id: '7',
                name: 'SkyBlock Extreme',
                ip: 'skyblock.gamehub.com',
                version: '1.19.2',
                category: 'survival',
                onlinePlayers: 68,
                maxPlayers: 80,
                status: 'online',
                rating: 4.6,
                votes: 520,
                description: 'SkyBlock con desafíos extremos y economía avanzada.',
                features: ['SkyBlock', 'Challenges', 'Economy', 'Islands'],
                banner: 'https://via.placeholder.com/800x200/00d9ff/ffffff?text=SkyBlock+Extreme',
                icon: '☁️',
                website: 'https://skyblock.gamehub.com',
                uptime: 97.8
            }
        ];

        allServers.push(...newServers);
        filterServers();
        updateGlobalStats();
        utils.showNotification('Más servidores cargados', 'success');
    }

    async function openServerModal(serverId) {
        const server = allServers.find(s => s.id === serverId);
        if (!server) return;

        const modal = document.getElementById('serverModal');
        
        // Actualizar información del modal
        document.getElementById('serverModalTitle').textContent = server.name;
        document.getElementById('serverBanner').src = server.banner;
        document.getElementById('modalPlayers').textContent = `${server.onlinePlayers}/${server.maxPlayers}`;
        document.getElementById('modalVersion').textContent = server.version;
        document.getElementById('modalIP').textContent = server.ip;
        document.getElementById('modalFullVersion').textContent = server.version;
        document.getElementById('modalCategory').textContent = server.category;
        document.getElementById('modalWebsite').href = server.website;
        document.getElementById('modalWebsite').textContent = 'Visitar sitio';
        document.getElementById('modalOnlinePlayers').textContent = server.onlinePlayers;
        document.getElementById('modalRating').textContent = server.rating;
        document.getElementById('modalVotes').textContent = server.votes.toLocaleString();
        document.getElementById('modalUptime').textContent = `${server.uptime}%`;
        document.getElementById('modalDescription').textContent = server.description;

        // Actualizar estado
        const statusIndicator = document.querySelector('.server-status .status-indicator');
        const statusText = document.querySelector('.server-status .status-text');
        statusIndicator.className = `status-indicator ${server.status}`;
        statusText.textContent = server.status === 'online' ? 'Online' : 'Offline';

        // Actualizar características
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        server.features.forEach(feature => {
            const featureTag = document.createElement('span');
            featureTag.className = 'feature-tag';
            featureTag.textContent = feature;
            featuresList.appendChild(featureTag);
        });

        // Verificar si es favorito
        if (currentUser) {
            const favoriteResult = await database.servers.isServerInFavorites(serverId, currentUser.uid);
            if (favoriteResult.success) {
                const favoriteBtn = document.getElementById('favoriteBtn');
                if (favoriteResult.isFavorite) {
                    favoriteBtn.innerHTML = '<i class="fas fa-bookmark"></i> Quitar Favorito';
                    favoriteBtn.classList.add('active');
                } else {
                    favoriteBtn.innerHTML = '<i class="far fa-bookmark"></i> Favorito';
                    favoriteBtn.classList.remove('active');
                }
            }
        }

        // Almacenar servidor actual para las acciones
        modal.currentServer = server;

        // Mostrar modal
        modal.classList.add('show');

        // Registrar visualización si el usuario está logueado
        if (currentUser) {
            database.activity.logServerConnect(currentUser.uid, serverId);
        }
    }

    function closeServerModal() {
        const modal = document.getElementById('serverModal');
        modal.classList.remove('show');
        modal.currentServer = null;
    }

    function connectToServer(ip) {
        utils.showNotification(`Conectando a ${ip}...`, 'info');
        
        // Simular conexión
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% de éxito
            if (success) {
                utils.showNotification('¡Conectado al servidor exitosamente!', 'success');
                
                // Copiar IP al portapapeles
                copyToClipboardText(ip);
            } else {
                utils.showNotification('Error al conectar al servidor', 'error');
            }
        }, 2000);
    }

    function connectFromModal() {
        const modal = document.getElementById('serverModal');
        const server = modal.currentServer;
        
        if (server) {
            connectToServer(server.ip);
        }
    }

    async function voteForServer() {
        const modal = document.getElementById('serverModal');
        const server = modal.currentServer;
        
        if (!server || !currentUser) {
            utils.showNotification('Debes iniciar sesión para votar', 'error');
            return;
        }

        const voteResult = await database.servers.voteForServer(server.id, currentUser.uid);
        
        if (voteResult.success) {
            utils.showNotification('¡Voto registrado! Gracias por tu apoyo.', 'success');
            
            // Actualizar contador en el modal
            server.votes++;
            document.getElementById('modalVotes').textContent = server.votes.toLocaleString();
            
            // Deshabilitar botón de voto
            const voteBtn = document.getElementById('voteBtn');
            voteBtn.disabled = true;
            voteBtn.innerHTML = '<i class="fas fa-check"></i> Votado';
        } else {
            utils.showNotification(voteResult.error, 'error');
        }
    }

    async function toggleFavorite() {
        const modal = document.getElementById('serverModal');
        const server = modal.currentServer;
        
        if (!server || !currentUser) {
            utils.showNotification('Debes iniciar sesión para usar favoritos', 'error');
            return;
        }

        const favoriteBtn = document.getElementById('favoriteBtn');
        const isCurrentlyFavorite = favoriteBtn.classList.contains('active');

        if (isCurrentlyFavorite) {
            const result = await database.servers.removeFromFavorites(server.id, currentUser.uid);
            if (result.success) {
                favoriteBtn.innerHTML = '<i class="far fa-bookmark"></i> Favorito';
                favoriteBtn.classList.remove('active');
                utils.showNotification('Servidor removido de favoritos', 'success');
            }
        } else {
            const result = await database.servers.addToFavorites(server.id, currentUser.uid);
            if (result.success) {
                favoriteBtn.innerHTML = '<i class="fas fa-bookmark"></i> Quitar Favorito';
                favoriteBtn.classList.add('active');
                utils.showNotification('Servidor agregado a favoritos', 'success');
            }
        }
    }

    function shareServer() {
        const modal = document.getElementById('serverModal');
        const server = modal.currentServer;
        
        if (!server) return;

        const shareText = `¡Mira este servidor de Minecraft! ${server.name} - ${server.ip}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: server.name,
                text: shareText,
                url: shareUrl
            });
        } else {
            copyToClipboardText(shareText);
            utils.showNotification('Información del servidor copiada al portapapeles', 'success');
        }
    }

    function copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        copyToClipboardText(text);
    }

    function copyToClipboardText(text) {
        navigator.clipboard.writeText(text).then(() => {
            utils.showNotification('Copiado al portapapeles', 'success');
        }).catch(() => {
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            utils.showNotification('Copiado al portapapeles', 'success');
        });
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
    window.connectToServer = connectToServer;
    window.openServerModal = openServerModal;
    window.copyToClipboard = copyToClipboard;
});