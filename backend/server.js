const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");

const secretKey = "ezalqikjdsqjhdaziedjhazoqdhjsiuehazoid";

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


function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

/* Routes pour le login et register  */

//Route d'inscription

app.post('/api/register', async (req, res) => {
  try {
    const {nom_complet, role, email, password } = req.body;
    
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
        'INSERT INTO admin (nom_complet, role, email, password) VALUES (?, ?, ?, ?)',
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


app.get('/api/produits', authMiddleware, (req, res) => {
  if (!req.user && !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  db.query('SELECT * FROM produits ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
