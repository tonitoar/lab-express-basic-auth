const router = require("express").Router();

const User = require("../models/User.model");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => { // signup process
  // console.log("XXXXXXXXXXXXXX", req.body)
  const {username, password} = req.body; 

  if(username === "" || password === "") {
    let data = {
      errorMessage: "missing information",
      user: {
        username,
        password
      }
    }
    res.render("signup", data);
    return; // sempre que hi ha un IF --> return al final 

  }


  User.findOne({ username }, (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.redirect('/signup');
    }

    if (existingUser) {
      return res.redirect('/signup');
    }


    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.redirect('/signup');
      }

      // Create a new user
      User.create({ username, password: hashedPassword }, (err) => {
        if (err) {
          console.error(err);
          return res.redirect('/signup');
        }
        res.redirect('/login');
      });
    });
  });


  // Render the login form
router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err || !user) {

      return res.redirect('/login');
    }


    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {

        return res.redirect('/login');
      }


      req.session.userId = user._id;


      res.redirect('/dashboard');
    });
  });
});


})

module.exports = router;
