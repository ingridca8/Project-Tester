function createCard(b){

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${b.title}</h3>
    <div class="meta">${b.author}</div>

    <div class="details">
      ${b.genre || ''} • ${b.year || ''}
    </div>

    <p>${b.notes || ''}</p>

    <details>
      <summary>Detalles</summary>
      <p>Editorial: ${b.editorial || '-'}</p>
      <p>Idioma: ${b.language || '-'}</p>
      <p>Páginas: ${b.pages || '-'}</p>
      <p>ISBN: ${b.isbn || '-'}</p>
      <p>Rating: ${b.grade || '-'}</p>
    </details>

    <p><b>${b.status}</b></p>

    <button onclick='editBook(${JSON.stringify(b)})'>Editar</button>
    <button onclick='deleteBook(${b.id})'>Borrar</button>
  `;

  return card;
}
``
