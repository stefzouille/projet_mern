//on apelle la base de donnée
const UserModel = require("../models/user.model");
// controller que les id soit reconnus par la base de donnée
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password"); // demande au server de ne pas renvoyer le mot de passe ds la réponse
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) // params info que l on recupere de ce qui est passé dans l url
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      // --------la callback ne marche pas avec moongoose utiliser un then pour resoudre le souci sinon nodemon crash ----------------
      //       (err, docs) => {
      //         if (!err) return res.send(docs);
      //         if (err) return console.log(err), res.status(500).send({ message: err });
      //       }
      //     );
      //   } catch (err) {
      //     return console.log(err), res.status(500).json({ message: err });
      //   }
      // };
    ).select("-password")
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // Warning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};



module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
      // (err, docs) => {
      //   if (!err) console.log('OK');
      //   else return res.status(400).jsos(err);
      // }
    )
      .then((docs) => res.status(201).send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }))
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   else return res.status(400).jsos(err);
      // }
    )
      .then((docs) => res.status(201).send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // remove to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      // (err, docs) => {
      //   // if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    )
      // .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }))
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};












