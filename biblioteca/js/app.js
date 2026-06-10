function render(){
  catalog.innerHTML = "";

  if (!books || books.length === 0) {
    catalog.innerHTML = "<p>No hay libros.</p>";
    return;
  }

  books.forEach(b=>{
    const card = createCard(b);
    catalog.appendChild(card);
  });

  document.getElementById("totalBooks").textContent = books.length;
  document.getElementById("booksRead").textContent =
    books.filter(b=>b.status==="Read").length;
  document.getElementById("booksReading").textContent =
    books.filter(b=>b.status==="Reading").length;
}
