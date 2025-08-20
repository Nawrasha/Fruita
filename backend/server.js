const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MySQL2',
  database: 'fruita'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});


/* Routes pour le login et register  */

//Route d'inscription

app.post('/api/register', async (req, res) => {
  try {
    const {nom_complet,email, password } = req.body;
    
    // Vérifier si l'email existe déjà
    db.query('SELECT * FROM admin WHERE email = ?', [email], async (err, results) => {
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
        'INSERT INTO admin (nom_complet, email, password) VALUES (?, ?, ?)',
        [nom_complet, email, motDePasseHache],
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


// Route de connexion

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Rechercher l'utilisateur par email
  db.query('SELECT * FROM admin WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const admin = results[0];
    
    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(password, admin.password);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
        
    // Connexion réussie
    res.json({ 
      message: 'Connexion réussie',
      admin: {
        id: admin.id,
        nom_complet: admin.nom_complet,
        email: admin.email,
        role: admin.role
      }
    });
  });
});





app.get('/api/produits', (req, res) => {
  db.query('SELECT * FROM produits ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
