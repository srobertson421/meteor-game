// The main level state
level_state = function(game) {
    this.game = game;
    this.starfield;
}

level_state.prototype = {
    
    create: function() {
        this.starfield = this.game.add.tileSprite(0,0,1600,480,'starfield');
        
        player.create();
        
        enemy.create();
        
        boss.create();
        
        this.game.global.music = this.game.add.audio('spaceTune', 0.5, true);
        this.game.global.music.play();
        
    },
    
    update: function() {
        
        this.starfield.tilePosition.y += 2;
        
        player.update();
        
        enemy.update();
        
        boss.update();
        
        if (boss.bosses.children.length < 1 && this.game.global.score > 250) {
            this.game.global.bossNum = 1;
            boss.spawnBoss();
        }
        if (boss.bosses.children.length < 2 && this.game.global.score > 1000) {
            this.game.global.bossNum = 2;
            boss.spawnBoss();
        }
        if (boss.bosses.children.length < 3 && this.game.global.score > 2000) {
            this.game.global.bossNum = 3;
            boss.spawnBoss();
        }
        if (boss.bosses.children.length < 4 && this.game.global.score > 3500) {
            this.game.global.bossNum = 4;
            boss.spawnBoss();
        }
        
        if (boss.bosses.countLiving() === 0 && this.game.global.score > 4000) {
            this.game.global.music.stop();
            this.game.time.events.add(1000, function() {
                this.game.state.start('victory');
            });
        }
        
    }
    
};