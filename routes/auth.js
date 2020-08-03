require('dotenv').config()

const router = require("express").Router();
const User = require("../model/User");
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  //validate the data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //check if user already exist.
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (foundUser) return res.status(400).json({ msg: "User Already exist." });
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    user
      .save()
      .then((response) => { res.send({ name: response.name, email: response.email })})
      .catch((error) => {res.status(400).send(error) });
  });
});

//login
router.post("/login", (req, res) => {
  //validate the data before creating a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exist.
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if(err) console.log(err)

    //note there might be some weird result if you don't check for user not found first.
    if(!foundUser) return res.status(400).send('User not found.');
    //check password
    bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
        // if result == true that means there is password match
        if(result){
        //   res.send(`${foundUser.name} has successfully logged in!`)
          const token = jwt.sign({_id: foundUser._id}, process.env.TOKEN_SECRET)
          res.header('auth-token', token).send(token)
        }else{ return res.send('Invalid credentials') }
      });
  });
});

module.exports = router;
