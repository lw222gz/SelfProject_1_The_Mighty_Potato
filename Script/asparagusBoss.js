"use strict";

var asparagusSkills = (function(){
    //Write boss skills here.
    var exports = {};
    
    var potatoArguments = ["So we finally meet, ASPARAGUS!", 
    "Petty revenge? After what you and your band of Brocclis did to my home town this will be the sweetest of retributions!",
    "I don't think! I know! Prepeare to die!"];
    
    var asparagusArguments = ["Indeed we do Potato, you sure have struggled far just for some petty revenge.", 
    "HA! So you truly think you stand a chance agianst me and my Cucumber Claymore?",
    "Hope my band of mindless Broccolies diden't worn you out too much."];
    
    var X;
    var Y;
    
    var BossLives = 150;
    
    function getTotalBossLives(){
        return BossLives;
    }
    
     //the rival asparagus
    var asparagus = {
        speed: 100,
        x: 500,
        y: 250,
        w: 24,
        h: 74,
        Lives: BossLives,
        lastMonsterMove: null,
        type: "Boss",
        XP: 500,
        canTakeDmg: true,
        useSkill: true,
        message: null,
        active: false,
        ButterSlops: [],
        asparagusSpray: [],
        SprayDestination: [],
        //LinearFunctionVaribels:{},
        CucumberSlashDestination: {},
        CucumberSlashActive: false,
        canMove: true,
        SpriteX:166,
        SpriteY:1,
        messCount: 0,
        MonsterSpawnX: 567,
        MonsterSpawnY: 298
    };
    
    function getBoss(){
        return asparagus;
    }
    
    
    //TODO: add more skills.
    function SkillChoice(hero, canvas, Monsters){
        
        switch(Math.round(Math.random()* (4-1)+1))
        {
            case 1: 
                asparagus.message = "BUTTER SLOP!";
                asparagusNewSpriteCords(108,1,24,74);
                
                setTimeout(function(){
                    ButterSlop()
                }, 1000);
                break;
                
            case 2: 
                asparagus.message = "ASPARAGUS SPRAY!";
                asparagusNewSpriteCords(194, 1,24,74);
                
                setTimeout(function(){
                    AsparagusSpray(hero, canvas)
                }, 1000);
                break;
                
            case 3: 
                asparagus.message = "COME FORTH MY MINNIONS!";
                asparagusNewSpriteCords(221, 0, 24, 74)
                
                setTimeout(function(){
                   SummonMinions(Monsters, canvas); 
                }, 1000)
                break;
                
            case 4: 
                asparagus.message = "CUCUMBER DIVE SLASH!";
                asparagus.CucumberSlashDestination.x = hero.x;
                asparagus.CucumberSlashDestination.y = hero.y;
                
                setTimeout(function(){
                    if(asparagus.CucumberSlashDestination.x < asparagus.x)
                    {
                        //Smooths animation
                        asparagus.x -= 26;
                    }
                    CucumberDiveSlash(hero);
                }, 1000);
                break;
            
            default:
                asparagus.message = "WHY WONT YOU DIE?!";
                break;
        }
        
        asparagus.canMove = false;
        
        //boss stands stil for a second to cast his abillety.
        setTimeout(function(){
            asparagus.lastMonsterMove = Date.now();
            asparagus.canMove = true;
            
            setTimeout(function(){
            asparagus.message = null;
            }, 1500);
        
        }, 1000);
    }
    
    function ButterSlop(){
        asparagus.ButterSlops.push(gameObjects.CreateGameObj("random", "ranndom", 32,32,null, "Butter Slop"));
        
    }
    
    function AsparagusSpray(hero, canvas){
        
        
        //f(x) = k*x + m för att få en linjär funktion
        //f(0) / f(x) = 0  ger destinations kordinater
        //dont work, it send quills super fast at N/S and slower at W/E
       /* var x;
        var xOne = asparagus.x;
        var xTwo = hero.x;
        var yOne = asparagus.y; // may have to set y cords to minus since this is not a regular cord-table
        var yTwo = hero.y;
        
        var k = (yTwo - yOne) / (xTwo - xOne);
        
        var m = yOne - (xOne * k);
        
        if(hero.x > asparagus.x && hero.y > asparagus.y)
        {
            //wont be colliding with any axel.
            //f(x > canvas.width + insurance)
            asparagus.SprayDestination.x = canvas.width + 10;
            asparagus.SprayDestination.y = k * (canvas.width + 10) + m;
        }
        else if(hero.x <= asparagus.x && hero.y >= asparagus.y)
        {
            //wont be colliding with the X-axel
            //k*x + m = 0, what is x?
            
            x = -(m/k);
            asparagus.SprayDestination.x = x;
            asparagus.SprayDestination.y = k*x + m;
        }
        else
        {
            //will be colliding with the x-axel
            //f(0) = y, what is y?
            asparagus.SprayDestination.x = 0;
            asparagus.SprayDestination.y = m;
        }

        
        asparagus.LinearFunctionVaribels.k = k;
        asparagus.LinearFunctionVaribels.m = m;*/
        
        
        
        if(hero.x <= asparagus.x && hero.y <= asparagus.y)
        {
            asparagus.SprayDestination.x = 0;
            asparagus.SprayDestination.y = 0;
        }
        else if(hero.x >= asparagus.x && hero.y >= asparagus.y)
        {
            asparagus.SprayDestination.x = canvas.width;
            asparagus.SprayDestination.y = canvas.height;
        }
        else if(hero.x <= asparagus.x && hero.y >= asparagus.y)
        {
            asparagus.SprayDestination.x = 0;
            asparagus.SprayDestination.y = canvas.height;
        }
        else 
        {
            asparagus.SprayDestination.x = canvas.width;
            asparagus.SprayDestination.y = 0;
        }
        
        asparagus.asparagusSpray.push(gameObjects.asparagusSprayShot(asparagus.x, asparagus.y));
        asparagus.asparagusSpray.push(gameObjects.asparagusSprayShot(asparagus.x, asparagus.y, "horizontalShot"));
        asparagus.asparagusSpray.push(gameObjects.asparagusSprayShot(asparagus.x, asparagus.y, "verticalShot"));
    }
    
    function SummonMinions(Monsters, canvas){
        Monsters.push(gameObjects.getMonster("monster", asparagus.MonsterSpawnX, asparagus.MonsterSpawnY));
        Monsters.push(gameObjects.getMonster("ranged", asparagus.MonsterSpawnX, asparagus.MonsterSpawnY));
    }
    
    function CucumberDiveSlash(hero){
        asparagus.CucumberSlashActive = true;
        asparagus.speed = 700;
        
        
        setTimeout(function(){
            asparagus.speed = 100;
            asparagus.CucumberSlashActive = false;
        }, 250);
    }
    
    function asparagusNewSpriteCords(x,y,w,h){
        asparagus.SpriteX = x;
        asparagus.SpriteY = y;
        asparagus.w = w;
        asparagus.h = h;
    }
    
    exports.getTotalBossLives = getTotalBossLives;
    exports.potatoArguments = potatoArguments;
    exports.asparagusArguments = asparagusArguments;
    exports.SkillChoice = SkillChoice;
    exports.asparagus = asparagus;
    exports.asparagusNewSpriteCords = asparagusNewSpriteCords;
    exports.BossLives = BossLives;
    exports.getBoss = getBoss;
    
    return exports;
})();