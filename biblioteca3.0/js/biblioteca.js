/* ========================================
   PÁGINA DE BIBLIOTECA - LIBROS
   ======================================== */

let currentBooks = [];

// Cargar cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Biblioteca cargada');
    loadLibrary();
    setupEventListeners();
});

// ========================================
// 1. CARGAR LIBROS DE LA BIBLIOTECA
// ========================================

async function loadLibrary() {
    console.log('🔄 Cargando libros...');
    const books = await fetchBooksFromTable('books');
    console.log(`📖 ${books.length} libros cargados`);
    currentBooks = books;
    renderBooks(books);
    populateFilters(books);
}

// ========================================
// 2. RENDERIZAR LIBROS EN TARJETAS
// ========================================

function renderBooks(books) {
    const container = document.getElementById('booksContainer');
    if (!container) {
        console.error('❌ No se encontró el contenedor booksContainer');
        return;
    }
    
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1 / -1;">
                <p style="font-size: 1.2rem;">📚 No hay libros en tu biblioteca</p>
                <p style="font-size: 0.9rem;">Haz clic en el botón + para agregar uno</p>
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
            ${book.notes ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.5rem 0;">${escapeHtml(book.notes)}</div>` : ''}
            <div class="book-status ${getStatusClass(book.status)}">${escapeHtml(book.status || 'Unread')}</div>
            <button class="toggle-status" data-id="${book.id}">🔄 Cambiar estado</button>
        `;
        
        // Al hacer clic en la tarjeta, abrir modal para editar
        card.addEventListener('click', function(e) {
            // Si el clic fue en el botón de toggle, no abrir el modal
            if (e.target.classList.contains('toggle-status') || e.target.closest('.toggle-status')) {
                return;
            }
            openEditModal(book);
        });
        
        container.appendChild(card);
    });
    
    // Agregar eventos a los botones de toggle
    document.querySelectorAll('.toggle-status').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se abra el modal
            const id = this.dataset.id;
            toggleBookStatus(id);
        });
    });
}

// ========================================
// 3. FILTROS Y BÚSQUEDA
// ========================================

function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // Filtros
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
        genreFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Botón de agregar
    const fabBtn = document.getElementById('fabBtn');
    if (fabBtn) {
        fabBtn.addEventListener('click', function() {
            openAddModal();
        });
    }
    
    // Botón de guardar en modal
    const saveBtn = document.getElementById('saveBookBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveBook();
        });
    }
    
    // Cerrar modal
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // Botón de eliminar
    const deleteBtn = document.getElementById('deleteBookBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteBook);
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const genreFilter = document.getElementById('genreFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = currentBooks;
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            const genre = (book.genre || '').toLowerCase();
            return title.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm);
        });
    }
    
    // Filtrar por género
    if (genreFilter) {
        filtered = filtered.filter(book => book.genre === genreFilter);
    }
    
    // Filtrar por estado
    if (statusFilter) {
        filtered = filtered.filter(book => book.status === statusFilter);
    }
    
    renderBooks(filtered);
}

function populateFilters(books) {
    // Géneros
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    const genreSelect = document.getElementById('genreFilter');
    if (genreSelect) {
        genreSelect.innerHTML = '<option value="">Todos los géneros</option>';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    }
}

// ========================================
// 4. TOGGLE DE ESTADO
// ========================================

async function toggleBookStatus(id) {
    const book = currentBooks.find(b => b.id === id);
    if (!book) {
        console.error('Libro no encontrado:', id);
        return;
    }
    
    // Ciclo de estados: Unread → Reading → Read → Unread
    let nextStatus;
    if (book.status === 'Unread') nextStatus = 'Reading';
    else if (book.status === 'Reading') nextStatus = 'Read';
    else nextStatus = 'Unread';
    
    try {
        const { error } = await supabaseClient
            .from('books')
            .update({ status: nextStatus })
            .eq('id', id);
            
        if (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al cambiar el estado del libro');
            return;
        }
        
        // Recargar la lista
        loadLibrary();
    } catch (error) {
        console.error('Error inesperado:', error);
        alert('Error al cambiar el estado del libro');
    }
}

// ========================================
// 5. GUARDAR LIBRO (AGREGAR/EDITAR)
// ========================================

async function saveBook() {
    const id = document.getElementById('editId').value;
    const bookData = {
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
    
    // Validar campos obligatorios
    if (!bookData.title || !bookData.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        let result;
        
        if (id) {
            // Actualizar
            result = await supabaseClient
                .from('books')
                .update(bookData)
                .eq('id', id);
        } else {
            // Insertar
            result = await supabaseClient
                .from('books')
                .insert([bookData]);
        }
        
        if (result.error) {
            console.error('Error al guardar:', result.error);
            alert('Error al guardar el libro');
            return;
        }
        
        closeModal();
        loadLibrary();
    } catch (error) {
        console.error('Error inesperado:', error);
        alert('Error al guardar el libro');
    }
}

// ========================================
// 6. ABRIR MODAL PARA AGREGAR
// ========================================

function openAddModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('modalTitle').textContent = 'Añadir libro';
    document.getElementById('editId').value = '';
    document.getElementById('addForm').reset();
    
    const deleteBtn = document.getElementById('deleteBookBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
}

// ========================================
// 7. ABRIR MODAL PARA EDITAR
// ========================================

function openEditModal(book) {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('modalTitle').textContent = 'Editar libro';
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
    
    // Mostrar botón de eliminar en edición
    const deleteBtn = document.getElementById('deleteBookBtn');
    if (deleteBtn) {
        deleteBtn.style.display = 'block';
        deleteBtn.dataset.id = book.id;
    }
}

// ========================================
// 8. ELIMINAR LIBRO
// ========================================

async function deleteBook() {
    const id = this.dataset.id;
    if (!id) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('books')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el libro');
            return;
        }
        
        closeModal();
        loadLibrary();
    } catch (error) {
        console.error('Error inesperado:', error);
        alert('Error al eliminar el libro');
    }
}

// ========================================
// 9. CERRAR MODAL (sobrescrito para esta página)
// ========================================

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Reemplazar la función global closeModal para esta página
window.closeModal = closeModal;