/* ========================================
   CONFIGURACIÓN DE SUPABASE
   ======================================== */

// Importar la librería de Supabase (CDN)
// Nota: La librería se carga desde el HTML con:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Configuración de tu proyecto Supabase
const SUPABASE_URL = 'https://oyxbycmpkfcszweufzqd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_946oJd_cXU--MEEQDvj6xg_nvwBeXWB';

// Crear el cliente de Supabase
// Verificar que supabase esté definido (cargado desde el CDN)
if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase cliente inicializado correctamente');
} else {
    console.error('❌ La librería de Supabase no está cargada. Verifica el script en el HTML.');
    // Crear un objeto dummy para evitar errores
    var supabaseClient = {
        from: function() {
            console.error('⚠️ Supabase no está disponible');
            return { select: function() { return { order: function() { return { then: function(cb) { cb({data: [], error: 'Supabase no disponible'}); } }; } }; } };
        }
    };
}