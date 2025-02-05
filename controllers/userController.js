const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "abcd123";
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: 400,
        message: "User already exist.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(400).json({
      status: 400,
      message: "User doesnot exist",
    });
  }
  const checkpassword = bcrypt.compare(password, userExist.password);
  if (!checkpassword) {
    return res.status(400).json({
      status: 400,
      message: "Password is not correct",
    });
  }
  const token = jwt.sign({ userId: userExist._id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return res.status(200).json({
    status: 200,
    message: "Login successfull",
    token,
  });
};
module.exports = { registerUser, LoginUser };
