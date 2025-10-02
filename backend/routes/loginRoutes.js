const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "ezalqikjdsqjhdaziedjhazoqdhjsiuehazoid";

// Route de connexion

router.post('/', (req, res) => {
  const { email, password } = req.body;
  
  // Rechercher l'utilisateur par email
  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const user = results[0];
    
    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(password, user.password);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    
    const token = jwt.sign({ user: {
        id: user.id,
        nom_complet: user.nom_complet,
        email: user.email,
        role: user.role
      }}, secretKey, { expiresIn: "1h" });

    res.json({ 
      token,
      user: {
        id: user.id,
        nom_complet: user.nom_complet,
        email: user.email,
        role: user.role
      }
    });
  });
});


module.exports = router;
