const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const  {sendToken} = require("../config/nodemailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/*************TOKEN************************** */
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode=token;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
    .then(() => {
      sendToken(email, confirmationCode)
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong☹️" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmationCode", (req, res) => {
  const {confirmationCode} = req.params;
  //true es para que nos regrese el ya editado
  User.findOneAndUpdate({ confirmationCode }, { status: "Active" }, { new: true })
  .then(user => {
    
    res.render("auth/confirmation", {message: "Cuenta confirmada"});
    //por que no funciona el alert?
    alert("Cuenta confirmada \n Inicia sesion")
  })
  .catch(err => {
    console.log(err);
    res.render("auth/login", { message: "Algo salio mal" });
  });
})

module.exports = router;
