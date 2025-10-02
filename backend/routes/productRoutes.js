const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const authMiddleware = require('../middlewares/authMiddleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');




// Route pour obtenir les produits (protégée)

router.get('/', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


router.delete('/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;
  
  // Supprimer le produit par son ID
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé avec succès" });
  });
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;
  const { nom_produit, prix, description, categorie, image } = req.body;
  try {
    db.query(
      'UPDATE products SET nom_produit=?, prix=?, description=?, categorie=?, image=? WHERE id=?',
      [nom_produit, prix, description, categorie, image, id]
    );
    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Ajouter un produit
router.post('/', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { nom_produit, prix, description, categorie, image } = req.body;

  if (!nom_produit || !prix || !categorie || !image || !description) {
    return res.status(400).json({ message: "Compléter tous les champs" });
  }

  try {
    db.query(
      'INSERT INTO products (nom_produit, prix, description, categorie, image) VALUES (?, ?, ?, ?, ?)',
      [nom_produit, prix, description , categorie, image],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Retourner le produit ajouté
        const newProduct = {
          id: result.insertId,
          nom_produit,
          prix,
          description,
          categorie,
          image
        };
        res.status(201).json({ message: "Produit ajouté avec succès", produit: newProduct });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route de recherche de produits
router.get('/search', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }   
  const keyword = req.query.keyword;
  db.query('SELECT * FROM products WHERE nom_produit LIKE ? ORDER BY created_at DESC', [`%${keyword}%`], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
} );


module.exports = router;