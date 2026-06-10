function render(){
totalBooks").textContent = books.length;  catalog.innerHTML = "";
  document.getElementById("booksRead").textContent =
    books.filter(b => b.status === "Read").length;
  document.getElementById("booksReading").textContent =
    books.filter(b => b.status === "Reading").length;
}

  books.forEach(b=>{
    catalog.appendChild(createCard(b));
  });

