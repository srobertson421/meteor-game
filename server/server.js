// Server-side data publish for client access
Meteor.publish('players', function() {
	var currentUserId = this.userId;
	return Players.find({playerId: currentUserId});
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
		var player = Players.find(playerId).fetch();
		if (player.score < playerScore) {
			Players.update(playerId, {_id: playerId, score: playerScore});
		} else {
			console.log('Did not beat the high score!')
			return
		}
	},
	'log': function(data) {
		console.log(data);
	}
});