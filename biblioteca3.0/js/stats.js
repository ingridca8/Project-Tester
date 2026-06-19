/* ========================================
   PÁGINA DE ESTADÍSTICAS - STATS
   ======================================== */

// Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Página de estadísticas cargada');
    loadStats();
});

// ========================================
// 1. CARGAR TODAS LAS ESTADÍSTICAS
// ========================================

async function loadStats() {
    console.log('🔄 Cargando estadísticas...');
    // Obtener datos de las tres tablas
    const books = await fetchBooksFromTable('books');
    const no33 = await fetchBooksFromTable('no_33');
    const wishlist = await fetchBooksFromTable('wishlist');
    
    console.log(`📖 Biblioteca: ${books.length}, No.33: ${no33.length}, Wishlist: ${wishlist.length}`);
    
    // Combinar los libros de biblioteca y No.33 para estadísticas
    const allBooks = [...books, ...no33];
    
    // Actualizar estadísticas generales
    updateGeneralStats(allBooks);
    
    // Actualizar top autores y géneros
    updateTopStats(allBooks);
    
    // Mostrar estado de Wishlist
    updateWishlistStats(wishlist);
}

// ========================================
// 2. ESTADÍSTICAS GENERALES
// ========================================

function updateGeneralStats(books) {
    const totalEl = document.getElementById('totalBooks');
    const readEl = document.getElementById('booksRead');
    const readingEl = document.getElementById('booksReading');
    const percentageEl = document.getElementById('readPercentage');
    
    // Total de libros
    if (totalEl) totalEl.textContent = books.length;
    
    // Libros leídos
    const read = books.filter(b => b.status === 'Read').length;
    if (readEl) readEl.textContent = read;
    
    // Libros en lectura
    const reading = books.filter(b => b.status === 'Reading').length;
    if (readingEl) readingEl.textContent = reading;
    
    // Porcentaje de lectura
    const readPercentage = books.length > 0 ? Math.round((read / books.length) * 100) : 0;
    if (percentageEl) percentageEl.textContent = `${readPercentage}%`;
}

// ========================================
// 3. TOP AUTORES Y GÉNEROS
// ========================================

function updateTopStats(books) {
    // --- Top autores más leídos (basado en libros completados) ---
    const readBooks = books.filter(b => b.status === 'Read');
    const authorCount = {};
    
    readBooks.forEach(book => {
        if (book.author) {
            const author = book.author.trim();
            authorCount[author] = (authorCount[author] || 0) + 1;
        }
    });
    
    // Ordenar y mostrar top 3
    const topAuthors = Object.entries(authorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const authorList = document.getElementById('topAuthors');
    if (authorList) {
        authorList.innerHTML = '';
        
        if (topAuthors.length === 0) {
            authorList.innerHTML = '<div class="top-item"><span class="top-name">No hay autores leídos aún</span></div>';
        } else {
            topAuthors.forEach(([author, count]) => {
                const item = document.createElement('div');
                item.className = 'top-item';
                item.innerHTML = `
                    <span class="top-name">${escapeHtml(author)}</span>
                    <span class="top-count">${count} ${count === 1 ? 'libro' : 'libros'}</span>
                `;
                authorList.appendChild(item);
            });
        }
    }
    
    // --- Autores con más libros en total (de toda la colección) ---
    const totalAuthorCount = {};
    books.forEach(book => {
        if (book.author) {
            const author = book.author.trim();
            totalAuthorCount[author] = (totalAuthorCount[author] || 0) + 1;
        }
    });
    
    const topTotalAuthors = Object.entries(totalAuthorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const totalAuthorList = document.getElementById('topTotalAuthors');
    if (totalAuthorList) {
        totalAuthorList.innerHTML = '';
        
        if (topTotalAuthors.length === 0) {
            totalAuthorList.innerHTML = '<div class="top-item"><span class="top-name">No hay autores registrados</span></div>';
        } else {
            topTotalAuthors.forEach(([author, count]) => {
                const item = document.createElement('div');
                item.className = 'top-item';
                item.innerHTML = `
                    <span class="top-name">${escapeHtml(author)}</span>
                    <span class="top-count">${count} ${count === 1 ? 'libro' : 'libros'}</span>
                `;
                totalAuthorList.appendChild(item);
            });
        }
    }
    
    // --- Top 3 géneros ---
    const genreCount = {};
    books.forEach(book => {
        if (book.genre) {
            const genre = book.genre.trim();
            genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
    });
    
    const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const genreList = document.getElementById('topGenres');
    if (genreList) {
        genreList.innerHTML = '';
        
        if (topGenres.length === 0) {
            genreList.innerHTML = '<div class="top-item"><span class="top-name">No hay géneros registrados</span></div>';
        } else {
            topGenres.forEach(([genre, count]) => {
                const item = document.createElement('div');
                item.className = 'top-item';
                item.innerHTML = `
                    <span class="top-name">${escapeHtml(genre)}</span>
                    <span class="top-count">${count} ${count === 1 ? 'libro' : 'libros'}</span>
                `;
                genreList.appendChild(item);
            });
        }
    }
}

// ========================================
// 4. ESTADO DE WISHLIST
// ========================================

function updateWishlistStats(wishlist) {
    const wishlistEl = document.getElementById('wishlistCount');
    if (wishlistEl) wishlistEl.textContent = wishlist.length;
}