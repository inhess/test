// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Créer une application Express
const app = express();

// Utiliser body-parser pour parser les requêtes JSON
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/licences', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB !'))
  .catch(err => console.log('Erreur de connexion à MongoDB :', err));

// Définir le schéma de la licence
const licenseSchema = new mongoose.Schema({
  key: { type: String, required: true },
  domain: { type: String, required: true }
});

// Créer un modèle de licence
const License = mongoose.model('License', licenseSchema);

// Route pour récupérer toutes les licences
app.get('/licenses', async (req, res) => {
  try {
    const licenses = await License.find(); // Récupère toutes les licences dans la base de données
    res.json(licenses); // Envoie les licences au frontend
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des licences' });
  }
});

// Route pour ajouter une licence
app.post('/add-license', async (req, res) => {
  const { key, domain } = req.body;

  // Vérifie que la clé et le domaine sont fournis
  if (!key || !domain) {
    return res.status(400).json({ message: 'Clé et domaine sont requis' });
  }

  try {
    // Crée une nouvelle licence et l'enregistre dans la base de données
    const newLicense = new License({ key, domain });
    await newLicense.save();

    res.status(201).json({ message: 'Licence ajoutée avec succès' }); // Réponse de succès
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la licence' });
  }
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
