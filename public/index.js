const PREFIX_URL = "https://ubiidea-node.herokuapp.com"
// const PREFIX_URL = "http://127.0.0.1:3000" 

$( document ).ready(function() {
    console.log("TEST LINES:\nif you have a lot of shoes, you can like scatter them around the floor and use them as a kind of obstacle course. You have to cross without touching any of the shoes. You can use it as a kind of habitat for certain pets,  like maybe you wanna keep a small lizard or small hamster, and you use a clean shoe to make it its home.")
    sessionStorage.setItem("checkbox", JSON.stringify("off"));
    sessionStorage.setItem("scriptCheckbox", JSON.stringify("off"));

    // when refresh the page, load current session storage
    var cleanData, imgs, transcript;
    if (sessionStorage.getItem('keywords') != null && sessionStorage.getItem('keywords') != JSON.stringify([]) ){
        cleanData = JSON.parse(sessionStorage.getItem('keywords'));
        imgs = JSON.parse(sessionStorage.getItem('images'));
        transcript = JSON.parse(sessionStorage.getItem('transcript'));
        displayKeyword(cleanData, imgs);
        displayScript(transcript, cleanData);
        // highlightKeyword();
    }
    
})

var transcript = "";

// speech to text
function runSpeechRecognition() {

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if ($( "#btn-speech-to-text" ).text() == "End Recording"){
        $("#state").text("STATUS: stopped listening, hope you are done...");
        recognition.stop();

        $( "#btn-speech-to-text" ).text("Start Recording")
        $('#btn-speech-to-text').css("background-color", "#555")
        

        // Temporary solution, couldnt resolve the if else problem with button text
        console.log(transcript);
        if (transcript != "") {
            var params = {val:transcript};
            console.log(params);
            transData(params);
            transcript = "";
        }
        else {
            $("#state").text("STATUS: speech detection failed, please record your speech again");
        }
        
    }
    else {
        console.log($( "#btn-speech-to-text" ).text());

        recognition.onstart = function() {
            $("#state").text("STATUS: listening, please speak...")
        };

        recognition.onresult = function(event) {
            // $("#state").text("STATUS: transcripting...")
            // console.log(event.results);
            transcript = "";
            for (var i=0; i<event.results.length; i++){
                transcript += event.results[i][0]['transcript'];
            }
            console.log(transcript);
        };
        
        recognition.start();

        $( "#btn-speech-to-text" ).text("End Recording");
        $('#btn-speech-to-text').css("background-color", "#f44336");

        console.log($( "#btn-speech-to-text" ).text());
    }
}

// data transmission between frontend and backend
function transData(params){
    $("#state").text("STATUS: extracting keywords...")
    var returnJSON;
    $.ajax({
        type:'POST',
        url: PREFIX_URL + '/data',
        data: JSON.stringify(params),
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
    })
    //load data
    .then( ret => {returnJSON = ret})
    .then( () => {
        console.log(returnJSON);
        var cleanData, imgs, transcript; 
        var maxKeyword;
        
        $("#state").text("STATUS: displaying keywords...")

        // get max keywords number in memory
        if (sessionStorage.getItem('maxKeyword') == JSON.stringify([]) || sessionStorage.getItem('maxKeyword') == null) {
            maxKeyword = 3;
        }
        else {
            maxKeyword = JSON.parse(sessionStorage.getItem('maxKeyword'));
        }

        // get keywords in memory
        if (sessionStorage.getItem('keywords') == null){
            cleanData = [];
            imgs = [];
        }
        else {
            cleanData = JSON.parse(sessionStorage.getItem('keywords'));
            imgs = JSON.parse(sessionStorage.getItem('images'));
        }

        // get transcript in memory
        if (sessionStorage.getItem('transcript') == null){
            transcript = [];
        }
        else {
            transcript = JSON.parse(sessionStorage.getItem('transcript'));
        }

        let newArrData = [];
        let newArrImgs = [];
        let newArrTranscript = [];

        for(let x = 0; x < maxKeyword; x++) {
            if(returnJSON.response[x] != null && returnJSON.images[x] != null) {
                newArrData.push(returnJSON.response[x]);
                newArrImgs.push(returnJSON.images[x]);
            }
            else {
                break;
            }
            
        }

        newArrTranscript.push(params.val);
        
        cleanData = cleanData.concat(newArrData);
        imgs = imgs.concat(newArrImgs);
        transcript = transcript.concat(newArrTranscript);

        // display keywords, images and transcript
        displayKeyword(newArrData, newArrImgs);
        displayScript(newArrTranscript, newArrData);

        // save data
        sessionStorage.setItem("keywords", JSON.stringify(cleanData));
        sessionStorage.setItem("images", JSON.stringify(imgs));
        sessionStorage.setItem("transcript", JSON.stringify(transcript));
        console.log(JSON.parse(sessionStorage.getItem('keywords')));
        console.log(JSON.parse(sessionStorage.getItem('images')));
        console.log(JSON.parse(sessionStorage.getItem('transcript')));

        $("#state").text("STATUS: waiting for your speech")
    })
}

// clear sessionStorage
function clearData(){
    sessionStorage.setItem("keywords", JSON.stringify([]));
    sessionStorage.setItem("images", JSON.stringify([]));
    sessionStorage.setItem("prompt", JSON.stringify([]));
    sessionStorage.setItem("maxKeyword", JSON.stringify([]));
    sessionStorage.setItem("transcript", JSON.stringify([]));
    sessionStorage.setItem("scriptCheckbox", JSON.stringify("off"));
    getScript();
    console.log(sessionStorage);
    $("#root-container").empty();
    $("#script-container").empty();
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

// keyword display
async function displayKeyword(cleanData, imgs){
    // $("#root-container").empty()
    var prompt = JSON.parse(sessionStorage.getItem('prompt'));
    cleanData.forEach((element,index) => {
        if (!prompt.includes(element)) {
            //$("#root-container").append("<li>"+element+"</li>") // CHANGE IT TO INPUT TEXT AND UPDATE THEM
            $("#root-container").append("<input type='text' onchange='update(this.id, this.value)' style='margin-top:10px; width:100px;' class='kw-input' id='kw-"+ index +"-"+ element +"' name='" + element + "' value='" + element +"'></input>")
        }
    })
    $("#root-container").append("<br/>");
    cleanData.forEach((element,index) => {
        if (!prompt.includes(element)) {
            //add image if switch on
            $("#root-container").append("<img src='"+imgs[index]+"' id='img-"+index+"-"+element+"' style='width:100px; height: 100px'>")
             if (JSON.parse(sessionStorage.getItem('checkbox')) == "on"){$("img").show();}
             else{$("img").hide();}
        }
    })
    $("#root-container").append("<br/>");
}

// script display
async function displayScript(transcript, cleanData) {
    console.log("script display");
    var prompt = JSON.parse(sessionStorage.getItem('prompt'));
    var script;
    transcript.forEach((data,i) => {
        script = data;
        var words = script.split( /\s+/ );
        var text = words.join( "</span> <span>" );
        script = "<span>" + text + "</span>";

        // script.html( "<span>" + text + "</span>" );
        cleanData.forEach((element,index) => {
            if (!prompt.includes(element)) {
                //add script
                //var keywords = script.split( /\s+/ );
                //keywords.forEach((key) => {
                var keywordWarper = wrapKeywordWithoutMark(element);
                script = script.replace(new RegExp(keywordWarper, 'ig'), wrapKeywordWithMark(element));
                //})
            }
        })
    })

    $("#script-container").append("<p style='padding-top:15px; padding-left:15px' class='drag'>"+script+"</p>");
    $("#script-container").append("<br/>");
    highlightKeyword();
    if (JSON.parse(sessionStorage.getItem('scriptCheckbox')) == "off"){
        $("#root-container").show();
        $("#script-container").hide();
    }
    else {
        $("#root-container").hide();
        $("#script-container").show();
    }
}

// wrap Keyword With HTML
function wrapKeywordWithMark(keyword) {
    return `<span class='mark'>${keyword}</span>`
}

function wrapKeywordWithoutMark(keyword) {
    return `<span>${keyword}</span>`
}




// select keyword and revise selected text and corresponing image
function update(id, val){
    var image_url;
    var old_val = id.split("-")[2];
    var index = id.split("-")[1];
    var keywords = JSON.parse(sessionStorage.getItem('keywords'));
    var images = JSON.parse(sessionStorage.getItem('images'));

    if (val==""){
        $("#" + id).remove()
        $("#img-" +index+"-"+old_val).remove()
        keywords.splice(parseInt(index), 1)
        images.splice(parseInt(index), 1)
        sessionStorage.setItem("keywords", JSON.stringify(keywords));
        sessionStorage.setItem("images", JSON.stringify(images));
        return
    }

    keywords[parseInt(index)] = val
    sessionStorage.setItem("keywords", JSON.stringify(keywords));
    $("#" + id).attr("id", "kw-"+index+"-"+val);
    $("#img-" +index+"-"+old_val).attr("id", "img-"+index+"-"+val);

    $.ajax({
        type:'POST',
        url: PREFIX_URL + '/image',
        data: JSON.stringify({kw:val}),
        processData: false,
        contentType: 'application/json',
        dataType: 'json'
    })
    .then(ret => image_url = ret)
    .then(()=>{
        console.log(image_url["image"]);
        $("#img-" +index+"-"+val).attr("src", image_url["image"]);
        //$("img-"+index+"-"+val).remove();
        //$("#" + id).append("<img src='"+image_url["image"]+"' id='img-"+index+"-"+val+"' style='width:150px;'><br/>")
        images[parseInt(index)] = image_url["image"]
        sessionStorage.setItem("images", JSON.stringify(images));
    })
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

// remove prompt from keyword list
function removePrompt(){
    var prompt = $("#input-prompt").val();
    var prompts = prompt.split(',');
    console.log(prompts);
    sessionStorage.setItem("prompt", JSON.stringify(prompts));
}

// set maximum keywords for each ideas
function setMaxKeyword() {
    var maxKeyword = $("#input-max-keyword").val();
    console.log(maxKeyword);
    sessionStorage.setItem("maxKeyword", JSON.stringify(maxKeyword));
}

// script switch
function getScript() {
    if (JSON.parse(sessionStorage.getItem('scriptCheckbox')) == "off"){
        sessionStorage.setItem("scriptCheckbox", JSON.stringify("on")); // turn to ON
        $("#root-container").hide();
        $("#script-container").show();
        highlightKeyword();
    }
    else {
        sessionStorage.setItem("scriptCheckbox", JSON.stringify("off")); // turn to OFF
        $("#root-container").show();
        $("#script-container").hide();
    }

}


// highlight the word on click in a sentence
function highlightKeyword() {
    $("span").on( "click", function() {
        if ($( this ).is(".mark")){
            $( this ).removeClass("mark");
        }
        else {
            $( this ).addClass("mark");
        }
    });
}
