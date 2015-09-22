"use strict";


var soundEffs = (function(){
    
    var exports = {};
    var audio;
    
    var sounds = {
        backgroundMusic: new Audio("Sound/AdventureMeme.mp3"),
        backgroundMusicBoss: new Audio("Sound/BossMusic.mp3"),
        BowRelease: "Sound/BowRelease.mp3",
        EnemyHit: "Sound/EnemyHit.mp3",
        LevelUp: "Sound/LevelUp.mp3",
        PlayerHit: "Sound/PlayerHit.mp3",
        PowerUp: "Sound/PowerUp.mp3",
        SwordSwish: "Sound/SwordSwish.mp3",
        ContinueClick: "Sound/ContinueClick.mp3",
        GameLost: "Sound/GameLost.mp3"
    };
    
    function playSound(url, volume){
        var vol = volume || 1;
        audio = new Audio(url);
        audio.volume = vol;
        audio.play();
    }
    
    exports.playSound = playSound;
    exports.sounds = sounds;
    
    return exports;
    
})();