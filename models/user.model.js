const mongoose = require('mongoose');
const { isEmail } = require('validator'); // cette fct renvoie true ou false
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String, // avec un S majuscule toujours
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true // supprime les espaces a la fin
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail], // fonction de la bibliotheque validator
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String, // c est le chemin de l image qui sera stocké dans la base de donnée
      default: "./uploads/profil/random-user.png"
    },
    bio: {                 //  ne s affiche dans la base de donnée que si on a remplie une bio
      type: String,
      max: 1024,
    },
    followers: {
      type: [String]  // tableau qui abrite a l interieur des strings qui sont les id des users qui suivent l utilisateur
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    }
  }, // cette partie est optionnelle fin du schema et on peut ajouter des options comme ci-dessous le timestamps
  {
    timestamps: true,  // crée automatiquement deux champs : createdAt et updatedAt
  }
);

// play function before save into display: 'block',
// avant de faire des save ds la base de donnée on va crypter le password
userSchema.pre("save", async function (next) {  // pas de fct fléchée car on a besoin de this sinon ca ne fonctionne pas
  const salt = await bcrypt.genSalt();          // saler le password avant de le crypter
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;