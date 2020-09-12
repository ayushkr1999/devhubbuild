const express =require('express')
const router = express.Router();
const auth =require('../../middleware/auth')
const User =require('../../models/User');
// const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt =require('bcryptjs')

router.get('/',auth,async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password');

        res.json(user);
    }
    catch(err){
        res.status(500).send('server error');
    }
});

//authentcate and get tioekrn
router.post('/',[
    check('email','please include a valid email').isEmail(),
    check('password','Pssword is req').exists()
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // console.log(email);

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalide Cereddinetials' }] });
      }

      const isMatch=await bcrypt.compare(password,user.password);

      if(!isMatch){
        return res
        .status(400)
        .json({ errors: [{ msg: 'invalide Cereddinetials' }] });
      }
     
      // res.status(200).send("yes");
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('secretOrKey'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
module.exports =router;