Enemy = function(game) {
    this.game = game;
    this.enemies = null;
    this.explosions = null;
    this.enemyLasers = null;
    this.firingTimer = 0;
    this.enemyLaser = null;
    this.livingEnemies = [];
};

Enemy.prototype = {
    
    preload: function() {
        
        // Load enemy images
        this.game.load.image('enemy1', 'enemies/enemy1.png');
        this.game.load.image('enemy2', 'enemies/enemy2.png');
        this.game.load.image('enemy3', 'enemies/enemy3.png');
        this.game.load.image('enemy4', 'enemies/enemy4.png');
        
        // Load explosion spritesheet
        this.game.load.spritesheet('explosion', 'explosion.png', 64, 64);
        
        // Add enemy lasers
        this.game.load.image('enemyLaser1', 'enemyLaser1.png');
        this.game.load.image('enemyLaser2', 'enemyLaser2.png');
        this.game.load.image('enemyLaser3', 'enemyLaser3.png');
        
    },
    
    create: function() {
        
        // Create our enemies group
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.setAll('body.immovable', true);
        
        // Create our explosions group
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(20, 'explosion');
        this.explosions.forEach(this.explosionSet, this);
        
        // Create our enemy lasers group
        this.enemyLasers = this.game.add.group();
        this.enemyLasers.enableBody = true;
        this.enemyLasers.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyLasers.createMultiple(20, 'enemyLaser1');
        this.enemyLasers.createMultiple(20, 'enemyLaser2');
        this.enemyLasers.createMultiple(20, 'enemyLaser3');
        this.enemyLasers.setAll('anchor.x', 0.5);
        this.enemyLasers.setAll('anchor.y', 1);
        this.enemyLasers.setAll('outOfBoundsKill', true);
        this.enemyLasers.setAll('checkWorldBounds', true);
        
        this.spawnEnemies();
        
        
    },
    
    explosionSet: function(explosion) {
        
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('explosion');
        
    },
    
    update: function() {
        
        if (this.game.time.now > this.firingTimer && this.game.time.now > 10000) {
            this.enemyShoot();
        }
        
        this.game.physics.arcade.collide(this.enemyLasers, player.ship, this.enemyLaserHit, null, this);
        
    },
    
    spawnEnemies: function() {
        
        if (this.enemies.countLiving() > 0) {
            return;
        }
        
        var enemyType = this.game.rnd.integerInRange(1, 4);
        var enemyPattern = this.game.rnd.integerInRange(1, 4);
        var enemyAmount = this.game.rnd.integerInRange(1, 6);
        
        this.game.time.events.repeat(Phaser.Timer.SECOND * 1, enemyAmount, this.createEnemy, this, enemyType, enemyPattern);
        
    },
    
    createEnemy: function(enemyType, enemyPattern) {
        
        var enemy = null;
        
        // Check enemyType and create the appropriate enemy
        if (enemyType === 1) {
            enemy = this.enemies.create(0, 0, 'enemy' + enemyType);
            enemy.anchor.setTo(0.5,0.5);
            enemy.health = 1;
            enemy.points = 10;
        } else if (enemyType === 2) {
            enemy = this.enemies.create(this.game.world.width, 0, 'enemy' + enemyType);
            enemy.anchor.setTo(0.5,0.5);
            enemy.health = 2;
            enemy.points = 15;
        } else if (enemyType === 3) {
            enemy = this.enemies.create(0, 0, 'enemy' + enemyType);
            enemy.anchor.setTo(0.5,0.5);
            enemy.health = 2;
            enemy.points = 20;
        } else {
            enemy = this.enemies.create(this.game.world.width, 0, 'enemy' + enemyType);
            enemy.anchor.setTo(0.5,0.5);
            enemy.health = 4;
            enemy.points = 30;
        }
        
        // Check enemyPattern and create appropriate tween animation
        if (enemyPattern === 1) {
            this.alphaPattern(enemy);
        } else if (enemyPattern === 2) {
            this.betaPattern(enemy);
        } else if (enemyPattern === 3) {
            this.charliePattern(enemy);
        } else {
            this.deltaPattern(enemy);
        }
        
    },
    
    enemyShoot: function() {
        
        var ranInt = this.game.rnd.integerInRange(1,60);
        
        this.enemyLaser = this.enemyLasers.children[ranInt];
        
        this.livingEnemies = [];
        
        this.enemies.forEachAlive(this.createEnemyArray, this);
        
        if (this.enemyLaser && this.livingEnemies.length > 0) {
            
            var random = this.game.rnd.integerInRange(0, this.livingEnemies.length - 1);
            
            var shooter = this.livingEnemies[random];
            
            this.enemyLaser.reset(shooter.x, shooter.y);
            
            this.game.physics.arcade.moveToObject(this.enemyLaser, player.ship, 150);
            this.firingTimer = this.game.time.now + 2000;
            
        }
        
    },
    
    enemyLaserHit: function(laser, ship) {
        
        laser.kill();
        ship.kill();
        var explosion = enemy.explosions.getFirstExists(false);
        explosion.reset(ship.x, ship.y);
        explosion.play('explosion', 30, false, true);
        player.explosionSound.play();
        
        if (player.lives != 0) {
            
            this.game.time.events.add(500, function() {
                ship.destroy();
                player.createPlayer();
            });
            
            player.lives--;
            
        } else {
            Meteor.call('modifyPlayerData', this.game.global.score);
            this.game.global.music.stop();
            this.game.time.events.add(1000, this.startMenu, this);
        }
        
    },
    
    startMenu: function() {
        this.game.state.start('menu');
    },
    
    createEnemyArray: function(enemy) {
        
        this.livingEnemies.push(enemy);
        
    },
    
    // First tween movement callback for enemies
    alphaPattern: function(enemy) {
        
        this.game.add.tween(enemy).to({x: 20, y: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 250, x: 300}, 2000, Phaser.Easing.Linear.None)
            .to({y: 280, x: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 155, x: this.game.world.width - 75}, 2000, Phaser.Easing.Linear.None)
            .loop().start();
        
    },
    
    // Second tween movement callback for enemies
    betaPattern: function(enemy) {
        
        this.game.add.tween(enemy).to({x: this.game.world.width - 20, y: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 250, x: this.game.world.width - 300}, 2000, Phaser.Easing.Linear.None)
            .to({y: 280, x: this.game.world.width - 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 155, x: this.game.world.width - 75}, 2000, Phaser.Easing.Linear.None)
            .loop().start();
        
    },
    
    // Third tween movement callback for enemies
    charliePattern: function(enemy) {
        
        this.game.add.tween(enemy).to({x: 20, y: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 250, x: 300}, 2000, Phaser.Easing.Linear.None)
            .to({y: 280, x: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 155, x: this.game.world.width - 75}, 2000, Phaser.Easing.Linear.None)
            .loop().start();
        
    },
    
    // Fourth tween movement callback for enemies
    deltaPattern: function(enemy) {
        
        this.game.add.tween(enemy).to({x: this.game.world.width - 20, y: 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 250, x: this.game.world.width - 300}, 2000, Phaser.Easing.Linear.None)
            .to({y: 280, x: this.game.world.width - 20}, 2000, Phaser.Easing.Linear.None)
            .to({y: 155, x: this.game.world.width - 75}, 2000, Phaser.Easing.Linear.None)
            .loop().start();
        
    }
    
};