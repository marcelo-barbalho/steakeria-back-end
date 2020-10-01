const jwt = require('jsonwebtoken');
const config = require('config');
const MSGS = require('../messages')



module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: MSGS.WITHOUT_TOKEN });
  }

  try {
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: MSGS.INVALID_TOKEN });
      }
      req.user = decoded.user;
      next();
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: MSGS.GENERIC_ERROR });
  }
}
