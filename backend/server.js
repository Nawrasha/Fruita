const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json()); 

const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
