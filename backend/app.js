const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
mongoose.connect("mongodb+srv://mex:" + process.env.MONGO_ATLAS_PW + "@cluster0-riijq.mongodb.net/node-angular?retryWrites=true&w=majority",{ useNewUrlParser: true })
 .then(() =>{
   console.log('connected to db');
 })
 .catch(()=>{
   console.log('connection failed');
 });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, PUT, DELETE, ORIGIN");
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);


module.exports = app;
