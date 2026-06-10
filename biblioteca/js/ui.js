function createCard(b){function createCard  card.className = "card";

  card.innerHTML = `
    <h3>${b.title}</h3>
    <p>${b.author}</p>

    <p>${b.genre || ''} • ${b.year || ''}</p>

    <strong>${b.status}</strong>

    <p>${b.notes || ''}</p>

    <details>
      <summary>Ver más</summary>
      <p>ISBN: ${b.isbn || '-'}</p>
      <p>Editorial: ${b.editorial || '-'}</p>
      <p>Idioma: ${b.language || '-'}</p>
      <p>Páginas: ${b.pages || '-'}</p>
      <p>Rating: ${b.grade || '-'}</p>
    </details>

    <button onclick="openEdit(${JSON.stringify(b).replace(/"/g, '&quot;')})">Editar</button>
    <button onclick="deleteBook(${b.id})">Borrar</button>
  `;

  return card;
}
  const card = document.createElement("div");

