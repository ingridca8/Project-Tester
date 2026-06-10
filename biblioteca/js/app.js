let books = [];
letbooks").select("*");let editingId = null;
  books = data || [];
  render();
}

function render(){
  catalog.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  books
    .filter(b =>
      (b.title || "").toLowerCase().includes(search) ||
      (b.author || "").toLowerCase().includes(search)
    )
    .forEach(b=>{
      catalog.appendChild(createCard(b));
    });

  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("booksRead").textContent =
    books.filter(b=>b.status==="Read").length;
  document.getElementById("booksReading").textContent =
    books.filter(b=>b.status==="Reading").length;
}

searchInput.oninput = render;

// abrir modal
fabBtn.onclick = ()=> overlay.classList.add("open");

form.onsubmit = async e=>{
  e.preventDefault();

  const book = {
    title:title.value,
    author:author.value,
    genre:genre.value,
    year:parseInt(year.value),
    editorial:editorial.value,
    language:language.value,
    pages:parseInt(pages.value),
    isbn:isbn.value,
    grade:parseInt(grade.value),
    status:status.value,
    notes:notes.value
  };

  if(editingId){
    await supabaseClient.from("books").update(book).eq("id",editingId);
    editingId = null;
  } else {
    await supabaseClient.from("books").insert([book]);
  }

  overlay.classList.remove("open");
  form.reset();

  fetchBooks();
};

function editBook(b){
  editingId = b.id;

  Object.keys(b).forEach(key=>{
    const el = document.getElementById(key);
    if(el) el.value = b[key] || "";
  });

  overlay.classList.add("open");
}

async function deleteBook(id){
  await supabaseClient.from("books").delete().eq("id",id);
  fetchBooks();
}

fetchBooks();

const catalog = document.getElementById("catalog");
const form = document.getElementById("addForm");
const overlay = document.getElementById("overlay");

async function fetchBooks(){
