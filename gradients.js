document.querySelectorAll('.block span').forEach(original => {
  const text = original.textContent;

  // Crée le clone du haut
  const top = document.createElement('span');
  top.className = 'clone top';
  top.textContent = text;

  // Crée le clone du bas
  const bottom = document.createElement('span');
  bottom.className = 'clone bottom';
  bottom.textContent = text;

  // Insère les clones autour de l'original
  original.parentNode.insertBefore(top, original);
  original.parentNode.insertBefore(bottom, original.nextSibling);
});


