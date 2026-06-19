function createCard(b){

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${b.title || ''}</h3>
    <p>${b.author || ''}</p>

    <p>${b.genre || ''} ${b.year || ''}</p>

    <p>${b.notes || ''}</p>

    <button class="edit-btn">Editar</button>
    <button class="delete-btn w3-black">Borrar</button>
  `;

  // eventos seguros
  card.querySelector(".edit-btn").onclick = () => editBook(b);
  card.querySelector(".delete-btn").onclick = () => deleteBook(b.id);

  return card;
}
