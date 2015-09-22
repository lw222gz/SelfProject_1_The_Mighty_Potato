"use strict";

var gameMiniMap = (function(){
    
    var exports = {};
    
    //make canvas element and append to site
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 250;
    canvas.height = 250;
    canvas.className = "MiniMap";
    
    var miniMapLocationUpdateOperator = {direction: null, operator: null};
    var i;
    var miniMapImages = [];
    
    //draws a minimap
    function drawMiniMap(){
        ctx.fillStyle = "#808080";
        ctx.fillRect(0,0,250,250);
        for(i = 0; i < miniMapImages.length; i += 1)
        {
            ctx.drawImage(miniMapImages[i].Image, miniMapImages[i].x, miniMapImages[i].y);
        }
        ctx.drawImage(preloads.Images.MiniMapDot, canvas.width/2 -9, canvas.height/2 -7)
    }
    
    //adds a image to the minimap when entering a new level
    function updateMiniMap(mapObj, From, To){
        //need to use the map obj later to decide what map image to show.
        if((From == "east" || From == "west") && (To == "east" || To == "west"))
        {
            //E-W
            mapObj.Image = preloads.Images.MiniMapEW;
        }
        else if((From == "east" || From == "north") && (To == "east" || To == "north"))
        {
            //E-N
            mapObj.Image = preloads.Images.MiniMapEN;
        }
        else if((From == "east" || From == "south") && (To == "east" || To == "south"))
        {
            //E-S
            mapObj.Image = preloads.Images.MiniMapES;
            
        }
        else if((From == "west" || From == "north") && (To == "west" || To == "north"))
        {
            //W-N
            mapObj.Image = preloads.Images.MiniMapWN;
        }
        else if((From == "west" || From == "south") && (To == "west" || To == "south"))
        {
            //W-S
            mapObj.Image = preloads.Images.MiniMapWS;
        }
        else if((From == "south" || From == "north") && (To == "south" || To == "north"))
        {
            //N-S
            mapObj.Image = preloads.Images.MiniMapSN;
        }
        else if (From == "boss")
        {
            mapObj.Image = preloads.Images.MiniMapBoss;
            //default img
        }
        else
        {
            mapObj.Image = preloads.Images.MiniMapImg;
        }
        
        miniMapImages.push(mapObj);
    }
    
    //updates the map center area
    function updateMapLocation(){
        for(i = 0; i < miniMapImages.length; i += 1)
        {
            if (miniMapLocationUpdateOperator.direction == "horizontal")
            {
                miniMapImages[i].x += miniMapLocationUpdateOperator.operator;
            }
            else
            {
                miniMapImages[i].y += miniMapLocationUpdateOperator.operator;
            }
        }
    }
    
    exports.miniMapLocationUpdateOperator = miniMapLocationUpdateOperator;
    exports.updateMapLocation = updateMapLocation;
    exports.canvas = canvas;
    exports.updateMiniMap = updateMiniMap;
    exports.drawMiniMap = drawMiniMap;
    exports.miniMap = canvas;
    
    return exports;
})();