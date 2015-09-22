"use strict";

var gameLogic = (function(){
    
    var exports = {};
    
    //Grants the hero the next lvl and bonuses
    function newHeroLvlReached(hero){
        //Sound effect
        soundEffs.playSound(soundEffs.sounds.LevelUp, 0.15)
        
        hero.currentLvl += 1;
        hero.nextHeroLevel += 200 * hero.currentLvl;
        hero.MaxLives += 2;
        hero.Lives += 2;
        
        LearnSkill(hero);
       
    }
    
    //Should be no problem if the hero gets 2 lvls at once.
    function LearnSkill(hero){
        
        if(hero.currentLvl % 2 === 0)
        {
            preloads.Skill.BowcooldownActive = false;           
        }
        else 
        {
            preloads.Skill.SwordcooldownActive = false;
        }
        switch(hero.currentLvl)
        {
            case 1:
                preloads.message = "My skills are comming back to me! I cant wait to use them with 'E'"
                preloads.TipMess = "If you hover over the skill icon in the down left corner you can see info about that skill."
                var StarchStrenght = {
                    cooldown: 30,
                    measure: "seconds",
                    effectDescription: "Description: Enters an enraged mode, doubles sword attack speed for 10 sec.",
                    name: "Starch Strength",
                    durotation: 10,
                    requirements: "---",
                    SpriteX: 0,
                    SpriteY: 61,
                }
                
                preloads.Skill.activeSwordSkill = StarchStrenght;
                preloads.Skill.SwordSkills.push(StarchStrenght);
                break;
                
            case 2:
                preloads.message = "Cant forget my precious bow skills aswell! This will come in handy."
                preloads.TipMess = "You can have 2 skills active at once. Your weapon decides wich one activates."
                var CornCobHealing = {
                    cooldown: 3,
                    measure: "levels",
                    durotation: "Instant",
                    effectDescription: "Description: Eats one of your corn cob ammo to regain 3 health. Cooldown only counts down as entering a new level.",
                    requirements: "1 ammo",
                    name: "Corn Cob Healing",
                    SpriteX:7,
                    SpriteY:12
                    };
                
                preloads.Skill.activeBowSkill = CornCobHealing;
                preloads.Skill.BowSkills.push(CornCobHealing);
                break;
                
            case 3:
                preloads.TipMess = "You can change back to old skills with 1-3 keys.";
                var SecretArtCarrotCut = {
                    cooldown: 10,
                    measure: "seconds",
                    durotation: "Next Atk.",
                    effectDescription: "Description: Release a secret art of the carrot sword, doubles the damage of your next attack.",
                    requirements: "---",
                    name: "Secret Art: Carrot Cut",
                    SpriteX:41,
                    SpriteY:60
                };
                preloads.Skill.activeSwordSkill = SecretArtCarrotCut;
                preloads.Skill.SwordSkills.push(SecretArtCarrotCut);
                break;
                
            case 4:
                var CornSpray = {
                    cooldown: 5,
                    measure: "seconds",
                    durotation: "Next Atk",
                    effectDescription: "Description: Quickly fires 3 shots with next bow attack.",
                    requirements: "1-3 ammo.",
                    name: "Corn Spray",
                    SpriteX: 1,
                    SpriteY: 99
                };
                preloads.Skill.activeBowSkill = CornSpray;
                preloads.Skill.BowSkills.push(CornSpray);
                break;
                
            case 5:
                var PotatoSlam = {
                    cooldown: 50,
                    measure: "seconds",
                    durotation: "Instant",
                    effectDescription: "Description: Stomps the ground extremly hard causeing a small earthquake. You are immune during this attack.",
                    requirements: "Costs 2 lives.",
                    name: "POTATO SLAM!",
                    SpriteX:48,
                    SpriteY:3
                };
                preloads.Skill.activeSwordSkill = PotatoSlam;
                preloads.Skill.SwordSkills.push(PotatoSlam);
                break;
                
            case 6:
                var HotShot = {
                    cooldown: 30,
                    measure: "seconds",
                    durotation: 5,
                    effectDescription: "Description: Drenches an arrow in hot sauce causing it to leave a trail of fire for 5 sek. MUST be used within 5 sec after activation. The arrow doesn't deal any dmg.",
                    requirements: "1 ammo",
                    name: "Hot Shot",
                    SpriteX:46,
                    SpriteY:98
                };
                preloads.Skill.activeBowSkill = HotShot;
                preloads.Skill.BowSkills.push(HotShot);
                break;
                
            case 7:
                break;
        }
    }
    
    
    //Executes the active skill
    function ExecuteSkill(skill, hero){
        
        switch (skill.name)
        {
            case "Starch Strength":
                preloads.Skill.StarchStrenghtActive = true;
                setTimeout(function(){
                    preloads.Skill.StarchStrenghtActive = false;
                }, skill.durotation * 1000);
                break;
                
            case "Corn Cob Healing":
                if (hero.Arrows > 0 && hero.Lives < hero.MaxLives)
                {
                    hero.Lives += 3;
                    hero.Arrows -= 1;
                    if (hero.Lives > hero.MaxLives)
                    {
                        hero.Lives = hero.MaxLives;
                    }
                }
                else
                {
                    preloads.message = "I cant do that.";
                }
                break;
                
            case "Secret Art: Carrot Cut":
                preloads.Skill.SecretArtCarrotCutActive = true;
                
                break;
                
            case "Corn Spray":
                preloads.Skill.CornSprayActive = true;
                break;
                
            case "POTATO SLAM!":
                preloads.canTakeDmg = false;
                preloads.canAct = false;
                hero.Lives -= 2;
                
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x - 37, hero.y + hero.h + 15,32,32,null, "EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x - 37, hero.y + hero.h - 28, 32,32,null, "EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x - 45, hero.y - 8,32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x - 37, hero.y - 45,32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x, hero.y - 42,32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x + 42, hero.y - 42, 32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x + 74, hero.y - 50, 32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x + hero.w + 27, hero.y, 32,32,null, "EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x + hero.w + 20, hero.y + 37,32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x + hero.w, hero.y + 69,32,32,null,"EarthSpike"));
                preloads.Skill.EarthSpikes.push(gameObjects.CreateGameObj(hero.x, hero.y + hero.h + 5, 32, 32, null, "EarthSpike"));
                
                setTimeout(function(){
                    preloads.canAct = true;
                    preloads.Skill.EarthSpikes = [];
                    
                    //if any monsters lived they are most likely close to the hero, therefore giving an extra half second of immunity.
                    setTimeout(function(){
                        preloads.canTakeDmg = true;
                    }, 500)
                    
                }, 1500);
                break;
                
                
            case "Hot Shot":
                if(hero.Arrows > 0)
                {
                    hero.Arrows -= 1;
                    preloads.Skill.HotShotActive = true;
                    setTimeout(function(){
                        preloads.Skill.HotShotActive = false;
                    }, 5000);
                }
                else
                {
                    preloads.message = "I dont have any arrows to drench in hot sauce."
                }
                break;
                
            default: 
                console.log("the skill does not exsist");
        }
        
    }
    
    function changeSkill(index){
        preloads.Skill.skillChangeAvablibel = false;
        if(preloads.SwordActive && preloads.Skill.SwordSkills.length >= index && !preloads.Skill.SwordcooldownActive)
        {
            preloads.Skill.activeSwordSkill = preloads.Skill.SwordSkills[index - 1];
        }
        else if (!preloads.SwordActive && preloads.Skill.BowSkills.length >= index && !preloads.Skill.BowcooldownActive)
        {
            preloads.Skill.activeBowSkill = preloads.Skill.BowSkills[index - 1];
        }
        setTimeout(function(){
            preloads.Skill.skillChangeAvablibel = true;
        }, 1000);
    }
    
    //Executes proper item bonus on pickup.
    function itemInteraction(itemType, hero){
        //sound effect
     
        switch(itemType)
        {
            case "heart": 
                    if(hero.Lives >= hero.MaxLives)
                    {return false;}
                    hero.Lives += 1;
                break;
                
            case "arrows": 
                    if (hero.Arrows >= hero.QuiverMax)
                    {return false;}
                    
                    hero.Arrows += Math.round(Math.random() * (5 - 2) + 2);
                    if (hero.Arrows >= hero.QuiverMax)
                    {
                        hero.Arrows = hero.QuiverMax;
                    }
                break;
                
            case "swordUpgrade":
                hero.MeleeDmg += 1;
                preloads.RisingTextMessage.message = "Sword dmg UP!"
    	        movingObjects.ResetMovingText();
    	        
                break;
                
            case "bowUpgrade":
                hero.ArrowDmg += 0.5;
                preloads.RisingTextMessage.message = "Bow dmg UP!"
    	        movingObjects.ResetMovingText();
    	        
                break;
                
            default: console.log("The itemtype was unknown.");
        }
        soundEffs.playSound(soundEffs.sounds.PowerUp);
        return true;
    }
    
    //Removes 1 life from the player.
    var damageTaken = function(hero){
        //sound effect
        soundEffs.playSound(soundEffs.sounds.PlayerHit);
        
        hero.Lives -= 1;
        preloads.canTakeDmg = false;
        if(hero.Lives <= 0)
        {
            soundEffs.sounds.backgroundMusic.pause();
            soundEffs.sounds.backgroundMusicBoss.pause();
            soundEffs.playSound(soundEffs.sounds.GameLost);
        }
        
        setTimeout(function(){
            preloads.canTakeDmg = true;
        }, 1000);
    };
    
    function monsterDmgTaken(monster, amount){
        monster.Lives -= amount;
        soundEffs.playSound(soundEffs.sounds.EnemyHit);
    }
    
    exports.monsterDmgTaken = monsterDmgTaken;
    exports.damageTaken = damageTaken;
    exports.newHeroLvlReached = newHeroLvlReached;
    exports.ExecuteSkill = ExecuteSkill;
    exports.itemInteraction = itemInteraction;
    exports.changeSkill = changeSkill;
    
    
    return exports;
    
})();