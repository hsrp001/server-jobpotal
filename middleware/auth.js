const jwt = require('jsonwebtoken');
const userdatas = require('../model/userdata')
const keys = "sonu#12345"
const auth = async (req, res, next) => {

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, keys );

  

    const user = await userdatas.findOne({ _id :decoded._id  , 'token': token });
    

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// authMiddleware.js



module.exports = auth ;