let books = [];
let editingId = null;
let currentOwner = "me";

// refs
const catalog = document.getElementById("catalog");
const form = document.getElementById("addForm");
const overlay = document.getElementById("overlay");

// tabs
document.querySelectorAll('.tab').forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentOwner = btn.dataset.owner;
    render();
  };
});

async function fetchBooks() {
  const { data } = await supabaseClient.from("books").select("*");
  books = data || [];
  render();
}

function render() {
  catalog.innerHTML = "";

  const filtered = books.filter(b => b.owner === currentOwner);

  filtered.forEach(b=>{
    const el = createCard(b);
    catalog.appendChild(el);
  });

  updateStats();
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const book = {
    title: title.value,
    author: author.value,
    isbn: isbn.value,
    year: parseInt(year.value),
    genre: genre.value,
    status: status.value,
    notes: notes.value,
    editorial: editorial.value,
    language: language.value,
    pages: parseInt(pages.value),
    grade: parseInt(grade.value),
    owner: currentOwner
  };

  if (editingId) {
    await supabaseClient.from("books").update(book).eq("id", editingId);
    editingId = null;
  } else {
    await supabaseClient.from("books").insert([book]);
  }

  overlay.classList.remove("open");
  form.reset();
  fetchBooks();
};

async function deleteBook(id){
  await supabaseClient.from("books").delete().eq("id", id);
  fetchBooks();
}

async function toggle(id){
  const book = books.find(b=>b.id == id);
  const next = book.status === "Unread" ? "Reading" : "Read";
  await supabaseClient.from("books").update({status:next}).eq("id",id);
  fetchBooks();
}

function openEdit(book){
  editingId = book.id;

  title.value = book.title;
  author.value = book.author;
  isbn.value = book.isbn;
  year.value = book.year;
  genre.value = book.genre;
  status.value = book.status;
  notes.value = book.notes;
  editorial.value = book.editorial;
  language.value = book.language;
  pages.value = book.pages;
  grade.value = book.grade;

  overlay.classList.add("open");
}

// abrir modal
fabBtn.onclick = () => overlay.classList.add("open");

// stats
function updateStats(){
  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("booksRead").textContent = books.filter(b=>b.status==="Read").length;
  document.getElementById("booksReading").textContent = books.filter(b=>b.status==="Reading").length;
}

fetchBooks();
