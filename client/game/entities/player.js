Player = function(game) {
    this.game = game;
    this.ship = null;
    this.lasers = null;
    this.shootButton = null;
    this.fireButton = null;
    this.leftButton = null;
    this.rightButton = null;
    this.laserTime = 0;
    this.laserSound = null;
    this.explosionSound = null;
    this.lives = 3;
    this.scoreText = null;
    this.highScoreText = null;
};

Player.prototype = {
    
    preload: function() {
        
        // Load ship image
        this.game.load.image('player', 'ship.png');
        
        // Load lasers
        this.game.load.image('laser', 'beam.png');
        
        // Onscreen buttons
        this.game.load.image('left', 'leftButton.png');
        this.game.load.image('right', 'rightButton.png');
        this.game.load.image('fire', 'jumpButton.png');
        
    },
    
    create: function() {
        
        // Create our ship sprite
        this.createPlayer();
        
        // Create laser group for sprites
        this.lasers = this.game.add.group();
        this.lasers.enableBody = true;
        this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
        this.lasers.createMultiple(30, 'laser');
        this.lasers.setAll('anchor.x', 0.5);
        this.lasers.setAll('anchor.y', 1);
        this.lasers.setAll('outOfBoundsKill', true);
        this.lasers.setAll('checkWorldBounds', true);
        
        // Laser sound
        this.laserSound = this.game.add.audio('laser', 0.3, false);
        
        // Explosion Sound
        this.explosionSound = this.game.add.audio('explosion', 0.3, false);
        
        // Create controls
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        }
        
        // Mobile Controls
        if (!this.game.device.desktop) {
            this.addMobileInputs();
        }
        
        this.game.global.score = 0;
        this.scoreText = this.game.add.text(55,this.game.world.height - 60, 'Score: ' + this.game.global.score, { font: '25px Arial', fill: '#ffffff' });
        this.scoreText.anchor.setTo(0.5,0.5);
        this.highScoreText = this.game.add.text(100,this.game.world.height - 30, 'High Score: ' + this.game.global.highScore, { font: '25px Arial', fill: '#ffffff' });
        this.highScoreText.anchor.setTo(0.5,0.5);
        
    },
    
    update: function() {
        
        // Collision lasers vs enemy, sends to callback laserHit
        this.game.physics.arcade.collide(this.lasers, enemy.enemies, this.laserHit, null, this);
        
        this.playerControls();
        
    },
    
    createPlayer: function() {
        
        this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 120, 'player');
        this.ship.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.ship);
        this.ship.body.collideWorldBounds = true;
        
    },
    
    // We define our player controls
    playerControls: function() {
        
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.ship.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.ship.body.velocity.x = 200;
        }
        /*else if (this.cursor.up.isDown) {
            this.ship.body.velocity.y = -200;
        }
        else if (this.cursor.down.isDown) {
            this.ship.body.velocity.y = 200;
        }*/
        else {
            this.ship.body.velocity.x = 0;
            //this.ship.body.velocity.y = 0;
        }
        
        if (this.shootButton.isDown) {
            this.fireLaser();
        }
    },
    
    // Build our inputs for mobile playing
    addMobileInputs: function() {
        
        this.fireButton = this.game.add.sprite(50, this.game.height -25, 'fire');
        this.fireButton.anchor.setTo(0.5, 0.5);
        this.fireButton.inputEnabled = true;
        this.fireButton.alph = 0.5;
        this.fireButton.events.onInputDown.add(this.fireLaser, this);
        this.fireButton.events.onInputOver.add(this.fireLaser, this);
        
        this.moveLeft = false;
        this.moveRight = false;
        
        this.leftButton = this.game.add.sprite(this.game.width - 150, this.game.height - 25, 'left');
        this.leftButton.anchor.setTo(0.5, 0.5);
        this.leftButton.inputEnabled = true;
        this.leftButton.alph = 0.5;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        
        this.rightButton = this.game.add.sprite(this.game.width - 50, this.game.height -25, 'right');
        this.rightButton.anchor.setTo(0.5, 0.5);
        this.rightButton.inputEnabled = true;
        this.rightButton.alph = 0.5;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
        
    },
    
    // Callback to fire the laser
    fireLaser: function() {
        
        if (this.game.time.now > this.laserTime) {
            
            var laser = this.lasers.getFirstExists(false);
            
            if (laser) {
                
                laser.reset(this.ship.x, this.ship.y + 8);
                laser.body.velocity.y = -400;
                this.laserTime = this.game.time.now + 200;
                this.laserSound.play();
                
            }
            
        }
        
    },
    
    laserHit: function(laser, baddie) {
        laser.kill();
        baddie.damage(1);
        
        if (baddie.health === 0) {
            enemy.enemies.remove(baddie, true);
            var explosion = enemy.explosions.getFirstExists(false);
            explosion.reset(baddie.x, baddie.y);
            explosion.play('explosion', 30, false, true);
            this.explosionSound.play();
            
            this.game.global.score += baddie.points;
            this.scoreText.text = 'score: ' + this.game.global.score;
        }
        
        if (enemy.enemies.countLiving() === 0) {
            enemy.spawnEnemies();
        }
        
    }
};