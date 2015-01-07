// Our load state
// Loads initial assets for players, enemies, etc.
load_state = function(game) {
    this.game = this.game;
}

load_state.prototype = {
    
    preload: function() {
        
        // Background
        this.game.load.image('starfield', 'background.png');
        
        var progressBar = this.game.add.sprite(this.game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(progressBar);
        
        // Create our player ship & preload assets
        player = new Player(this.game);
        player.preload();
        
        // Create our enemies
        enemy = new Enemy(this.game);
        enemy.preload();
        
        boss = new Boss(this.game);
        boss.preload();
        
        // Musics
        this.game.load.audio('spaceTune', ['SpaceAwesome.mp3', 'SpaceAwesome.ogg']);
        this.game.load.audio('laser', ['laser.mp3', 'laser.ogg']);
        this.game.load.audio('explosion', ['explosion.mp3', 'explosion.ogg']);
        
        
    },
    
    create: function() {
        
        this.game.state.start('menu');
        
    }
    
};