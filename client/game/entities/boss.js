Boss = function(game) {
    this.game = game;
    this.bosses = null;
    this.firingTimer = 0;
    this.bossLaser = null;
};

Boss.prototype = {
    
    preload: function() {
        this.game.load.image('boss1', 'enemies/boss1.png');
        this.game.load.image('boss2', 'enemies/boss2.png');
        this.game.load.image('boss3', 'enemies/boss3.png');
        this.game.load.image('boss4', 'enemies/boss4.png');
    },
    
    create: function() {
        
        this.bosses = this.game.add.group();
        this.bosses.enableBody = true;
        this.bosses.physicsBodyType = Phaser.Physics.ARCADE;
        
    },
    
    update: function() {
        
        this.game.physics.arcade.collide(this.bosses, player.lasers, this.laserHit, null, this);
        
        if (this.game.time.now > this.firingTimer && this.game.time.now > 10000 && this.bosses.countLiving() > 0) {
            this.bossShoot();
        }
        
    },
    
    bossShoot: function() {
        
        for(var i = 0; i < 4; i++) {
            var ranInt = this.game.rnd.integerInRange(1,30);
            var deficit = this.game.rnd.integerInRange(-20,20);

            this.bossLaser = enemy.enemyLasers.children[ranInt];
            var boss = this.bosses.getFirstAlive();

            this.bossLaser.reset(boss.x + deficit, boss.y + deficit);

            this.game.physics.arcade.moveToObject(this.bossLaser, player.ship, 150);
        }
        
        this.firingTimer = this.game.time.now + 2000;
        
    },
    
    spawnBoss: function() {
        
        var boss = null;
        
        if (this.game.global.bossNum === 1) {
            boss = this.bosses.create(this.game.world.centerX, -100, 'boss1');
            boss.anchor.setTo(0.5,0.5);
            boss.body.immovable = true;
            boss.health = 15;
            boss.points = 100;
            this.game.add.tween(boss).to({y: 50}, 3000, Phaser.Easing.Linear.In, true);
        } else if (this.game.global.bossNum === 2) {
            boss = this.bosses.create(this.game.world.centerX, -100, 'boss2');
            boss.anchor.setTo(0.5,0.5);
            boss.body.immovable = true;
            boss.health = 25;
            boss.points = 200;
            this.game.add.tween(boss).to({y: 50}, 3000, Phaser.Easing.Linear.In, true);
        } else if (this.game.global.bossNum === 3) {
            boss = this.bosses.create(this.game.world.centerX, -100, 'boss3');
            boss.anchor.setTo(0.5,0.5);
            boss.body.immovable = true;
            boss.health = 30;
            boss.points = 400;
            this.game.add.tween(boss).to({y: 50}, 3000, Phaser.Easing.Linear.In, true);
        } else if (this.game.global.bossNum === 4) {
            boss = this.bosses.create(this.game.world.centerX, -100, 'boss4');
            boss.anchor.setTo(0.5,0.5);
            boss.body.immovable = true;
            boss.health = 40;
            boss.points = 1000;
            this.game.add.tween(boss).to({y: 50}, 3000, Phaser.Easing.Linear.In, true);
        } else {
            
            console.log('no more bosses!');
            
        }
        
    },
    
    laserHit: function(baddie, laser) {
        
        laser.kill();
        baddie.damage(1);
        
        if (baddie.health === 0) {
            baddie.kill();
            var explosion = enemy.explosions.getFirstExists(false);
            explosion.reset(baddie.x, baddie.y);
            explosion.play('explosion', 30, false, true);
            player.explosionSound.play();
            
            this.game.global.score += baddie.points;
            player.scoreText.text = 'score: ' + this.game.global.score;
        }
    }
};