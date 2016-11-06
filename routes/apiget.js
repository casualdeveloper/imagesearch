// https://www.googleapis.com/customsearch/v1?q=cats&num=10&start=1&imgSize=huge&searchType=image&key=API_KEY&cx=CX

module.exports = function(req, res,request){
    var search = encodeURIComponent(req.params.search.trim());
    var offset = (req.query.offset)?req.query.offset:1;
    updateLatestSearch(req.params.search);
    var url    = "https://www.googleapis.com/customsearch/v1?q="
                 +search+"&num=10&start="
                 +Number((offset<=0)?1:offset).toString()
                 +"&imgSize=huge&searchType=image&key="
                 +process.env.API_KEY+"&cx="+process.env.CX;
                 
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            return res.send(rebuildImgArrObj(body.items)); // Print the json response
        }
        if(response.statusCode!==200){
            return res.send(body.error);
        }
    });
};

function rebuildImgArrObj(arr){
    for(var i =0;i<arr.length;i++){
        arr[i] = rebuildImgObj(arr[i]);    
    }
    return arr;
}


//rebuild body.items objects
function rebuildImgObj(obj){
    var newObj = {};
    newObj.url = obj.link;
    newObj.snippet = obj.snippet;
    newObj.thumbnail = obj.image.thumbnailLink;
    newObj.context = obj.image.contextLink;
    return newObj;
}

function updateLatestSearch(searched){
    const jsonfile = require('jsonfile');
    const file = './latestsearch.json';
    var d = new Date();
    var completedDate = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+((parseInt(d.getHours())<10)?'0'+d.getHours():d.getHours())+":"+((parseInt(d.getMinutes())<10)?'0'+d.getMinutes():d.getMinutes())+":"+d.getSeconds();
    //object to add to the file
    var obj = {
        "term":searched,
        "when":completedDate
    }
    
    var newArr; // updated array that will be put back into the file
    var data = jsonfile.readFileSync(file);//JSON that was read from file
    var oldArr = data.response;
    
    newArr = insertArray(oldArr,obj);
    data.response = newArr;//replacing old array with a new one in JSON
    
    jsonfile.writeFileSync(file, data);
    
    
    /*jsonfile.readFile(file, function(err, arrayFromFile) {
        if(err) console.log(err);
        console.log(arrayFromFile);
        newArr = insertArray(arrayFromFile,obj);
    });
    
    jsonfile.writeFile(file, newArr, function (err) {
        if(err)console.error(err);
    });*/
}


function insertArray(arr,obj,pos,maxSize){
    pos = pos || 0;
    maxSize = maxSize || 10;
    
    arr.splice(pos,0,obj);
    if(arr.length>maxSize){
        arr.splice(arr.length-1,1);
    }
    return arr;
}