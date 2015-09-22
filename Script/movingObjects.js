"use strict";

var movingObjects = (function(){
    var exports = {};
    var randomX;
    var randomY;
    
    var i;
     //Updates arrow position.
    function FlyingArrows(canvas, arrow, now){
        if(arrow.lastRegisterdMove != null)
        {
            var diff = (now - arrow.lastRegisterdMove)/1000;
            switch(arrow.Direction)
            {
                case "W":
                        arrow.y -= diff * arrow.speed;
                        if (arrow.y < 0)
                        {
                            return false; //returning false removes the arrow.
                        }
                    break;
                    
                case "S":
                        arrow.y += diff * arrow.speed;
                        if (arrow.y > canvas.height)
                        {
                            return false;
                        }
                    break;
                
                case "A":
                        arrow.x -= diff * arrow.speed;
                        if (arrow.x < -10)
                        {
                            return false;
                        }
                    break;
                
                case "D":
                        arrow.x += diff * arrow.speed;
                        if (arrow.x > canvas.width)
                        {
                            return false;
                        }
                    break;
                    
                default: console.log("Critical error when updating the arrow location.");
            }
            
        }
        arrow.lastRegisterdMove = now;
        return true;
    }
    
    //Makes the monster chase the player.
    function RunningMonsters(hero, boxes, monster, now, canvas, currentLvl){
        var x = hero.x;
        var y = hero.y;
        if(asparagusSkills.asparagus.CucumberSlashActive)
        {
            x = asparagusSkills.asparagus.CucumberSlashDestination.x;
            y = asparagusSkills.asparagus.CucumberSlashDestination.y;
        }
        
        if(monster.lastMonsterMove != null)
        {
            var diff = (now - monster.lastMonsterMove)/1000;
                if (x > monster.x)
            	{
            	    //makes the ranged attacking monster move to the back of the canvas block.
            	    if(monster.type == "ranged" && currentLvl.OrgPath == "east")
            	    {
            	        monster.x -= monster.speed * diff;
                        //TODO:This one is bugged as of the moment. Why I dont know but this if never occurs
            	        if(currentLvl.NextPath != "west" && monster.x <= 47)
                	    {
            	            monster.x = 47;
            	        }
            	        else
            	        {
                	        if (monster.y + monster.h > canvas.height/2 + 30)
                    	    {
                    	        monster.x = 47;
                    	    }
                    	    if (monster.y < canvas.height/2 - 70)
                    	    {
                    	        monster.x = 47;
                    	    }
                    	    if(monster.x <= 0)
                    	    {
                    	        monster.x = 0;
                    	    }
            	        }
            	    }
            	    else
            	    {
            	        monster.x += monster.speed * diff;
            	        //boss animation
            	        if (monster.type === "Boss" && !asparagusSkills.asparagus.CucumberSlashActive)
            	        {
            	            asparagusSkills.asparagusNewSpriteCords(137, 1, 24, 74);
            	        }
            	        else if(asparagusSkills.asparagus.CucumberSlashActive)
            	        {
            	            asparagusSkills.asparagusNewSpriteCords(55, 1, 50, 74);
            	        }
            	    }
           	    
            	    //Checks box collision.
            	    if(boxes != null)
            		{
                		for (i = 0; i<boxes.length ;i += 1)
                		{
                			if (collisions.isTouching(monster, boxes[i]))
                			{
                			    // move an extra pixel, otherwise bugg when too close to the blocks.
                				monster.x = boxes[i].x - monster.w -1 ;
                			}
                		}
            		}
            		
            	}
            	
            	if (x < monster.x)
            	{
            	    //makes the ranged attacking monster move to the back of the canvas block.
            	    if(monster.type == "ranged" && currentLvl.OrgPath == "west")
            	    {
            	        monster.x += monster.speed * diff;
            	        if(currentLvl.NextPath != "east" && monster.x + monster.w >= canvas.width - 50)
                	    {
                	        monster.x = canvas.width - monster.w - 50;
                	    }
                	    else
                	    {
                	        if (monster.y + monster.h > canvas.height/2 + 30)
                    	    {
                    	        monster.x = canvas.width - monster.h - 50;
                    	    }
                    	    if (monster.y < canvas.height/2 - 70)
                    	    {
                    	        monster.x = canvas.width - monster.h - 50;
                    	    }
                    	    if(monster.x >= canvas.width - monster.w)
                    	    {
                    	        monster.x = canvas.width - monster.w;
                    	    }
                	    }
                	    
            	    }
            	    else
            	    {
            	        monster.x -= monster.speed * diff;
            	        //boss animation
            	        if (monster.type === "Boss" && !asparagusSkills.asparagus.CucumberSlashActive)
            	        {
            	            asparagusSkills.asparagusNewSpriteCords(166, 1, 24, 74);
            	        }
            	        else if(asparagusSkills.asparagus.CucumberSlashActive)
            	        {
            	            asparagusSkills.asparagusNewSpriteCords(0, 1, 50, 74);
            	        }
            	    }
            	    
            	    //Checks box collision.
    	    		if(boxes != null)
            		{
                		for (i = 0;i<boxes.length ;i += 1)
                		{
                			if (collisions.isTouching(monster, boxes[i]))
                			{
                			    // move an extra pixel, otherwise bugg when too close to the blocks.
                				monster.x = boxes[i].x + boxes[i].w + 1;
                			}
                		}
            		}
            	}
            	
            	if (y > monster.y)
            	{
            	    if(monster.type == "ranged" && currentLvl.OrgPath == "south")
            	    {
            	        monster.y -= monster.speed * diff;
            	        
            	        if(currentLvl.NextPath != "north" && monster.y <= 58)
                	    {
            	            monster.y = 58;
                	    }
                	    else
                	    {
                	        if(monster.x < canvas.width/2 - 50)
                    	    {
                    		    monster.y = 58;
                    	    }
                    	    if(monster.x + monster.w > canvas.width/2 + 50)
                    	    {
                    	        monster.y = 58;
                    	    }
                    	    if(monster.y <= 0)
                    	    {
                    	        monster.y = 0;
                    	    }
                	    }
                	   
            	    }
            	    
        	        else
            	    {
    	                monster.y += monster.speed * diff;
            	    }
            	    
                	    //Checks box collision.
                	    if(boxes != null)
                		{
                    		for (i = 0;i<boxes.length ; i += 1)
                    		{
                    			if (collisions.isTouching(monster, boxes[i]))
                    			{
                    			    // move an extra pixel, otherwise bugg when too close to the blocks.
                    				monster.y = boxes[i].y - monster.h - 1;
                    			}
                    		}
                		}
            		
                	}
            	
            	
                	if (y < monster.y)
                	{
                	    if(monster.type == "ranged" && currentLvl.OrgPath == "north")
                	    {
                	        monster.y += monster.speed * diff;
                	        if(currentLvl.NextPath != "south" && monster.y >= canvas.height - monster.h - 60)
                    	    {
                    	        monster.y = canvas.height - monster.h - 60;
                    	    }
                    	    else
                    	    {
                    	        if(monster.x < canvas.width/2 - 55)
                        	    {
                        		    monster.y = canvas.height - monster.h - 60;
                        	    }
                        	    if(monster.x + monster.w > canvas.width/2 + 60)
                        	    {
                        	        monster.y = canvas.height - monster.h - 60;
                        	    }
                        	    if(monster.y >= canvas.height - monster.h)
                        	    {
                        	        monster.y = canvas.height - monster.h;
                        	    }
                    	    }
                    	   
                	    }
                	    else
                	    {
                	        monster.y -= monster.speed * diff;
                	    }
            	        
                	    //Checks box collision.
                	    if(boxes != null)
                		{
                    		for (i = 0;i<boxes.length ; i += 1)
                    		{
                    			if (collisions.isTouching(monster, boxes[i]))
                    			{
                    			    // move an extra pixel, otherwise bugg when too close to the blocks.
                    				monster.y = boxes[i].y + boxes[i].h + 1;
                    			}
                    		}
                		}
                	}
        }
        monster.lastMonsterMove = now;
    }
    
    //resets the monster timer for the dmg of some special abilletys
    function ResetMonsterCanTakeDmg(monster){
        setTimeout(function(){
            monster.canTakeDmg = true;
        }, 250)
    }
    
    //resets the floating text
    function ResetMovingText(){
        setTimeout(function(){
            preloads.RisingTextMessage.message = null;
            preloads.RisingTextMessage.location = 0;
        }, 1000)
        
    }
    
    //Moves the asparagus spray skill
    function flyingAsparagusSpray(Quill, now, canvas, hero){
        
        
        if(Quill.lastRegisterdMove != null)
        {
            var diff = (now - Quill.lastRegisterdMove)/1000;
            
            if(asparagusSkills.asparagus.SprayDestination.x > Quill.x && Quill.type != "verticalShot")
            {
                Quill.x += diff * Quill.speed;
            }
            else if (Quill.type != "verticalShot")
            {
                Quill.x -= diff * Quill.speed;
            }
            if(asparagusSkills.asparagus.SprayDestination.y > Quill.y && Quill.type != "horizontalShot")
            {
                Quill.y += Quill.speed * diff;
            }
            else if(Quill.type != "horizontalShot")
            {
                Quill.y -= Quill.speed * diff;
            }
            //Quill.y = (asparagusSkills.asparagus.LinearFunctionVaribels.k * Quill.x + asparagusSkills.asparagus.LinearFunctionVaribels.m);
            
            
            if (Quill.x < 0 || Quill.x > canvas.width || Quill.y < 0 || Quill.y > canvas.height)
            {
                //if the shot left the canvas block, it gets removed.
                return false;
            }
            
        }
        
        
        Quill.lastRegisterdMove = now;
        return true;
    }
    
    exports.flyingAsparagusSpray = flyingAsparagusSpray;
    exports.ResetMovingText = ResetMovingText;
    exports.RunningMonsters = RunningMonsters;
    exports.FlyingArrows = FlyingArrows;
    return exports;
    
})();