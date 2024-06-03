const express = require("express");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const User = require('../models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    /* .findById() is a static method.It does not return real promise 
  still you can use async await on it. */
    // you can return actual promise using .exec()
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find a place for the id", 401);
    return next(error);
  }
  

  

  // when we send a request to /.. it takes the value after / as :pid and returns a
  // object, to avoid this we are using this if condition.
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(error);
  }

  /* The place object sent by mongoose is bit different to javascript object
  thats why we convert it using .toObject */
  // And to take off the underscore(_) from _id property we use getters.
  res.json({ place: place.toObject({ getters: true }) }); /* {place = place} */
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError("fetching places failed,please try again", 500);
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // This will trigger error handling middleware.
    return next(
      new HttpError("Could not find a place for the provided UserId", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) => place.toObject({ getters: true }))
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed please check your data", 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId 
  });

  let user;
  try{
    user = await User.findById(req.userData.userId);
  }
  catch(err){
    const error = new HttpError('Creating place failed, try again later', 500);
    return next(error);
  }

  if(!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess});
    user.places.push(createdPlace); //.push() is a method provided by Mongoose for manipulating arrays within documents.
    await user.save({session: sess});
    await sess.commitTransaction();
  }
   catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  // finally{
  //   sess.endSession();
  // }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed please check your data", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update place",
      500
    );
    return next(error);
  }

  console.log(`check 1: ${place.creator.toString()}`)
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this place.',
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try{
    await place.save();
  } catch(err){
    const error = new HttpError('Something went wrong, could not update', 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({getters: true}) });
};


const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

 let place;
 try{
  place = await Place.findById(placeId).populate('creator');
 }catch(err){
  console.log('check 2');
  const error = new HttpError('Something went wrong, could not delete place', 500);
  return next(error);
 }

 if(!place){
  console.log('check 3');
  const error = new HttpError('Could not find place for this id', 404);
  return next(error);
 }

//  if(place.creator.id !== req.userData.userId) {
//   const error = new HttpError(
//     'You are not allowed to edit this place.',
//     401
//   );
//  }

 if (place.creator.id.toString() !== req.userData.userId) {
  const error = new HttpError(
    'You are not allowed to edit this place.',
    401
  );
  return next(error);
}

 const imagePath = place.image ;

 try{
  const sess = await mongoose.startSession();
   sess.startTransaction();
   console.log(place.creator.places);
  await place.deleteOne({session: sess});
   place.creator.places.pull(place);
   await place.creator.save({session: sess});
   await sess.commitTransaction();
 }
 catch(err) {
  const error = new HttpError('Somethingggggg went wrong, could not delete place', 500);
  return next(error);
 }

 fs.unlink(imagePath, err => {
  console.log(err);
 });

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
