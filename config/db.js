require('dotenv').config({ path: './config/.env' });

// importer express
const express = require('express');

// creerla const pour appelé la methode express pour creer une application express
const app = express();

const mongoose = require('mongoose');

// console.log(process.env.NAMEMGSE);

mongoose.connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.e9dod.mongodb.net/mern-project`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // ------------------------------------projet fromscratch erreur ??
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
