const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const { User } = require("../models/users");

const { HttpError, ctrlWrapper,sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({  ...req.body, avatarURL,
    password: hashPassword,verificationToken
  });
 const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a tagret="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}"> Click verify email </a>`,
  };
  await sendEmail(verifyEmail);


  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "Missing required field email");
  }
  const user = User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a tagret="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}"> Click verify Email </a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    user,
    token
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscriptionUser = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });

  res.json({ _id, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw HttpError(401);
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({message: "Logout success"});
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw HttpError(401);
  }
  const { path: tempUpload, originalname } = req.file;
  jimp
    .read(tempUpload)
    .then((avatar) => {
      return avatar.cover(250, 250).write(resultUpload);
    })
    .catch((error) => {
      console.error(error);
    });
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};


module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  logout: ctrlWrapper(logout),
};