"use strict";

var gameObjects = (function(){
    var exports = {};
    
    var MonsterLives = 2;
    var XPGrant = 50;
    
    var UpgradeMonsters = function(upgrade, xpUpgrade){
        MonsterLives += upgrade;
        XPGrant += xpUpgrade;
    }
    
    var getTotalMonsterLives = function(){
        return MonsterLives;
    }
    
    //returns an angry monster.
    var getMonster = function(type, x , y){
        var speed;
        if(type == "ranged")
        {
            speed = Math.floor(Math.random() * (75 - 50) + 50);
        }
        else
        {
            type = null;
            speed = Math.floor(Math.random() * (150-100) + 100);
        }
        //if the minions are to spawn at random in a certain area of the level
        if(isNaN(x))
        {
            switch(x)
            {
                case "west": 
                    x = Math.floor(Math.random() * (617 - 449) + 449);
                    y = Math.floor(Math.random() * (448 - 32) + 32);
                    break;
                    
                case "east":
                    x = Math.floor(Math.random() * (249 - 32) + 32);
                    y = Math.floor(Math.random() * (448 - 32) + 32);
                    break;
                
                case "north":
                    x = Math.floor(Math.random() * (567 - 47) + 47);
                    y = Math.floor(Math.random() * (564 - 396) + 396);
                    break;
                
                case "south":
                    x = Math.floor(Math.random() * (567 - 47) + 47);
                    y = Math.floor(Math.random() * (232 - 32) + 32);
                    break;
            }
        }
        
        
        
        var monster = {
        x: x || Math.floor(Math.random() * (518 - 275) + 275), //X and Y cords are random on the right half of the canvas block. //28/4 update: these cords should still work.
        y: y || Math.floor(Math.random() * (448 - 32) + 32),
        speed: speed, // speed in pixels per second.
        w: 32,
        h: 32,
        Lives: MonsterLives,
        MonsterMaxLives: MonsterLives,
        lastMonsterMove: null,
        type: type || "monster",
        XP: XPGrant,
        canAttack: true,
        canTakeDmg: true // This is for the skill Potato slam, it needs a timer each time it can dmg otherwise the dmg increases due to CPU speed.
        };
        
        return monster;
    };
    
    
    //returns an object with the parameter settings (used for boxes and spikes.)
    var CreateGameObj = function(xPos, yPos, width, height, Objlives, TypeOfObj)
    {
        if (isNaN(xPos))
        {
            xPos = Math.floor(Math.random() * (446 - 150) + 150);
        }
        if(isNaN(yPos))
        {
            yPos = Math.floor(Math.random() * (425 - 150) + 150);
        }
        var obj = {
            x:xPos,
            y:yPos,
            w:width,
            h:height,
            Lives: Objlives,
            type: TypeOfObj
        }
        
        return obj;
    };
    
    //Returns a moving arrow.
    var ShootArrow = function(xPos, yPos, direction, spriteX, spriteY, type){
        
        //Sound effect, need to use new Audio else it can only play 1 at a time.
        //preloads.soundEffs.BowRelease = new Audio('Sound/BowRelease.mp3');
        //preloads.soundEffs.BowRelease.play();
        soundEffs.playSound(soundEffs.sounds.BowRelease);
        
        switch(direction)
        {
            case "east": direction = "D";
                break;
                
            case "west":direction = "A";
                break;
                
            case "north":direction = "W";
                break;
                
            case "south":direction = "S";
                break;
        }
        
        
        var width;
        var height;
        if(direction == "S" || direction == "W")
        {
            width = 5;
            height = 24;
        }
        else
        {
            width = 24;
            height = 5;
        }
        
       
        var arrow = {
            x: xPos,
            y: yPos,
            speed: 400,
            w:width,
            h:height,
            lastRegisterdMove: null,
            Direction: direction,
            sPosX: spriteX,
            sPosY: spriteY,
            type: type || "Arrow"
        }
        
        return arrow;
    };
    
    
    //Shoots a asparagusSpray projectile.
    var asparagusSprayShot = function(xPos, yPos, type)
    {
        var SprayShot = {
            x: xPos,
            y: yPos,
            speed: 250,
            w:10,
            h:10,
            lastRegisterdMove: null,
            type: type
        }
        return SprayShot;
    }
    
    
    var LootDropped = function(Odds){
        var random = Math.floor(Math.random() * (Odds - 1) + 1);
        console.log(random)
        if (random === 1)
        {
            return true;
        }
        return false;
    }
    
    
    var generateRandomItem = function(identifier, obj){
        var item;
        switch(identifier)
        {
            case 1:item = CreateGameObj(obj.x, obj.y, 32, 32, null, "heart");
                break;
            
            case 2:item = CreateGameObj(obj.x, obj.y, 32, 32, null, "arrows");
                break;

                
            default: console.log("The randomed number does not represent an item.")
        }
        return item;
    }
    
    exports.getMonster = getMonster;
    exports.UpgradeMonsters = UpgradeMonsters;
    exports.getTotalMonsterLives = getTotalMonsterLives;
    exports.CreateGameObj = CreateGameObj;
    exports.ShootArrow = ShootArrow;
    exports.LootDropped = LootDropped;
    exports.generateRandomItem = generateRandomItem;
    exports.asparagusSprayShot = asparagusSprayShot;
    
    return exports;
})();
