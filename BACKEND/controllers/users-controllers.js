const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const HttpError = require("../models/http-error");

const app = express();
app.use(express.json());


// GET USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    // this shows all fields except password.
    users = await User.find({}, "-password");
    // can also write 'email name'
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};


// SIGNUP
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Invalid inputs passed please check your data",
      422
    );
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists already", 422);
    return next(error);
  }

  let hashedPassword;
  try{
    hashedPassword = await bcrypt.hash(password, 12);
  }
  catch(err){
    console.log(err);
    const error = new HttpError('Could not create a user, please try again',500);
    return next(error);
  }


  const createdUser = new User({
    name,
    email,
    image: req.file.path ,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, try again later", 500);
    return next(error);
  }

  let token;
  try{
    token = jwt.sign(
      {userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      {expiresIn: '1h'}
    );
  }
  catch(err){
    console.log(err);
    const error = new HttpError("Signing up failed, try again later", 500);
    return next(error);
  }
  

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};


// LOGIN
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("logging in failed, try again later", 500);
    return next(error);
  }

  if (!existingUser ) {
    const error = new HttpError("Invalid credentials, could not log in", 401);
    return next(error);
  }

  let isValidPassword= false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  }
   catch(err) {
    const error = new HttpError('Server error', 500);
    return next(error);
   }

   if(!isValidPassword) {
    const error = new HttpError('Invalid credentials, could not log in', 401);
    return next(error);
   }

   let token;
  try{
    token = jwt.sign(
      {userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      {expiresIn: '1h'}
    );
  }
  catch(err){
    console.log(err);
    const error = new HttpError("Logging in failed, try again later", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id ,
    email: existingUser.email ,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
