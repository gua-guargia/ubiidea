const gis = require('g-i-s');

function image_search(element){
    return new Promise((resolve, reject) => {
        var url;
        gis(element, (error, results)=>{
            url = results[Math.ceil(Math.random() * (results.length-1))]["url"];
            resolve(url);
        })
    })
}

module.exports = image_search;