const express = require('express');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const app = express();

// process.env.PORT pour recuperer la valeur du port dans le fichier .env
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}
);
