const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');



router.post('/', async (req, res) => {
  try {
    const {nom_complet, role, email, password } = req.body;
    
    // Vérifier si l'email existe déjà
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Erreur lors de la requête SQL:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      
      // Hasher le mot de passe
      const motDePasseHache = await bcrypt.hash(password, 10);

      // Insérer le nouvel utilisateur
      db.query(
        'INSERT INTO user (nom_complet, role, email, password) VALUES (?, ?, ?, ?)',
        [nom_complet, role, email, motDePasseHache ],
        (err, result) => {
          if (err) {
            console.error('Erreur lors de l\'inscription:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
          }
          res.status(201).json({ message: 'Inscription réussie' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;