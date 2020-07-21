const jwt = require("jsonwebtoken");
const User = require("../model/User");

const auth = async (req, res, next) => {

  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, "kb34de57GFqcjFGgwXDL");
    console.log(data);
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    console.log("req => ", req.user.email);
    req.token = token;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
