/* ========================================
   PÁGINA DE WISHLIST - LISTA DE DESEOS
   ======================================== */

let currentWishlist = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('⭐ Wishlist cargada');
    loadWishlist();
    setupWishlistEvents();
});

async function loadWishlist() {
    console.log('🔄 Cargando Wishlist...');
    const books = await fetchBooksFromTable('wishlist');
    console.log(`📖 ${books.length} libros en Wishlist`);
    currentWishlist = books;
    renderWishlist(books);
    populateWishlistFilters(books);
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
            <div style="text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1 / -1;">
                <p style="font-size: 1.2rem;">📖 No hay libros en tu Wishlist</p>
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
                ${book.year ? `<span>${escapeHtml(String(book.year))}</span>` : ''}
                ${book.editorial ? `<span>${escapeHtml(book.editorial)}</span>` : ''}
            </div>
            ${book.notes ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.5rem 0;">${escapeHtml(book.notes)}</div>` : ''}
            <div class="book-status" style="background: rgba(201, 168, 108, 0.15); color: var(--gold); display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; margin-top: 0.5rem;">⭐ En lista de deseos</div>
        `;
        
        card.addEventListener('click', function() {
            openWishlistEditModal(book);
        });
        
        container.appendChild(card);
    });
}

function setupWishlistEvents() {
    const searchInput = document.getElementById('searchInputWishlist');
    if (searchInput) searchInput.addEventListener('input', applyWishlistFilters);
    
    const genreFilter = document.getElementById('genreFilterWishlist');
    if (genreFilter) genreFilter.addEventListener('change', applyWishlistFilters);
    
    const yearFilter = document.getElementById('yearFilterWishlist');
    if (yearFilter) yearFilter.addEventListener('change', applyWishlistFilters);
    
    const fabBtn = document.getElementById('fabBtnWishlist');
    if (fabBtn) fabBtn.addEventListener('click', function() { openWishlistAddModal(); });
    
    const saveBtn = document.getElementById('saveBookBtnWishlist');
    if (saveBtn) saveBtn.addEventListener('click', saveWishlistBook);
    
    const closeBtn = document.getElementById('closeModalWishlist');
    if (closeBtn) closeBtn.addEventListener('click', closeWishlistModal);
    
    const overlay = document.getElementById('modalOverlayWishlist');
    if (overlay) overlay.addEventListener('click', function(e) { if (e.target === this) closeWishlistModal(); });
    
    const deleteBtn = document.getElementById('deleteBookBtnWishlist');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteWishlistBook);
}

function applyWishlistFilters() {
    const searchTerm = document.getElementById('searchInputWishlist').value.toLowerCase().trim();
    const genreFilter = document.getElementById('genreFilterWishlist').value;
    const yearFilter = document.getElementById('yearFilterWishlist').value;
    
    let filtered = currentWishlist;
    
    if (searchTerm) {
        filtered = filtered.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            return title.includes(searchTerm) || author.includes(searchTerm);
        });
    }
    
    if (yearFilter) {
        filtered = filtered.filter(book => String(book.year) === yearFilter);
    }
    
    renderWishlist(filtered);
}

function populateWishlistFilters(books) {
    // Años disponibles
    const years = [...new Set(books.map(b => b.year).filter(Boolean))].sort((a, b) => b - a);
    const yearSelect = document.getElementById('yearFilterWishlist');
    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">Todos los años</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }
}

// Funciones de modal para Wishlist
function openWishlistAddModal() {
    const overlay = document.getElementById('modalOverlayWishlist');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalTitleWishlist').textContent = 'Añadir a Wishlist';
    document.getElementById('editIdWishlist').value = '';
    document.getElementById('addFormWishlist').reset();
    const deleteBtn = document.getElementById('deleteBookBtnWishlist');
    if (deleteBtn) deleteBtn.style.display = 'none';
}

function closeWishlistModal() {
    const overlay = document.getElementById('modalOverlayWishlist');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function fillWishlistForm(book) {
    document.getElementById('editIdWishlist').value = book.id || '';
    document.getElementById('titleWishlist').value = book.title || '';
    document.getElementById('authorWishlist').value = book.author || '';
    document.getElementById('isbnWishlist').value = book.isbn || '';
    document.getElementById('yearWishlist').value = book.year || '';
    document.getElementById('editorialWishlist').value = book.editorial || '';
    document.getElementById('notesWishlist').value = book.notes || '';
}

function openWishlistEditModal(book) {
    const overlay = document.getElementById('modalOverlayWishlist');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    fillWishlistForm(book);
    document.getElementById('modalTitleWishlist').textContent = 'Editar libro';
    const deleteBtn = document.getElementById('deleteBookBtnWishlist');
    if (deleteBtn) {
        deleteBtn.style.display = 'block';
        deleteBtn.dataset.id = book.id;
    }
}

async function saveWishlistBook() {
    const id = document.getElementById('editIdWishlist').value;
    const bookData = {
        title: document.getElementById('titleWishlist').value.trim(),
        author: document.getElementById('authorWishlist').value.trim(),
        isbn: document.getElementById('isbnWishlist').value.trim() || null,
        year: parseInt(document.getElementById('yearWishlist').value) || null,
        editorial: document.getElementById('editorialWishlist').value.trim() || null,
        notes: document.getElementById('notesWishlist').value.trim() || null
    };
    
    if (!bookData.title || !bookData.author) {
        alert('Título y autor son obligatorios');
        return;
    }
    
    try {
        let result;
        if (id) {
            result = await supabaseClient.from('wishlist').update(bookData).eq('id', id);
        } else {
            result = await supabaseClient.from('wishlist').insert([bookData]);
        }
        
        if (result.error) {
            console.error('Error:', result.error);
            alert('Error al guardar');
            return;
        }
        
        closeWishlistModal();
        loadWishlist();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
}

async function deleteWishlistBook() {
    const id = this.dataset.id;
    if (!id) return;
    if (!confirm('¿Eliminar este libro de la wishlist?')) return;
    
    try {
        const { error } = await supabaseClient.from('wishlist').delete().eq('id', id);
        if (error) {
            console.error('Error:', error);
            alert('Error al eliminar');
            return;
        }
        closeWishlistModal();
        loadWishlist();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
    }
}