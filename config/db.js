require('dotenv').config({ path: '../.env' });



const mongoose = require('mongoose');

// console.log(process.env.NAMEMGSE);

// mongoose.connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.e9dod.mongodb.net/?retryWrites=true&w=majority`,
mongoose.connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.9ylgaxd.mongodb.net/mern-project`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // ------------------------------------projet fromscratch erreur ??
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));


