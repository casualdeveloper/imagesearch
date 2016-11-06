module.exports = function(req,res){
    const jsonfile = require('jsonfile');
    const file = './latestsearch.json';
    jsonfile.readFile(file, function(err, obj) {
        if(err) console.log(err);
        res.send(obj.response);
    });
};