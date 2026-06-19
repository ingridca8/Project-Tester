/* ========================================
   PÁGINA NO.33 - MISMA ESTRUCTURA QUE BIBLIOTECA
   ======================================== */

let currentNo33Books = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔢 No.33 cargada');
    loadNo33();
    setupEventListenersNo33();
});

async function loadNo33() {
    console.log('🔄 Cargando No.33...');
    const books = await fetchBooksFromTable('no_33');
    console.log(`📖 ${books.length} libros en No.33`);
    currentNo33Books = books;
    renderNo33Books(books);
    populateNo33Filters(books);
}

function renderNo33Books(books) {
    const container = document.getElementById('no33Container');
    if (!container) {
        console.error('❌ No se encontró el contenedor no33Container');
        return;
    }
    
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1 / -1;">
                <p style="font-size: 1.2rem;">📚 No hay libros en No.33</p>
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
        
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('toggle-status') || e.target.closest('.toggle-status')) {
                return;
            }
            openEditModalNo33(book);
        });
        
        container.appendChild(card);
    });
    
    document.querySelectorAll('.toggle-status').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            toggleNo33Status(id);
        });
    });
}

function setupEventListenersNo33() {
    const searchInput = document.getElementById('searchInputNo33');
    if (searchInput) searchInput.addEventListener('input', applyNo33Filters);
    
    const genreFilter = document.getElementById('genreFilterNo33');
    if (genreFilter) genreFilter.addEventListener('change', applyNo33Filters);
    
    const statusFilter = document.getElementById('statusFilterNo33');
    if (statusFilter) statusFilter.addEventListener('change', applyNo33Filters);
    
    const fabBtn = document.getElementById('fabBtnNo33');
    if (fabBtn) fabBtn.addEventListener('click', function() { openAddModalNo33(); });
    
    const saveBtn = document.getElementById('saveBookBtnNo33');
    if (saveBtn) saveBtn.addEventListener('click', saveNo33Book);
    
    const closeBtn = document.getElementById('closeModalNo33');
    if (closeBtn) closeBtn.addEventListener('click', closeModalNo33);
    
    const overlay = document.getElementById('modalOverlayNo33');
    if (overlay) overlay.addEventListener('click', function(e) { if (e.target === this) closeModalNo33(); });
    
    const deleteBtn = document.getElementById('deleteBookBtnNo33');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteNo33Book);
}

function applyNo33Filters() {
    const searchTerm = document.getElementById('searchInputNo33').value.toLowerCase().trim();
    const genreFilter = document.getElementById('genreFilterNo33').value;
    const statusFilter = document.getElementById('statusFilterNo33').value;
    
    let filtered = currentNo33Books;
    
    if (searchTerm) {
        filtered = filtered.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            const genre = (book.genre || '').toLowerCase();
            return title.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm);
        });
    }
    
    if (genreFilter) filtered = filtered.filter(book => book.genre === genreFilter);
    if (statusFilter) filtered = filtered.filter(book => book.status === statusFilter);
    
    renderNo33Books(filtered);
}

function populateNo33Filters(books) {
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    const genreSelect = document.getElementById('genreFilterNo33');
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

async function toggleNo33Status(id) {
    const book = currentNo33Books.find(b => b.id === id);
    if (!book) return;
    
    let nextStatus;
    if (book.status === 'Unread') nextStatus = 'Reading';
    else if (book.status === 'Reading') nextStatus = 'Read';
    else nextStatus = 'Unread';
    
    try {
        const { error } = await supabaseClient
            .from('no_33')
            .update({ status: nextStatus })
            .eq('id', id);
            
        if (error) {
            console.error('Error:', error);
            alert('Error al cambiar el estado');
            return;
        }
        loadNo33();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el estado');
    }
}

// Funciones de modal para No.33
function openAddModalNo33() {
    const overlay = document.getElementById('modalOverlayNo33');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalTitleNo33').textContent = 'Añadir libro';
    document.getElementById('editIdNo33').value = '';
    document.getElementById('addFormNo33').reset();
    const deleteBtn = document.getElementById('deleteBookBtnNo33');
    if (deleteBtn) deleteBtn.style.display = 'none';
}

function closeModalNo33() {
    const overlay = document.getElementById('modalOverlayNo33');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function fillNo33Form(book) {
    document.getElementById('editIdNo33').value = book.id || '';
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
}

function openEditModalNo33(book) {
    const overlay = document.getElementById('modalOverlayNo33');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    fillNo33Form(book);
    document.getElementById('modalTitleNo33').textContent = 'Editar libro';
    const deleteBtn = document.getElementById('deleteBookBtnNo33');
    if (deleteBtn) {
        deleteBtn.style.display = 'block';
        deleteBtn.dataset.id = book.id;
    }
}

async function saveNo33Book() {
    const id = document.getElementById('editIdNo33').value;
    const bookData = {
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
    
    if (!bookData.title || !bookData.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        let result;
        if (id) {
            result = await supabaseClient.from('no_33').update(bookData).eq('id', id);
        } else {
            result = await supabaseClient.from('no_33').insert([bookData]);
        }
        
        if (result.error) {
            console.error('Error:', result.error);
            alert('Error al guardar');
            return;
        }
        
        closeModalNo33();
        loadNo33();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
}

async function deleteNo33Book() {
    const id = this.dataset.id;
    if (!id) return;
    if (!confirm('¿Eliminar este libro?')) return;
    
    try {
        const { error } = await supabaseClient.from('no_33').delete().eq('id', id);
        if (error) {
            console.error('Error:', error);
            alert('Error al eliminar');
            return;
        }
        closeModalNo33();
        loadNo33();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
    }
}