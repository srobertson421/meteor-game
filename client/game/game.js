Template.game.helpers({
	'game': function() {
	  	var game = new Phaser.Game(320, 480, Phaser.CANVAS, "game");

	  	game.global = {
		    music: null,
		    score: 0,
		    bossNum: 0
		};

	  	game.state.add("boot", boot_state);
		game.state.add("load", load_state);
		game.state.add("menu", menu_state);
		game.state.add("level", level_state);
		game.state.start("boot");
		return;
	}
});