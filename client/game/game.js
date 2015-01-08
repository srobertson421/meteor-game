Template.game.helpers({
	'game': function() {
	  	var game = new Phaser.Game(320, 480, Phaser.CANVAS, "game");
		
		var playerId = Meteor.userId();
		var currentPlayer = Players.find({ _id: playerId});
		
		if (!currentPlayer) {
			Meteor.call('insertPlayerData', 0);
		}
		
		Meteor.call('log', currentPlayer);
    	
	  	game.global = {
		    music: null,
		    score: 0,
		    bossNum: 0
		};
		
		if (currentPlayer.score && currentPlayer.score > game.global.score) {
			game.global.score = currentPlayer.score;
		}

	  	game.state.add("boot", boot_state);
		game.state.add("load", load_state);
		game.state.add("menu", menu_state);
		game.state.add("level", level_state);
		game.state.start("boot");
		return;
	}
});