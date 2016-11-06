const express = require("express");
const app = express();
const request = require("request");


var apiGet = require("./routes/apiget.js");
var apiLatest = require("./routes/apilatest.js");

app.get("/",function(req,res){
   res.send("Welcome, to search for images add to you url path - /api/imagesearch"); 
});


app.get("/api/imagesearch/:search/",function(req,res){
    apiGet(req,res,request);
});

app.get("/api/latest/imagesearch",apiLatest);

app.listen(process.env.PORT || 8080, function(err){
    if(err) console.log(err);
    console.log("server is up and running");
});