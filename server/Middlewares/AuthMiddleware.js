const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
// require("dotenv").config();

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token; // extract token
  if (!token) {
    return res.status(401).json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => { // verify token
    if (err) {
      return res.status(401).json({ status: false });
    }

    try {
      const user = await User.findById(data.id); // find user
      if (user) {
        return res.status(200).json({ status: true, user: user.username });
      } else {
        return res.status(404).json({ status: false });
      }
    } catch (error) { // handle errors
      console.error(error);
      return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  });
};
