require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));