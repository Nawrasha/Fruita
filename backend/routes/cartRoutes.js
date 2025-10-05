const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const authMiddleware = require('../middlewares/authMiddleware');


router.use(express.json());

// Route pour obtenir les éléments du panier (protégée)
router.get('/', authMiddleware, (req, res ) => {
  if (!req.user || !req.user.id || req.user.role !== 'user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.id;
    const query = `
    SELECT c.id, c.quantity, p.nom_produit, p.prix, p.image, p.id AS product_id
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart items', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.json(results);
  });
});




// Route pour ajouter un élément au panier (protégée)
router.post('/', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  db.query('INSERT INTO cart(user_id, product_id) VALUES (?, ?)', [userId, productId], (err, results) => {
    if (err) {
      console.error('Error adding item to cart', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'Item added to cart', itemId: results.insertId });
  });
});



// Route pour mettre à jour la quantité d'un produit dans le panier
router.put('/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const cartitemID = req.params.id;
  const { quantity } = req.body;
  const userId = req.user.id;


  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantité invalide' });
  }
  db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
     [quantity, cartitemID, userId], (err, result) => {
    if (err) {
      console.error('Erreur mise à jour quantité:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json({ message: 'Quantité mise à jour avec succès' });
  });
});


// Route pour supprimer un élément du panier
router.delete('/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.id || req.user.role !== 'user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const cartitemID = req.params.id;
  const userId = req.user.id;

  db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartitemID, userId], (err, result) => {
    if (err) {
      console.error('Error removing item from cart', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart' });
  });
});

module.exports = router;