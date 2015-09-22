"use strict";

//Kapsla in i ett windown.onload? Bord fixa buggen då canvas inte laddar 
    

var preloads = (function(){
    
    var exports = {};

   //Varibels used in several scripts, also resets them for a new game.
   
   var Skill = {
       BowcooldownActive: false,
       SwordcooldownActive: false,
       SwordSkillActive: false,
       SwordCDStart: null,
       BowCDStart: null,
       roundsCooldownlldown: 0,
       levelSkillUsed: 0,
       activeSwordSkill: null,
       activeBowSkill: null,
       BowSkills: [],
       SwordSkills: [],
       skillChangeAvablibel: true,
       StarchStrenghtActive: false,
       SecretArtCarrotCutActive: false,
       EarthSpikes: [],
       CornSprayActive: false,
       HotShotActive: false,
       Fires: [],
       FireStartY: null,
       FireStartX: null,
       Firelength: 32,
       MissedFires: null
   }
   
   var pauseGame = false;
   var canAct = true;
   var SwordActive = true;
   var canTakeDmg = true;
   var RisingTextMessage = {
       message: null,
       location: 0
   }
   var TipMess = "Keep an eye out for weapon upgrades (peelers and bottles of hot sauce)!";
   
   
   //Hero speaks.
    var message = "I AM THE MIGHTY POTATO WHO MOVES WITH ARROW KEYS!";
   
    //All images
    var Images = {
        bgImage: new Image(),
        bgImageEW: new Image(),
        bgImageEN: new Image(),
        bgImageES: new Image(),
        bgImageWN: new Image(),
        bgImageWS: new Image(),
        bgImageNS: new Image(),
        bgImageBoss:new Image(),
        VictoryScreen: new Image,
        LoseScreen:new Image,
        heroSprite: new Image(),
        heroSlamAttack: new Image(),
        
        MiniMapImg: new Image(),
        MiniMapEW: new Image(),
        MiniMapEN: new Image(),
        MiniMapES: new Image(),
        MiniMapWN: new Image(),
        MiniMapWS: new Image(),
        MiniMapSN: new Image(),
        MiniMapBoss:new Image(),
        MiniMapDot: new Image(),
        
        dangerousSpikes: new Image(),
    
        //Monsters could be mushrooms because they are a good side dish with asparagus?
        // OR! Killer tomatos!
        // OR Evil pumpkin
        MonsterImage: new Image(),
        RangedMonsterImage: new Image(),
   
        boxImage: new Image(),
        heartImage: new Image(),
        Quiver: new Image(),
        swordUpgradeImage: new Image(),
        ArrowSprite: new Image(),
        BowUpgrade: new Image(),
        MonsterArrowH: new Image(),
        MonsterArrowV: new Image(),
        EarthSpike: new Image(),
        FireOne: new Image(),
        FireTwo: new Image(),
        AsparagusImg: new Image(),
        ButterSlopImg: new Image(),
        SkillSprite:new Image(),
        AsparagusSprayImg: new Image(),
        AsparagusSprite:new Image(),
        MenuTitleImg: new Image(),
        MenuPlateImg: new Image(),
        CreditsImg: new Image(),
        ControlsImg: new Image()
    };
    
    //TODO: convert alot of stuff to sprites....
    Images.bgImageEW.src = "Images/Backgrounds/CanvasBackgroundForestW-E.png";
    Images.bgImageEN.src = "Images/Backgrounds/CanvasBackgroundForestE-N.png";
    Images.bgImageES.src = "Images/Backgrounds/CanvasBackgroundForestE-S.png";
    Images.bgImageWN.src = "Images/Backgrounds/CanvasBackgroundForestW-N.png";
    Images.bgImageWS.src = "Images/Backgrounds/CanvasBackgroundForestW-S.png";
    Images.bgImageNS.src = "Images/Backgrounds/CanvasBackgroundForestN-S.png";
    Images.bgImageBoss.src = "Images/Backgrounds/CanvasBackgroundForestBoss.png";
    
    Images.MiniMapImg.src = "Images/MiniMap/MiniMapDisplay.png";
    Images.MiniMapEW.src = "Images/MiniMap/MiniMapDisplayEW.png";
    Images.MiniMapEN.src = "Images/MiniMap/MiniMapDisplayEN.png";
    Images.MiniMapES.src = "Images/MiniMap/MiniMapDisplayES.png";
    Images.MiniMapWN.src = "Images/MiniMap/MiniMapDisplayWN.png";
    Images.MiniMapWS.src = "Images/MiniMap/MiniMapDisplayWS.png";
    Images.MiniMapSN.src = "Images/MiniMap/MiniMapDisplaySN.png";
    Images.MiniMapBoss.src = "Images/MiniMap/MiniMapDisplayBoss.png";
    Images.MiniMapDot.src = "Images/MiniMap/MiniMapDot.png";
    
    Images.bgImage.src = "Images/Backgrounds/CanvasBackgroundForest.png";
    Images.VictoryScreen.src = "Images/Backgrounds/Victory.png";
    Images.LoseScreen.src = "Images/Backgrounds/Lost.png";
    Images.heroSprite.src = "Images/Hero/HeroSprite.png";
    
    Images.dangerousSpikes.src = "Images/GameObjects/Spikes.png";
    Images.MonsterImage.src = "Images/GameObjects/Monster.png";
    Images.boxImage.src = "Images/GameObjects/Box.png";
    Images.heartImage.src = "Images/GameObjects/Heart.png";
    Images.Quiver.src = "Images/GameObjects/Quiver.png";
    Images.swordUpgradeImage.src = "Images/GameObjects/swordUpgrade.png";
    Images.ArrowSprite.src = "Images/Hero/ArrowSprite.png";
    Images.BowUpgrade.src = "Images/GameObjects/BowUpgrade.png";
    Images.MonsterArrowH.src = "Images/GameObjects/MonsterArrowHorizontal.png";
    Images.MonsterArrowV.src = "Images/GameObjects/MonsterArrowVertical.png";
    
    Images.EarthSpike.src = "Images/HeroSkills/EarthSpike.png";
    Images.heroSlamAttack.src = "Images/Hero/PotatoHeroSlam.png";
    Images.FireOne.src = "Images/HeroSkills/Fire1.png";
    Images.FireTwo.src = "Images/HeroSkills/Fire2.png";
    
    Images.RangedMonsterImage.src = "Images/GameObjects/RangedMonster.png";
    Images.AsparagusImg.src = "Images/GameObjects/Asparagus.png";
    Images.ButterSlopImg.src = "Images/GameObjects/ButterSlop.png";
    Images.SkillSprite.src = "Images/HeroSkills/SkillSprite.png";
    Images.AsparagusSprayImg.src = "Images/GameObjects/AsparagusSpray.png";
    Images.AsparagusSprite.src = "Images/GameObjects/AsparagusSprite.png";
    
    Images.MenuTitleImg.src = "Images/Menu/MenuTitle.png";
    Images.MenuPlateImg.src = "Images/Menu/MenuPlate.png";
    Images.CreditsImg.src = "Images/Menu/Credits.png";
    Images.ControlsImg.src = "Images/Menu/Controls.png";
    
    
    
    exports.pauseGame = pauseGame;
    exports.Skill = Skill;
    exports.canTakeDmg = canTakeDmg;
    exports.message = message;
    exports.SwordActive = SwordActive;
    exports.RisingTextMessage = RisingTextMessage;
    exports.TipMess = TipMess;
    exports.canAct = canAct;
    
    exports.Images = Images;
    
    
    
    return exports;
    
})();
