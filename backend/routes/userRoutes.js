const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const authMiddleware = require('../middlewares/authMiddleware');




// Route pour les utilisateurs (protégée)
router.get('/', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  db.query('SELECT id, nom_complet, email, role, created_at FROM user', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


  // Supprimer l'utilisateur par son ID
router.delete('/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;

  db.query('DELETE FROM user WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  });
});

  // Modifier un utilisateur
router.put('/:id', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;
  const { nom_complet, role, email } = req.body;
  try {
    db.query(
      'UPDATE user SET nom_complet=?, role=?, email=? WHERE id=?',
      [nom_complet, role, email, id]
    );
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un utilisateur
router.post('/', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { nom_complet, email, role, password } = req.body;

  if (!nom_complet || !email || !role || !password) {
    return res.status(400).json({ message: "Compléter tous les champs" });
  }

  try {
    // Vérifier si l'email existe déjà
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }


    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO user (nom_complet, email, password, role) VALUES (?, ?, ?, ?)',
      [nom_complet, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Retourner l'utilisateur ajouté
        const newUser = {
          id: result.insertId,
          nom_complet,
          email,
          role
        };
        res.status(201).json({ message: "Utilisateur ajouté avec succès", utilisateur: newUser });
      }
    );
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/search', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }   
  const motCle = req.query.search;
  db.query('SELECT * FROM user WHERE nom_complet LIKE ? OR email LIKE ? ORDER BY created_at DESC', [`%${motCle}%`, `%${motCle}%`], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




module.exports = router;