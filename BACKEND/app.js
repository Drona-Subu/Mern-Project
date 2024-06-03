const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
const url = `mongodb+srv://subhusharmaic:lLSUmpuRJGez5VuI@blog.pv9jhn9.mongodb.net/MERN?retryWrites=true&w=majority&appName=Blog`;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(url);
     app.listen(5000);
    console.log("Connected");
  } catch (error) {
    console.log(error);
  } 
};

connectToMongoDB();

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
   next();
 })

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

// This is a special middleware function(error handling function) that
// will execute when any middleware returns a error object.
app.use((error, req, res, next) => {

  if(req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    // headerSent means response has already been sent.
    return next(error);
  }
  // Here the code in error.code is the status code.
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});



