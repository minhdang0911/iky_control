const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const techRoutes = require('./routes/technicianRoutes');
const storeRoutes = require('./routes/store');
const liftTableRoutes = require('./routes/liftTableRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cors = require('cors');
require('dotenv').config();

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

app.use(express.json());
app.use('/api/user', authRoutes);
app.use('/api/technical', techRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/lifttable', liftTableRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/customer', customerRoutes);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello, Express with MongoDB!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
