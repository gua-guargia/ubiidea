$( document ).ready(function() {
    console.log("TEST LINES:\nif you have a lot of shoes, you can like scatter them around the floor and use them as a kind of obstacle course. You have to cross without touching any of the shoes. You can use it as a kind of habitat for certain pets,  like maybe you wanna keep a small lizard or small hamster, and you use a clean shoe to make it its home.")
    sessionStorage.setItem("checkbox", JSON.stringify("off"));
})

// speech to text
function runSpeechRecognition() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    recognition.onstart = function() {
        console.log("listening, please speak...");
    };
    
    recognition.onspeechend = function() {
        console.log("stopped listening, hope you are done...");
        recognition.stop();
    }
    
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        console.log(transcript);
        console.log(confidence);
        var params = {val:transcript};
        transData(params);
    };
    
    recognition.start();
}

// data transmission between frontend and backend
function transData(params){
    var returnJSON;
    $.ajax({
        type:'POST',
        url:'http://127.0.0.1:3000/data',
        data: JSON.stringify(params),
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
    })
    //load data
    .then( ret => returnJSON = ret)
    .then( () => {
        console.log(returnJSON);
        var cleanData, imgs; 
        
        if (sessionStorage.getItem('keywords') == null){
            cleanData = [];
            imgs = [];
        }
        else {
            cleanData = JSON.parse(sessionStorage.getItem('keywords'));
            imgs = JSON.parse(sessionStorage.getItem('images'));
        }
        cleanData = cleanData.concat(returnJSON.response);
        imgs = imgs.concat(returnJSON.images);

        // display keywords
        $("#root-container").empty()
        cleanData.forEach((element,index) => {
            $("#root-container").append("<li>"+element+"</li>") // CHANGE IT TO INPUT TEXT AND UPDATE THEM
            //add image if switch on
            $("#root-container").append("<img src='"+imgs[index]+"' style='width:100px;'>")
            if (JSON.parse(sessionStorage.getItem('checkbox')) == "on"){$("img").show();}
            else{$("img").hide();}
        })

        // save data
        sessionStorage.setItem("keywords", JSON.stringify(cleanData));
        sessionStorage.setItem("images", JSON.stringify(imgs));
        console.log(JSON.parse(sessionStorage.getItem('keywords')));
        console.log(JSON.parse(sessionStorage.getItem('images')));
    })
}

// clear sessionStorage
function clearData(){
    sessionStorage.setItem("keywords", JSON.stringify([]));
    sessionStorage.setItem("images", JSON.stringify([]));
    console.log(sessionStorage);
    $("#root-container").empty();
}

function getImage(){
    if (JSON.parse(sessionStorage.getItem('checkbox')) == "off"){
        sessionStorage.setItem("checkbox", JSON.stringify("on")); // turn to ON
        $("img").show();
    }
    else{
        sessionStorage.setItem("checkbox", JSON.stringify("off")); // turn to OFF
        $("img").hide();
    }
}

// select keyword and revise them
function update(){

}

// download as json
function download() {
    const keywords = JSON.parse(sessionStorage.getItem('keywords'));
    const images = JSON.parse(sessionStorage.getItem('images'));
    const content = JSON.stringify({"keywords": keywords, "image_url":images}) 
    const fileName = "ubiidea-data.json" 
    const contentType = "text/plain"

    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

