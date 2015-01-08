Meteor.startup(function(){
    Hooks.init();
});

Meteor.subscribe('players');

var game = new Phaser.Game(320, 480, Phaser.CANVAS, "game");

game.global = {
    music: null,
    score: 0,
    highScore: 0,
    bossNum: 0
};

var login_state = {
	create: function() {
		var loginText = game.add.text(game.world.width / 2, this.game.world.height / 2, 'Login to Play', { font: '25px Arial', fill: '#ffffff' });
		loginText.anchor.setTo(0.5, 0.5);
	}
}

game.state.add('login', login_state);
game.state.start('login');

Template.game.helpers({
	'game': function() {
		var playerId = Meteor.userId();
		var currentPlayer = Players.findOne({ _id: playerId});
		console.log(playerId);
		console.log(currentPlayer);

		if (currentPlayer) {
			game.global.highScore = currentPlayer.score
		}

		Hooks.onLoggedOut = function(playerId) {
			game.state.start('login');
			game.global.music.stop();
		}

	  	game.state.add("boot", boot_state);
		game.state.add("load", load_state);
		game.state.add("menu", menu_state);
		game.state.add("level", level_state);
		game.state.start("boot");
		return;
	}
});