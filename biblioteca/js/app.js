// cargar al inicio

let books = [];
let editingId = null;

// referencias del DOM
const catalog = document.getElementById("catalog");
const form = document.getElementById("addForm");

// estado global// estado globalForm");
const overlay = document.getElementById("overlayForm");
const searchInput = document.getElementById("searchInput");
const fabBtn = document.getElementById("fabBtn");

// cargar libros desde Supabase
async function fetchBooks() {
  const { data, error } = await supabaseClient
    .from("books")
    .select("*");

  console.log("ERROR:", error);
  console.log("RAW DATA:", data);

  books = data || [];
  render();
}


// renderizar catálogo
function render() {
  catalog.innerHTML = "";

  if (!books || books.length === 0) {
    catalog.innerHTML = "<p>No hay libros.</p>";
  } else {
    const search = (searchInput.value || "").toLowerCase();

    books
      .filter(b =>
        (b.title || "").toLowerCase().includes(search) ||
        (b.author || "").toLowerCase().includes(search)
      )
      .forEach(b => {
        const card = createCard(b);
        catalog.appendChild(card);
      });
  }

  // stats
  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("booksRead").textContent =
    books.filter(b => b.status === "Read").length;
  document.getElementById("booksReading").textContent =
    books.filter(b => b.status === "Reading").length;
}

// buscador en tiempo real
searchInput.oninput = render;

// abrir modal
fabBtn.onclick = () => {
  overlay.style.display = "block";
};

// cerrar modal al hacer click fuera
window.onclick = (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
};

// submit form (add o edit)
form.onsubmit = async (e) => {
  e.preventDefault();

  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    genre: document.getElementById("genre").value,
    year: parseInt(document.getElementById("year").value) || null,
    editorial: document.getElementById("editorial").value,
    language: document.getElementById("language").value,
    pages: parseInt(document.getElementById("pages").value) || null,
    isbn: document.getElementById("isbn").value,
    grade: parseInt(document.getElementById("grade").value) || null,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value,
  };

  try {
    if (editingId) {
      // editar
      const { error } = await supabaseClient
        .from("books")
        .update(book)
        .eq("id", editingId);

      if (error) console.error(error);

      editingId = null;
    } else {
      // nuevo
      const { error } = await supabaseClient
        .from("books")
        .insert([book]);

      if (error) console.error(error);
    }

    form.reset();
    overlay.style.display = "none";
    fetchBooks();

  } catch (err) {
    console.error("Error guardando:", err);
  }
};

// editar libro (llenar form)
function editBook(b) {
  editingId = b.id;

  document.getElementById("title").value = b.title || "";
  document.getElementById("author").value = b.author || "";
  document.getElementById("genre").value = b.genre || "";
  document.getElementById("year").value = b.year || "";
  document.getElementById("editorial").value = b.editorial || "";
  document.getElementById("language").value = b.language || "";
  document.getElementById("pages").value = b.pages || "";
  document.getElementById("isbn").value = b.isbn || "";
  document.getElementById("grade").value = b.grade || "";
  document.getElementById("status").value = b.status || "";
  document.getElementById("notes").value = b.notes || "";

  overlay.style.display = "block";
}

// borrar libro
async function deleteBook(id) {
  if (!confirm("¿Eliminar este libro?")) return;

  try {
    const { error } = await supabaseClient
      .from("books")
      .delete()
      .eq("id", id);

    if (error) console.error(error);

    fetchBooks();
  } catch (err) {
    console.error("Error borrando:", err);
  }
}

