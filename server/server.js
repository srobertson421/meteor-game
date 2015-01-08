// Server-side data publish for client access
Meteor.publish('players', function() {
	var currentUserId = this.userId;
	return Players.find({_id: currentUserId});
});

// Server-side methods for data
Meteor.methods({
	'insertPlayerData': function(playerScore) {
		var currentUserId = Meteor.userId();
		Players.insert({
			_id : currentUserId,
			score: playerScore
		});
	},
	'removePlayerData': function() {
		var currentUserId = Meteor.userId();
		Players.remove(currentUserId);
	},
	'modifyPlayerData': function(playerScore) {
		var playerId = Meteor.userId();
		var player = Players.findOne({_id: playerId});
		console.log(player);
		if (player) {
			if (player.score < playerScore) {
				Players.update(playerId, {_id: playerId, score: playerScore});
			} else {
				console.log('Did not beat the high score!')
				return
			}
		} else {
			console.log('Error! No Player Found!');
			console.log('Creating Player Record');
			Meteor.call('insertPlayerData', playerScore);
		}
	},
	'log': function(data) {
		console.log(data);
	}
});