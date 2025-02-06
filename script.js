document.getElementById('licenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const licenseCode = document.getElementById('licenseCode').value;
  const domain = document.getElementById('domain').value;

  const response = await fetch('/api/licenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ licenseCode, domain })
  });

  if (response.ok) {
    alert('Licence ajoutée avec succès!');
    loadLicenses();  // Rafraîchir la liste des licences
  } else {
    alert('Erreur lors de l\'ajout de la licence');
  }
});

async function loadLicenses() {
  const response = await fetch('/api/licenses');
  const licenses = await response.json();

  const list = document.getElementById('licenseList');
  list.innerHTML = '';

  licenses.forEach(license => {
    const listItem = document.createElement('li');
    listItem.textContent = `Code: ${license.licenseCode}, Domaine: ${license.domain}`;
    list.appendChild(listItem);
  });
}

// Charger les licences au démarrage
loadLicenses();
