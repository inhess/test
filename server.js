const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const License = require('./models/License');
const path = require('path'); // Ajouté pour utiliser le chemin de fichiers
const cors = require('cors');

// Charger les variables d'environnement
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Permet les requêtes Cross-Origin

// Connexion à MongoDB (ajuste avec ton URI MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB Atlas !'))
  .catch(err => console.log('Erreur de connexion à MongoDB :', err));

// Route pour ajouter une licence
app.post('/api/licenses', async (req, res) => {
  const { licenseCode, domain } = req.body;

  const newLicense = new License({ licenseCode, domain });
  try {
    await newLicense.save();
    res.status(201).send('Licence ajoutée');
  } catch (err) {
    res.status(400).send('Erreur lors de l\'ajout de la licence');
  }
});

// Route pour récupérer toutes les licences
app.get('/api/licenses', async (req, res) => {
  try {
    const licenses = await License.find();
    res.json(licenses);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des licences');
  }
});

// Serve l'index.html pour la racine (accès au panel)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Sert le fichier index.html depuis la racine
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
