var allData = {"0":{}};
const bc = new BroadcastChannel('demo');
console.log(bc.name);

bc.onmessage = function(e) {
    // console.log('receive:', e.data);
    var msg = e.data;
    msg = msg.split("-");
    // console.log(msg);
    if (msg.length == 3){
        if (sessionStorage.getItem("data") != null){
            allData = JSON.parse(sessionStorage.getItem("data"));
        }
        if (msg[0] == "0"){
            //create a new component
            allData["0"][msg[1]] = msg[2];
            $("#component-container").empty();
            Object.keys(allData["0"]).forEach(function(key){
                $("#component-container").append("<div class='component'><div class='root'><div class='root_content'>"+allData["0"][key]+"</div></div><div class='overflow_container' id='root_sub"+(key)+"'></div></div>");
            })
            for (var i=0;i<Object.keys(allData).length;i++){
                if (i!="0"){
                    Object.keys(allData[Object.keys(allData)[i]]).forEach(function(key){
                        $("#root_sub"+Object.keys(allData)[i]).append("<div class='sub'><div class='sub_content'>"+allData[Object.keys(allData)[i]][key]+"</div></div>")
                    })
                }
            }
        }
        else{
            //add new sub 
            if (Object.keys(allData).indexOf(msg[0])>-1){
                allData[msg[0]][msg[1]] = msg[2];
            }
            else{
                allData[msg[0]] = {};
                allData[msg[0]][msg[1]] = msg[2];
            }
            $("#root_sub"+msg[0]).empty();
            Object.keys(allData[msg[0]]).forEach(function(key){
                $("#root_sub"+msg[0]).append("<div class='sub'><div class='sub_content'>"+allData[msg[0]][key]+"</div></div>")
            })
            
        }
        console.log(allData);
        sessionStorage.setItem("data", JSON.stringify(allData));
    }
};
