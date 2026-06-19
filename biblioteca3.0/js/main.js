/* ========================================
   FUNCIONES COMPARTIDAS - CORE
   ======================================== */

// ========================================
// 1. MENÚ DE NAVEGACIÓN - MANEJO DEL TOGGLE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón hamburguesa - SOLO si existe en la página
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Solo agregar el evento si existen los elementos
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
    }

    // Marcar el enlace activo según la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('nav a');
    
    navLinksAll.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // Cerrar menú al hacer clic en un enlace (móvil)
    navLinksAll.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('open');
            }
        });
    });
});

// ========================================
// 2. FUNCIONES DE UTILIDAD - COMUNES
// ========================================

// Escapar HTML para evitar inyección
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Obtener clase de estado
function getStatusClass(status) {
    if (!status) return 'status-unread';
    const s = status.toLowerCase();
    if (s === 'read') return 'status-read';
    if (s === 'reading') return 'status-reading';
    return 'status-unread';
}

// ========================================
// 3. FUNCIÓN PARA OBTENER DATOS DE UNA TABLA
// ========================================

async function fetchBooksFromTable(tableName) {
    try {
        // Verificar que supabaseClient esté definido
        if (typeof supabaseClient === 'undefined') {
            console.error('supabaseClient no está definido. Asegúrate de cargar supabase.js primero.');
            return [];
        }
        
        const { data, error } = await supabaseClient
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error(`Error al obtener datos de ${tableName}:`, error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error(`Error inesperado en ${tableName}:`, error);
        return [];
    }
}

// ========================================
// 4. FUNCIONES DE MODAL - SOLO PARA PÁGINAS QUE LAS USEN
// ========================================

// Función para abrir modal - se sobreescribe en cada página
function openModal(bookData = null) {
    console.log('openModal debe ser implementado en cada página');
}

// Función para cerrar modal
function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// 5. NOTA: Cada página tiene su propio setup de eventos
// ========================================
// Las funciones setupEventListeners están en cada archivo específico
// (biblioteca.js, no33.js, wishlist.js, stats.js)