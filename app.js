const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const keyword_extraction = require(`${__dirname}/utils/keyword_extraction.js`);
const image_search = require(`${__dirname}/utils/image_search.js`);


const app = express();
const expressPort = 3000;

app.listen(process.env.PORT || expressPort, ()=>{
    console.log("listening on 127.0.0.1:" + expressPort);
})


app.use('/public', express.static(`${__dirname}/public/`));
app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.sendFile(`${__dirname}/public/index.html`);
})

app.post('/data', (req, res, next) => {
    var data = req.body['val'].toLowerCase(); 
    console.log(data);
    
    var cleanKeywords;
    
    keyword_extraction(data)
    //pre-processing
    .then( result => {
        console.log("---------response---------");
        var keywords;
        cleanKeywords = [];
        if (result.indexOf(",") == -1){
            keywords = result.split("\n");
        }
        else{
            keywords = result.split(",");
        }
        keywords.forEach(element =>{
            if (element[0] == " " || element[0] == "-"){
                cleanKeywords.push(element.slice(1));
            }
            else{
                cleanKeywords.push(element);
            }
        })  
    })
    .then(async() => {
        var imageURLs = [];
        var url;
        for (var i=0; i<cleanKeywords.length; i++){
            url = await image_search(cleanKeywords[i]).catch()
            imageURLs.push(url)
        }
        console.log({response: cleanKeywords, images: imageURLs});
        res.json({response: cleanKeywords, images: imageURLs});
    })
    .catch()
})















