var express = require("express");
var app = express();


app.get("/",function(req,res){
   res.send("HI!"); 
});



app.listen(process.env.PORT || 8080, function(err){
    if(err) console.log(err);
    console.log("server is up and running");
});