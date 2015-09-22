"use strict";

//Known bugs:
//- when having a skill active, if a skill change occured the skill is still active.



(function(){
    //make canvas element and append to site
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 649;
    canvas.height = 596;
    //main game container
    var gamecont = document.getElementById("gameContainer");
    gamecont.appendChild(canvas);
    //minimap container
    var miniMapCont = document.getElementById("miniMapContainer");
    
    
    //Handels fire animation
    var FireImgAnimation1 = preloads.Images.FireOne;
    var FireImgAnimation2 = preloads.Images.FireTwo;
    var FireimageSwitch = 0;
    
    
    //Restart button
    var aCont = document.createElement("a");
    aCont.href = "#";
    var RSbutton = document.createElement("div");
    RSbutton.className = "RestartButton";
    RSbutton.innerHTML = "Restart";
    RSbutton.addEventListener("click", function(e){
        if(hero.Lives > 0)
        {
            if (confirm("Are you sure you wanna restart?"))
            {
                location.reload();
            }
        }
        else
        {
            location.reload();
        }
    });
    aCont.appendChild(RSbutton);
    document.body.appendChild(aCont);
    
    //Checks if everything has loaded.
    var loaded = false;
    
    //What level ONLY ADD WHEN ENTERING A NEW LVL
    var nextLevel = 1; 
    
    
    //map location
    var mapLoc = [0,0];
    
    //hold values for the current lvl
    var currLvl;
    
    //has the player won the game?
    var Victory = false;
    
    
    //If one of these attacks are active a special render is needed.
    var WAtk = false;
    var AAtk = false;
    
    //Holds the status of the active battle mode.
    var weaponChangePossible = true;
    
    //Game objects
    var hero = {
        speed: 250, //movement speed in pixels.
        x: ((canvas.width/2) - 32),
        y: ((canvas.height/2) - 32),
        w: 42, 
        h: 52, 
        Lives: 5,
        MaxLives: 10,
        AtkRng: 33,
        MeleePushback: 20,
        MeleeDmg: 1,
        Arrows: 30,
        QuiverMax: 30,
        ArrowDmg: 0.5,
        EXP: 0,
        nextHeroLevel: 200,
        currentLvl: 0
    };
    
    //if the user hold his mouse over a skill, a description is shown.
    var swordskillDesc = false;
    var bowskillDesc = false;
    
    
    //interval to remove messages
    var cantRemoveMessage = true;
    
    var mouseX;
    var mouseY;
    
    canvas.addEventListener("mousemove", function(e){
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
        
        if (mouseX > 3 && mouseX < 46 && mouseY > 554)
        {
            swordskillDesc = true;
            bowskillDesc = false;
        }
        else if(mouseX > 46 && mouseX < 86 && mouseY > 554)
        {
            bowskillDesc = true;
            swordskillDesc = false;
        }
        else
        {
            bowskillDesc = false;
            swordskillDesc = false;
        }
    }, false);
    
    //Default values for right walk pos.
    var spriteCords = {
        x:640,
        y:42,
        w:52,
        h:55,
        operatorX: hero.x - 33,
        operatorY: hero.y - 33
    };
    
    //Needed when writing abillety info box
    var DescY = 0;
    
    //For-loop index
    var i;
    var j;
    
    
    //Active hero bow shots
    var Arrows = [];
    
    //Active monster bow shots.
    var MonsterArrows = [];
    

    //Varibels for attacking.
    var ReadytoAtk = true;
    var canMeleedmg = false;
    var hasDamaged = false;
    var attackDirection;
    
    //Handels controls.
    var keysDown = {};
    
    addEventListener("keydown", function(e){
        keysDown[e.keyCode] = true;
    });
    
    addEventListener("keyup", function (e) {
    	delete keysDown[e.keyCode];
    });
    
    
    //Handels all drawing for the game
    var render = function(){
        
        //Draws background
        if(!Victory)
        {
            ctx.drawImage(currLvl.Image, -55, -15);
        }
        else
        {
            ctx.drawImage(currLvl.Image,-1,-1);
        }
        
        
        if(asparagusSkills.asparagus.ButterSlops.length > 0)
        {
            drawGameObj(preloads.Images.ButterSlopImg, asparagusSkills.asparagus.ButterSlops);
        }
        if(asparagusSkills.asparagus.message != null && asparagusSkills.asparagus.active)
        {
            ctx.font = "10px Helvetica";
            ctx.fillStyle = "rgb(250,250,250)";
            multiLineText(asparagusSkills.asparagus.message, asparagusSkills.asparagus.x - 10, asparagusSkills.asparagus.y - 10);
        }
        
        //Draws hero.
        if(!preloads.Skill.EarthSpikes.length > 0)
        {
            if(!WAtk && !AAtk)
            {
                            //(Image, sprite pos.x, sprite pos.y, image resolution.x, image resolution.y, render pos.x, render pos.y, imagesize.w, imagesize.h)   
                ctx.drawImage(preloads.Images.heroSprite, spriteCords.x, spriteCords.y, spriteCords.w, spriteCords.h, hero.x , hero.y, spriteCords.w, spriteCords.h);
            }
            else if (AAtk)
            {
                ctx.drawImage(preloads.Images.heroSprite, spriteCords.x, spriteCords.y, spriteCords.w, spriteCords.h, spriteCords.operatorX, hero.y, spriteCords.w, spriteCords.h);
            }
            else
            {
                ctx.drawImage(preloads.Images.heroSprite, spriteCords.x, spriteCords.y, spriteCords.w, spriteCords.h, hero.x, spriteCords.operatorY, spriteCords.w, spriteCords.h);
            }
        }
        else
        {
            ctx.drawImage(preloads.Images.heroSlamAttack, -5,8,50,60,hero.x, hero.y,50,60);
        }
        
        
        if (currLvl.spikes != null) //if level got currLvl.spikes, they get drawn.
        {
            drawGameObj(preloads.Images.dangerousSpikes, currLvl.spikes);
        }
        if (currLvl.Monsters != null)//if level got monsters, they spawn.
        {
            spawnMonsters();
        }
        if(preloads.message != null)//Is there a preloads.message this level?
        {
            ctx.font = "10px Helvetica";
            ctx.fillStyle = "rgb(250,250,250)";
            multiLineText(preloads.message, hero.x, hero.y - 10);
        }
        if(currLvl.boxes != null)//if level got currLvl.boxes, they spawn.
        {
            drawGameObj(preloads.Images.boxImage, currLvl.boxes);
        }
        if (currLvl.items.length > 0)
        {
            drawItems();
        }
        if (Arrows.length > 0)
        {
             drawArrows();
        }
        if(MonsterArrows.length > 0)
        {
            drawMonsterArrows();
        }
        if(preloads.Skill.EarthSpikes.length > 0)
        {
            drawEarthSpikes();
        }
        if(preloads.Skill.Fires.length > 0)
        {
            drawFires();
        }
        if(asparagusSkills.asparagus.asparagusSpray.length > 0)
        {
            drawGameObj(preloads.Images.AsparagusSprayImg, asparagusSkills.asparagus.asparagusSpray);
        }
        
        
        
        //Shows user lives, resets text color to white.
        ctx.fillStyle = "rgb(250,250,250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline ="top";
        ctx.drawImage(preloads.Images.heartImage, 5,5);
        ctx.fillText(": "+hero.Lives+"/"+hero.MaxLives,40,5); // have a heart image instead of the Lives text
        ctx.fillText("Arrows: "+hero.Arrows+"/"+hero.QuiverMax, 10, 34);
        ctx.fillText("EXP: "+hero.EXP+"/"+hero.nextHeroLevel, 10, 58);
        
        
        if (hero.currentLvl >= 1)
        {
            ctx.fillText("Level: "+hero.currentLvl, 10,82)
        }
        
        if(preloads.RisingTextMessage.message != null)
        {
            ctx.font = "12px Helvetica";
            ctx.fillText(preloads.RisingTextMessage.message, hero.x, hero.y - preloads.RisingTextMessage.location);
            preloads.RisingTextMessage.location += 1;
        }
        if(preloads.TipMess != null)
        {
            ctx.font = "bold 12px Helvetica";
            ctx.fillText("Tip: "+preloads.TipMess, 125, 25);
        }
        
        //If 2 or more skills are learnt on one weapon, a visual effect shows the amount of skills the player has on that weapon.
        ctx.fillStyle = "#000000";
        ctx.font = "12px Helvetica"
        if(preloads.Skill.BowSkills.length >= 2)
        {
            ctx.fillText("(1 - "+preloads.Skill.BowSkills.length+")", 43, 540)
        }
        if(preloads.Skill.SwordSkills.length >= 2)
        {
            ctx.fillText("(1 - "+preloads.Skill.SwordSkills.length+")", 5, 540)
        }
        
        
        
        //TODO: WHEN all skills are made and their pictures are made into a sprite, make a function that draws the skill box and it's description, atm there is alot breaking the DRY rule.
        if (preloads.Skill.activeSwordSkill != null)
        {
            ctx.fillStyle = "#808080";
            //Shows and orange color if a skill is active.
            if(preloads.Skill.StarchStrenghtActive || preloads.Skill.SecretArtCarrotCutActive)
            {
                ctx.fillStyle = "#FF6600";
            }
            ctx.fillRect(3, canvas.height-42, 38, 38);
            ctx.drawImage(preloads.Images.SkillSprite, preloads.Skill.activeSwordSkill.SpriteX, preloads.Skill.activeSwordSkill.SpriteY,32,32, 6, canvas.height - 39,32,32);
            
            
            if(swordskillDesc)
            {
                //Draws skill description
                ctx.fillStyle = "#000000";
                ctx.font = "12px Helvetica";
            
                multiLineText(preloads.Skill.activeSwordSkill.effectDescription, 3, 512, true, canvas.height - 30);
                ctx.font = "bold 12px Helvetica";
                ctx.fillText(preloads.Skill.activeSwordSkill.name, 3, 500- DescY); // write after desc to know placement.
                ctx.font = "12px Helvetica";
                
                ctx.fillText("Cooldown: "+preloads.Skill.activeSwordSkill.cooldown +" "+preloads.Skill.activeSwordSkill.measure, 3, 512);
                if(isNaN(preloads.Skill.activeSwordSkill.durotation))
                {
                    ctx.fillText("Durotation: "+preloads.Skill.activeSwordSkill.durotation, 3, 524);
                }
                else
                {
                    ctx.fillText("Durotation: "+preloads.Skill.activeSwordSkill.durotation+" "+preloads.Skill.activeSwordSkill.measure, 3, 524);
                }
                ctx.fillText("Requirements: "+preloads.Skill.activeSwordSkill.requirements, 3, 536);
            }
            
            
            //removes CD
        	if(preloads.Skill.activeSwordSkill != null && (Date.now() - preloads.Skill.SwordCDStart) / 1000 >= preloads.Skill.activeSwordSkill.cooldown && preloads.Skill.SwordcooldownActive)
        	{
        	    preloads.Skill.SwordCDStart = null;
        	    preloads.Skill.SwordcooldownActive = false;
        	}
            if(preloads.Skill.SwordcooldownActive)
            {
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.7;
                ctx.fillRect(3, canvas.height-42, 38,((((Date.now() - preloads.Skill.SwordCDStart)/ 1000)/ preloads.Skill.activeSwordSkill.cooldown) * -38) + 38);
                ctx.globalAlpha = 1;
                        //((current/ total) * height) + height 
            }
        }
        if(preloads.Skill.activeBowSkill != null)
        {
            ctx.fillStyle = "#808080";
            if(preloads.Skill.CornSprayActive || preloads.Skill.HotShotActive)
            {
                ctx.fillStyle = "#FF6600";
            }
            ctx.fillRect(40, canvas.height-42, 38, 38);
            //need to fix sprite
            ctx.drawImage(preloads.Images.SkillSprite, preloads.Skill.activeBowSkill.SpriteX,preloads.Skill.activeBowSkill.SpriteY,32,32, 43, canvas.height - 39,32,32);
            
            if(bowskillDesc)
            {
                //Draws skill description
                ctx.fillStyle = "#000000";
                ctx.font = "12px Helvetica"
                
                multiLineText(preloads.Skill.activeBowSkill.effectDescription, 3, 512, true, canvas.height -30);
                ctx.font = "bold 12px Helvetica";
                ctx.fillText(preloads.Skill.activeBowSkill.name, 3, 500 - DescY);
                ctx.font = "12px Helvetica"
                
                
                //ctx.fillText("Description: "+preloads.Skill.activeBowSkill.effectDescription, 3, 500);
                ctx.fillText("Cooldown: "+preloads.Skill.activeBowSkill.cooldown +" "+preloads.Skill.activeBowSkill.measure, 3, 512);
                if (isNaN(preloads.Skill.activeBowSkill.durotation))
                {
                    ctx.fillText("Durotation: "+preloads.Skill.activeBowSkill.durotation, 3, 524);
                }
                else
                {
                    ctx.fillText("Durotation: "+preloads.Skill.activeBowSkill.durotation+" "+ preloads.Skill.activeBowSkill.measure, 3, 524);
                }
                ctx.fillText("Requirements: "+preloads.Skill.activeBowSkill.requirements, 3, 536);
            }
            
            //Handels Bow CD
        	if(preloads.Skill.activeBowSkill != null && preloads.Skill.BowcooldownActive)
        	{
        	    //This skill has a round CD
            	if (preloads.Skill.activeBowSkill.name === "Corn Cob Healing")
            	{
            	    preloads.Skill.roundsCooldownlldown = nextLevel - preloads.Skill.levelSkillUsed;
            	    if(preloads.Skill.roundsCooldownlldown >= preloads.Skill.activeBowSkill.cooldown)
            	    {
            	        preloads.Skill.BowcooldownActive = false;
            	    }
            	}
            	else if(preloads.Skill.activeBowSkill != null && (Date.now() - preloads.Skill.BowCDStart)/1000 >= preloads.Skill.activeBowSkill.cooldown)
            	{
            	    preloads.Skill.BowCDStart = null;
        	        preloads.Skill.BowcooldownActive = false;
            	}
        	}
            
            if(preloads.Skill.BowcooldownActive)
            {
                //Displays CD
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.7;
                //Skills that got round CDs
                if(preloads.Skill.activeBowSkill.name === "Corn Cob Healing")
                {
                    ctx.fillRect(40, canvas.height-42, 38, ((preloads.Skill.roundsCooldownlldown / preloads.Skill.activeBowSkill.cooldown) * -38) + 38);
                }
                else
                {
                    ctx.fillRect(40, canvas.height-42, 38,((((Date.now() - preloads.Skill.BowCDStart)/ 1000)/ preloads.Skill.activeBowSkill.cooldown) * -38) + 38);
                }
                ctx.globalAlpha = 1;
            }
        }
    };
    
    
    //Updates objects positions and checks collisions.
    //TODO: Several if's have the same demand, combine the execution maby?
    var animation = function(modifier){
        // movement commands. 
        if (!preloads.pauseGame)
        {
            if(preloads.canAct)
            {
                
                if (38 in keysDown) { //keycode for up arrow 
            		hero.y -= hero.speed * modifier;
            		
            		//blocks the hero from crossing path with a box
            		if(currLvl.boxes != null)
            		{
                		for (i = 0;i<currLvl.boxes.length ; i += 1)
                		{
                			if (collisions.isTouching(hero, currLvl.boxes[i]))
                			{
                			    // move an extra pixel, otherwise bugg when too close to the blocks.
                				hero.y = currLvl.boxes[i].y + currLvl.boxes[i].h + 1;
                			}
                		}
            		}
            	}
            	if (40 in keysDown) { //keycode for down arrow
            		hero.y += hero.speed * modifier;
            		
            		//blocks the hero from crossing path with a box
            		if(currLvl.boxes != null)
            		{
                		for (i = 0;i<currLvl.boxes.length ; i += 1)
                		{
                			if (collisions.isTouching(hero, currLvl.boxes[i]))
                			{
                			    //move an extra pixel, otherwise bugg when too close to the blocks.
                				hero.y = currLvl.boxes[i].y - hero.h - 1;
                			}
                		}
            		}
            	}
            	if (37 in keysDown) { //keycode for left arrow 
            		hero.x -= hero.speed * modifier;
            		
            		//if the player is readytoatk (meaning they are just walking)
                    if(ReadytoAtk && preloads.SwordActive)
                    {
            		    newSpriteCords(518, 42, 52, 54);
                    }
                    else if(ReadytoAtk)
                    {
                        newSpriteCords(163, 182, 47, 55);
                    }
            		
                    
            		//blocks the hero from crossing path with a box
            		if(currLvl.boxes != null)
            		{
                		for (i = 0;i<currLvl.boxes.length ;i += 1)
                		{
                			if (collisions.isTouching(hero, currLvl.boxes[i]))
                			{
                			    // move an extra pixel, otherwise bugg when too close to the blocks.
                				hero.x = currLvl.boxes[i].x + currLvl.boxes[i].w + 1;
                			}
                		}
            		}
            	}
            	if (39 in keysDown) { //keycode for right arrow
            		hero.x += hero.speed * modifier;
            
                    //if the player is readytoatk (meaning they are just walking)
                    if(ReadytoAtk && preloads.SwordActive)
                    {
                        newSpriteCords(640, 42, 52, 54);
                    }
                    else if (ReadytoAtk)
                    {
                        newSpriteCords(282, 183, 47, 55);
                    }
                    
            		//blocks the hero from crossing path with a box
            		if(currLvl.boxes != null)
            		{
                		for (i = 0; i<currLvl.boxes.length ;i += 1)
                		{
                			if (collisions.isTouching(hero,currLvl.boxes[i]))
                			{
                			    // move an extra pixel, otherwise bugg when too close to the blocks.
                				hero.x = currLvl.boxes[i].x - hero.w - 4;
                			}
                		}
            		}
            	}
            	
            	
            	//Shifts active weapon
            	if(81 in keysDown && weaponChangePossible && ReadytoAtk) //keycode for Q
            	{
            	    weaponChangePossible = false;
            	    if(preloads.SwordActive)
            	    {
            	        newSpriteCords(282, 183, 47, 55);
            	        preloads.SwordActive = false;
            	    }
            	    else
            	    {
            	        newSpriteCords(640, 42, 52, 54);
            	        preloads.SwordActive = true;
            	    }
            	    setTimeout(function(){weaponChangePossible = true}, 250);
            	}
            	
            	//Executes a special skill.
            	if (69 in keysDown) //keycode for E
            	{
            	    if (preloads.SwordActive && preloads.Skill.SwordSkills.length > 0 && !preloads.Skill.SwordcooldownActive)
            	    {
            	        gameLogic.ExecuteSkill(preloads.Skill.activeSwordSkill, hero);
            	        preloads.Skill.SwordcooldownActive = true;
            	        preloads.Skill.SwordCDStart = Date.now();
            	        //setTimeout(function(){preloads.Skill.SwordcooldownActive = false;}, preloads.Skill.activeSwordSkill.cooldown * 1000)
            	    }
            	    else if(!preloads.SwordActive && preloads.Skill.BowSkills.length > 0 && !preloads.Skill.BowcooldownActive)
            	    {
            	        gameLogic.ExecuteSkill(preloads.Skill.activeBowSkill, hero);
            	        preloads.Skill.BowcooldownActive = true;
            	        if (preloads.Skill.activeBowSkill.name === "Corn Cob Healing")
            	        {
            	            preloads.Skill.levelSkillUsed = nextLevel;
            	        }
            	        else
            	        {
            	            preloads.Skill.BowCDStart = Date.now();
            	        }
            	    }
            	}
         	
            	//let's the player switch skills
            	if(49 in keysDown && preloads.Skill.skillChangeAvablibel) //keycode for 1
            	{
            	    gameLogic.changeSkill(1);
            	}
            	if(50 in keysDown && preloads.Skill.skillChangeAvablibel)//keycode for 2
            	{
            	    gameLogic.changeSkill(2);
            	}
            	if(51 in keysDown && preloads.Skill.skillChangeAvablibel)//keycode for 3
            	{
            	    gameLogic.changeSkill(3);
            	}
            	
    
            	// Hero attacks!
            	if (68 in keysDown && ReadytoAtk) //keycode for D
            	{
            	    attackDirection = "D";
            	    if(preloads.SwordActive)
            	    {
                	    newSpriteCords(401, 43, 79, 54);
                	    
                	    heroSwordAttack();
            	    }
            	    else if(hero.Arrows > 0)
            	    {
            	        
            	        heroBowAttack(attackDirection);
            	        newSpriteCords(282, 183, 47, 55);
            	    }
            	}
            	if (65 in keysDown && ReadytoAtk) // keycode for A
            	{
            	    attackDirection = "A";
            	    if(preloads.SwordActive)
            	    {
            	        //TESTING PURPOSES! TODO:REmove
            	        //hero.EXP += 2000;
            	        AAtk = true;
                	    newSpriteCords(10, 43, 80, 55);
                	    
                	    heroSwordAttack();
            	    }
            	    else if(hero.Arrows > 0)
            	    {
            	        
            	        heroBowAttack(attackDirection);
            	        newSpriteCords(163, 182, 47, 55);
            	    }
            	}
            	if (83 in keysDown && ReadytoAtk) //key code for S
            	{
            	    attackDirection = "S";
            	    if(preloads.SwordActive)
            	    {
                	    newSpriteCords(160, 44, 42, 87);
                	    
                	    heroSwordAttack();
            	    }
            	    else if(hero.Arrows > 0)
            	    {
            	        
            	        heroBowAttack(attackDirection);
            	        newSpriteCords(45, 184, 42, 54);
            	    }
            	}
            	if (87 in keysDown && ReadytoAtk) //keycode for W
            	{
            	    attackDirection = "W";
            	    if(preloads.SwordActive)
            	    {
                	    WAtk = true;
                	    newSpriteCords(282, 9, 42, 87);
                	    
                	    heroSwordAttack();
            	    }
            	    else if(hero.Arrows > 0)
            	    {
            	        
            	        heroBowAttack(attackDirection);
            	        newSpriteCords(401, 184, 42, 54);
            	    }
            	}
            	
            	//Keep the operator updated with the heros x cords
            	if (AAtk)
            	{
                	spriteCords.operatorX = hero.x - 33;
            	}
            	if (WAtk)
            	{
            	    spriteCords.operatorY = hero.y - 33;
            	}
            	
            	
            	//if an attack is ongoing monsters can take damage from the hero.
            	if (canMeleedmg && currLvl.Monsters != null && !hasDamaged)
            	{
            	    for (i = 0; i < currLvl.Monsters.length; i += 1)
            	    {
            	        hasDamaged = collisions.attackConnect(hero, attackDirection, currLvl.Monsters[i]);
            	        if(hasDamaged)
            	        {
            	            break;
            	        }
            	    }
            	}
            	
            	//Player hits a box with his sword.
            	if(canMeleedmg && currLvl.boxes != null)
            	{
            	    for (i = 0; i < currLvl.boxes.length; i += 1)
            	    {
            	        collisions.attackConnect(hero, attackDirection, currLvl.boxes[i]);
            	        if (currLvl.boxes[i].Lives <= 0)
            	        {
            	            //The parameter decides the odds of success, the higher the number, the lower success rate.
            	            if (gameObjects.LootDropped(7))
            	            {
            	                //generates a random item
            	                currLvl.items.push(gameObjects.generateRandomItem(Math.round(Math.random() * (2 - 1) + 1), currLvl.boxes[i]));
            	            }
            	            currLvl.boxes.splice(i,1);
            	        }
            	    }
            	}
            	
            	//is the monster tearing away at the hero's flesh?
            	if (currLvl.Monsters != null)
            	{
            	    for (i = 0; i < currLvl.Monsters.length; i+= 1)
            	    {
            	        if (collisions.isTouching(hero, currLvl.Monsters[i]) && preloads.canTakeDmg)
            	        {
            	            gameLogic.damageTaken(hero);
            	        }
            	    }
            	}
           	    
           	    //Checks if enemy arrows touches the hero.
            	if(MonsterArrows != null)
            	{
            	    for(i = 0; i < MonsterArrows.length; i += 1)
            	    {
                	    if(MonsterArrows[i] != null)
            	        {
                	        if(collisions.isTouching(hero, MonsterArrows[i]) && preloads.canTakeDmg)
                	        {
                	            gameLogic.damageTaken(hero);
                	            MonsterArrows.splice(i , 1);
                	        }
            	        }
            	    }
            	}
            	
            	//Is the hero touching the dangerous currLvl.spikes?
            	if (currLvl.spikes != null)
            	{
                	for (i = 0; i < currLvl.spikes.length; i +=1)
                	{
                	    if (collisions.isTouching(hero, currLvl.spikes[i]) && preloads.canTakeDmg)
                	    {
                	        gameLogic.damageTaken(hero);
                	    }
                	}
            	}
            	
            	
            	
            	//Blocks the user from leaving the canvas block
            	//east border
            	if(hero.x >= canvas.width - hero.h -50){
            	    if((currLvl.OrgPath == "east" || currLvl.NextPath == "east") && !asparagusSkills.asparagus.active)
            	    {
                	    if (hero.y + hero.h > canvas.height/2 + 30)
                	    {
                	        hero.x = canvas.width - hero.h - 50;
                	    }
                	    
                	    if (hero.y < canvas.height/2 - 70)
                	    {
                	        hero.x = canvas.width - hero.h - 50;
                	    }
            	    }
            	    else
            	    {
            	        hero.x = canvas.width - hero.h - 50;
            	    }
            	}
            	//west border
            	if (hero.x <= 47){
            	    
            	   if((currLvl.OrgPath == "west" || currLvl.NextPath == "west") && !asparagusSkills.asparagus.active)
            	   {
                	   if (hero.y + hero.h > canvas.height/2 + 30)
                	   {
                	       hero.x = 47;
                	   }
                	    
                	   if (hero.y < canvas.height/2 - 70)
                	   {
                	       hero.x = 47;
                	   }
            	   }
            	   else
            	   {
        		        hero.x = 47;
            	   }
            	   
            	}
            	// south border
            	if (hero.y >= canvas.height - hero.h - 60){
            	    
            	    if((currLvl.OrgPath == "south" || currLvl.NextPath == "south") && !asparagusSkills.asparagus.active)
            	    {
                	    if(hero.x < canvas.width/2 - 55)
                	    {
                		    hero.y = canvas.height - hero.h - 60;
                	    }
                	    if(hero.x + hero.w > canvas.width/2 + 60)
                	    {
                	        hero.y = canvas.height - hero.h - 60;
                	    }
            	    }
            	    else
            	    {
            	        hero.y = canvas.height - hero.h - 60;
            	    }
            	}
            	//North border
            	if (hero.y <= 58){
            	    if((currLvl.OrgPath == "north" || currLvl.NextPath == "north") && !asparagusSkills.asparagus.active)
            	    {
            	        if(hero.x < canvas.width/2 - 50)
                	    {
                		    hero.y = 58;
                	    }
                	    if(hero.x + hero.w > canvas.width/2 + 50)
                	    {
                	        hero.y = 58;
                	    }
            	    }
            	    else
            	    {
            	        hero.y = 58;
            	    }
            		
            	}
            	
            	//Is the hero standing in  the asapragus butter slop?
            	if(asparagusSkills.asparagus.ButterSlops.length > 0)
            	{
            	    hero.speed = 250;
            	    for (i = 0; i < asparagusSkills.asparagus.ButterSlops.length; i += 1)
            	    {
            	        if (collisions.isTouching(hero, asparagusSkills.asparagus.ButterSlops[i]))
            	        {
            	            hero.speed = 100;
            	        }
            	    }
            	}
            	
            	//Executes a asparagus skills etc.
            	if(asparagusSkills.asparagus.active)
            	{
                	if(asparagusSkills.asparagus.useSkill)
                	{
                	    asparagusSkills.SkillChoice(hero, canvas, currLvl.Monsters);
                	    asparagusSkills.asparagus.useSkill = false;
                	    setTimeout(function(){
                	        asparagusSkills.asparagus.useSkill = true;
                	    }, 5000);
                	}
            	}
            }
            
            
            //Is the hero picking up any currLvl.items?
        	if (currLvl.items != null)
        	{
        	    for (i = 0; i < currLvl.items.length; i += 1)
        	    {
        	        if(collisions.isTouching(hero, currLvl.items[i]))
        	        {
        	            if(gameLogic.itemInteraction(currLvl.items[i].type, hero))
        	            {
        	                currLvl.items.splice(i, 1);
        	            }
        	        }
        	    }
        	}
            
            //Makes the monster chase the player.
        	if(currLvl.Monsters != null)
        	{
            	for (i = 0; i < currLvl.Monsters.length; i += 1)
            	{
            	    if(currLvl.Monsters[i].type != "Boss")
            	    {
            	        movingObjects.RunningMonsters(hero, currLvl.boxes, currLvl.Monsters[i], Date.now(), canvas, currLvl);
            	    }
            	    else if(asparagusSkills.asparagus.canMove)
            	    {
            	        movingObjects.RunningMonsters(hero, currLvl.boxes, currLvl.Monsters[i], Date.now(), canvas);
            	    }
            	    
            	    //If a ranged attack monster is abel and in position to attack, they fire.
            	    if(currLvl.Monsters[i].type == "ranged" && currLvl.Monsters[i].y < hero.y + hero.h/2 && currLvl.Monsters[i].y > hero.y - hero.h/2 && currLvl.Monsters[i].canAttack && (currLvl.OrgPath == "east" || currLvl.OrgPath == "west"))
        	        {
        	            MonsterArrows.push(gameObjects.ShootArrow(currLvl.Monsters[i].x - 10, currLvl.Monsters[i].y + 15, currLvl.OrgPath))
        	            currLvl.Monsters[i].canAttack = false;
        	            MonsterRangeAtkInterval(currLvl.Monsters[i]);
        	        }
        	        //TODO:Make an image for a vertical arrow
        	        else if(currLvl.Monsters[i].type == "ranged" && currLvl.Monsters[i].x < hero.x + hero.w/2 && currLvl.Monsters[i].x > hero.x - hero.w/2 && currLvl.Monsters[i].canAttack && (currLvl.OrgPath == "south" || currLvl.OrgPath == "north"))
        	        {
        	            MonsterArrows.push(gameObjects.ShootArrow(currLvl.Monsters[i].x + 15, currLvl.Monsters[i].y - 10, currLvl.OrgPath))
        	            currLvl.Monsters[i].canAttack = false;
        	            MonsterRangeAtkInterval(currLvl.Monsters[i]);
        	        }
        	        
        	        //if Hero skill "Potato slam" is in play.
        	        if(preloads.Skill.EarthSpikes.length > 0)
            		{
            		    for (j = 0; j < preloads.Skill.EarthSpikes.length; j += 1)
            		    {
            		        if (collisions.isTouching(currLvl.Monsters[i], preloads.Skill.EarthSpikes[j]) || collisions.isTouching(currLvl.Monsters[i], hero))
            		        {
            		            if(currLvl.Monsters[i].canTakeDmg)
            		            {
            		                gameLogic.monsterDmgTaken(currLvl.Monsters[i], 2)
                		            currLvl.Monsters[i].canTakeDmg = false;
                		            currLvl.Monsters[i].x += Math.floor(Math.random() * (50 - -50) - 50);
                		            currLvl.Monsters[i].y += Math.floor(Math.random() * (50 - -50) - 50);
                		            ResetMonsterCanTakeDmg(currLvl.Monsters[i]);
            		            }
            		        }
            		    }
            		}
    	     
            		//if hero skill "Hot Shot" is in play.
            		if(preloads.Skill.Fires.length > 0)
            		{
            		    for (j = 0; j < preloads.Skill.Fires.length; j += 1)
            		    {
            		        if (currLvl.Monsters[i].canTakeDmg && collisions.isTouching(currLvl.Monsters[i], preloads.Skill.Fires[j]))
            		        {
            		            gameLogic.monsterDmgTaken(currLvl.Monsters[i], 1)
            		            currLvl.Monsters[i].canTakeDmg = false;
            		            ResetMonsterCanTakeDmg(currLvl.Monsters[i]);
            		        }
            		    }
            		}
            	}
        	}
            
            //updates monster arrows location and checks if hero got hit.
        	if(MonsterArrows != null)
        	{
        	    for (i = 0; i < MonsterArrows.length; i += 1)
        	    {
        	        if (!movingObjects.FlyingArrows(canvas, MonsterArrows[i], Date.now()))
        	        {
        	            MonsterArrows.splice(i, 1);
        	        }
        	    }
        	}
        	
        	
        	//Checks if a arrow hit a monster
        	if(currLvl.Monsters !== null && Arrows.length > 0)
        	{
        	    for (i = 0; i < Arrows.length; i += 1)
        	    {
        	        for (j = 0; j < currLvl.Monsters.length; j += 1)
        	        {
        	            //need to check if null since it loops for each monster, if it hits mosnter at pos 0 and then it tries to loop agian then Arrows[i] is null and causes a crash.
        	            if (Arrows[i] != null && Arrows[i].type != "FireArrow" && collisions.isTouching(currLvl.Monsters[j], Arrows[i]))
        	            {
        	                Arrows.splice(i, 1);
        	                gameLogic.monsterDmgTaken(currLvl.Monsters[j], hero.ArrowDmg);
        	            }
        	            
                    }
        	    }
        	}
            
        	//checks if the hero reached the next lvl
        	if(hero.EXP >= hero.nextHeroLevel)
        	{
        	    gameLogic.newHeroLvlReached(hero);
        	    preloads.RisingTextMessage.message = "LEVEL UP!"
        	    movingObjects.ResetMovingText();
        	}
            
        	//removes a monster if they got no lives.
        	if (currLvl.Monsters !== null)
        	{
        	    for (i = 0; currLvl.Monsters.length > i; i += 1)
        	    {
        	        if (currLvl.Monsters[i].Lives <= 0)
        	        {
        	            if(currLvl.Monsters[i].type === "Boss")
        	            {
        	                preloads.message = "ASPARAGUS IS DEAAAD!!";
        	                currLvl.Image = preloads.Images.VictoryScreen;
        	                Victory = true;
        	                asparagusSkills.asparagus.ButterSlops = [];
        	                currLvl.items = [];
        	                asparagusSkills.asparagus.active = false;
        	                
        	                setTimeout(function(){
        	                    currLvl.Image = preloads.Images.CreditsImg;
        	                }, 10000)
        	                currLvl.Monsters = [];
        	                break;
        	            }
        	            if (gameObjects.LootDropped(3))
        	            {
        	                //generates a random item.
        	                currLvl.items.push(gameObjects.generateRandomItem(Math.round(Math.random() * (2 - 1) + 1), currLvl.Monsters[i]));
        	            }
        	            hero.EXP += currLvl.Monsters[i].XP;
                        currLvl.Monsters.splice(i, 1);
                        if(currLvl.Monsters.length == 0)
                        {
                            currLvl.Monsters = null;
                            break;
                        }
        	        }
        	    }
        	}
            
            //Updates arrows positions and also removes them if they left the canvas block.
        	if(Arrows.length > 0)
        	{
            	for (i = 0; i < Arrows.length; i += 1)
            	{
            	    if (!movingObjects.FlyingArrows(canvas, Arrows[i], Date.now(), hero))
            	    {
            	        Arrows.splice(i, 1);
            	    }
            	}
        	}
        	
        	//Moves the asparagus spray abillitys
        	if(asparagusSkills.asparagus.asparagusSpray.length > 0)
        	{
        	    for(i = 0; i < asparagusSkills.asparagus.asparagusSpray.length; i += 1)
        	    {
        	        
            	        if(!movingObjects.flyingAsparagusSpray(asparagusSkills.asparagus.asparagusSpray[i], Date.now(), canvas))
            	        {
            	            asparagusSkills.asparagus.asparagusSpray.splice(i, 1);
            	        }
            	        if(asparagusSkills.asparagus.asparagusSpray[i] != null)
            	        {
                	        if(collisions.isTouching(hero, asparagusSkills.asparagus.asparagusSpray[i]))
                            {
                                gameLogic.damageTaken(hero);
                                asparagusSkills.asparagus.asparagusSpray.splice(i, 1);
                            }
            	        }
        	    }
        	}
        }
        
        //Removes messsage
    	if(17 in keysDown && cantRemoveMessage) { //keycode for CTRL
    	    
    	    
        	if(preloads.message != null)
	        {
	            soundEffs.playSound(soundEffs.sounds.ContinueClick);
	            preloads.message = null;
	        }
	        
    	    if(asparagusSkills.asparagus.active)
    	    {
    	        if(asparagusSkills.asparagus.message == null)
    	        {
    	            
    	            asparagusSkills.asparagus.message = asparagusSkills.asparagusArguments[asparagusSkills.asparagus.messCount];
    	            if (asparagusSkills.asparagus.messCount == asparagusSkills.asparagusArguments.length -1)
    	            {
    	                soundEffs.sounds.backgroundMusicBoss.loop = true;
    	                soundEffs.sounds.backgroundMusicBoss.play();
    	                setTimeout(function(){
    	                    preloads.pauseGame = false;
    	                },3000)
    	            }
    	        }
    	        else 
    	        {
    	            soundEffs.playSound(soundEffs.sounds.ContinueClick);
    	            asparagusSkills.asparagus.message = null;
    	            asparagusSkills.asparagus.messCount += 1;
    	            preloads.message = asparagusSkills.potatoArguments[asparagusSkills.asparagus.messCount];
    	        }
    	    }
    	    cantRemoveMessage = false;
    	    
    	    setTimeout(function(){
    	        cantRemoveMessage = true;
    	    }, 1000);
    	}
        
    	// Go to next level.
    	if(hero.x > canvas.width)
    	{
    	    mapLoc[0] += 1;
    	    getLevelObjects("east");
    	    //Nextlvl();
    	}
    	if(hero.x < -(hero.w))
    	{
    	    mapLoc[0] -= 1;
    	    getLevelObjects("west");
    	}
    	if(hero.y < -(hero.h))
    	{
    	    mapLoc[1] += 1;
    	    getLevelObjects("north");
    	}
    	if(hero.y > canvas.height)
    	{
    	    mapLoc[1] -= 1;
    	    getLevelObjects("south");
    	}
    };
    
    //gets the current game objects
    function getLevelObjects(direction){
        console.log(mapLoc);
        console.log(mapGen.Levels[0][-1])
        switch(direction)
        {
            case "east":
                hero.x = 74;
                hero.y = canvas.width/2 - 50;
                
                //used to update the minimap
                gameMiniMap.miniMapLocationUpdateOperator.operator = -42;
                gameMiniMap.miniMapLocationUpdateOperator.direction = "horizontal";
                break;
                
            case "west":
                hero.x = canvas.width - 116;
                hero.y = canvas.width/2 - 50;
                
                //used to update the minimap
                gameMiniMap.miniMapLocationUpdateOperator.operator = +42;
                gameMiniMap.miniMapLocationUpdateOperator.direction = "horizontal";
                break;
                
            case "south":
                hero.y = 74;
                hero.x = canvas.width/2 - 70;
                
                //used to update the minimap
                gameMiniMap.miniMapLocationUpdateOperator.operator = -42;
                gameMiniMap.miniMapLocationUpdateOperator.direction = "vertical";
                break;
                
            case "north":
                hero.y = canvas.height - hero.h  -70;
                hero.x = canvas.width/2 - 70;
                
                //used to update the minimap
                gameMiniMap.miniMapLocationUpdateOperator.operator = +42;
                gameMiniMap.miniMapLocationUpdateOperator.direction = "vertical";
                break;
        }
        
        currLvl = mapGen.Levels[mapLoc[0]][mapLoc[1]];
        
        //updates the minimap
        gameMiniMap.updateMapLocation();
        
        if(!currLvl.hasExplored)
        {
            currLvl.hasExplored = true;
            nextLevel += 1;
            if(nextLevel < 31)
            {
                gameMiniMap.updateMiniMap({Image: null, x: gameMiniMap.canvas.width/2 - 16, y: gameMiniMap.canvas.height/2 - 16}, currLvl.OrgPath, currLvl.NextPath);
            }
            else
            {
                gameMiniMap.updateMiniMap({Image: null, x: gameMiniMap.canvas.width/2 - 16, y: gameMiniMap.canvas.height/2 - 16}, "boss")
            }
        }
        
        // set them to null so that levels that dont use them dont have the last levels objects spawned.
       
        preloads.message = null;

        Arrows = [];
        preloads.TipMess = null;
        preloads.Skill.Fires = [];
        asparagusSkills.asparagus.ButterSlops = [];
        MonsterArrows = [];
        
        
        if(currLvl.Monsters != null && currLvl.Monsters[0].type == "Boss")
        {
            soundEffs.sounds.backgroundMusic.pause();
            //nerfing monster or else they can easily swarm too fast.
            gameObjects.UpgradeMonsters(-4, 0);
            asparagusSkills.asparagus.active = true;
            preloads.message = asparagusSkills.potatoArguments[asparagusSkills.asparagus.messCount];
            preloads.pauseGame = true;
            preloads.TipMess = "Press CTRL to continue the conversation.";
        }
        
        if(currLvl.Monsters != null)
        {
            for (i = 0; i < currLvl.Monsters.length; i += 1)
            {
                currLvl.Monsters[i].lastMonsterMove = Date.now();
            }
        }
    }
    
    //Sets hero sprite cords to the requested ones.
    function newSpriteCords(x,y,w,h){
        spriteCords.x = x;
        spriteCords.y = y;
        spriteCords.w = w;
        spriteCords.h = h;
    }
    
    //resets the monster timer for the dmg of some special abilletys
    function ResetMonsterCanTakeDmg(monster){
        setTimeout(function(){
            monster.canTakeDmg = true;
        }, 250);
    }
    
    //Executes the animation for a hero sword attack and resets the animation after the attack
    var heroSwordAttack = function(){
        
        //sound effect
        soundEffs.playSound(soundEffs.sounds.SwordSwish, 0.5)
        
        ReadytoAtk = false;
        canMeleedmg = true;
        var interval = 500;
        if(preloads.Skill.StarchStrenghtActive)
        {
            interval = 250
        };
        
        //Resets hero attack.
        setTimeout(function(){
    
            canMeleedmg = false;
            hasDamaged = false;
            
            //Resets the sprite cords.
            if (AAtk)
            {
                newSpriteCords(518, 42, 52, 54);
            }
            else
            {
                newSpriteCords(640, 42, 52, 55);
            }
            
            WAtk = false;
            AAtk = false;
            //Interval between attacks.
            
            setTimeout(function() {
                ReadytoAtk = true;
            },250);
            
        },interval); 
    };
    
    //Executes a bow shot
    var heroBowAttack = function(key){
        ReadytoAtk = false;
        
        if(preloads.Skill.HotShotActive)
        {
            var fireAnimation = setInterval(function(){
                FireimageSwitch += 1;
                if(FireimageSwitch % 2 == 0)
                {
                    FireImgAnimation1 = preloads.Images.FireTwo;
                    FireImgAnimation2 = preloads.Images.FireOne;
                }
                else
                {
                    FireImgAnimation1 = preloads.Images.FireOne;
                    FireImgAnimation2 = preloads.Images.FireTwo;
                }
            }, 250);
        }
        
        switch(key)
        {
            case "W":
                    if(!preloads.Skill.CornSprayActive && !preloads.Skill.HotShotActive)
                    {
                        hero.Arrows -= 1;
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y, key, 112, 6));
                    }
                    else if(preloads.Skill.CornSprayActive)
                    {
                        CornSpray(15, 0, key, 112, 6)
                        preloads.Skill.CornSprayActive = false;
                    }
                    else if(preloads.Skill.HotShotActive)
                    {
                        //testing HotShot
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y, key, 112, 6, "FireArrow"));
                        preloads.Skill.HotShotActive = false;
                        preloads.Skill.FireStartY = hero.y;
                        preloads.Skill.FireStartX = hero.x;
                        
                        setTimeout(function(){
                            clearInterval(fireAnimation);
                            preloads.Skill.Fires = [];
                            preloads.Skill.Firelength = 32;
                        }, 4000);
                    }
                break;
                
            case "S":
                    if(!preloads.Skill.CornSprayActive && !preloads.Skill.HotShotActive)
                    {
                        hero.Arrows -= 1;
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y + 10, key, 14, 6));
                    }
                    else if(preloads.Skill.CornSprayActive)
                    {
                        CornSpray(15, 10, key, 14, 6);
                        preloads.Skill.CornSprayActive = false;
                    }
                    else if(preloads.Skill.HotShotActive)
                    {
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y + 10, key, 14, 6, "FireArrow"));
                        preloads.Skill.HotShotActive = false;
                        preloads.Skill.Firelength = 0;
                        preloads.Skill.FireStartY = hero.y + hero.h;
                        preloads.Skill.FireStartX = hero.x;
                        
                        setTimeout(function(){
                            clearInterval(fireAnimation);
                            preloads.Skill.Fires = [];
                            preloads.Skill.Firelength = 32;
                        }, 5000)
                    }
                break;
                
            case "A":
                    if(!preloads.Skill.CornSprayActive && !preloads.Skill.HotShotActive)
                    {
                        hero.Arrows -= 1;
                        Arrows.push(gameObjects.ShootArrow(hero.x, hero.y + 22, key, 39, 13));
                    }
                    else if(preloads.Skill.CornSprayActive)
                    {
                        CornSpray(0, 22, key, 39, 13);
                        preloads.Skill.CornSprayActive = false;
                    }
                    else if(preloads.Skill.HotShotActive)
                    {
                        Arrows.push(gameObjects.ShootArrow(hero.x, hero.y + 22, key, 39, 13, "FireArrow"));
                        preloads.Skill.HotShotActive = false;
                        preloads.Skill.FireStartY = hero.y;
                        preloads.Skill.FireStartX = hero.x;
                        
                        setTimeout(function(){
                            clearInterval(fireAnimation);
                            preloads.Skill.Fires = [];
                            preloads.Skill.Firelength = 32;
                        }, 5000)
                    }
                break;
                
            case "D":
                    if(!preloads.Skill.CornSprayActive && !preloads.Skill.HotShotActive)
                    {
                        hero.Arrows -= 1;
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y + 22, key, 72, 13));
                    }
                    else if(preloads.Skill.CornSprayActive)
                    {
                        CornSpray(15, 22, key, 72, 13);
                        preloads.Skill.CornSprayActive = false;
                    }
                    else if(preloads.Skill.HotShotActive)
                    {
                        Arrows.push(gameObjects.ShootArrow(hero.x + 15, hero.y + 22, key, 72, 13, "FireArrow"));
                        preloads.Skill.HotShotActive = false;
                        preloads.Skill.Firelength = 0;
                        preloads.Skill.FireStartY = hero.y;
                        preloads.Skill.FireStartX = hero.x + hero.w;
                        
                        setTimeout(function(){
                            clearInterval(fireAnimation);
                            preloads.Skill.Fires = [];
                            preloads.Skill.Firelength = 32;
                        }, 5000)
                    }
                break;
                
            default:
                console.log("Error occurred.");
        }
        
        setTimeout(function(){ReadytoAtk = true;}, 500);
    };
    
    function CornSpray(xOper,yOper,key,SpriteX,SpriteY){
        
        var repeater = setInterval(function(){
            if(hero.Arrows > 0)
            {
                Arrows.push(gameObjects.ShootArrow(hero.x+xOper, hero.y+yOper, key, SpriteX, SpriteY));
                hero.Arrows -= 1;
            }
            else
            {clearInterval(repeater);}
        },100);
        setTimeout(function(){
            clearInterval(repeater);
        },400);
    }
    
    //A ranged monsters reload time.
    function MonsterRangeAtkInterval(monster){
        setTimeout(function(){monster.canAttack = true}, 1000);
    }
    
    //Functions that draws on levls.
    
    //A personal multi line function
    function multiLineText(messageString, orgX, orgY, paintBox, toYcords) 
    {
        var maxCharsPerLine = 15;
        var lines = Math.ceil(messageString.length/ maxCharsPerLine); //15 chars per line.
        var topY = lines * 12; //12 px per line
        var lastBreak = 0;
        j = 0;
        var messagepart = "";
        var failsafe = true;
        
        var messageParts = [];
        //console.log(topX);
        
        while (failsafe)
        {
            for (i = 0; i < lines; i += 1)
            {
                
                for (j = lastBreak; j < messageString.length; j += 1)
                {
                    messagepart += messageString[j];
                    if (j >= 10 + lastBreak && messageString[j] == " ")
                    {
                        lastBreak = j + 1;
                        break;
                    }
                    else if(j - lastBreak === maxCharsPerLine)
                    {
                        lastBreak = j + 1;
                        //if there is one more letter in the word, it gets added b4 the break.
                        if (messageString[j + 1] != " " && messageString[j + 2] == " ")
                        {
                            messagepart += messageString[j + 1];
                            messagepart += " "; //need to add this empty space to get the correct amount of lenght so it can pass the fail safe.
                            lastBreak += 2;
                        }
                        else
                        {
                            messagepart += "-";
                        }
                        break;
                    }
                }
                messageParts.push(messagepart);
                messagepart = "";
            }
            
            //If the entire sentance hasent been written, then another line gets added and the process is re-done.
            if (entireSentanceWritten(messageParts, messageString))
            {
                failsafe = false;
            }
            else 
            {
                messageParts = [];
                lastBreak = 0;
                lines += 1;
                topY = 12 * lines;
            }
        }
        
        if(paintBox)
        {
            ctx.fillStyle = "#FFFFFF"
            ctx.fillRect(orgX, 500-topY, 155, toYcords - orgY + topY);
            ctx.fillStyle = "#000000";
        }
        DescY = topY;
        for (i = 0; i < messageParts.length; i += 1)
        {
            ctx.fillText(messageParts[i], orgX, orgY - topY);
            topY -= 12;
        }
    }
    
    //returns true if the entire sentance has been written, otherwise false.
    function entireSentanceWritten(messagePartsArray, messageString){
        var arrayTotalchar = 0;
    
        for (i = 0; i < messagePartsArray.length; i += 1)
        {
            arrayTotalchar += messagePartsArray[i].length;
        }
        
        if(arrayTotalchar >= messageString.length)
        {
            return true;
        }
        return false;
    }
    
    //draws the fire trail from the Hot SHot abillety
    function drawFires(){
        for (i = 0; i < preloads.Skill.Fires.length; i += 1)
        {
            if (i % 2 == 0)
            {
                ctx.drawImage(FireImgAnimation1, preloads.Skill.Fires[i].x, preloads.Skill.Fires[i].y);
            }
            else
            {
                ctx.drawImage(FireImgAnimation2, preloads.Skill.Fires[i].x, preloads.Skill.Fires[i].y);
            }
        }
    }
    
    //draws all game obj that dont require any special code. (Monster arrows, currLvl.boxes and currLvl.spikes.)
    function drawGameObj(img, Arr){
        for (i = 0; i < Arr.length; i += 1)
        {
            ctx.drawImage(img, Arr[i].x, Arr[i].y);
        }
    }
    
    //draws monster arrows
    function drawMonsterArrows(){
        for (i = 0; i < MonsterArrows.length; i += 1)
        {
            if(MonsterArrows[i].Direction == "A" || MonsterArrows[i].Direction == "D")
            {
                //horizontal
                ctx.drawImage(preloads.Images.MonsterArrowH, MonsterArrows[i].x, MonsterArrows[i].y)
            }
            else
            {
                //vertical
                ctx.drawImage(preloads.Images.MonsterArrowV, MonsterArrows[i].x, MonsterArrows[i].y)
            }
        }
    }
    
    //draw earthspikes from the Potato Slam abillety
    function drawEarthSpikes(){
        for (i = 0; i < preloads.Skill.EarthSpikes.length; i += 1)
        {
            //(Image, sprite pos.x, sprite pos.y, image resolution.x, image resolution.y, render pos.x, render pos.y, imagesize.w, imagesize.h)   
            ctx.drawImage(preloads.Images.EarthSpike,36,36,32,32, preloads.Skill.EarthSpikes[i].x, preloads.Skill.EarthSpikes[i].y,32,32)
        }
    }
    
    //spawns all monsters for a level. NOTE: Currently only abel to spawn 1 monster.
    function spawnMonsters(){
        for (i = 0; i < currLvl.Monsters.length; i += 1)
        {
            //Draws the monster and a health bar over it
            if(currLvl.Monsters[i].type != "ranged" && currLvl.Monsters[i].type != "Boss")
            {
                ctx.drawImage(preloads.Images.MonsterImage, 38,36,32,32, currLvl.Monsters[i].x, currLvl.Monsters[i].y,32,32);
            }
            else if(currLvl.Monsters[i].type == "ranged")
            {
                ctx.drawImage(preloads.Images.RangedMonsterImage, 38,36,32,32, currLvl.Monsters[i].x, currLvl.Monsters[i].y,32,32);
            }
            else if(currLvl.Monsters[i].type == "Boss")
            {
                ctx.drawImage(preloads.Images.AsparagusSprite, asparagusSkills.asparagus.SpriteX,asparagusSkills.asparagus.SpriteY, asparagusSkills.asparagus.w, asparagusSkills.asparagus.h,  currLvl.Monsters[i].x, currLvl.Monsters[i].y, asparagusSkills.asparagus.w, asparagusSkills.asparagus.h)
            }
            if(currLvl.Monsters[i].type != "Boss")
            {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(currLvl.Monsters[i].x -9,currLvl.Monsters[i].y -10 ,(currLvl.Monsters[i].Lives/currLvl.Monsters[i].MonsterMaxLives)*50, 5)
            }
            else
            {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(currLvl.Monsters[i].x -9,currLvl.Monsters[i].y -10 ,(currLvl.Monsters[i].Lives/asparagusSkills.getTotalBossLives())*50, 5)
            }
        }
    }
    
    //draws all hero arrows
    function drawArrows(){
        for (i= 0; i < Arrows.length; i += 1)
        {
            ctx.drawImage(preloads.Images.ArrowSprite, Arrows[i].sPosX, Arrows[i].sPosY, Arrows[i].w, Arrows[i].h, Arrows[i].x, Arrows[i].y, Arrows[i].w, Arrows[i].h);
            
            if(Arrows[i].type == "FireArrow")
            {
                switch(Arrows[i].Direction)
                {
                    case "S":
                            if (preloads.Skill.FireStartY + preloads.Skill.Firelength + 32 <= Arrows[i].y)
                            {
                                preloads.Skill.MissedFires = Math.floor((Arrows[i].y - preloads.Skill.FireStartY - preloads.Skill.Firelength) / 32);
                                for (j = 0; j < preloads.Skill.MissedFires; j += 1)
                                {
                                    preloads.Skill.Fires.push(gameObjects.CreateGameObj(preloads.Skill.FireStartX, preloads.Skill.FireStartY + preloads.Skill.Firelength, 32,32,null,"Fire"));
                                    preloads.Skill.Firelength += 32;
                                }
                            }
                        break;
                    
                    case "W":
                            if (preloads.Skill.FireStartY - preloads.Skill.Firelength >= Arrows[i].y)
                            {
                                preloads.Skill.MissedFires = Math.floor((preloads.Skill.FireStartY - preloads.Skill.Firelength - Arrows[i].y) / 32);
                                for(j = 0; j < preloads.Skill.MissedFires; j+= 1)
                                {
                                    preloads.Skill.Fires.push(gameObjects.CreateGameObj(preloads.Skill.FireStartX, preloads.Skill.FireStartY - preloads.Skill.Firelength, 32,32,null,"Fire"));
                                    preloads.Skill.Firelength += 32;
                                }
                            }
                    break;
                    
                    case "D":
                        if (preloads.Skill.FireStartX + preloads.Skill.Firelength + 32 <= Arrows[i].x)
                        {
                            preloads.Skill.MissedFires = Math.floor((Arrows[i].x - preloads.Skill.FireStartX - preloads.Skill.Firelength) / 32)
                            for(j = 0; j < preloads.Skill.MissedFires; j += 1)
                            {
                                preloads.Skill.Fires.push(gameObjects.CreateGameObj(preloads.Skill.FireStartX + preloads.Skill.Firelength, preloads.Skill.FireStartY, 32,32,null,"Fire"));
                                preloads.Skill.Firelength += 32;
                            }
                        }
                        break;
                        
                    case "A":
                        if(preloads.Skill.FireStartX - preloads.Skill.Firelength >= Arrows[i].x)
                        {
                            preloads.Skill.MissedFires = Math.floor((preloads.Skill.FireStartX - preloads.Skill.Firelength - Arrows[i].x) / 32)
                            for (j = 0; j <preloads.Skill.MissedFires; j += 1)
                            {
                                preloads.Skill.Fires.push(gameObjects.CreateGameObj(preloads.Skill.FireStartX - preloads.Skill.Firelength, preloads.Skill.FireStartY, 32,32,null, "Fire"));
                                preloads.Skill.Firelength += 32;
                            }
                        }
                        break;
                }
                
            }
        }
    }
    
    //draws the current levels items.
    function drawItems(){
        for (i = 0; i < currLvl.items.length; i += 1)
        {
            switch(currLvl.items[i].type)
            {
                case "heart": ctx.drawImage(preloads.Images.heartImage, currLvl.items[i].x, currLvl.items[i].y);
                    break;
                    
                case "arrows": ctx.drawImage(preloads.Images.Quiver, currLvl.items[i].x, currLvl.items[i].y);
                    break;
                    
                case "swordUpgrade": ctx.drawImage(preloads.Images.swordUpgradeImage, currLvl.items[i].x, currLvl.items[i].y);
                    break;
                    
                case "bowUpgrade": //TODO: ADD UPGRADE IMG.
                    ctx.drawImage(preloads.Images.BowUpgrade, currLvl.items[i].x, currLvl.items[i].y)
                    break;
                    
                default:
                    console.log("The item type does not exsist.");
            }
        }
    }
    
    //Player lost the game.
    function PlayerLost(){
        ctx.drawImage(preloads.Images.LoseScreen,-1,-1);
    }

    // Loops the game.
    var main = function() {
        var now = Date.now();
        var modifier = now - then;
        
        //checks if all the used images have loaded.
        if(!loaded && preloads.Images.bgImage.complete && preloads.Images.heroSprite.complete && preloads.Images.heroSlamAttack.complete && 
        preloads.Images.dangerousSpikes.complete && preloads.Images.MonsterImage.complete && preloads.Images.RangedMonsterImage.complete && 
        preloads.Images.boxImage.complete && preloads.Images.heartImage.complete && preloads.Images.Quiver.complete && 
        preloads.Images.swordUpgradeImage.complete && preloads.Images.ArrowSprite.complete && preloads.Images.BowUpgrade.complete && preloads.Images.MonsterArrowH.complete &&  preloads.Images.MonsterArrowV.complete &&
        preloads.Images.EarthSpike.complete && preloads.Images.FireOne.complete && preloads.Images.FireTwo.complete && preloads.Images.SkillSprite.complete && 
        preloads.Images.AsparagusSprayImg.complete && preloads.Images.AsparagusSprite.complete && preloads.Images.MenuTitleImg.complete && preloads.Images.MenuPlateImg.complete && 
        preloads.Images.CreditsImg.complete && preloads.Images.LoseScreen.complete && preloads.Images.VictoryScreen.complete && preloads.Images.ControlsImg.complete &&
        preloads.Images.bgImageEW.complete && preloads.Images.bgImageEN.complete && preloads.Images.bgImageES.complete && preloads.Images.bgImageWN.complete && 
        preloads.Images.bgImageWS.complete && preloads.Images.bgImageNS.complete && preloads.Images.MiniMapImg.complete && preloads.Images.MiniMapEW.complete && 
        preloads.Images.MiniMapEN.complete && preloads.Images.MiniMapES.complete && preloads.Images.MiniMapWN.complete && preloads.Images.MiniMapWS.complete && 
        preloads.Images.MiniMapSN.complete && preloads.Images.MiniMapBoss.complete && preloads.Images.MiniMapDot.complete && preloads.Images.bgImageBoss.complete)
        {
            //starts game music
            soundEffs.sounds.backgroundMusic.loop = true;
            soundEffs.sounds.backgroundMusic.volume = 0.20;
            soundEffs.sounds.backgroundMusic.play();
            
            //generate maps
            mapGen.generateMaps();
            currLvl = mapGen.Levels[mapLoc[0]][mapLoc[1]];
            
            //add level 1 to the minimap
            gameMiniMap.updateMiniMap({Image: preloads.Images.MiniMapImg, x: gameMiniMap.canvas.width/2 - 16, y: gameMiniMap.canvas.height/2 - 16});
            
            //game appends the minimap canvas
            miniMapCont.appendChild(gameMiniMap.miniMap);
            
            
            
            //when all images loaded the loaded bool is set to true
            loaded = true;
        }
        
        if(loaded)
        {
            
            gameMiniMap.drawMiniMap();
            if(menu.menuObj.renderActive)
            {
                render();
            }
            else
            {
                menu.drawMenuOption(ctx, canvas);
            }
            
            if(menu.menuObj.menuActive && menu.menuObj.renderActive)
            {
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.85;
                ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                menu.Menu(ctx, canvas);
            }
            else if(hero.Lives > 0 && !menu.menuObj.menuActive)
            {
                animation(modifier / 1000);
            }
            else if(!menu.menuObj.menuActive)
            {
                PlayerLost();
            }
        }
        else
        {
            ctx.font = "24px Helvetica";
            ctx.fillText("Game is loading", 250,250);
        }
        
        then = now;
        //request to do this method agian asap.
        requestAnimationFrame(main);
    };
    
    //cross browser support for requestanimationframe. 
    //NOTE: DOES NOT WORK ATM. some wrong syntax?
    //var w = window;
    //requestAnimationFrame = w.requestAnimationFrame || w.webkitrequestAnimationFrame || w.msrequestAnimationFrame || w.mozrequestAnimationFrame;
    
    //Let's start!
    var then = Date.now();
    main();
})();