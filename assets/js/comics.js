document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let allComics = [];
    let filteredComics = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let currentComic = null;
    let currentPage = 1;

    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadComics();
            setupEventListeners();
        } else {
            await loadComics();
            setupEventListeners();
        }
    });

    async function loadComics() {
        try {
            // Simular carga de comics
            allComics = [
                {
                    id: 1,
                    title: 'La Aventura del Espacio Profundo',
                    cover: 'https://via.placeholder.com/280x350/6c63ff/ffffff?text=Espacio+Profundo',
                    author: 'Carlos Martínez',
                    category: 'ciencia-ficcion',
                    rating: 4.8,
                    views: 12450,
                    pages: 24,
                    description: 'Una emocionante aventura interestelar donde un grupo de exploradores descubre civilizaciones alienígenas.',
                    pages: [
                        'https://via.placeholder.com/800x1200/6c63ff/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/ff6584/ffffff?text=P%C3%A1gina+2',
                        'https://via.placeholder.com/800x1200/00d9ff/ffffff?text=P%C3%A1gina+3'
                    ],
                    uploadDate: '2024-01-10',
                    isNew: true
                },
                {
                    id: 2,
                    title: 'El Reino de Cristal',
                    cover: 'https://via.placeholder.com/280x350/00ff88/ffffff?text=Reino+Cristal',
                    author: 'Ana López',
                    category: 'fantasia',
                    rating: 4.6,
                    views: 8920,
                    pages: 18,
                    description: 'En un mundo mágico de cristales vivientes, una joven descubre poderes ancestrales.',
                    pages: [
                        'https://via.placeholder.com/800x1200/00ff88/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/ffaa00/ffffff?text=P%C3%A1gina+2'
                    ],
                    uploadDate: '2024-01-08',
                    isNew: true
                },
                {
                    id: 3,
                    title: 'Guardianes Urbanos',
                    cover: 'https://via.placeholder.com/280x350/ff6584/ffffff?text=Guardianes',
                    author: 'Miguel Ángel',
                    category: 'superheroes',
                    rating: 4.9,
                    views: 15600,
                    pages: 32,
                    description: 'Un grupo de superhéroes protege la ciudad de amenazas sobrenaturales.',
                    pages: [
                        'https://via.placeholder.com/800x1200/ff6584/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/6c63ff/ffffff?text=P%C3%A1gina+2',
                        'https://via.placeholder.com/800x1200/00d9ff/ffffff?text=P%C3%A1gina+3',
                        'https://via.placeholder.com/800x1200/00ff88/ffffff?text=P%C3%A1gina+4'
                    ],
                    uploadDate: '2024-01-05'
                },
                {
                    id: 4,
                    title: 'La Expedición Perdida',
                    cover: 'https://via.placeholder.com/280x350/ffaa00/ffffff?text=Expedici%C3%B3n',
                    author: 'Roberto Jiménez',
                    category: 'aventura',
                    rating: 4.5,
                    views: 7680,
                    pages: 20,
                    description: 'Exploradores se adentran en la selva amazónica en busca de una ciudad perdida.',
                    pages: [
                        'https://via.placeholder.com/800x1200/ffaa00/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/6c63ff/ffffff?text=P%C3%A1gina+2'
                    ],
                    uploadDate: '2024-01-03'
                },
                {
                    id: 5,
                    title: 'Cyborg Revolution',
                    cover: 'https://via.placeholder.com/280x350/00d9ff/ffffff?text=Cyborg',
                    author: 'Laura Chen',
                    category: 'ciencia-ficcion',
                    rating: 4.7,
                    views: 10300,
                    pages: 28,
                    description: 'En un futuro distópico, los cyborgs luchan por sus derechos en una sociedad dividida.',
                    pages: [
                        'https://via.placeholder.com/800x1200/00d9ff/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/ff6584/ffffff?text=P%C3%A1gina+2',
                        'https://via.placeholder.com/800x1200/00ff88/ffffff?text=P%C3%A1gina+3'
                    ],
                    uploadDate: '2023-12-28'
                },
                {
                    id: 6,
                    title: 'Dragon Heir',
                    cover: 'https://via.placeholder.com/280x350/6c63ff/ffffff?text=Dragon+Heir',
                    author: 'Sarah Johnson',
                    category: 'fantasia',
                    rating: 4.8,
                    views: 14200,
                    pages: 22,
                    description: 'El último heredero de los dragones debe recuperar su legado en un mundo mágico.',
                    pages: [
                        'https://via.placeholder.com/800x1200/6c63ff/ffffff?text=P%C3%A1gina+1',
                        'https://via.placeholder.com/800x1200/ffaa00/ffffff?text=P%C3%A1gina+2'
                    ],
                    uploadDate: '2023-12-25'
                }
            ];

            filteredComics = [...allComics];
            renderComics();

        } catch (error) {
            console.error('Error loading comics:', error);
            utils.showNotification('Error al cargar los comics', 'error');
        }
    }

    function renderComics() {
        const comicsGrid = document.getElementById('comicsGrid');
        comicsGrid.innerHTML = '';

        if (filteredComics.length === 0) {
            comicsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-book-open"></i>
                    <h3>No se encontraron comics</h3>
                    <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
            `;
            return;
        }

        filteredComics.forEach(comic => {
            const comicCard = document.createElement('div');
            comicCard.className = 'comic-card';
            comicCard.innerHTML = `
                <div class="comic-cover">
                    <img src="${comic.cover}" alt="${comic.title}">
                    ${comic.isNew ? '<div class="comic-badge">Nuevo</div>' : ''}
                    <div class="comic-category">${comic.category}</div>
                </div>
                <div class="comic-info">
                    <h3 class="comic-title">${comic.title}</h3>
                    <span class="comic-author">Por ${comic.author}</span>
                    <div class="comic-meta">
                        <span class="comic-rating">
                            <i class="fas fa-star"></i> ${comic.rating}
                        </span>
                        <span class="comic-pages">
                            <i class="fas fa-file"></i> ${comic.pages.length} págs.
                        </span>
                    </div>
                </div>
            `;

            comicCard.addEventListener('click', () => openComicModal(comic));
            comicsGrid.appendChild(comicCard);
        });
    }

    function setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                filterComics();
            });
        });

        // Búsqueda
        document.getElementById('comicSearch').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterComics();
        });

        // Cargar más comics
        document.getElementById('loadMoreBtn').addEventListener('click', loadMoreComics);

        // Modal
        document.getElementById('comicModalClose').addEventListener('click', closeComicModal);
        document.getElementById('comicModal').addEventListener('click', (e) => {
            if (e.target.id === 'comicModal') closeComicModal();
        });

        // Navegación de páginas
        document.getElementById('prevPage').addEventListener('click', prevPage);
        document.getElementById('nextPage').addEventListener('click', nextPage);

        // Acciones del comic
        document.getElementById('comicLikeBtn').addEventListener('click', toggleComicLike);
        document.getElementById('comicBookmarkBtn').addEventListener('click', toggleComicBookmark);
        document.getElementById('comicShareBtn').addEventListener('click', shareComic);

        // Teclado para navegación
        document.addEventListener('keydown', handleKeyboardNavigation);

        // Cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }

    function filterComics() {
        filteredComics = allComics.filter(comic => {
            const matchesFilter = currentFilter === 'all' || comic.category === currentFilter;
            const matchesSearch = comic.title.toLowerCase().includes(currentSearch) ||
                                comic.author.toLowerCase().includes(currentSearch) ||
                                comic.description.toLowerCase().includes(currentSearch);
            return matchesFilter && matchesSearch;
        });
        renderComics();
    }

    function loadMoreComics() {
        // Simular carga de más comics
        const newComics = [
            {
                id: 7,
                title: 'Neon Samurai',
                cover: 'https://via.placeholder.com/280x350/ff6584/ffffff?text=Neon+Samurai',
                author: 'Kenji Tanaka',
                category: 'ciencia-ficcion',
                rating: 4.9,
                views: 9800,
                pages: 26,
                description: 'Samuráis cibernéticos en un Tokio futurista luchan por la justicia.',
                pages: [
                    'https://via.placeholder.com/800x1200/ff6584/ffffff?text=P%C3%A1gina+1',
                    'https://via.placeholder.com/800x1200/6c63ff/ffffff?text=P%C3%A1gina+2'
                ],
                uploadDate: '2023-12-20'
            }
        ];

        allComics.push(...newComics);
        filterComics();
        utils.showNotification('Más comics cargados', 'success');
    }

    function openComicModal(comic) {
        currentComic = comic;
        currentPage = 1;

        const modal = document.getElementById('comicModal');
        
        // Actualizar información del modal
        document.getElementById('comicModalTitle').textContent = comic.title;
        document.getElementById('comicDescription').textContent = comic.description;
        document.getElementById('comicAuthor').textContent = comic.author;
        document.getElementById('comicDate').textContent = formatDate(comic.uploadDate);
        document.getElementById('comicViews').textContent = comic.views.toLocaleString();
        document.getElementById('comicLikeCount').textContent = Math.floor(comic.views * 0.1).toLocaleString();

        // Actualizar navegación
        updatePageNavigation();

        // Mostrar primera página
        showPage(currentPage);

        // Mostrar modal
        modal.classList.add('show');

        // Registrar lectura si el usuario está logueado
        if (currentUser) {
            registerComicRead(comic.id);
        }
    }

    function closeComicModal() {
        const modal = document.getElementById('comicModal');
        modal.classList.remove('show');
        currentComic = null;
        currentPage = 1;
    }

    function updatePageNavigation() {
        const totalPages = currentComic.pages.length;
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('totalPages').textContent = totalPages;

        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function showPage(pageNumber) {
        const pageImage = document.getElementById('comicPageImage');
        pageImage.src = currentComic.pages[pageNumber - 1];
        pageImage.alt = `Página ${pageNumber} - ${currentComic.title}`;
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updatePageNavigation();
        }
    }

    function nextPage() {
        if (currentPage < currentComic.pages.length) {
            currentPage++;
            showPage(currentPage);
            updatePageNavigation();
        }
    }

    function handleKeyboardNavigation(e) {
        if (!currentComic) return;

        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'Escape') {
            closeComicModal();
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async function registerComicRead(comicId) {
        try {
            if (currentUser) {
                await db.collection('user_activity').add({
                    userId: currentUser.uid,
                    comicId: comicId,
                    type: 'comic_read',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error registering comic read:', error);
        }
    }

    function toggleComicLike() {
        const likeBtn = document.getElementById('comicLikeBtn');
        const likeCount = document.getElementById('comicLikeCount');
        
        likeBtn.classList.toggle('active');
        if (likeBtn.classList.contains('active')) {
            likeBtn.innerHTML = '<i class="fas fa-heart"></i> <span id="comicLikeCount">' + (parseInt(likeCount.textContent) + 1) + '</span>';
            utils.showNotification('Te gusta este comic', 'success');
        } else {
            likeBtn.innerHTML = '<i class="far fa-heart"></i> <span id="comicLikeCount">' + (parseInt(likeCount.textContent) - 1) + '</span>';
        }
    }

    function toggleComicBookmark() {
        const bookmarkBtn = document.getElementById('comicBookmarkBtn');
        bookmarkBtn.classList.toggle('active');
        
        if (bookmarkBtn.classList.contains('active')) {
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Guardado';
            utils.showNotification('Comic agregado a favoritos', 'success');
        } else {
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Guardar';
        }
    }

    function shareComic() {
        const comicUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: currentComic.title,
                text: currentComic.description,
                url: comicUrl
            });
        } else {
            navigator.clipboard.writeText(comicUrl).then(() => {
                utils.showNotification('Enlace copiado al portapapeles', 'success');
            });
        }
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
});