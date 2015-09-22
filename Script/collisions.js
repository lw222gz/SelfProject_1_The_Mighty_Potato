"use strict";

//contains all collision logic.
var collisions = (function(){
    var exports = {};
    var dmgDealt;
    
    //Checks if the heros attack reaches an enemy.
    function attackConnect(hero, attackDirection, gameObject){
        dmgDealt = false;
        
        switch (attackDirection) {
            case 'W':
                //if the gameObject is within attack range above the hero.
                if(hero.y - hero.AtkRng <= gameObject.y + gameObject.h && hero.y - hero.AtkRng >= gameObject.y && hero.x <= gameObject.x + gameObject.w && hero.x + hero.w >= gameObject.x) 
                    {
                        //swordInteraction(attackDirection, gameObject);
                        if(gameObject.type === "monster" || gameObject.type === "ranged" || gameObject.type === "Boss")
                        {
                            gameObject.y -= hero.MeleePushback;
                        }
                        dmgDealt = true;
                    }
                break;
            case 'A':
                //if the gameObject is within attack range to the hero's left side.
                if(hero.x - hero.AtkRng <= gameObject.x + gameObject.w && hero.x - hero.AtkRng >= gameObject.x && hero.y <= gameObject.y + gameObject.h && hero.y + hero.h >= gameObject.y) 
                    {
                        if(gameObject.type === "monster" || gameObject.type === "ranged" || gameObject.type === "Boss")
                        {
                            gameObject.x -= hero.MeleePushback;
                        }
                        dmgDealt = true;
                    }
                break;
            case 'S':
                //if the gameObject is within attack range under the hero
                if(hero.y + hero.h + hero.AtkRng <= gameObject.y + gameObject.h && hero.y + hero.h + hero.AtkRng >= gameObject.y && hero.x <= gameObject.x + gameObject.w && hero.x + hero.w >= gameObject.x) 
                    {
                        if(gameObject.type === "monster" || gameObject.type === "ranged" || gameObject.type === "Boss")
                        {
                            gameObject.y += hero.MeleePushback;
                        }
                        dmgDealt = true
                    }
                break;
            case 'D':
                //if the gameObject is within attack range to the hero's right side.
                if(hero.x + hero.w + hero.AtkRng <= gameObject.x + gameObject.w && hero.x + hero.w + hero.AtkRng >= gameObject.x && hero.y <= gameObject.y + gameObject.h && hero.y + hero.h >= gameObject.y) 
                    {
                        if(gameObject.type === "monster" || gameObject.type === "ranged" || gameObject.type === "Boss")
                        {
                            gameObject.x += hero.MeleePushback;
                        }
                        dmgDealt = true;
                    }
                break;
            default:
                // code
        }
        
        if(dmgDealt)
        {
            if(!preloads.Skill.SecretArtCarrotCutActive)
            {
                gameLogic.monsterDmgTaken(gameObject, hero.MeleeDmg)
            }
            else
            {
                gameLogic.monsterDmgTaken(gameObject, hero.MeleeDmg * 2);
                preloads.Skill.SecretArtCarrotCutActive = false;
            }
        }
        return dmgDealt;
    }
    
    
    //Is the a-object touching the b-object?
    function isTouching(a, b){
         if(a.x <= (b.x + b.w)
    		&& b.x <= (a.x + a.w)
    		&& a.y <= (b.y + b.h)
    		&& b.y <= (a.y + a.h))
    		{
    			return true;
    		}
    		else 
    		{
    			return false;
    		}
    }
    
    exports.isTouching = isTouching;
    exports.attackConnect = attackConnect;
    
    return exports;
})();