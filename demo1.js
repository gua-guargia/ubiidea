var allData = {"0":{},"1":{},"2":{},"3":{},"4":{},
               "5":{},"6":{},"7":{},"8":{}};
var level = "root";

const bc = new BroadcastChannel('demo');
// console.log(bc.name);

$("#btn").click(function(){
    console.log($("#text").val());
    mydata = $("#text").val();
    bc.postMessage(mydata);
    console.log(allData);
})

bc.onmessage = function(e) {
    //console.log('receive:', e.data);
    var msg = e.data;
    msg = msg.split("-");
    if (msg.length == 3){
        if (sessionStorage.getItem("data") != null){
            allData = JSON.parse(sessionStorage.getItem("data"));
        }
        allData[msg[0]][msg[1]] = msg[2];
        console.log(allData);
        if (level=="root"){
            Object.keys(allData["0"]).forEach(function(key){
                $("#block"+key).html(allData["0"][key]);
            })
        }
        sessionStorage.setItem("data", JSON.stringify(allData));
    }
    if (msg.length == 1){
        switchLevel(msg[0]);
    }
};

function zoomin(id){
    var num = id.slice(-1);
    for (var i=0; i<8; i++){
        $("#block"+(i+1)).html("");
    }
    Object.keys(allData[num]).forEach(function(key){
        $("#block"+key).html(allData[num][key]);
    })
    $("#root").text("<- Go Back")
    level = num;
}

function zoomout(){
    for (var i=0; i<8; i++){
        $("#block"+(i+1)).html("");
    }
    Object.keys(allData["0"]).forEach(function(key){
        $("#block"+key).html(allData["0"][key]);
    })
    $("#root").text("");
    level = "root";
}

function switchLevel(num){
    for (var i=0; i<8; i++){
        $("#block"+(i+1)).html("");
    }
    Object.keys(allData[num]).forEach(function(key){
        $("#block"+key).html(allData[num][key]);
    })
    if (num=="0"){
        $("#root").text("");
        level = "root";
    }
    else{
        $("#root").text("<- Go Back")
        // $("#root").text("Root idea "+(num)+": "+allData["0"][num])
        level = num;
    }
}