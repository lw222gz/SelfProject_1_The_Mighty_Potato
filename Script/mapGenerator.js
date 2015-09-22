"use strict";

var mapGen = (function(){
    
    // possible buggs: the game tries to create a level on an allready exsisting one.
    
    var exports = {};
    
    var Levels = [];
    var progressLevels = 30;
    var gridWidth = 30;
    var i;
    var j;
    var index;
    var DirectionArray;
    var random;
    // level 0,0 is default
    var currentPos = [0,0];
    var currentX = 0;
    var currentY = 0;
    var highestAmountOfMonsters = 3;
    //Levels[0][0] = [{spikes: null, OrgPath:null, NextPath:null}]

    
    //generates game map and grid.
    function generateMaps(){
        //builds the map grid, if I do during the construction of the levels problems occured when trying to get lower than 0
        for (i = -(gridWidth); i < gridWidth; i += 1)
        {
            Levels[i] = [];
            for (j = -(gridWidth); j < gridWidth; j += 1)
            {
                Levels[i][j] = {};
                Levels[i][j].isUsed = false;
                Levels[i][j].hasExplored = false;
                Levels[i][j].Monsters = null;
                Levels[i][j].spikes = null;
                Levels[i][j].boxes = null;
                Levels[i][j].items = [];
                Levels[i][j].TipMess = null;
            }
        }
        
        //create the map
        for (i = 0; i < progressLevels; i += 1)
        {
         
            if(Levels[currentX + 1][currentY].isUsed && Levels[currentX - 1][currentY].isUsed && Levels[currentX][currentY + 1].isUsed && Levels[currentX][currentY - 1].isUsed)
            {
                i -= 1;
                switch(Levels[currentX][currentY].OrgPath)
                {
                    case "east":currentX += 1
                        break;
                        
                    case "west": currentX -= 1;
                        break;
                        
                    case "north": currentY += 1;
                        break;
                        
                    case "south": currentY -= 1;
                        break;
                }
            }
            
            if(i !== 0)
            {
                DirectionArray = ["east", "west", "north", "south"];
                
                //remove the option to get NextPath as the OrgPath
                index = DirectionArray.indexOf(Levels[currentX][currentY].OrgPath);
                DirectionArray.splice(index, 1);
                
                Levels[currentX][currentY].NextPath = shuffleArray(DirectionArray);
         
                Levels[currentX][currentY].Image = setLvlImage(Levels[currentX][currentY].OrgPath, Levels[currentX][currentY].NextPath);
                
                
                switch(Levels[currentX][currentY].NextPath)
                {
                    case "east":
                        if(!Levels[currentX + 1][currentY].isUsed)
                        {
                            currentX += 1;
                            Levels[currentX][currentY].OrgPath = "west";
                            Levels[currentX][currentY].isUsed = true;
                        }
                        else
                        {
                            i -= 1;
                        }
                        break;
                        
                    case "west":
                        if(!Levels[currentX - 1][currentY].isUsed)
                        {
                            currentX -= 1;
                            Levels[currentX][currentY].OrgPath = "east";
                            Levels[currentX][currentY].isUsed = true;
                        }
                        else
                        {
                            i -= 1;
                        }
                        break;
                        
                    case "north":
                        if(!Levels[currentX][currentY + 1].isUsed)
                        {
                            currentY += 1;
                            Levels[currentX][currentY].OrgPath = "south";
                            Levels[currentX][currentY].isUsed = true;
                        }
                        else
                        {
                            i -= 1;
                        }
                        break;
                        
                    case "south":
                        
                        if(!Levels[currentX][currentY - 1].isUsed)
                        {
                            currentY -= 1;
                            Levels[currentX][currentY].OrgPath = "north";
                            Levels[currentX][currentY].isUsed = true;
                        }
                        else
                        {
                            i -= 1;
                        }
                        
                        break;
                   
                    default: console.log("error");     
                }
                
                //final level where the boss spawns
                if (i == progressLevels - 1)
                {
                    console.log("final")
                    switch(Levels[currentX][currentY].OrgPath)
                    {
                        case "east":
                            //pre-set cords are for west, therefore the Y cords dont need to be changed.
                            asparagusSkills.asparagus.x = 100;
                            
                            asparagusSkills.asparagus.MonsterSpawnX = 82;
                            //change positon so he is facing the potato
                            asparagusSkills.asparagusNewSpriteCords(137, 1, 24, 74);
                    
                            break;
                        
                        case "north":
                            asparagusSkills.asparagus.x = 300;
                            asparagusSkills.asparagus.y = 400;
                            
                            asparagusSkills.asparagus.MonsterSpawnX = 324;
                            asparagusSkills.asparagus.MonsterSpawnY = 517;
                            break;
                            
                        case "south":
                            asparagusSkills.asparagus.x = 300;
                            asparagusSkills.asparagus.y = 125;
                            
                            asparagusSkills.asparagus.MonsterSpawnX = 324;
                            asparagusSkills.asparagus.MonsterSpawnY = 132;
                            break;
                            
                        default:
                            console.log("west");
                    }
                    Levels[currentX][currentY].Monsters = [asparagusSkills.asparagus];
                    Levels[currentX][currentY].Image = setLvlImage("boss");
                }
                //normal level objects
                else
                {
                    generateRandomLevel();
                    if(i  == 10 || i == 20)
                    {
                        gameObjects.UpgradeMonsters(2, 50);
                        highestAmountOfMonsters += 3;
                    }
                }
                
                //levels that gets weapon upgrades
                if(i == 5 || i == 6 || i == 13 || i ==20)
                {
                    //dont want any spikes to spawn on the boosts
                    Levels[currentX][currentY].spikes = null;
                    
                    if (i % 2 == 0)
                    {
                        Levels[currentX][currentY].items = [gameObjects.CreateGameObj(290, 324, 32,32,null,"bowUpgrade")]
                    }
                    else
                    {
                        Levels[currentX][currentY].items = [gameObjects.CreateGameObj(290, 324, 32,32,null,"swordUpgrade")]
                    }
                }
            }
            else
            {
                //default lvl 1
                Levels[currentX][currentY].NextPath = "east";
                Levels[currentX][currentY].Image = preloads.Images.bgImage;
                Levels[currentX][currentY].isUsed = true;
                
                currentX += 1;
                Levels[currentX][currentY].OrgPath = "west";
                Levels[currentX][currentY].isUsed = true;
            }
        }
    }
        
    
    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {
        for (var k = array.length - 1; k > 0; k--) {
            var l = Math.floor(Math.random() * (k + 1));
            var temp = array[k];
            array[k] = array[l];
            array[l] = temp;
        }
        return array[0];
    }

    
    //returns an image for the levels exits/ entrance
    function setLvlImage(From, To){
        
        if((From == "east" || From == "west") && (To == "east" || To == "west"))
        {
            //E-W
            return preloads.Images.bgImageEW;
        }
        else if((From == "east" || From == "north") && (To == "east" || To == "north"))
        {
            //E-N
            return preloads.Images.bgImageEN;
        }
        else if((From == "east" || From == "south") && (To == "east" || To == "south"))
        {
            //E-S
            return preloads.Images.bgImageES;
            
        }
        else if((From == "west" || From == "north") && (To == "west" || To == "north"))
        {
            //W-N
            return preloads.Images.bgImageWN;
        }
        else if((From == "west" || From == "south") && (To == "west" || To == "south"))
        {
            //W-S
            return preloads.Images.bgImageWS;
        }
        else if((From == "south" || From == "north") && (To == "south" || To == "north"))
        {
            //N-S
            return preloads.Images.bgImageNS;
        }
        else if (From == "boss")
        {
            return preloads.Images.bgImageBoss;
            //default img
        }
        else
        {
            return preloads.Images.bgImage;
        }
    }
    
    function Random(hi, lo){
        return Math.round((Math.random() * (hi - lo) + lo));
    }
    
    //generates a random easy level
    function generateRandomLevel(){
        //if(Random(2,1) == 1)
        //{
            random = Random(highestAmountOfMonsters, 1);
            console.log(random)
            Levels[currentX][currentY].Monsters = [];
            for (j = 0; j < random; j += 1)
            {
                if(j < 4)
                {
                    Levels[currentX][currentY].Monsters.push(gameObjects.getMonster("monster", Levels[currentX][currentY].OrgPath));
                }
                else
                {
                    Levels[currentX][currentY].Monsters.push(gameObjects.getMonster("ranged", Levels[currentX][currentY].OrgPath));
                }
            }
        //}
        if(Random(2,1) == 1)
        {
            random = Random(4,1)
            Levels[currentX][currentY].spikes = [];
            for (j = 0; j < random; j += 1)
            {
                Levels[currentX][currentY].spikes.push(gameObjects.CreateGameObj("random", "random", 32,32,null,"spike"))
            }
        }
        
        if(Random(2,1) == 1)
        {
            random = Random(4,1)
            Levels[currentX][currentY].boxes = [];
            for (j = 0; j < random; j += 1)
            {
                Levels[currentX][currentY].boxes.push(gameObjects.CreateGameObj("random", "random", 32,32, 1,"box"))
            }
        }
    }
    
    
    exports.Levels = Levels;
    exports.generateMaps = generateMaps;
    
    return exports;
})();