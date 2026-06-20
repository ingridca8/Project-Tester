/* ========================================
   CONFIGURACIÓN DE SUPABASE - VERSIÓN REST
   ======================================== */

const SUPABASE_URL = 'https://oyxbycmpkfcszweufzqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eGJ5Y21wa2Zjc3p3ZXVmenFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTkyMDYsImV4cCI6MjA5NTk5NTIwNn0.mKWFCngzTVtlUkJPAoOX38fLeFqeLakvkdV2B4RVJpQ';

console.log('✅ Supabase configurado');

// Función para obtener datos de cualquier tabla
async function getTableData(tableName) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
        console.log(`📡 Consultando: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ ${tableName}: ${data.length} registros`);
        return data;
    } catch (error) {
        console.error(`❌ Error en ${tableName}:`, error);
        return [];
    }
}

// Función para insertar
async function insertRecord(tableName, data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log(`✅ Insertado en ${tableName}`);
        return result;
    } catch (error) {
        console.error(`❌ Error al insertar en ${tableName}:`, error);
        throw error;
    }
}

// Función para actualizar
async function updateRecord(tableName, id, data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log(`✅ Actualizado en ${tableName}`);
        return result;
    } catch (error) {
        console.error(`❌ Error al actualizar en ${tableName}:`, error);
        throw error;
    }
}

// Función para eliminar
async function deleteRecord(tableName, id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        console.log(`✅ Eliminado de ${tableName}`);
        return true;
    } catch (error) {
        console.error(`❌ Error al eliminar de ${tableName}:`, error);
        throw error;
    }
}