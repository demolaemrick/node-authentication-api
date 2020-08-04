require("dotenv").config();

const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/////////////////////////////////////////// REGISTER ////////////////////////////////////////////////////
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  //validate the data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exist.
  User.findOne({ email }, (err, user) => {
    if (user) return res.status(400).json({ msg: "User Already exist." });
    //create a new user
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw err;
      // Store hash in your password DB.
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      newUser
        .save()
        .then((user) => {
          jwt.sign(
            { id: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.send({
                token,
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    });
  });
});

/////////////////////////////////////////// LOGIN ////////////////////////////////////////////////////
router.post("/login", (req, res) => {
  const { name, email, password } = req.body;
  //validate the data before creating a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exist.
  User.findOne({ email }, (err, user) => {
    if (err) console.log(err);

    //note there might be some weird result if you don't check for user not found first.
    if (!user) return res.status(400).send("User Does not exist.");
    //check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      // if isMatch(result) == true that means there is password match
      if (!isMatch) return res.status(400).send("Invalid credentials");
      // res.send(`${foundUser.name} has successfully logged in!`)
      jwt.sign(
        { id: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.send({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

module.exports = router;
