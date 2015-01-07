// Our menu state
// Starts the menu
menu_state = function(game) {
    this.game = game;
}

menu_state.prototype = {
    
    create: function() {
        
        var titleLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Space Shooter', { font: '35px Arial', fill: '#ffffff' });
        titleLabel.anchor.setTo(0.5, 0.5);
        
        var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 80, 'Tap to start', { font: '35px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);

        player.lives = 3;
        
        this.game.input.onDown.addOnce(this.start, this);
        
    },
    
    start: function() {
        
        this.game.state.start('level');
        
    }
    
};