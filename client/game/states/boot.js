// Our init or boot state
// Loads progress bar, physics, and scaling
boot_state = function(game) {
    this.game = game;
};

boot_state.prototype = {
    
    preload: function() {
        
        this.game.load.image('progressBar', 'progressBar.png');
        
        this.game.scale.maxWidth = 800;
        this.game.scale.maxHeight = 600;
        
    },
    
    create: function() {
        
        this.game.stage.backgroundColor = '000000';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        if (!this.game.device.desktop) {
            
            // set the type of scaling to "show-all"
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            // Add a black color to the page, to hide the white borders we might have
            document.body.style.backgroundColor = '#000000';
            
            // Set the min and max width/height of the game
            /*game.scale.minWidth = 250;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 320;
            game.scale.maxHeight = 480;*/
            
            // Center the game on the screen
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            
            // Appy the scale changes
            this.game.scale.setScreenSize();
            
        } else {
            
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            
        }
        
        this.game.state.start('load');
        
    },
    
};