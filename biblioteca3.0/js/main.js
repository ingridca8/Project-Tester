/* ========================================
   BIBLIOTHECA - APLICACIÓN COMPLETA
   ======================================== */

// ========================================
// 1. FUNCIONES DE UTILIDAD
// ========================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStatusClass(status) {
    if (!status) return 'status-unread';
    const s = status.toLowerCase();
    if (s === 'read') return 'status-read';
    if (s === 'reading') return 'status-reading';
    return 'status-unread';
}

function getStatusText(status) {
    if (!status) return 'No leído';
    const s = status.toLowerCase();
    if (s === 'read') return 'Leído';
    if (s === 'reading') return 'Leyendo';
    return 'No leído';
}

// ========================================
// 2. FUNCIONES DE MODAL
// ========================================

function openModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) {
        console.warn(`Modal ${modalId} no encontrado`);
        return;
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========================================
// 3. MENÚ DE NAVEGACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Bibliotheca...');
    
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            console.log('Menú:', navLinks.classList.contains('open') ? 'abierto' : 'cerrado');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('open');
            }
        });
    });

    // Marcar enlace activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Inicializar la página según la URL
    const page = currentPage.replace('.html', '');
    console.log(`📍 Página: ${page || 'index'}`);
    
    if (page === 'index' || page === '') {
        initStats();
    } else if (page === 'biblioteca') {
        initBiblioteca();
    } else if (page === 'no33') {
        initNo33();
    } else if (page === 'wishlist') {
        initWishlist();
    }
});

// ========================================
// 4. PÁGINA DE ESTADÍSTICAS
// ========================================

async function initStats() {
    console.log('📊 Cargando estadísticas...');
    
    try {
        const books = await getTableData('books');
        const no33 = await getTableData('no_33');
        const wishlist = await getTableData('wishlist');
        
        console.log(`📖 Biblioteca: ${books.length}, No.33: ${no33.length}, Wishlist: ${wishlist.length}`);
        
        const allBooks = [...books, ...no33];
        
        // Total
        const totalEl = document.getElementById('totalBooks');
        if (totalEl) totalEl.textContent = allBooks.length;
        
        // Leídos
        const read = allBooks.filter(b => b.status === 'Read').length;
        const readEl = document.getElementById('booksRead');
        if (readEl) readEl.textContent = read;
        
        // Leyendo
        const reading = allBooks.filter(b => b.status === 'Reading').length;
        const readingEl = document.getElementById('booksReading');
        if (readingEl) readingEl.textContent = reading;
        
        // Porcentaje
        const pct = allBooks.length > 0 ? Math.round((read / allBooks.length) * 100) : 0;
        const pctEl = document.getElementById('readPercentage');
        if (pctEl) pctEl.textContent = `${pct}%`;
        
        // Wishlist
        const wishEl = document.getElementById('wishlistCount');
        if (wishEl) wishEl.textContent = wishlist.length;
        
        // Top autores leídos
        const authorRead = {};
        books.filter(b => b.status === 'Read').forEach(b => {
            if (b.author) {
                const a = b.author.trim();
                authorRead[a] = (authorRead[a] || 0) + 1;
            }
        });
        const topRead = Object.entries(authorRead).sort((a, b) => b[1] - a[1]).slice(0, 3);
        const topAuthorsEl = document.getElementById('topAuthors');
        if (topAuthorsEl) {
            topAuthorsEl.innerHTML = topRead.length === 0 
                ? '<div class="top-item"><span class="top-name">No hay autores leídos</span></div>'
                : topRead.map(([a, c]) => 
                    `<div class="top-item"><span class="top-name">${escapeHtml(a)}</span><span class="top-count">${c} ${c === 1 ? 'libro' : 'libros'}</span></div>`
                ).join('');
        }
        
        // Top autores totales
        const authorTotal = {};
        allBooks.forEach(b => {
            if (b.author) {
                const a = b.author.trim();
                authorTotal[a] = (authorTotal[a] || 0) + 1;
            }
        });
        const topTotal = Object.entries(authorTotal).sort((a, b) => b[1] - a[1]).slice(0, 3);
        const topTotalEl = document.getElementById('topTotalAuthors');
        if (topTotalEl) {
            topTotalEl.innerHTML = topTotal.length === 0
                ? '<div class="top-item"><span class="top-name">No hay autores</span></div>'
                : topTotal.map(([a, c]) =>
                    `<div class="top-item"><span class="top-name">${escapeHtml(a)}</span><span class="top-count">${c} ${c === 1 ? 'libro' : 'libros'}</span></div>`
                ).join('');
        }
        
        // Top géneros
        const genreCount = {};
        allBooks.forEach(b => {
            if (b.genre) {
                const g = b.genre.trim();
                genreCount[g] = (genreCount[g] || 0) + 1;
            }
        });
        const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
        const topGenresEl = document.getElementById('topGenres');
        if (topGenresEl) {
            topGenresEl.innerHTML = topGenres.length === 0
                ? '<div class="top-item"><span class="top-name">No hay géneros</span></div>'
                : topGenres.map(([g, c]) =>
                    `<div class="top-item"><span class="top-name">${escapeHtml(g)}</span><span class="top-count">${c} ${c === 1 ? 'libro' : 'libros'}</span></div>`
                ).join('');
        }
        
        console.log('✅ Estadísticas actualizadas');
    } catch (error) {
        console.error('❌ Error en estadísticas:', error);
    }
}

// ========================================
// 5. PÁGINA DE BIBLIOTECA
// ========================================

let bibliotecaBooks = [];

async function initBiblioteca() {
    console.log('📚 Iniciando Biblioteca...');
    try {
        bibliotecaBooks = await getTableData('books');
        console.log(`📖 ${bibliotecaBooks.length} libros en biblioteca`);
        renderBiblioteca(bibliotecaBooks);
        setupBibliotecaEvents();
    } catch (error) {
        console.error('❌ Error al cargar biblioteca:', error);
    }
}

function renderBiblioteca(books) {
    const container = document.getElementById('booksContainer');
    if (!container) {
        console.error('❌ No se encontró booksContainer');
        return;
    }
    
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:3rem;color:var(--text-muted);grid-column:1/-1;">
                <p style="font-size:1.2rem;">📚 No hay libros en tu biblioteca</p>
                <p style="font-size:0.9rem;">Haz clic en el botón + para agregar uno</p>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        
        card.innerHTML = `
            <div class="book-title">${escapeHtml(book.title || 'Sin título')}</div>
            <div class="book-author">${escapeHtml(book.author || 'Autor desconocido')}</div>
            <div class="book-meta">
                ${book.genre ? `<span>${escapeHtml(book.genre)}</span>` : ''}
                ${book.year ? `<span>${escapeHtml(String(book.year))}</span>` : ''}
                ${book.pages ? `<span>${escapeHtml(String(book.pages))} págs</span>` : ''}
            </div>
            ${book.notes ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0;">${escapeHtml(book.notes)}</div>` : ''}
            <div class="book-status ${getStatusClass(book.status)}">${getStatusText(book.status)}</div>
            <button class="toggle-status" data-id="${book.id}">🔄 Cambiar estado</button>
        `;
        
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('toggle-status') || e.target.closest('.toggle-status')) return;
            openBibliotecaEdit(book);
        });
        
        container.appendChild(card);
    });
    
    document.querySelectorAll('.toggle-status').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBibliotecaStatus(this.dataset.id);
        });
    });
}

function setupBibliotecaEvents() {
    // Búsqueda y filtros
    const search = document.getElementById('searchInput');
    if (search) search.addEventListener('input', applyBibliotecaFilters);
    
    const genre = document.getElementById('genreFilter');
    if (genre) genre.addEventListener('change', applyBibliotecaFilters);
    
    const status = document.getElementById('statusFilter');
    if (status) status.addEventListener('change', applyBibliotecaFilters);
    
    // Botón agregar
    const fab = document.getElementById('fabBtn');
    if (fab) fab.addEventListener('click', () => openBibliotecaAdd());
    
    // Modal
    const save = document.getElementById('saveBookBtn');
    if (save) save.addEventListener('click', saveBibliotecaBook);
    
    const close = document.getElementById('closeModal');
    if (close) close.addEventListener('click', () => closeModal('modalOverlay'));
    
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal('modalOverlay');
    });
    
    const del = document.getElementById('deleteBookBtn');
    if (del) del.addEventListener('click', deleteBibliotecaBook);
    
    // Poblar filtros de género
    populateGenreFilter('genreFilter', bibliotecaBooks);
}

function applyBibliotecaFilters() {
    const search = document.getElementById('searchInput')?.value?.toLowerCase()?.trim() || '';
    const genre = document.getElementById('genreFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    
    let filtered = bibliotecaBooks;
    
    if (search) {
        filtered = filtered.filter(b => {
            const t = (b.title || '').toLowerCase();
            const a = (b.author || '').toLowerCase();
            const g = (b.genre || '').toLowerCase();
            return t.includes(search) || a.includes(search) || g.includes(search);
        });
    }
    
    if (genre) filtered = filtered.filter(b => b.genre === genre);
    if (status) filtered = filtered.filter(b => b.status === status);
    
    renderBiblioteca(filtered);
}

function populateGenreFilter(id, books) {
    const select = document.getElementById(id);
    if (!select) return;
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    select.innerHTML = '<option value="">Todos los géneros</option>';
    genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        select.appendChild(opt);
    });
}

async function toggleBibliotecaStatus(id) {
    const book = bibliotecaBooks.find(b => b.id === id);
    if (!book) return;
    
    let next;
    if (book.status === 'Unread') next = 'Reading';
    else if (book.status === 'Reading') next = 'Read';
    else next = 'Unread';
    
    try {
        await updateRecord('books', id, { status: next });
        bibliotecaBooks = await getTableData('books');
        renderBiblioteca(bibliotecaBooks);
    } catch (e) {
        console.error(e);
        alert('Error al cambiar estado');
    }
}

function openBibliotecaAdd() {
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Añadir libro';
    document.getElementById('editId').value = '';
    document.getElementById('addForm').reset();
    const delBtn = document.getElementById('deleteBookBtn');
    if (delBtn) delBtn.style.display = 'none';
    openModal('modalOverlay');
}

function openBibliotecaEdit(book) {
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Editar libro';
    document.getElementById('editId').value = book.id;
    document.getElementById('title').value = book.title || '';
    document.getElementById('author').value = book.author || '';
    document.getElementById('isbn').value = book.isbn || '';
    document.getElementById('year').value = book.year || '';
    document.getElementById('genre').value = book.genre || '';
    document.getElementById('status').value = book.status || 'Unread';
    document.getElementById('editorial').value = book.editorial || '';
    document.getElementById('language').value = book.language || '';
    document.getElementById('pages').value = book.pages || '';
    document.getElementById('grade').value = book.grade || '';
    document.getElementById('notes').value = book.notes || '';
    const delBtn = document.getElementById('deleteBookBtn');
    if (delBtn) {
        delBtn.style.display = 'block';
        delBtn.dataset.id = book.id;
    }
    openModal('modalOverlay');
}

async function saveBibliotecaBook() {
    const id = document.getElementById('editId').value;
    const data = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        isbn: document.getElementById('isbn').value.trim() || null,
        year: parseInt(document.getElementById('year').value) || null,
        genre: document.getElementById('genre').value || null,
        status: document.getElementById('status').value || 'Unread',
        editorial: document.getElementById('editorial').value.trim() || null,
        language: document.getElementById('language').value.trim() || null,
        pages: parseInt(document.getElementById('pages').value) || null,
        grade: parseInt(document.getElementById('grade').value) || null,
        notes: document.getElementById('notes').value.trim() || null
    };
    
    if (!data.title || !data.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        if (id) {
            await updateRecord('books', id, data);
        } else {
            await insertRecord('books', data);
        }
        closeModal('modalOverlay');
        bibliotecaBooks = await getTableData('books');
        renderBiblioteca(bibliotecaBooks);
        populateGenreFilter('genreFilter', bibliotecaBooks);
    } catch (e) {
        console.error(e);
        alert('Error al guardar');
    }
}

async function deleteBibliotecaBook() {
    const id = this.dataset.id;
    if (!id || !confirm('¿Eliminar este libro?')) return;
    try {
        await deleteRecord('books', id);
        closeModal('modalOverlay');
        bibliotecaBooks = await getTableData('books');
        renderBiblioteca(bibliotecaBooks);
        populateGenreFilter('genreFilter', bibliotecaBooks);
    } catch (e) {
        console.error(e);
        alert('Error al eliminar');
    }
}

// ========================================
// 6. PÁGINA NO.33
// ========================================

let no33Books = [];

async function initNo33() {
    console.log('🔢 Iniciando No.33...');
    try {
        no33Books = await getTableData('no_33');
        console.log(`📖 ${no33Books.length} libros en No.33`);
        renderNo33(no33Books);
        setupNo33Events();
    } catch (error) {
        console.error('❌ Error al cargar No.33:', error);
    }
}

function renderNo33(books) {
    const container = document.getElementById('no33Container');
    if (!container) {
        console.error('❌ No se encontró no33Container');
        return;
    }
    
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:3rem;color:var(--text-muted);grid-column:1/-1;">
                <p style="font-size:1.2rem;">📚 No hay libros en No.33</p>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        
        card.innerHTML = `
            <div class="book-title">${escapeHtml(book.title || 'Sin título')}</div>
            <div class="book-author">${escapeHtml(book.author || 'Autor desconocido')}</div>
            <div class="book-meta">
                ${book.genre ? `<span>${escapeHtml(book.genre)}</span>` : ''}
                ${book.year ? `<span>${escapeHtml(String(book.year))}</span>` : ''}
                ${book.pages ? `<span>${escapeHtml(String(book.pages))} págs</span>` : ''}
            </div>
            ${book.notes ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0;">${escapeHtml(book.notes)}</div>` : ''}
            <div class="book-status ${getStatusClass(book.status)}">${getStatusText(book.status)}</div>
            <button class="toggle-status" data-id="${book.id}">🔄 Cambiar estado</button>
        `;
        
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('toggle-status') || e.target.closest('.toggle-status')) return;
            openNo33Edit(book);
        });
        
        container.appendChild(card);
    });
    
    document.querySelectorAll('.toggle-status').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleNo33Status(this.dataset.id);
        });
    });
}

function setupNo33Events() {
    const search = document.getElementById('searchInputNo33');
    if (search) search.addEventListener('input', applyNo33Filters);
    
    const genre = document.getElementById('genreFilterNo33');
    if (genre) genre.addEventListener('change', applyNo33Filters);
    
    const status = document.getElementById('statusFilterNo33');
    if (status) status.addEventListener('change', applyNo33Filters);
    
    const fab = document.getElementById('fabBtnNo33');
    if (fab) fab.addEventListener('click', () => openNo33Add());
    
    const save = document.getElementById('saveBookBtnNo33');
    if (save) save.addEventListener('click', saveNo33Book);
    
    const close = document.getElementById('closeModalNo33');
    if (close) close.addEventListener('click', () => closeModal('modalOverlayNo33'));
    
    const overlay = document.getElementById('modalOverlayNo33');
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal('modalOverlayNo33');
    });
    
    const del = document.getElementById('deleteBookBtnNo33');
    if (del) del.addEventListener('click', deleteNo33Book);
    
    populateGenreFilter('genreFilterNo33', no33Books);
}

function applyNo33Filters() {
    const search = document.getElementById('searchInputNo33')?.value?.toLowerCase()?.trim() || '';
    const genre = document.getElementById('genreFilterNo33')?.value || '';
    const status = document.getElementById('statusFilterNo33')?.value || '';
    
    let filtered = no33Books;
    if (search) {
        filtered = filtered.filter(b => {
            const t = (b.title || '').toLowerCase();
            const a = (b.author || '').toLowerCase();
            const g = (b.genre || '').toLowerCase();
            return t.includes(search) || a.includes(search) || g.includes(search);
        });
    }
    if (genre) filtered = filtered.filter(b => b.genre === genre);
    if (status) filtered = filtered.filter(b => b.status === status);
    renderNo33(filtered);
}

async function toggleNo33Status(id) {
    const book = no33Books.find(b => b.id === id);
    if (!book) return;
    
    let next;
    if (book.status === 'Unread') next = 'Reading';
    else if (book.status === 'Reading') next = 'Read';
    else next = 'Unread';
    
    try {
        await updateRecord('no_33', id, { status: next });
        no33Books = await getTableData('no_33');
        renderNo33(no33Books);
        populateGenreFilter('genreFilterNo33', no33Books);
    } catch (e) {
        console.error(e);
        alert('Error al cambiar estado');
    }
}

function openNo33Add() {
    const titleEl = document.getElementById('modalTitleNo33');
    if (titleEl) titleEl.textContent = 'Añadir libro';
    document.getElementById('editIdNo33').value = '';
    document.getElementById('addFormNo33').reset();
    const delBtn = document.getElementById('deleteBookBtnNo33');
    if (delBtn) delBtn.style.display = 'none';
    openModal('modalOverlayNo33');
}

function openNo33Edit(book) {
    const titleEl = document.getElementById('modalTitleNo33');
    if (titleEl) titleEl.textContent = 'Editar libro';
    document.getElementById('editIdNo33').value = book.id;
    document.getElementById('titleNo33').value = book.title || '';
    document.getElementById('authorNo33').value = book.author || '';
    document.getElementById('isbnNo33').value = book.isbn || '';
    document.getElementById('yearNo33').value = book.year || '';
    document.getElementById('genreNo33').value = book.genre || '';
    document.getElementById('statusNo33').value = book.status || 'Unread';
    document.getElementById('editorialNo33').value = book.editorial || '';
    document.getElementById('languageNo33').value = book.language || '';
    document.getElementById('pagesNo33').value = book.pages || '';
    document.getElementById('gradeNo33').value = book.grade || '';
    document.getElementById('notesNo33').value = book.notes || '';
    const delBtn = document.getElementById('deleteBookBtnNo33');
    if (delBtn) {
        delBtn.style.display = 'block';
        delBtn.dataset.id = book.id;
    }
    openModal('modalOverlayNo33');
}

async function saveNo33Book() {
    const id = document.getElementById('editIdNo33').value;
    const data = {
        title: document.getElementById('titleNo33').value.trim(),
        author: document.getElementById('authorNo33').value.trim(),
        isbn: document.getElementById('isbnNo33').value.trim() || null,
        year: parseInt(document.getElementById('yearNo33').value) || null,
        genre: document.getElementById('genreNo33').value || null,
        status: document.getElementById('statusNo33').value || 'Unread',
        editorial: document.getElementById('editorialNo33').value.trim() || null,
        language: document.getElementById('languageNo33').value.trim() || null,
        pages: parseInt(document.getElementById('pagesNo33').value) || null,
        grade: parseInt(document.getElementById('gradeNo33').value) || null,
        notes: document.getElementById('notesNo33').value.trim() || null
    };
    
    if (!data.title || !data.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        if (id) {
            await updateRecord('no_33', id, data);
        } else {
            await insertRecord('no_33', data);
        }
        closeModal('modalOverlayNo33');
        no33Books = await getTableData('no_33');
        renderNo33(no33Books);
        populateGenreFilter('genreFilterNo33', no33Books);
    } catch (e) {
        console.error(e);
        alert('Error al guardar');
    }
}

async function deleteNo33Book() {
    const id = this.dataset.id;
    if (!id || !confirm('¿Eliminar este libro?')) return;
    try {
        await deleteRecord('no_33', id);
        closeModal('modalOverlayNo33');
        no33Books = await getTableData('no_33');
        renderNo33(no33Books);
        populateGenreFilter('genreFilterNo33', no33Books);
    } catch (e) {
        console.error(e);
        alert('Error al eliminar');
    }
}

// ========================================
// 7. PÁGINA DE WISHLIST
// ========================================

let wishlistBooks = [];

async function initWishlist() {
    console.log('⭐ Iniciando Wishlist...');
    try {
        wishlistBooks = await getTableData('wishlist');
        console.log(`📖 ${wishlistBooks.length} libros en Wishlist`);
        renderWishlist(wishlistBooks);
        setupWishlistEvents();
    } catch (error) {
        console.error('❌ Error al cargar Wishlist:', error);
    }
}

function renderWishlist(books) {
    const container = document.getElementById('wishlistContainer');
    if (!container) {
        console.error('❌ No se encontró wishlistContainer');
        return;
    }
    
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:3rem;color:var(--text-muted);grid-column:1/-1;">
                <p style="font-size:1.2rem;">📖 No hay libros en Wishlist</p>
                <p style="font-size:0.9rem;">Haz clic en el botón + para agregar uno</p>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        
        card.innerHTML = `
            <div class="book-title">${escapeHtml(book.title || 'Sin título')}</div>
            <div class="book-author">${escapeHtml(book.author || 'Autor desconocido')}</div>
            <div class="book-meta">
                ${book.year ? `<span>${escapeHtml(String(book.year))}</span>` : ''}
                ${book.editorial ? `<span>${escapeHtml(book.editorial)}</span>` : ''}
            </div>
            ${book.notes ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0;">${escapeHtml(book.notes)}</div>` : ''}
            <div class="book-status" style="background:rgba(201,168,108,0.15);color:var(--gold);display:inline-block;padding:0.3rem 0.8rem;border-radius:20px;font-size:0.75rem;margin-top:0.5rem;">⭐ Deseado</div>
        `;
        
        card.addEventListener('click', function() {
            openWishlistEdit(book);
        });
        
        container.appendChild(card);
    });
}

function setupWishlistEvents() {
    const search = document.getElementById('searchInputWishlist');
    if (search) search.addEventListener('input', applyWishlistFilters);
    
    const year = document.getElementById('yearFilterWishlist');
    if (year) year.addEventListener('change', applyWishlistFilters);
    
    const fab = document.getElementById('fabBtnWishlist');
    if (fab) fab.addEventListener('click', () => openWishlistAdd());
    
    const save = document.getElementById('saveBookBtnWishlist');
    if (save) save.addEventListener('click', saveWishlistBook);
    
    const close = document.getElementById('closeModalWishlist');
    if (close) close.addEventListener('click', () => closeModal('modalOverlayWishlist'));
    
    const overlay = document.getElementById('modalOverlayWishlist');
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal('modalOverlayWishlist');
    });
    
    const del = document.getElementById('deleteBookBtnWishlist');
    if (del) del.addEventListener('click', deleteWishlistBook);
    
    populateWishlistYears();
}

function populateWishlistYears() {
    const years = [...new Set(wishlistBooks.map(b => b.year).filter(Boolean))].sort((a, b) => b - a);
    const yearSelect = document.getElementById('yearFilterWishlist');
    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">Todos los años</option>';
        years.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        });
    }
}

function applyWishlistFilters() {
    const search = document.getElementById('searchInputWishlist')?.value?.toLowerCase()?.trim() || '';
    const year = document.getElementById('yearFilterWishlist')?.value || '';
    
    let filtered = wishlistBooks;
    if (search) {
        filtered = filtered.filter(b => {
            const t = (b.title || '').toLowerCase();
            const a = (b.author || '').toLowerCase();
            return t.includes(search) || a.includes(search);
        });
    }
    if (year) filtered = filtered.filter(b => String(b.year) === year);
    renderWishlist(filtered);
}

function openWishlistAdd() {
    const titleEl = document.getElementById('modalTitleWishlist');
    if (titleEl) titleEl.textContent = 'Añadir a Wishlist';
    document.getElementById('editIdWishlist').value = '';
    document.getElementById('addFormWishlist').reset();
    const delBtn = document.getElementById('deleteBookBtnWishlist');
    if (delBtn) delBtn.style.display = 'none';
    openModal('modalOverlayWishlist');
}

function openWishlistEdit(book) {
    const titleEl = document.getElementById('modalTitleWishlist');
    if (titleEl) titleEl.textContent = 'Editar libro';
    document.getElementById('editIdWishlist').value = book.id;
    document.getElementById('titleWishlist').value = book.title || '';
    document.getElementById('authorWishlist').value = book.author || '';
    document.getElementById('isbnWishlist').value = book.isbn || '';
    document.getElementById('yearWishlist').value = book.year || '';
    document.getElementById('editorialWishlist').value = book.editorial || '';
    document.getElementById('notesWishlist').value = book.notes || '';
    const delBtn = document.getElementById('deleteBookBtnWishlist');
    if (delBtn) {
        delBtn.style.display = 'block';
        delBtn.dataset.id = book.id;
    }
    openModal('modalOverlayWishlist');
}

async function saveWishlistBook() {
    const id = document.getElementById('editIdWishlist').value;
    const data = {
        title: document.getElementById('titleWishlist').value.trim(),
        author: document.getElementById('authorWishlist').value.trim(),
        isbn: document.getElementById('isbnWishlist').value.trim() || null,
        year: parseInt(document.getElementById('yearWishlist').value) || null,
        editorial: document.getElementById('editorialWishlist').value.trim() || null,
        notes: document.getElementById('notesWishlist').value.trim() || null
    };
    
    if (!data.title || !data.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        if (id) {
            await updateRecord('wishlist', id, data);
        } else {
            await insertRecord('wishlist', data);
        }
        closeModal('modalOverlayWishlist');
        wishlistBooks = await getTableData('wishlist');
        renderWishlist(wishlistBooks);
        populateWishlistYears();
    } catch (e) {
        console.error(e);
        alert('Error al guardar');
    }
}

async function deleteWishlistBook() {
    const id = this.dataset.id;
    if (!id || !confirm('¿Eliminar este libro de la wishlist?')) return;
    try {
        await deleteRecord('wishlist', id);
        closeModal('modalOverlayWishlist');
        wishlistBooks = await getTableData('wishlist');
        renderWishlist(wishlistBooks);
        populateWishlistYears();
    } catch (e) {
        console.error(e);
        alert('Error al eliminar');
    }
}