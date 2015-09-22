"use strict";

var menu = (function(){
    var exports = {};
    
    var menuObj = {
        menuActive: true,
        renderActive: true,
        activeBackground: null,
        activeMenuOption: null,
        clickX:null,
        clickY:null
    };
    
    
    //creates the main menu
    function Menu(ctx, canvas){

        canvas.onclick = function(e){
            //handels if the canvas is moved to another location
            menuObj.clickX = e.pageX - canvas.offsetLeft;
            menuObj.clickY = e.pageY - canvas.offsetTop;
            
            //start
            if(menuObj.clickX >= 290 && menuObj.clickY >= 200 && menuObj.clickY <= 270 && menuObj.clickX <= 445)
            {
                menuObj.menuActive = false;
                soundEffs.playSound(soundEffs.sounds.ContinueClick);
                //remove the menu onclick event
                canvas.onclick = function(){return false;};
            }
            
            //Controls
            if(menuObj.clickX >= 290 && menuObj.clickY >= 305 && menuObj.clickY <= 375 && menuObj.clickX <= 445)
            {
                menuObj.renderActive = false;
                soundEffs.playSound(soundEffs.sounds.ContinueClick);
                menuObj.activeBackground = preloads.Images.ControlsImg;
            }
            
            //Credits
            if(menuObj.clickX >= 290 && menuObj.clickY >= 405 && menuObj.clickY <= 475 && menuObj.clickX <= 450)
            {
                menuObj.renderActive = false;
                soundEffs.playSound(soundEffs.sounds.ContinueClick);
                menuObj.activeBackground = preloads.Images.CreditsImg;
            }
        };
        
      
        ctx.drawImage(preloads.Images.MenuTitleImg,10,50);
        ctx.drawImage(preloads.Images.MenuPlateImg, 175,150);
        ctx.drawImage(preloads.Images.MenuPlateImg, 175,250);
        ctx.drawImage(preloads.Images.MenuPlateImg, 175,350);
        
        
        ctx.font = "36px Helvetica";
        ctx.fillText("Start", 300,205);
        ctx.fillText("Controls", 300, 310);
        ctx.fillText("Credits", 300, 410);
        
    }
    
    //Draws a menu option, controls or credits
    function drawMenuOption(ctx, canvas){
        canvas.onclick = function(e){
            //handels if the canvas is moved to another location
            menuObj.clickX = e.pageX - canvas.offsetLeft;
            menuObj.clickY = e.pageY - canvas.offsetTop;
            //back button
            if(menuObj.clickX >=465 && menuObj.clickY >= 500 && menuObj.clickY <= 570 && menuObj.clickX <= 620)
            {
                soundEffs.playSound(soundEffs.sounds.ContinueClick);
                menuObj.renderActive = true;
            }
        };
        
        ctx.drawImage(menu.menuObj.activeBackground,-2,-2);
        
        ctx.drawImage(preloads.Images.MenuPlateImg, 350,450);
        ctx.fillText("Back", 475, 505)
    }
    
    exports.drawMenuOption = drawMenuOption;
    exports.menuObj = menuObj;
    exports.Menu = Menu;
    
    return exports;
})();